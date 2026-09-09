"use server";

import { connectToDatabase } from "@/lib/database";
import Service, { IService } from "@/lib/database/models/service.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getServices(params?: {
  published?: boolean;
  featured?: boolean;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;

    let q = Service.find(query).sort({ order: 1, createdAt: -1 });
    if (params?.limit) q = q.limit(params.limit);

    const services = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(services)) };
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectToDatabase();
    const service = await Service.findOne({ slug: slug.toLowerCase() }).lean();
    if (!service) return { success: false, data: null };
    return { success: true, data: JSON.parse(JSON.stringify(service)) };
  } catch (error: any) {
    console.error("Error fetching service by slug:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createService(data: Partial<IService>) {
  try {
    await requirePermission("services", "create");
    await connectToDatabase();

    const slug = (data.slug || data.title || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newService = await Service.create({ ...data, slug });
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(newService)) };
  } catch (error: any) {
    console.error("Error creating service:", error);
    return { success: false, error: error.message };
  }
}

export async function updateService(id: string, data: Partial<IService>) {
  try {
    await requirePermission("services", "update");
    await connectToDatabase();

    const updated = await Service.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating service:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    await requirePermission("services", "delete");
    await connectToDatabase();

    await Service.findByIdAndDelete(id);
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return { success: false, error: error.message };
  }
}
