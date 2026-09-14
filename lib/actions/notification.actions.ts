"use server";

import { connectToDatabase } from "@/lib/database";
import Notification from "@/lib/database/models/notification.model";
import CompanySetting from "@/lib/database/models/companySetting.model";
import { getCurrentDashboardAccess, requireDashboardAccess } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

const DEFAULT_SUPER_ADMIN_EMAILS = [
  "rizmecofficial@gmail.com",
  "nazmulsaw@gmail.com",
  ...(process.env.SUPER_ADMIN_EMAILS
    ? process.env.SUPER_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : []),
];

export interface StatusChangeNotificationParams {
  type: "quote" | "invoice" | "order";
  entityId: string;
  identifier: string; // e.g. "INV-2026-001", "QUO-2026-004", "Project Alpha"
  clientName?: string;
  clientEmail?: string;
  projectName?: string;
  oldStatus?: string;
  newStatus: string;
  amount?: number;
  currency?: string;
  actionUrl: string; // e.g. "/dashboard/invoices", "/dashboard/quotations", "/dashboard/projects"
  details?: string;
}

/**
 * Dispatches an admin notification to database and sends an email via SMTP
 */
export async function notifyAdminsOnStatusChange(params: StatusChangeNotificationParams) {
  try {
    await connectToDatabase();

    const formattedType =
      params.type === "quote"
        ? "Quotation"
        : params.type === "invoice"
        ? "Invoice"
        : "Project / Order";

    const title = `${formattedType} Status: ${params.identifier} → ${params.newStatus.toUpperCase()}`;

    let summaryMessage = `${formattedType} "${params.identifier}" has changed status to "${params.newStatus.toUpperCase()}".`;
    if (params.clientName) {
      summaryMessage += ` Client: ${params.clientName}.`;
    }
    if (params.amount !== undefined && params.currency) {
      summaryMessage += ` Value: ${params.currency} ${Number(params.amount).toLocaleString()}.`;
    }
    if (params.details) {
      summaryMessage += ` ${params.details}`;
    }

    // 1. Create in-app Notification record in DB
    const createdNotification = await Notification.create({
      title,
      message: summaryMessage,
      type: params.type,
      link: params.actionUrl,
      isRead: false,
    });

    // 2. Prepare Admin Email Recipients
    const companySetting = await CompanySetting.findOne().lean();
    const recipientSet = new Set<string>(DEFAULT_SUPER_ADMIN_EMAILS);

    if (companySetting?.contactEmail) {
      recipientSet.add(companySetting.contactEmail.toLowerCase().trim());
    }
    if (process.env.CONTACT_RECEIVER) {
      recipientSet.add(process.env.CONTACT_RECEIVER.toLowerCase().trim());
    }

    const recipients = Array.from(recipientSet).filter(Boolean);

    // 3. Dispatch Email Notification
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://rizmec.com";

    const fullActionUrl = params.actionUrl.startsWith("http")
      ? params.actionUrl
      : `${appBaseUrl}${params.actionUrl}`;

    const statusBadgeColor =
      params.newStatus === "paid" || params.newStatus === "accepted" || params.newStatus === "completed"
        ? "#4ade80"
        : params.newStatus === "rejected" || params.newStatus === "overdue" || params.newStatus === "cancelled"
        ? "#f87171"
        : "#38bdf8";

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #ffffff; padding: 40px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; color: #ffffff;">
          RIZMEC // ADMIN RADAR
        </div>
        <div style="display: inline-block; padding: 4px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid ${statusBadgeColor}; border-radius: 20px; color: ${statusBadgeColor}; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">
          ● ${formattedType} Status Transition
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
          ${title}
        </h2>
        <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin-bottom: 24px;">
          ${summaryMessage}
        </p>

        <div style="background: #18181b; padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: monospace;">
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Entity Type:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${formattedType}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; padding: 6px 0;">Reference:</td>
              <td style="color: #ffffff; text-align: right; font-weight: 600;">${params.identifier}</td>
            </tr>
            ${params.clientName ? `<tr><td style="color:#a1a1aa;padding:6px 0;">Client:</td><td style="color:#ffffff;text-align:right;font-weight:600;">${params.clientName}</td></tr>` : ""}
            ${params.projectName ? `<tr><td style="color:#a1a1aa;padding:6px 0;">Project:</td><td style="color:#ffffff;text-align:right;font-weight:600;">${params.projectName}</td></tr>` : ""}
            ${params.amount !== undefined && params.currency ? `<tr><td style="color:#a1a1aa;padding:6px 0;">Amount:</td><td style="color:#ffffff;text-align:right;font-weight:700;">${params.currency} ${Number(params.amount).toLocaleString()}</td></tr>` : ""}
            ${params.oldStatus ? `<tr><td style="color:#a1a1aa;padding:6px 0;">Prior Status:</td><td style="color:#a1a1aa;text-align:right;text-transform:uppercase;">${params.oldStatus}</td></tr>` : ""}
            <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #ffffff; padding: 8px 0; font-weight: 700;">Current Status:</td>
              <td style="color: ${statusBadgeColor}; text-align: right; font-weight: 800; text-transform: uppercase;">${params.newStatus}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${fullActionUrl}" style="background: #ffffff; color: #000000; padding: 12px 28px; border-radius: 6px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">
            Inspect in Dashboard →
          </a>
        </div>

        <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-family: monospace;">
          RIZMEC Automated Operations Bot • ${new Date().toUTCString()}
        </p>
      </div>
    `;

    if (SMTP_USER && SMTP_PASS && recipients.length > 0) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"RIZMEC Platform" <${SMTP_USER}>`,
        to: recipients.join(", "),
        subject: `[RIZMEC Alert] ${title}`,
        html: htmlContent,
      });
    } else {
      console.log(`[MOCK ADMIN ALERT EMAIL] To: ${recipients.join(", ")} | Subject: [RIZMEC Alert] ${title}`);
    }

    revalidatePath("/dashboard");
    return { success: true, notificationId: createdNotification._id.toString() };
  } catch (error: any) {
    console.error("Error dispatching status change notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch latest notifications for the dashboard header
 */
export async function getAdminNotifications(limit = 15) {
  try {
    await requireDashboardAccess("/sign-in");
    await connectToDatabase();

    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({ isRead: false });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(notifications)),
      unreadCount,
    };
  } catch (error: any) {
    console.error("Error fetching admin notifications:", error);
    return { success: false, data: [], unreadCount: 0, error: error.message };
  }
}

/**
 * Get unread notification counter for badge
 */
export async function getUnreadNotificationsCount() {
  try {
    const access = await getCurrentDashboardAccess();
    if (!access) return { success: true, count: 0 };

    await connectToDatabase();
    const count = await Notification.countDocuments({ isRead: false });
    return { success: true, count };
  } catch (error: any) {
    return { success: false, count: 0, error: error.message };
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    await requireDashboardAccess("/sign-in");
    await connectToDatabase();

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error marking notification read:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark all unread notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    await requireDashboardAccess("/sign-in");
    await connectToDatabase();

    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error marking all notifications read:", error);
    return { success: false, error: error.message };
  }
}
