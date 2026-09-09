"use server";

import { connectToDatabase } from "@/lib/database";
import Invoice from "@/lib/database/models/invoice.model";
import PaymentReminder from "@/lib/database/models/paymentReminder.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function sendInvoicePaymentReminder(
  invoiceId: string,
  reminderType: "manual" | "upcoming" | "overdue" = "manual",
) {
  try {
    await requirePermission("invoices", "update");
    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return { success: false, error: "Invoice not found" };

    if (invoice.status === "paid") {
      return { success: false, error: "Invoice is already fully paid." };
    }

    // Check duplicate prevention: check if a reminder was sent in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentReminder = await PaymentReminder.findOne({
      invoiceId: invoice._id,
      sentAt: { $gte: oneDayAgo },
    });

    if (recentReminder) {
      return {
        success: false,
        error: "A payment reminder was already dispatched within the last 24 hours to prevent client notification fatigue.",
      };
    }

    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SERVER_URL || "https://rizmec.com"}/invoice/${invoice.secureToken}`;

    const subject =
      reminderType === "overdue"
        ? `[OVERDUE] Payment Reminder for Invoice ${invoice.invoiceNumber} — RIZMEC Engineering`
        : `Payment Reminder for Invoice ${invoice.invoiceNumber} — RIZMEC Engineering`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #ffffff; padding: 40px 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; color: #ffffff;">
          RIZMEC
        </div>
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; margin-bottom: 12px;">
          Attention: ${invoice.clientName} (${invoice.clientCompany || "Valued Partner"})
        </p>
        <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          Payment Notice — ${invoice.invoiceNumber}
        </h2>
        <p style="font-size: 15px; color: #d4d4d8; line-height: 1.6; margin-bottom: 24px;">
          This is a notification regarding outstanding payment for project <strong>${invoice.projectName}</strong>.
        </p>
        <div style="background: #18181b; padding: 20px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Invoice Number:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${invoice.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Due Date:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Total Amount:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${invoice.currency} ${invoice.totalAmount.toLocaleString()}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
              <td style="color: #ffffff; padding: 10px 0; font-weight: 700;">Outstanding Balance:</td>
              <td style="color: #ef4444; text-align: right; font-weight: 800; font-size: 16px;">${invoice.currency} ${invoice.amountDue.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${publicUrl}" style="background: #ffffff; color: #000000; padding: 14px 28px; border-radius: 4px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
            View & Pay Invoice
          </a>
        </div>
        <p style="font-size: 13px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
          Wiring & Payment Instructions: ${invoice.paymentInstructions}
        </p>
        <p style="font-size: 12px; color: #52525b; margin-top: 10px;">
          RIZMEC Engineering Inc. • Intelligence. Engineered.
        </p>
      </div>
    `;

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
          from: `"RIZMEC Finance" <${SMTP_USER}>`,
          to: invoice.clientEmail,
          subject,
          html: htmlContent,
        });
        emailSent = true;
      } catch (err: any) {
        console.error("Nodemailer dispatch error:", err);
        errorMessage = err.message;
      }
    } else {
      errorMessage = "SMTP credentials not configured, recorded in simulation mode.";
      emailSent = true; // logged
    }

    // Record reminder history
    await PaymentReminder.create({
      invoiceId: invoice._id,
      clientEmail: invoice.clientEmail,
      reminderType,
      sentAt: new Date(),
      status: emailSent ? "sent" : "failed",
      errorMessage,
    });

    // Update invoice stats
    invoice.remindersCount = (invoice.remindersCount || 0) + 1;
    invoice.lastReminderSentAt = new Date();
    await invoice.save();

    revalidatePath("/dashboard/invoices");
    return {
      success: emailSent,
      message: emailSent
        ? `Payment reminder successfully dispatched to ${invoice.clientEmail}`
        : `Dispatch error: ${errorMessage}`,
    };
  } catch (error: any) {
    console.error("Error in sendInvoicePaymentReminder:", error);
    return { success: false, error: error.message };
  }
}
