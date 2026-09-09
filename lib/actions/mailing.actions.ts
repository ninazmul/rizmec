"use server";

import { connectToDatabase } from "@/lib/database";
import MailCampaign, {
  IMailCampaign,
} from "@/lib/database/models/mailCampaign.model";
import EmailTemplate from "@/lib/database/models/emailTemplate.model";
import Lead from "@/lib/database/models/lead.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function getMailCampaigns() {
  try {
    await requirePermission("mailing", "read");
    await connectToDatabase();

    const campaigns = await MailCampaign.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(campaigns)) };
  } catch (error: any) {
    console.error("Error fetching mail campaigns:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createMailCampaign(data: {
  name: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
  targetStatus: string[];
}) {
  try {
    await requirePermission("mailing", "create");
    await connectToDatabase();

    // Count matching leads
    const recipientCount = await Lead.countDocuments({
      status: { $in: data.targetStatus },
    });

    const campaign = await MailCampaign.create({
      ...data,
      recipientCount,
      sentCount: 0,
      failedCount: 0,
      status: "draft",
    });

    revalidatePath("/dashboard/mailing");
    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    console.error("Error creating mail campaign:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Dispatch Mail Campaign with Batch Processing, Unsubscribe Footer, and Nodemailer
 */
export async function sendMailCampaign(campaignId: string) {
  try {
    await requirePermission("mailing", "update");
    await connectToDatabase();

    const campaign = await MailCampaign.findById(campaignId);
    if (!campaign) return { success: false, error: "Campaign not found" };

    const leads = await Lead.find({
      status: { $in: campaign.targetStatus },
      email: { $nin: campaign.unsubscribeList || [] },
    }).lean();

    if (leads.length === 0) {
      return {
        success: false,
        error: "No eligible recipients found matching criteria.",
      };
    }

    campaign.status = "sending";
    await campaign.save();

    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    let sent = 0;
    let failed = 0;

    if (SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      // Batch size of 10 to respect rate limits
      const BATCH_SIZE = 10;
      for (let i = 0; i < leads.length; i += BATCH_SIZE) {
        const batch = leads.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (lead: any) => {
            try {
              const personalizedHtml = `
                <div style="font-family: sans-serif; background: #09090b; color: #f4f4f5; padding: 30px; border-radius: 8px;">
                  <div style="font-family: monospace; font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #ffffff;">
                    RIZMEC
                  </div>
                  <div style="line-height: 1.6; color: #e4e4e7;">
                    ${campaign.contentHtml.replace(/\{\{name\}\}/g, lead.name).replace(/\{\{company\}\}/g, lead.company || "Partner")}
                  </div>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #71717a;">
                    You are receiving this message because you interacted with RIZMEC Engineering.<br/>
                    RIZMEC • 100 Montgomery St, San Francisco, CA 94104<br/>
                    <a href="https://rizmec.com/unsubscribe?email=${encodeURIComponent(lead.email)}" style="color: #a1a1aa; text-decoration: underline;">Unsubscribe from engineering updates</a>
                  </div>
                </div>
              `;

              await transporter.sendMail({
                from: `"RIZMEC Engineering" <${SMTP_USER}>`,
                to: lead.email,
                subject: campaign.subject,
                html: personalizedHtml,
              });
              sent++;
            } catch (err) {
              failed++;
            }
          }),
        );
      }
    } else {
      // Simulation mode
      sent = leads.length;
    }

    campaign.sentCount = sent;
    campaign.failedCount = failed;
    campaign.status = "completed";
    campaign.sentAt = new Date();
    await campaign.save();

    revalidatePath("/dashboard/mailing");
    return {
      success: true,
      data: { sentCount: sent, failedCount: failed },
    };
  } catch (error: any) {
    console.error("Error sending mail campaign:", error);
    return { success: false, error: error.message };
  }
}

export async function getEmailTemplates() {
  try {
    await requirePermission("mailing", "read");
    await connectToDatabase();

    const templates = await EmailTemplate.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(templates)) };
  } catch (error: any) {
    console.error("Error fetching email templates:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function saveEmailTemplate(data: {
  name: string;
  subject: string;
  bodyHtml: string;
  category: any;
  variables?: string[];
}) {
  try {
    await requirePermission("mailing", "create");
    await connectToDatabase();

    const template = await EmailTemplate.create(data);
    return { success: true, data: JSON.parse(JSON.stringify(template)) };
  } catch (error: any) {
    console.error("Error saving email template:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMailCampaign(
  id: string,
  data: {
    name?: string;
    subject?: string;
    previewText?: string;
    contentHtml?: string;
    targetStatus?: string[];
  },
) {
  try {
    await requirePermission("mailing", "update");
    await connectToDatabase();

    const existing = await MailCampaign.findById(id);
    if (!existing) return { success: false, error: "Campaign not found." };
    if (existing.status === "completed" || existing.status === "sending") {
      return {
        success: false,
        error: `Campaign is ${existing.status} and cannot be edited.`,
      };
    }

    const updateData: any = { ...data };
    if (data.targetStatus) {
      const recipientCount = await Lead.countDocuments({
        status: { $in: data.targetStatus },
      });
      updateData.recipientCount = recipientCount;
    }

    const updated = await MailCampaign.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    revalidatePath("/dashboard/mailing");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating mail campaign:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMailCampaign(id: string) {
  try {
    await requirePermission("mailing", "delete");
    await connectToDatabase();

    const existing = await MailCampaign.findById(id);
    if (!existing) return { success: false, error: "Campaign not found." };
    if (existing.status === "sending") {
      return {
        success: false,
        error: "Cannot delete a campaign that is currently sending.",
      };
    }

    await MailCampaign.findByIdAndDelete(id);
    revalidatePath("/dashboard/mailing");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting mail campaign:", error);
    return { success: false, error: error.message };
  }
}
