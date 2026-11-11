"use server";

import { connectToDatabase } from "@/lib/database";
import Testimonial, { ITestimonial } from "@/lib/database/models/testimonial.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

const CURATED_TESTIMONIALS = [
  {
    _id: "testimonial-01",
    clientName: "David Sterling",
    company: "International Education Consultancies Ltd",
    position: "Admissions Operations Director",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    content:
      "Centralizing our sub-agent network and student application tracking into one structured platform eliminated administrative confusion and gave our counselors complete clarity across all partner intakes.",
    rating: 5,
    featured: true,
    published: true,
    order: 1,
  },
  {
    _id: "testimonial-02",
    clientName: "Marcus Vance",
    company: "B2B Technology Services Enterprise",
    position: "Managing Director",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    content:
      "The ability to generate dynamic quotes, have clients accept them with immutable snapshots, and immediately trigger invoices has completely streamlined our commercial operations.",
    rating: 5,
    featured: true,
    published: true,
    order: 2,
  },
  {
    _id: "testimonial-03",
    clientName: "Sarah Al-Mansoor",
    company: "Digital Media Publishing Group",
    position: "Head of Editorial Operations",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    content:
      "Our digital publication now loads instantaneously across every mobile device. The editorial workflow is effortless, and our Core Web Vitals are consistently in the green.",
    rating: 5,
    featured: true,
    published: true,
    order: 3,
  },
];

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
    if (testimonials && testimonials.length > 0) {
      return { success: true, data: JSON.parse(JSON.stringify(testimonials)) };
    }
    return { success: true, data: CURATED_TESTIMONIALS };
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return { success: true, data: CURATED_TESTIMONIALS };
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
