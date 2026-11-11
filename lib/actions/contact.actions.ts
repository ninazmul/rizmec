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
  email: string;
  phone?: string;
  website?: string;
  country?: string;
  subject?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  hp?: string; // Anti-spam honeypot
}) {
  try {
    // Spam protection: honeypot field must remain empty
    if (data.hp && data.hp.trim().length > 0) {
      return { success: true };
    }

    const cleanName = data.name?.trim();
    const cleanEmail = data.email?.trim().toLowerCase();
    const cleanMessage = data.message?.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: "Please enter your full name." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return { success: false, error: "Please provide a valid business email address." };
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return { success: false, error: "Please provide a brief description of your project (minimum 10 characters)." };
    }

    // Optional Clerk session integration if user is logged in
    let resolvedEmail = cleanEmail;
    try {
      const { userId } = await auth();
      if (userId) {
        const clerkUser = await currentUser();
        const primary =
          clerkUser?.emailAddresses?.find(
            (e) => e.id === clerkUser.primaryEmailAddressId,
          )?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
        if (primary) resolvedEmail = primary.toLowerCase();
      }
    } catch {
      // Unauthenticated submission is completely valid
    }

    await connectToDatabase();

    const messagePayload = {
      name: cleanName,
      company: data.company?.trim() || "",
      email: resolvedEmail,
      phone: data.phone?.trim() || "",
      website: data.website?.trim() || "",
      country: data.country?.trim() || "",
      service: data.service || "Custom Software Engineering",
      budget: data.budget || "To be scoped",
      timeline: data.timeline || "Flexible / Ongoing",
      message: cleanMessage,
    };

    // 1. Create ContactMessage record
    const message = await ContactMessage.create(messagePayload);

    // 2. Automatically create a Lead in the CRM
    await Lead.create({
      name: cleanName,
      company: data.company?.trim() || "",
      email: resolvedEmail,
      phone: data.phone?.trim() || "",
      country: data.country?.trim() || "",
      source: "website",
      serviceInterest: data.service || "Custom Software Engineering",
      budget: data.budget || "To be scoped",
      priority:
        data.budget?.includes("25k") || data.budget?.includes("10k")
          ? "high"
          : data.budget?.includes("< $2,500")
          ? "low"
          : "medium",
      status: "new",
      tags: ["Website Contact", data.service || "Software Engineering"],
      notes: `Country: ${data.country || "Not specified"}\nWebsite: ${data.website || "N/A"}\nTimeline: ${data.timeline || "Flexible"}\nBudget: ${data.budget || "N/A"}\nMessage: ${cleanMessage}`,
      timeline: [
        {
          date: new Date(),
          note: `Project inquiry received from website. Category: ${data.service || "General"}. Budget: ${data.budget || "N/A"}`,
          author: "Inquiry Webhook",
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
          from: `"RIZMEC Alert" <${SMTP_USER}>`,
          to: CONTACT_RECEIVER,
          subject: `[NEW INQUIRY] ${data.name} from ${data.company || "Enterprise Client"} — RIZMEC`,
          html: `
            <div style="font-family: sans-serif; background: #09090b; color: #ffffff; padding: 28px; border-radius: 8px;">
              <h2 style="color: #ffffff; margin-bottom: 16px;">New Enterprise Engagement Request</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Company:</strong> ${data.company || "N/A"}</p>
              <p><strong>Email:</strong> ${resolvedEmail}</p>
              <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
              <p><strong>Service Focus:</strong> ${data.service || "N/A"}</p>
              <p><strong>Estimated Budget:</strong> ${data.budget || "N/A"}</p>
              <p><strong>Target Timeline:</strong> ${data.timeline || "N/A"}</p>
              <div style="margin-top: 16px; padding: 14px; background: #18181b; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
                <strong>Project Scope:</strong><br/>
                ${data.message.replace(/\n/g, "<br/>")}
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Failed to send contact notification email:", mailErr);
      }
    }

    revalidatePath("/dashboard/leads");
    return { success: true, data: JSON.parse(JSON.stringify(message)) };
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    return { success: false, error: error.message };
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
