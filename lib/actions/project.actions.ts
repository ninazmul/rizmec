"use server";

import { connectToDatabase } from "@/lib/database";
import Project, { IProject } from "@/lib/database/models/project.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getProjects(params?: {
  published?: boolean;
  featured?: boolean;
  industry?: string;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;
    if (params?.industry) query.industry = params.industry;

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
  try {
    await connectToDatabase();
    const project = await Project.findOne({ slug: slug.toLowerCase() })
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

    const updated = await Project.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/work");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating project:", error);
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
