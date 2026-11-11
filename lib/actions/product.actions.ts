"use server";

import { connectToDatabase } from "@/lib/database";
import Product, { IProduct } from "@/lib/database/models/product.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

const CURATED_PRODUCTS = [
  {
    _id: "product-01",
    title: "Rizmec PartnerOS",
    slug: "partneros",
    tagline: "Unified Operations Platform for International Student Recruitment",
    category: "Education Technology",
    summary:
      "Modular, configurable platform architecture unifying student application tracking, sub-agent hierarchies, commission calculation, and document verification.",
    description:
      "PartnerOS is engineered specifically for international student recruitment agencies, admission consultancies, and multi-agent education networks. It centralizes applicant workflows, eliminates spreadsheet chaos, and automates partner commission payouts.",
    features: [
      "Student application lifecycle tracking and Kanban pipeline",
      "Multi-tier agent and sub-agent management with lead attribution",
      "Automated commission calculation based on university milestone agreements",
      "Centralized document verification vault with completeness checklists",
    ],
    techStack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
    screenshots: [
      {
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
        caption: "PartnerOS Agency Console",
      },
    ],
    demoUrl: "https://rizmec.com/products/partneros",
    status: "active",
    order: 1,
    featured: true,
    published: true,
  },
];

export async function getProducts(params?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: any = {};
    if (params?.published !== undefined) query.published = params.published;
    if (params?.featured !== undefined) query.featured = params.featured;
    if (params?.category) query.category = params.category;

    let q = Product.find(query).sort({ order: 1, createdAt: -1 });
    if (params?.limit) q = q.limit(params.limit);

    const products = await q.lean();
    if (products && products.length > 0) {
      return { success: true, data: JSON.parse(JSON.stringify(products)) };
    }
    return { success: true, data: CURATED_PRODUCTS };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: true, data: CURATED_PRODUCTS };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: slug.toLowerCase() }).lean();
    if (product) return { success: true, data: JSON.parse(JSON.stringify(product)) };
    const fallback = CURATED_PRODUCTS.find((p) => p.slug === slug.toLowerCase());
    if (fallback) return { success: true, data: fallback };
    return { success: false, data: null };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error);
    const fallback = CURATED_PRODUCTS.find((p) => p.slug === slug.toLowerCase());
    if (fallback) return { success: true, data: fallback };
    return { success: false, error: error.message, data: null };
  }
}

export async function createProduct(data: Partial<IProduct>) {
  try {
    await requirePermission("products", "create");
    await connectToDatabase();

    const slug = (data.slug || data.title || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProduct = await Product.create({ ...data, slug });
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: Partial<IProduct>) {
  try {
    await requirePermission("products", "update");
    await connectToDatabase();

    const updated = await Product.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requirePermission("products", "delete");
    await connectToDatabase();

    await Product.findByIdAndDelete(id);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
