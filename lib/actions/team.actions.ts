"use server";

import { connectToDatabase } from "@/lib/database";
import TeamMember, { ITeamMember } from "@/lib/database/models/teamMember.model";
import User from "@/lib/database/models/user.model";
import { requireDashboardAccess, requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function getTeamMembers(params?: {
  published?: boolean;
  featured?: boolean;
  role?: string;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;
    if (params?.role) query.role = params.role;

    let q = TeamMember.find(query).sort({ order: 1, createdAt: 1 });
    if (params?.limit) q = q.limit(params.limit);

    const members = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(members)) };
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getTeamMemberBySlug(slug: string) {
  try {
    await connectToDatabase();
    const member = await TeamMember.findOne({ slug: slug.toLowerCase() }).lean();
    if (!member) return { success: false, data: null };
    return { success: true, data: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    console.error("Error fetching team member by slug:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createTeamMember(data: Partial<ITeamMember>) {
  try {
    await requirePermission("team", "create");
    await connectToDatabase();

    const slug = (data.slug || data.name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newMember = await TeamMember.create({ ...data, slug });
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(newMember)) };
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamMember(id: string, data: Partial<ITeamMember>) {
  try {
    await requirePermission("team", "update");
    await connectToDatabase();

    const updated = await TeamMember.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/team");
    revalidatePath(`/p/${updated?.slug}`);
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if a custom slug / URL is available
 */
export async function checkSlugAvailable(slug: string, currentMemberId?: string) {
  try {
    await connectToDatabase();
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug || cleanSlug.length < 2) {
      return { available: false, error: "Slug must be at least 2 characters long" };
    }

    const existing = await TeamMember.findOne({ slug: cleanSlug });
    if (!existing) return { available: true, cleanSlug };

    if (currentMemberId && existing._id.toString() === currentMemberId.toString()) {
      return { available: true, cleanSlug };
    }

    return { available: false, error: "This custom URL is already in use by another member." };
  } catch (error: any) {
    return { available: false, error: error.message };
  }
}

/**
 * Worker Self-Service: Get personal profile for logged-in user
 */
export async function getMyProfile() {
  try {
    const access = await requireDashboardAccess();
    await connectToDatabase();

    let member = access.teamMemberId
      ? await TeamMember.findById(access.teamMemberId).lean()
      : await TeamMember.findOne({ email: access.email.toLowerCase() }).lean();

    if (!member) {
      // Return empty skeleton matching user identity
      return {
        success: true,
        data: {
          name: access.name || "",
          email: access.email || "",
          slug: (access.name || "engineer")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-"),
          title: "Software Engineer",
          tagline: "Systems & Distributed Engineering",
          bio: "",
          avatar: "/assets/images/placeholder.webp",
          location: "",
          skills: [],
          technologies: [],
          experience: [],
          education: [],
          certifications: [],
          customProjects: [],
          themeConfig: { preset: "obsidian", effect3D: "tilt", accentColor: "" },
          contactInfo: { personalEmail: access.email, publicEmail: true },
          availability: { status: "open_to_work", label: "Open for new opportunities & consulting" },
          socialLinks: {},
        },
      };
    }

    return { success: true, data: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    console.error("Error fetching my profile:", error);
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Worker Self-Service: Update personal profile from the member dashboard
 */
export async function updateMyProfile(data: {
  name?: string;
  slug?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  skills?: any[];
  technologies?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  customProjects?: any[];
  achievements?: string[];
  themeConfig?: any;
  contactInfo?: any;
  availability?: any;
  seo?: any;
  socialLinks?: any;
}) {
  try {
    const access = await requireDashboardAccess();
    await connectToDatabase();

    // Check if user already has a linked team member profile
    let member = access.teamMemberId
      ? await TeamMember.findById(access.teamMemberId)
      : await TeamMember.findOne({ email: access.email.toLowerCase() });

    // Handle slug change if provided
    let finalSlug: string | undefined;
    if (data.slug) {
      const cleanSlug = data.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const conflict = await TeamMember.findOne({
        slug: cleanSlug,
        ...(member ? { _id: { $ne: member._id } } : {}),
      });

      if (conflict) {
        return { success: false, error: `URL handle '/p/${cleanSlug}' is already taken.` };
      }
      finalSlug = cleanSlug;
    }

    if (!member) {
      // Create new linked team member profile
      const slug =
        finalSlug ||
        (data.name || access.name)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      member = await TeamMember.create({
        userId: access.dbUserId,
        name: data.name || access.name,
        slug,
        title: data.title || "Software Engineer",
        tagline: data.tagline || "Systems & Distributed Engineering",
        bio: data.bio || "",
        avatar: data.avatar || "/assets/images/placeholder.webp",
        coverImage: data.coverImage || "",
        email: access.email,
        location: data.location || "",
        skills: data.skills || [],
        technologies: data.technologies || [],
        experience: data.experience || [],
        education: data.education || [],
        certifications: data.certifications || [],
        customProjects: data.customProjects || [],
        themeConfig: data.themeConfig || { preset: "obsidian", effect3D: "tilt" },
        contactInfo: data.contactInfo || { personalEmail: access.email, publicEmail: true },
        availability: data.availability || { status: "open_to_work", label: "Open for new opportunities" },
        seo: data.seo || {},
        socialLinks: data.socialLinks || {},
        published: true,
      });

      // Link to User record
      await User.findByIdAndUpdate(access.dbUserId, { teamMemberId: member._id });
    } else {
      // Update existing profile
      const updatePayload: any = { ...data };
      if (finalSlug) {
        updatePayload.slug = finalSlug;
      }

      member = await TeamMember.findByIdAndUpdate(
        member._id,
        { $set: updatePayload },
        { new: true },
      );
    }

    revalidatePath("/team");
    revalidatePath(`/p/${member.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    console.error("Error updating personal profile:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Direct inquiry message to an individual team member / worker
 */
export async function submitPortfolioDirectMessage(data: {
  memberId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  subject?: string;
}) {
  try {
    await connectToDatabase();
    if (!data.senderName || !data.senderEmail || !data.message) {
      return { success: false, error: "Please provide your name, email, and message." };
    }

    const member = await TeamMember.findById(data.memberId);
    if (!member) {
      return { success: false, error: "Portfolio owner not found." };
    }

    const recipientEmail = member.contactInfo?.personalEmail || member.email;

    // Send email using nodemailer if configured
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (SMTP_USER && SMTP_PASS && recipientEmail) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"${data.senderName}" <${SMTP_USER}>`,
        replyTo: data.senderEmail,
        to: recipientEmail,
        subject: data.subject || `New message from ${data.senderName} via your Portfolio`,
        text: `From: ${data.senderName} (${data.senderEmail})\n\nMessage:\n${data.message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #111; margin-top: 0;">New Inquiry for ${member.name}</h2>
            <p><strong>From:</strong> ${data.senderName} &lt;<a href="mailto:${data.senderEmail}">${data.senderEmail}</a>&gt;</p>
            ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
            <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #111;">
              <p style="white-space: pre-wrap; margin: 0; color: #333;">${data.message}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #888;">This email was sent from your personal public portfolio contact form.</p>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting direct message:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await requirePermission("team", "delete");
    await connectToDatabase();

    await TeamMember.findByIdAndDelete(id);
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return { success: false, error: error.message };
  }
}
