"use server";

import { connectToDatabase } from "@/lib/database";
import Project, { IProject } from "@/lib/database/models/project.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import { notifyAdminsOnStatusChange } from "@/lib/actions/notification.actions";

export async function getProjects(params?: {
  published?: boolean;
  featured?: boolean;
  industry?: string;
  limit?: number;
}) {
  // Fetch current user access to enforce project visibility restrictions
  const { getCurrentDashboardAccess } = await import("@/lib/auth/rbac");
  const access = await getCurrentDashboardAccess();
  if (!access) {
    return { success: false, error: "Unauthorized", data: [] };
  }
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;
    if (params?.industry) query.industry = params.industry;

    // Restrict workers and interns to only projects they are assigned to
    if (access.role === "worker" || access.role === "intern") {
      if (access.teamMemberId) {
        query.teamMemberIds = access.teamMemberId;
      } else {
        // No team member association, return empty list
        return { success: true, data: [] };
      }
    }

    let q = Project.find(query)
      .populate("teamMemberIds", "name title avatar slug")
      .sort({ order: 1, createdAt: -1 });
    if (params?.limit) q = q.limit(params.limit);

    const projects = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProjectBySlug(slug: string) {
  // Fetch current user access to enforce project visibility restrictions
  const { getCurrentDashboardAccess } = await import("@/lib/auth/rbac");
  const access = await getCurrentDashboardAccess();
  if (!access) {
    return { success: false, error: "Unauthorized", data: null };
  }

  try {
    await connectToDatabase();
    const query: any = { slug: slug.toLowerCase() };
    // Restrict workers and interns to projects they are assigned to
    if (access.role === "worker" || access.role === "intern") {
      if (access.teamMemberId) {
        query.teamMemberIds = access.teamMemberId;
      } else {
        return { success: false, error: "Unauthorized", data: null };
      }
    }
    const project = await Project.findOne(query)
      .populate("teamMemberIds", "name title avatar slug bio skills socialLinks")
      .lean();
    if (!project) return { success: false, data: null };
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error("Error fetching project by slug:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createProject(data: Partial<IProject>) {
  try {
    await requirePermission("projects", "create");
    await connectToDatabase();

    const slug = (data.slug || data.title || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProject = await Project.create({ ...data, slug });
    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, data: Partial<IProject>) {
  try {
    await requirePermission("projects", "update");
    await connectToDatabase();

    const existing = await Project.findById(id);
    if (!existing) return { success: false, error: "Project not found." };

    const oldStatus = existing.status || "in_progress";
    const statusChanged = data.status && data.status !== oldStatus;

    const updated = await Project.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();

    if (statusChanged && updated) {
      notifyAdminsOnStatusChange({
        type: "order",
        entityId: id,
        identifier: updated.title,
        projectName: updated.title,
        clientName: updated.clientName,
        oldStatus,
        newStatus: data.status!,
        actionUrl: "/dashboard/projects",
        details: `Work Order / Project status changed from "${oldStatus}" to "${data.status}".`,
      }).catch((err) => console.error("Error notifying admins of project status:", err));
    }

    revalidatePath("/work");
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProjectStatus(
  id: string,
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold"
) {
  try {
    await requirePermission("projects", "update");
    await connectToDatabase();

    const existing = await Project.findById(id);
    if (!existing) return { success: false, error: "Project not found." };

    const oldStatus = existing.status || "in_progress";
    existing.status = status;
    await existing.save();

    notifyAdminsOnStatusChange({
      type: "order",
      entityId: existing._id.toString(),
      identifier: existing.title,
      projectName: existing.title,
      clientName: existing.clientName,
      oldStatus,
      newStatus: status,
      actionUrl: "/dashboard/projects",
      details: `Work Order / Project status transitioned from "${oldStatus}" to "${status}".`,
    }).catch((err) => console.error("Error notifying admins of project status:", err));

    revalidatePath("/dashboard/projects");
    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(existing)) };
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await requirePermission("projects", "delete");
    await connectToDatabase();

    await Project.findByIdAndDelete(id);
    revalidatePath("/work");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message };
  }
}
