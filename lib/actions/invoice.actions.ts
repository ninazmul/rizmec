"use server";

import { connectToDatabase } from "@/lib/database";
import Invoice, { IInvoice } from "@/lib/database/models/invoice.model";
import Payment from "@/lib/database/models/payment.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getInvoices(params?: {
  status?: string;
  limit?: number;
  skip?: number;
}) {
  try {
    await requirePermission("invoices", "read");
    await connectToDatabase();

    const query: any = {};
    if (params?.status && params.status !== "all") query.status = params.status;

    const total = await Invoice.countDocuments(query);
    let q = Invoice.find(query).sort({ createdAt: -1 });
    if (params?.skip) q = q.skip(params.skip);
    if (params?.limit) q = q.limit(params.limit);

    const invoices = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(invoices)), total };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: error.message, data: [], total: 0 };
  }
}

/**
 * Public Invoice viewing (by unpredictable secureToken)
 */
export async function getInvoiceByToken(secureToken: string) {
  try {
    await connectToDatabase();
    const invoice = await Invoice.findOne({ secureToken }).lean();
    if (!invoice) return { success: false, data: null };

    // Update status to "viewed" if it was "sent"
    if (invoice.status === "sent") {
      await Invoice.findByIdAndUpdate(invoice._id, { status: "viewed" });
      invoice.status = "viewed";
    }

    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error("Error fetching invoice by token:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createInvoice(data: {
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectName: string;
  dueDate: string | Date;
  currency?: string;
  lineItems: Array<{
    item: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
}) {
  try {
    await requirePermission("invoices", "create");
    await connectToDatabase();

    let subtotal = 0;
    const computedItems = (data.lineItems || []).map((li) => {
      const total = (li.quantity || 1) * (li.unitPrice || 0);
      subtotal += total;
      return {
        item: li.item,
        description: li.description || "",
        quantity: li.quantity || 1,
        unitPrice: li.unitPrice || 0,
        total,
      };
    });

    const taxAmount = data.taxAmount || 0;
    const discountAmount = data.discountAmount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    const invoiceNumber = `RIZ-INV-${year}-${String(count + 1).padStart(4, "0")}`;
    const secureToken = crypto.randomBytes(24).toString("hex");

    const newInvoice = await Invoice.create({
      ...data,
      invoiceNumber,
      secureToken,
      lineItems: computedItems,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      amountPaid: 0,
      amountDue: totalAmount,
      dueDate: new Date(data.dueDate),
      status: "sent",
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, data: JSON.parse(JSON.stringify(newInvoice)) };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Record a payment against an invoice
 */
export async function recordInvoicePayment(
  invoiceId: string,
  paymentData: {
    amount: number;
    method: "bank_transfer" | "wire" | "stripe" | "credit_card" | "other";
    reference?: string;
    notes?: string;
  },
) {
  try {
    await requirePermission("invoices", "update");
    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return { success: false, error: "Invoice not found" };

    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount: paymentData.amount,
      paymentDate: new Date(),
      method: paymentData.method,
      reference: paymentData.reference || "",
      notes: paymentData.notes || "",
    });

    const newAmountPaid = (invoice.amountPaid || 0) + paymentData.amount;
    const newAmountDue = Math.max(0, invoice.totalAmount - newAmountPaid);
    const newStatus = newAmountDue === 0 ? "paid" : "partially_paid";

    invoice.amountPaid = newAmountPaid;
    invoice.amountDue = newAmountDue;
    invoice.status = newStatus;
    await invoice.save();

    revalidatePath("/dashboard/invoices");
    return {
      success: true,
      data: {
        invoice: JSON.parse(JSON.stringify(invoice)),
        payment: JSON.parse(JSON.stringify(payment)),
      },
    };
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return { success: false, error: error.message };
  }
}
