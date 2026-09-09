"use server";

import { connectToDatabase } from "@/lib/database";
import Testimonial, { ITestimonial } from "@/lib/database/models/testimonial.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getTestimonials(params?: {
  published?: boolean;
  featured?: boolean;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;

    let q = Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    if (params?.limit) q = q.limit(params.limit);

    const testimonials = await q.lean();
    return { success: true, data: JSON.parse(JSON.stringify(testimonials)) };
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createTestimonial(data: Partial<ITestimonial>) {
  try {
    await requirePermission("testimonials", "create");
    await connectToDatabase();

    const newTestimonial = await Testimonial.create(data);
    revalidatePath("/dashboard/testimonials");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(newTestimonial)) };
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTestimonial(id: string, data: Partial<ITestimonial>) {
  try {
    await requirePermission("testimonials", "update");
    await connectToDatabase();

    const updated = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/dashboard/testimonials");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requirePermission("testimonials", "delete");
    await connectToDatabase();

    await Testimonial.findByIdAndDelete(id);
    revalidatePath("/dashboard/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: error.message };
  }
}
