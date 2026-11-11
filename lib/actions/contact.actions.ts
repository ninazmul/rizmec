"use server";

import { connectToDatabase } from "@/lib/database";
import ContactMessage from "@/lib/database/models/contactMessage.model";
import Lead from "@/lib/database/models/lead.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function submitContactMessage(data: {
  name: string;
  company?: string;
  website?: string;
  country?: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  honeypot?: string;
}) {
  try {
    // 1. Anti-spam honeypot check
    if (data.honeypot && data.honeypot.trim().length > 0) {
      // Silently discard bot submission
      return { success: true };
    }

    const trimmedName = data.name?.trim();
    const rawEmail = data.email?.trim().toLowerCase();
    const trimmedMessage = data.message?.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: "Please provide your full name." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return { success: false, error: "Please provide a valid business email address." };
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      return { success: false, error: "Please share a few details about your project or inquiry (minimum 10 characters)." };
    }

    // Optional Clerk session detection (enrich if available, never block public visitors)
    let authenticatedUserId: string | null = null;
    try {
      const { userId } = await auth();
      authenticatedUserId = userId;
    } catch {
      // In public server action context if auth fails or not signed in, proceed gracefully
    }

    await connectToDatabase();

    const messagePayload = {
      name: trimmedName,
      company: data.company?.trim() || "",
      website: data.website?.trim() || "",
      country: data.country?.trim() || "",
      email: rawEmail,
      phone: data.phone?.trim() || "",
      service: data.service || "General Consultation",
      budget: data.budget || "Not specified",
      timeline: data.timeline || "Flexible",
      message: trimmedMessage,
      status: "new" as const,
    };

    // 1. Create ContactMessage record
    const message = await ContactMessage.create(messagePayload);

    // 2. Automatically create a qualified Lead in the CRM
    const budgetStr = data.budget || "";
    const priority =
      budgetStr.includes("$25k") || budgetStr.includes("$50k") || budgetStr.includes("$100k") || budgetStr.includes("250k")
        ? "high"
        : budgetStr.includes("< $2k") || budgetStr.includes("< $1k")
        ? "low"
        : "medium";

    await Lead.create({
      name: trimmedName,
      company: data.company?.trim() || "",
      email: rawEmail,
      phone: data.phone?.trim() || "",
      country: data.country?.trim() || "",
      source: "website",
      serviceInterest: data.service || "Engineering Engagement",
      budget: data.budget || "Not specified",
      priority,
      status: "new",
      tags: ["Website Inquiry", data.service || "Software Engineering"],
      notes: `Company Website: ${data.website || "N/A"}\nTarget Country: ${data.country || "International"}\nTimeline: ${data.timeline || "Flexible"}\nMessage: ${trimmedMessage}${
        authenticatedUserId ? `\n(Submitted with authenticated Clerk account: ${authenticatedUserId})` : ""
      }`,
      timeline: [
        {
          date: new Date(),
          note: `Project inquiry received via Rizmec website. Budget: ${data.budget || "N/A"}, Timeline: ${data.timeline || "N/A"}`,
          author: "Website Portal",
        },
      ],
    });

    // 3. Email Notification to Admin via Nodemailer
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || "hello@rizmec.com";

    if (SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        await transporter.sendMail({
          from: `"Rizmec Inquiries" <${SMTP_USER}>`,
          to: CONTACT_RECEIVER,
          subject: `[NEW PROJECT INQUIRY] ${trimmedName}${data.company ? ` from ${data.company}` : ""}${data.country ? ` (${data.country})` : ""} — Rizmec`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #09090b; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
              <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">New Business Project Inquiry</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
                <tr><td style="padding: 6px 0; color: #a1a1aa; width: 140px;"><strong>Client Name:</strong></td><td style="color: #ffffff;">${trimmedName}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Business Email:</strong></td><td style="color: #ffffff;"><a href="mailto:${rawEmail}" style="color: #38bdf8; text-decoration: none;">${rawEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Company:</strong></td><td style="color: #ffffff;">${data.company || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Website:</strong></td><td style="color: #ffffff;">${data.website || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Country / Market:</strong></td><td style="color: #ffffff;">${data.country || "Not specified"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Phone:</strong></td><td style="color: #ffffff;">${data.phone || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Service Category:</strong></td><td style="color: #ffffff;">${data.service || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Estimated Budget:</strong></td><td style="color: #ffffff;">${data.budget || "N/A"}</td></tr>
                <tr><td style="padding: 6px 0; color: #a1a1aa;"><strong>Target Timeline:</strong></td><td style="color: #ffffff;">${data.timeline || "N/A"}</td></tr>
              </table>
              <div style="margin-top: 24px; padding: 18px; background: #18181b; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; margin-bottom: 8px;">Project Scope & Objectives:</div>
                <div style="font-size: 14px; color: #f4f4f5; line-height: 1.6; white-space: pre-line;">${trimmedMessage}</div>
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Failed to send contact notification email:", mailErr);
      }
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/contact-messages");
    return { success: true, data: JSON.parse(JSON.stringify(message)) };
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    return { success: false, error: error.message || "Failed to submit inquiry. Please try again." };
  }
}

export async function getContactMessages() {
  try {
    await requirePermission("dashboard", "read");
    await connectToDatabase();

    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(messages)) };
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: string,
) {
  try {
    await requirePermission("dashboard", "update");
    await connectToDatabase();
    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean();
    if (!updated) return { success: false, error: "Message not found" };
    revalidatePath("/dashboard/contact-messages");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating contact message status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await requirePermission("dashboard", "delete");
    await connectToDatabase();
    await ContactMessage.findByIdAndDelete(id);
    revalidatePath("/dashboard/contact-messages");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting contact message:", error);
    return { success: false, error: error.message };
  }
}
