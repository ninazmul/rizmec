"use server";

import { connectToDatabase } from "@/lib/database";
import Invoice, { IInvoice } from "@/lib/database/models/invoice.model";
import Payment from "@/lib/database/models/payment.model";
import CompanySetting from "@/lib/database/models/companySetting.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

    const defaultPlaceholder =
      "Bank Wire Transfer: Account Name: RIZMEC Engineering Inc. | SWIFT: RIZMUS33 | IBAN: US34RIZM000192837465";
    if (!invoice.paymentInstructions || invoice.paymentInstructions === defaultPlaceholder) {
      const companySetting = await CompanySetting.findOne().lean();
      if (companySetting?.paymentInstructions) {
        invoice.paymentInstructions = companySetting.paymentInstructions;
      }
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
  paymentInstructions?: string;
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

    let paymentInstructions = data.paymentInstructions;
    if (!paymentInstructions) {
      const companySetting = await CompanySetting.findOne().lean();
      if (companySetting?.paymentInstructions) {
        paymentInstructions = companySetting.paymentInstructions;
      }
    }

    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    const invoiceNumber = `RIZ-INV-${year}-${String(count + 1).padStart(4, "0")}`;
    const secureToken = crypto.randomBytes(24).toString("hex");

    const newInvoice = await Invoice.create({
      ...data,
      paymentInstructions,
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

/**
 * Send Payment Confirmation Receipt Email to client
 */
async function sendPaymentReceiptEmail(invoice: any) {
  try {
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SERVER_URL || "https://rizmec.com"}/invoice/${invoice.secureToken}`;
    const subject = `Payment Confirmed — Invoice ${invoice.invoiceNumber} | RIZMEC Engineering`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #ffffff; padding: 40px 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; color: #ffffff;">
          RIZMEC
        </div>
        <div style="display: inline-block; padding: 4px 12px; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 20px; color: #4ade80; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">
          ✓ Payment Received & Verified
        </div>
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; margin-bottom: 8px;">
          Attention: ${invoice.clientName} (${invoice.clientCompany || "Valued Partner"})
        </p>
        <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          Payment Receipt — ${invoice.invoiceNumber}
        </h2>
        <p style="font-size: 15px; color: #d4d4d8; line-height: 1.6; margin-bottom: 24px;">
          We are pleased to confirm that your remittance for project <strong>${invoice.projectName}</strong> has been received and successfully recorded.
        </p>
        <div style="background: #18181b; padding: 20px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Invoice Number:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${invoice.invoiceNumber}</td>
            </tr>
            ${invoice.milestoneLabel ? `<tr><td style="color:#a1a1aa;padding:6px 0;">Milestone Phase:</td><td style="color:#ffffff;text-align:right;font-weight:600;">${invoice.milestoneLabel}</td></tr>` : ""}
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Amount Paid:</td>
              <td style="color: #4ade80; text-align: right; font-weight: 800; font-size: 16px;">${invoice.currency} ${Number(invoice.totalAmount).toLocaleString()}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
              <td style="color: #ffffff; padding: 10px 0; font-weight: 700;">Remaining Balance:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 800;">${invoice.currency} 0.00</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Status:</td>
              <td style="color: #4ade80; text-align: right; font-weight: 700; text-transform: uppercase; font-family: monospace;">PAID IN FULL</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${publicUrl}" style="background: #ffffff; color: #000000; padding: 14px 28px; border-radius: 4px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
            View Official Paid Invoice
          </a>
        </div>
        <p style="font-size: 12px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
          Thank you for partnering with RIZMEC Engineering Inc. • Intelligence. Engineered. • rizmec.com
        </p>
      </div>
    `;

    if (SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"RIZMEC Engineering" <${SMTP_USER}>`,
        to: invoice.clientEmail,
        subject,
        html: htmlContent,
      });
      return { success: true };
    } else {
      console.log("[MOCK EMAIL] Payment receipt confirmation sent to:", invoice.clientEmail);
      return { success: true, mocked: true };
    }
  } catch (error: any) {
    console.error("Error sending payment receipt email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark an invoice as Paid and notify the client
 */
export async function markInvoicePaid(invoiceId: string, notifyClient: boolean = true) {
  try {
    await requirePermission("invoices", "update");
    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return { success: false, error: "Invoice not found." };

    const fullAmount = invoice.totalAmount || 0;
    invoice.status = "paid";
    invoice.amountPaid = fullAmount;
    invoice.amountDue = 0;
    await invoice.save();

    await Payment.create({
      invoiceId: invoice._id,
      amount: fullAmount,
      paymentDate: new Date(),
      method: "bank_transfer",
      reference: `PAID-${invoice.invoiceNumber}`,
      notes: "Marked as paid by administrator. Payment verified.",
    });

    let emailSent = false;
    if (notifyClient && invoice.clientEmail) {
      const emailRes = await sendPaymentReceiptEmail(invoice);
      emailSent = Boolean(emailRes.success);
    }

    revalidatePath("/dashboard/invoices");
    if (invoice.secureToken) {
      revalidatePath(`/invoice/${invoice.secureToken}`);
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(invoice)),
      emailSent,
      message: emailSent
        ? `Invoice marked as Paid & receipt notification emailed to ${invoice.clientEmail}!`
        : `Invoice marked as Paid successfully!`,
    };
  } catch (error: any) {
    console.error("Error marking invoice paid:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Revert an invoice back to Unpaid (due balance restored)
 */
export async function markInvoiceUnpaid(invoiceId: string) {
  try {
    await requirePermission("invoices", "update");
    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return { success: false, error: "Invoice not found." };

    invoice.status = "sent";
    invoice.amountPaid = 0;
    invoice.amountDue = invoice.totalAmount || 0;
    await invoice.save();

    await Payment.deleteMany({
      invoiceId: invoice._id,
      reference: `PAID-${invoice.invoiceNumber}`,
    });

    revalidatePath("/dashboard/invoices");
    if (invoice.secureToken) {
      revalidatePath(`/invoice/${invoice.secureToken}`);
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(invoice)),
      message: `Invoice marked as Unpaid (balance restored).`,
    };
  } catch (error: any) {
    console.error("Error marking invoice unpaid:", error);
    return { success: false, error: error.message };
  }
}

export async function updateInvoice(
  id: string,
  data: Partial<IInvoice> & {
    lineItems?: Array<{
      item: string;
      description?: string;
      quantity: number;
      unitPrice: number;
    }>;
  },
) {
  try {
    await requirePermission("invoices", "update");
    await connectToDatabase();

    const existing = await Invoice.findById(id);
    if (!existing) return { success: false, error: "Invoice not found." };

    const updatePayload: any = { ...data };

    if (data.lineItems && data.lineItems.length > 0) {
      let subtotal = 0;
      const computedItems = data.lineItems.map((li) => {
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
      const taxAmount =
        data.taxAmount !== undefined ? data.taxAmount : existing.taxAmount || 0;
      const discountAmount =
        data.discountAmount !== undefined
          ? data.discountAmount
          : existing.discountAmount || 0;
      const totalAmount = subtotal + taxAmount - discountAmount;
      const amountPaid = existing.amountPaid || 0;
      const amountDue = Math.max(0, totalAmount - amountPaid);
      let status = existing.status;
      if (amountDue === 0) status = "paid";
      else if (amountPaid > 0) status = "partially_paid";
      else status = data.status || existing.status || "sent";

      updatePayload.lineItems = computedItems;
      updatePayload.subtotal = subtotal;
      updatePayload.taxAmount = taxAmount;
      updatePayload.discountAmount = discountAmount;
      updatePayload.totalAmount = totalAmount;
      updatePayload.amountDue = amountDue;
      updatePayload.status = status;
    }

    if (data.dueDate) {
      updatePayload.dueDate = new Date(data.dueDate as any);
    }

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    ).lean();

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/invoice/${existing.secureToken}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await requirePermission("invoices", "delete");
    await connectToDatabase();

    const existing = await Invoice.findById(id);
    if (!existing) return { success: false, error: "Invoice not found." };

    await Payment.deleteMany({ invoiceId: id });
    await Invoice.findByIdAndDelete(id);
    revalidatePath("/dashboard/invoices");
    if (existing.secureToken)
      revalidatePath(`/invoice/${existing.secureToken}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: error.message };
  }
}
