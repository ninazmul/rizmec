import { NextRequest, NextResponse } from "next/server";
import { getCurrentDashboardAccess } from "@/lib/auth/rbac";
import { hasPermission } from "@/lib/auth/rbac-rules";
import { connectToDatabase } from "@/lib/database";
import Client from "@/lib/database/models/client.model";
import nodemailer from "nodemailer";

export const maxDuration = 60; // Allow sufficient time for batch email sending

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate and check permissions
    const access = await getCurrentDashboardAccess();
    if (!access) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (!hasPermission(access, "clients", "update") && !access.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Insufficient permissions to email clients." },
        { status: 403 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const subject = (formData.get("subject") as string || "").trim();
    const message = (formData.get("message") as string || "").trim();
    const sendToAll = formData.get("sendToAll") === "true";
    const statusFilter = formData.get("statusFilter") as string || "";
    const clientIdsRaw = formData.get("clientIds") as string || "[]";
    const files = formData.getAll("files") as File[];

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Email subject is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message body is required." },
        { status: 400 }
      );
    }

    // 3. Process attachments
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total
    let totalSize = 0;

    const attachments: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }> = [];

    for (const file of files) {
      if (!file || typeof file === "string" || file.size === 0) continue;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds the 10MB limit per attachment.`,
          },
          { status: 400 }
        );
      }

      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: "Total attachment size exceeds the 25MB email limit.",
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name,
        content: Buffer.from(arrayBuffer),
        contentType: file.type || "application/octet-stream",
      });
    }

    // 4. Query recipients from database
    await connectToDatabase();
    let recipients: Array<{
      _id: any;
      company: string;
      contactPerson: string;
      email: string;
    }> = [];

    if (sendToAll) {
      const query: any = {};
      if (statusFilter && statusFilter !== "all") {
        query.status = statusFilter;
      }
      recipients = await Client.find(query)
        .select("_id company contactPerson email")
        .lean();
    } else {
      let clientIds: string[] = [];
      try {
        clientIds = JSON.parse(clientIdsRaw);
      } catch {
        clientIds = [];
      }

      if (!Array.isArray(clientIds) || clientIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "Please select at least one recipient." },
          { status: 400 }
        );
      }

      recipients = await Client.find({ _id: { $in: clientIds } })
        .select("_id company contactPerson email")
        .lean();
    }

    // Filter recipients with valid emails
    const validRecipients = recipients.filter(
      (r) => r.email && r.email.includes("@")
    );

    if (validRecipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid client email addresses found for the selected recipients.",
        },
        { status: 400 }
      );
    }

    // 5. Configure SMTP transporter
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const senderEmail = SMTP_USER || "contact@rizmec.com";

    const isMocked = !SMTP_USER || !SMTP_PASS;

    const transporter = !isMocked
      ? nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        })
      : null;

    let sentCount = 0;
    let failedCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    // Helper to format HTML email
    const createHtml = (
      personalizedBody: string,
      contactPerson: string,
      company: string
    ) => {
      // Convert line breaks to paragraphs/breaks if plain text
      const formattedContent = personalizedBody
        .split("\n\n")
        .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.6;">${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");

      const attachmentInfo =
        attachments.length > 0
          ? `
          <div style="margin-top: 24px; padding: 14px 18px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;">
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; margin-bottom: 8px;">
              Attached Files (${attachments.length})
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #e4e4e7;">
              ${attachments.map((a) => `<li style="margin-bottom: 4px;">${a.filename}</li>`).join("")}
            </ul>
          </div>
        `
          : "";

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0b0b0c; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: linear-gradient(180deg, #121214 0%, #0b0b0c 100%);">
                      <div style="font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; margin-bottom: 4px;">
                        RIZMEC
                      </div>
                      <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">
                        Intelligence. Engineered.
                      </div>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 36px; font-size: 14px; color: #d4d4d8;">
                      <div style="margin-bottom: 20px; font-size: 13px; color: #a1a1aa; font-family: monospace;">
                        To: <strong style="color: #ffffff;">${contactPerson || company}</strong> (${company})
                      </div>
                      <div style="color: #f4f4f5; font-size: 15px;">
                        ${formattedContent}
                      </div>
                      ${attachmentInfo}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 36px; background-color: #080809; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #71717a; line-height: 1.6;">
                      <div style="font-family: monospace; margin-bottom: 6px; color: #a1a1aa;">
                        RIZMEC Engineering Inc. • Client Communications
                      </div>
                      <div>
                        This transmission is intended solely for the designated recipient and may contain privileged or proprietary intelligence.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    };

    // 6. Send in rate-limited batches (batch of 5 to avoid SMTP rate limits)
    const BATCH_SIZE = 5;
    for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
      const batch = validRecipients.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (client) => {
          try {
            // Personalize subject & body
            const personalizedSubject = subject
              .replace(/\{\{company\}\}/gi, client.company || "Partner")
              .replace(/\{\{contactPerson\}\}/gi, client.contactPerson || "Valued Client");

            const personalizedBody = message
              .replace(/\{\{company\}\}/gi, client.company || "Partner")
              .replace(/\{\{contactPerson\}\}/gi, client.contactPerson || "Valued Client")
              .replace(/\{\{email\}\}/gi, client.email);

            const html = createHtml(
              personalizedBody,
              client.contactPerson,
              client.company
            );

            if (transporter) {
              await transporter.sendMail({
                from: `"RIZMEC Engineering" <${senderEmail}>`,
                to: client.email,
                subject: personalizedSubject,
                text: personalizedBody,
                html,
                attachments,
              });
            } else {
              // Dev/mock mode
              console.log(
                `[DEV EMAIL MOCK] Sent to ${client.email} (${client.company}) with ${attachments.length} attachment(s). Subject: "${personalizedSubject}"`
              );
            }

            sentCount++;
          } catch (err: any) {
            console.error(`Failed to send email to ${client.email}:`, err);
            failedCount++;
            errors.push({
              email: client.email,
              error: err?.message || "Delivery failed",
            });
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      mocked: isMocked,
      totalRecipients: validRecipients.length,
      sentCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error in /api/clients/send-email:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
