"use server";

import { connectToDatabase } from "@/lib/database";
import Quotation, { IQuotation } from "@/lib/database/models/quotation.model";
import Invoice from "@/lib/database/models/invoice.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
  paymentSchedule?: Array<{
    milestone: string;
    percent: number;
    trigger: string;
    dueDate?: string;
  }>;
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
      paymentSchedule: data.paymentSchedule || [],
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

    const baseCount = await Invoice.countDocuments();
    const year = new Date().getFullYear();

    const commonLineItems = quotation.lineItems.map((li: any) => ({
      item: li.item,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      total: li.total,
    }));

    const schedule: Array<{ milestone: string; percent: number; trigger: string; dueDate?: Date }> =
      quotation.paymentSchedule && quotation.paymentSchedule.length > 0
        ? quotation.paymentSchedule
        : [];

    let createdInvoices: any[] = [];

    if (schedule.length > 0) {
      // ── Milestone-split: create one invoice per payment milestone ──
      // Default due dates: Advance=today, Midpoint=+45d, Delivery=+90d
      const defaultDueDayOffsets = [0, 45, 90];

      for (let i = 0; i < schedule.length; i++) {
        const m = schedule[i];
        const milestoneAmount = Math.round((quotation.totalAmount * m.percent) / 100 * 100) / 100;
        const milestoneLabel = `${m.milestone} – ${m.percent}%`;

        const dueDate = m.dueDate
          ? new Date(m.dueDate)
          : (() => {
              const d = new Date();
              d.setDate(d.getDate() + (defaultDueDayOffsets[i] ?? i * 30));
              return d;
            })();

        const invoiceNumber = `RIZ-INV-${year}-${String(baseCount + i + 1).padStart(4, "0")}`;
        const secureToken = crypto.randomBytes(24).toString("hex");

        const inv = await Invoice.create({
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
          lineItems: commonLineItems,
          subtotal: quotation.subtotal,
          taxAmount: quotation.taxAmount,
          discountAmount: quotation.discountTotal,
          totalAmount: milestoneAmount,
          amountPaid: 0,
          amountDue: milestoneAmount,
          status: i === 0 ? "sent" : "draft", // Advance = sent immediately; others = draft
          milestoneLabel,
          paymentSchedule: schedule,
          notes: `Milestone: ${milestoneLabel} — from accepted quotation ${quotation.quoteNumber}. ${m.trigger}`,
        });
        createdInvoices.push(inv);
      }
    } else {
      // ── Single invoice (no payment schedule) ──
      const invoiceNumber = `RIZ-INV-${year}-${String(baseCount + 1).padStart(4, "0")}`;
      const secureToken = crypto.randomBytes(24).toString("hex");
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);

      const inv = await Invoice.create({
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
        lineItems: commonLineItems,
        subtotal: quotation.subtotal,
        taxAmount: quotation.taxAmount,
        discountAmount: quotation.discountTotal,
        totalAmount: quotation.totalAmount,
        amountPaid: 0,
        amountDue: quotation.totalAmount,
        status: "sent",
        notes: `Generated from accepted quotation ${quotation.quoteNumber}`,
      });
      createdInvoices.push(inv);
    }

    revalidatePath("/dashboard/invoices");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(createdInvoices)),
      milestoneCount: createdInvoices.length,
    };
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
    paymentSchedule?: Array<{
      milestone: string;
      percent: number;
      trigger: string;
      dueDate?: string;
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

/**
 * Send quotation link to client by email
 */
export async function sendQuotationEmail(quotationId: string) {
  try {
    await requirePermission("quotations", "update");
    await connectToDatabase();

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return { success: false, error: "Quotation not found." };

    if (quotation.status === "accepted") {
      return { success: false, error: "Quotation already accepted — no need to resend." };
    }

    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    const publicUrl = `${
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://rizmec.com"
    }/quote/${quotation.secureToken}`;

    // Build payment schedule rows
    const scheduleRows =
      quotation.paymentSchedule && quotation.paymentSchedule.length > 0
        ? quotation.paymentSchedule
            .map(
              (m: any) => `
          <tr>
            <td style="padding:6px 8px;color:#a1a1aa;">${m.milestone}</td>
            <td style="padding:6px 8px;color:#ffffff;font-weight:700;text-align:right;">${m.percent}%</td>
            <td style="padding:6px 8px;color:#71717a;font-size:12px;">${m.trigger}</td>
          </tr>`,
            )
            .join("")
        : `<tr><td colspan="3" style="padding:6px 8px;color:#71717a;">${quotation.paymentTerms || "As agreed"}</td></tr>`;

    const htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#09090b;color:#ffffff;padding:40px 30px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
        <div style="font-family:monospace;font-size:20px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:24px;">RIZMEC</div>
        <p style="font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;margin-bottom:8px;">Quotation for ${quotation.clientCompany || quotation.clientName}</p>
        <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;">${quotation.projectName}</h2>
        <p style="font-size:15px;color:#d4d4d8;line-height:1.6;margin-bottom:24px;">
          Please review your engineering quotation <strong>${quotation.quoteNumber}</strong> from RIZMEC. You may review the full scope, pricing, and sign electronically using the link below.
        </p>
        <div style="background:#18181b;padding:20px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="color:#a1a1aa;padding:6px 0;">Quote Number:</td>
              <td style="color:#fff;text-align:right;font-weight:600;">${quotation.quoteNumber}</td>
            </tr>
            <tr>
              <td style="color:#a1a1aa;padding:6px 0;">Total Amount:</td>
              <td style="color:#fff;text-align:right;font-weight:700;">${quotation.currency} ${quotation.totalAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color:#a1a1aa;padding:6px 0;">Valid Until:</td>
              <td style="color:#fff;text-align:right;">${new Date(quotation.validUntil).toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        ${quotation.paymentSchedule?.length > 0 ? `
        <div style="background:#18181b;padding:20px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#71717a;margin-bottom:12px;">Payment Schedule</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            ${scheduleRows}
          </table>
        </div>` : ""}
        <div style="text-align:center;margin:32px 0;">
          <a href="${publicUrl}" style="background:#ffffff;color:#000000;padding:14px 28px;border-radius:4px;font-weight:700;text-decoration:none;display:inline-block;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;">Review &amp; Sign Quotation</a>
        </div>
        <p style="font-size:12px;color:#52525b;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
          RIZMEC Engineering Inc. • Intelligence. Engineered. • This quotation expires on ${new Date(quotation.validUntil).toLocaleDateString()}.
        </p>
      </div>`;

    let emailSent = false;
    let errorMessage = "";

    if (SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
        await transporter.sendMail({
          from: `"RIZMEC Engineering" <${SMTP_USER}>`,
          to: quotation.clientEmail,
          subject: `Quotation ${quotation.quoteNumber} — ${quotation.projectName} | RIZMEC Engineering`,
          html: htmlContent,
        });
        emailSent = true;
      } catch (err: any) {
        console.error("Quotation email error:", err);
        errorMessage = err.message;
      }
    } else {
      // Simulation mode if SMTP not configured
      emailSent = true;
      errorMessage = "SMTP not configured — logged in simulation mode.";
    }

    if (emailSent) {
      // Mark as sent if it was draft
      if (quotation.status === "draft") {
        quotation.status = "sent";
        await quotation.save();
        revalidatePath("/dashboard/quotations");
        revalidatePath(`/quote/${quotation.secureToken}`);
      }
    }

    return {
      success: emailSent,
      message: emailSent
        ? `Quotation sent to ${quotation.clientEmail}`
        : `Email error: ${errorMessage}`,
    };
  } catch (error: any) {
    console.error("Error sending quotation email:", error);
    return { success: false, error: error.message };
  }
}
