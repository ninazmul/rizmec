"use server";

import { connectToDatabase } from "@/lib/database";
import Product, { IProduct } from "@/lib/database/models/product.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

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
    return { success: true, data: JSON.parse(JSON.stringify(products)) };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: slug.toLowerCase() }).lean();
    if (!product) return { success: false, data: null };
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error);
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
