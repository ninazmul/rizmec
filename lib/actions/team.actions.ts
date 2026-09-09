"use server";

import { connectToDatabase } from "@/lib/database";
import TeamMember, { ITeamMember } from "@/lib/database/models/teamMember.model";
import User from "@/lib/database/models/user.model";
import { requireDashboardAccess, requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

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
    revalidatePath(`/team/${updated?.slug}`);
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Worker Self-Service: Update personal profile from the member dashboard
 */
export async function updateMyProfile(data: {
  title?: string;
  tagline?: string;
  bio?: string;
  avatar?: string;
  skills?: any[];
  technologies?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  socialLinks?: any;
}) {
  try {
    const access = await requireDashboardAccess();
    await connectToDatabase();

    // Check if user already has a linked team member profile
    let member = access.teamMemberId
      ? await TeamMember.findById(access.teamMemberId)
      : await TeamMember.findOne({ email: access.email.toLowerCase() });

    if (!member) {
      // Create new linked team member profile
      const slug = access.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

      member = await TeamMember.create({
        userId: access.dbUserId,
        name: access.name,
        slug,
        title: data.title || "Software Engineer",
        tagline: data.tagline || "Systems & Distributed Engineering",
        bio: data.bio || "",
        avatar: data.avatar || "/assets/images/placeholder.webp",
        email: access.email,
        skills: data.skills || [],
        technologies: data.technologies || [],
        experience: data.experience || [],
        education: data.education || [],
        certifications: data.certifications || [],
        socialLinks: data.socialLinks || {},
        published: true,
      });

      // Link to User record
      await User.findByIdAndUpdate(access.dbUserId, { teamMemberId: member._id });
    } else {
      // Update existing profile
      member = await TeamMember.findByIdAndUpdate(
        member._id,
        { $set: data },
        { new: true },
      );
    }

    revalidatePath("/team");
    if (member?.slug) revalidatePath(`/team/${member.slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    console.error("Error updating personal profile:", error);
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
