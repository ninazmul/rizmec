"use server";

import { connectToDatabase } from "@/lib/database";
import Quotation, { IQuotation } from "@/lib/database/models/quotation.model";
import Invoice from "@/lib/database/models/invoice.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getQuotations(params?: {
  status?: string;
  limit?: number;
  skip?: number;
}) {
  try {
    await requirePermission("quotations", "read");
    await connectToDatabase();

    const query: any = {};
    if (params?.status && params.status !== "all") query.status = params.status;

    const total = await Quotation.countDocuments(query);
    let q = Quotation.find(query).sort({ createdAt: -1 });
    if (params?.skip) q = q.skip(params.skip);
    if (params?.limit) q = q.limit(params.limit);

    const quotations = await q.lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(quotations)),
      total,
    };
  } catch (error: any) {
    console.error("Error fetching quotations:", error);
    return { success: false, error: error.message, data: [], total: 0 };
  }
}

/**
 * Public secure quotation access (does NOT expose Mongo internal ID)
 */
export async function getQuotationByToken(secureToken: string) {
  try {
    await connectToDatabase();
    const quotation = await Quotation.findOne({ secureToken }).lean();
    if (!quotation) return { success: false, data: null };

    // Update status to "viewed" if it was "sent"
    if (quotation.status === "sent") {
      await Quotation.findByIdAndUpdate(quotation._id, { status: "viewed" });
      quotation.status = "viewed";
    }

    return { success: true, data: JSON.parse(JSON.stringify(quotation)) };
  } catch (error: any) {
    console.error("Error fetching quotation by token:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createQuotation(data: {
  clientId?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone?: string;
  projectName: string;
  description?: string;
  lineItems: Array<{
    item: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  taxRate?: number;
  currency?: string;
  paymentTerms?: string;
  validUntil: string | Date;
  notes?: string;
  termsConditions?: string;
}) {
  try {
    await requirePermission("quotations", "create");
    await connectToDatabase();

    // Calculate line items and totals
    let subtotal = 0;
    let discountTotal = 0;
    const computedLineItems = (data.lineItems || []).map((li) => {
      const gross = (li.quantity || 1) * (li.unitPrice || 0);
      const discountVal = li.discount ? (gross * li.discount) / 100 : 0;
      const total = gross - discountVal;
      subtotal += gross;
      discountTotal += discountVal;
      return {
        item: li.item,
        description: li.description || "",
        quantity: li.quantity || 1,
        unitPrice: li.unitPrice || 0,
        discount: li.discount || 0,
        total,
      };
    });

    const netSubtotal = subtotal - discountTotal;
    const taxRate = data.taxRate || 0;
    const taxAmount = (netSubtotal * taxRate) / 100;
    const totalAmount = netSubtotal + taxAmount;

    // Unique quote number and cryptographic token
    const count = await Quotation.countDocuments();
    const year = new Date().getFullYear();
    const quoteNumber = `RIZ-Q-${year}-${String(count + 1).padStart(4, "0")}`;
    const secureToken = crypto.randomBytes(24).toString("hex");

    const newQuotation = await Quotation.create({
      ...data,
      quoteNumber,
      secureToken,
      lineItems: computedLineItems,
      subtotal,
      discountTotal,
      taxRate,
      taxAmount,
      totalAmount,
      currency: data.currency || "USD",
      validUntil: new Date(data.validUntil),
      status: "draft",
    });

    revalidatePath("/dashboard/quotations");
    return { success: true, data: JSON.parse(JSON.stringify(newQuotation)) };
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Client Public E-Signing & Acceptance Workflow
 */
export async function signAndAcceptQuotation(
  secureToken: string,
  payload: {
    signedByName: string;
    signedByEmail: string;
    signatureData: string;
    signerIp?: string;
    signerUserAgent?: string;
  },
) {
  try {
    await connectToDatabase();
    const quotation = await Quotation.findOne({ secureToken });
    if (!quotation) {
      return { success: false, error: "Quotation not found or invalid token." };
    }

    if (quotation.status === "accepted") {
      return {
        success: false,
        error: "This quotation has already been signed and accepted.",
      };
    }

    // Freeze snapshot
    const acceptedSnapshot = {
      quoteNumber: quotation.quoteNumber,
      clientName: quotation.clientName,
      clientCompany: quotation.clientCompany,
      projectName: quotation.projectName,
      lineItems: quotation.lineItems,
      subtotal: quotation.subtotal,
      discountTotal: quotation.discountTotal,
      taxAmount: quotation.taxAmount,
      totalAmount: quotation.totalAmount,
      currency: quotation.currency,
      validUntil: quotation.validUntil,
      termsConditions: quotation.termsConditions,
      acceptedAt: new Date(),
      signedByName: payload.signedByName,
      signedByEmail: payload.signedByEmail,
    };

    quotation.status = "accepted";
    quotation.signedAt = new Date();
    quotation.signedByName = payload.signedByName;
    quotation.signedByEmail = payload.signedByEmail;
    quotation.signatureData = payload.signatureData;
    quotation.signerIp = payload.signerIp || "client-web";
    quotation.signerUserAgent = payload.signerUserAgent || "browser";
    quotation.acceptedSnapshot = acceptedSnapshot;

    await quotation.save();

    revalidatePath(`/quote/${secureToken}`);
    revalidatePath("/dashboard/quotations");

    return { success: true, data: JSON.parse(JSON.stringify(quotation)) };
  } catch (error: any) {
    console.error("Error signing quotation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Convert Accepted Quotation to Active Invoice
 */
export async function convertQuotationToInvoice(quotationId: string) {
  try {
    await requirePermission("invoices", "create");
    await connectToDatabase();

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return { success: false, error: "Quotation not found" };

    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    const invoiceNumber = `RIZ-INV-${year}-${String(count + 1).padStart(4, "0")}`;
    const secureToken = crypto.randomBytes(24).toString("hex");

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // Net 15 days default

    const invoice = await Invoice.create({
      invoiceNumber,
      secureToken,
      quotationId: quotation._id,
      clientId: quotation.clientId,
      clientName: quotation.clientName,
      clientEmail: quotation.clientEmail,
      clientCompany: quotation.clientCompany,
      projectName: quotation.projectName,
      issueDate: new Date(),
      dueDate,
      currency: quotation.currency,
      lineItems: quotation.lineItems.map((li: any) => ({
        item: li.item,
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.total,
      })),
      subtotal: quotation.subtotal,
      taxAmount: quotation.taxAmount,
      discountAmount: quotation.discountTotal,
      totalAmount: quotation.totalAmount,
      amountPaid: 0,
      amountDue: quotation.totalAmount,
      status: "sent",
      notes: `Generated from accepted quotation ${quotation.quoteNumber}`,
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error("Error converting quotation to invoice:", error);
    return { success: false, error: error.message };
  }
}

export async function updateQuotation(
  id: string,
  data: Partial<IQuotation> & {
    lineItems?: Array<{
      item: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
    }>;
  },
) {
  try {
    await requirePermission("quotations", "update");
    await connectToDatabase();

    const existing = await Quotation.findById(id);
    if (!existing) return { success: false, error: "Quotation not found." };

    const updatePayload: any = { ...data };

    if (data.lineItems && data.lineItems.length > 0) {
      let subtotal = 0;
      let discountTotal = 0;
      const computedLineItems = data.lineItems.map((li) => {
        const gross = (li.quantity || 1) * (li.unitPrice || 0);
        const discountVal = li.discount ? (gross * li.discount) / 100 : 0;
        const total = gross - discountVal;
        subtotal += gross;
        discountTotal += discountVal;
        return {
          item: li.item,
          description: li.description || "",
          quantity: li.quantity || 1,
          unitPrice: li.unitPrice || 0,
          discount: li.discount || 0,
          total,
        };
      });
      const taxRate =
        data.taxRate !== undefined ? data.taxRate : existing.taxRate || 0;
      const netSubtotal = subtotal - discountTotal;
      const taxAmount = (netSubtotal * taxRate) / 100;
      const totalAmount = netSubtotal + taxAmount;
      updatePayload.lineItems = computedLineItems;
      updatePayload.subtotal = subtotal;
      updatePayload.discountTotal = discountTotal;
      updatePayload.taxRate = taxRate;
      updatePayload.taxAmount = taxAmount;
      updatePayload.totalAmount = totalAmount;
    }

    if (data.validUntil) {
      updatePayload.validUntil = new Date(data.validUntil as any);
    }

    const updated = await Quotation.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    ).lean();

    revalidatePath("/dashboard/quotations");
    revalidatePath(`/quote/${existing.secureToken}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating quotation:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuotation(id: string) {
  try {
    await requirePermission("quotations", "delete");
    await connectToDatabase();

    const existing = await Quotation.findById(id);
    if (!existing) return { success: false, error: "Quotation not found." };

    await Quotation.findByIdAndDelete(id);
    revalidatePath("/dashboard/quotations");
    if (existing.secureToken) revalidatePath(`/quote/${existing.secureToken}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting quotation:", error);
    return { success: false, error: error.message };
  }
}
