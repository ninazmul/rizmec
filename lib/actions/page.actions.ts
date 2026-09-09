"use server";

import { connectToDatabase } from "@/lib/database";
import Page, { IPage, IPageSection } from "@/lib/database/models/page.model";
import { requirePermission } from "@/lib/auth/rbac";
import { safeJson, handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getPages(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {},
) {
  await requirePermission("dashboard", "read");
  try {
    await connectToDatabase();
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.search) {
      query.$or = [
        { title: new RegExp(params.search, "i") },
        { slug: new RegExp(params.search, "i") },
      ];
    }

    const [pages, totalCount] = await Promise.all([
      Page.find(query)
        .populate("parentPage", "title slug")
        .sort({ priority: -1, title: 1 })
        .skip(skip)
        .limit(limit)
        .lean<IPage[]>(),
      Page.countDocuments(query),
    ]);

    return {
      pages: safeJson(pages),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    handleError(error);
    return { pages: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
}

export async function getAllPages(): Promise<IPage[]> {
  try {
    await connectToDatabase();
    const pages = await Page.find()
      .populate("parentPage", "title slug")
      .sort({ priority: -1, title: 1 })
      .lean<IPage[]>();
    return safeJson(pages);
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getPublishedPages(): Promise<any[]> {
  try {
    await connectToDatabase();
    const pages = await Page.find({ status: "published" })
      .populate("parentPage", "title slug")
      .sort({ priority: 1, title: 1 })
      .lean<IPage[]>();
    return safeJson(pages);
  } catch (error) {
    handleError(error);
    return [];
  }
}

/**
 * Returns published top-level pages with their children nested inside.
 * Used by the footer to build hierarchical navigation.
 */
export async function getPublishedPagesNested(): Promise<
  { title: string; slug: string; children: { title: string; slug: string }[] }[]
> {
  try {
    await connectToDatabase();
    const all = await Page.find({ status: "published" })
      .populate("parentPage", "title slug")
      .sort({ priority: 1, title: 1 })
      .lean<any[]>();

    const serialised = safeJson(all);

    // Split into parents and children
    const parents: any[] = serialised.filter((p: any) => !p.parentPage);
    const children: any[] = serialised.filter((p: any) => p.parentPage);

    return parents.map((parent: any) => ({
      title: parent.title,
      slug: parent.slug,
      children: children
        .filter((c: any) => {
          const parentId =
            typeof c.parentPage === "object"
              ? c.parentPage?._id || c.parentPage?.id
              : c.parentPage;
          return String(parentId) === String(parent._id);
        })
        .map((c: any) => ({ title: c.title, slug: c.slug })),
    }));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getPage(id: string): Promise<IPage | null> {
  try {
    await connectToDatabase();
    const page = await Page.findById(id)
      .populate("parentPage", "title slug")
      .lean<IPage>();
    return safeJson(page);
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug }).lean<IPage>();
    if (!page) return { success: false, error: "Page not found" };
    return { success: true, data: safeJson(page) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Looks up a child page by its own slug, ensuring its parent matches parentSlug.
 * Used for /[parentSlug]/[childSlug] routes.
 */
export async function getNestedPageByPath(
  parentSlug: string,
  childSlug: string,
) {
  try {
    await connectToDatabase();
    // Find the parent first
    const parent = await Page.findOne({ slug: parentSlug }).lean<IPage>();
    if (!parent) return { success: false, error: "Parent page not found" };

    // Find the child whose slug matches and parentPage points to parent
    const child = await Page.findOne({
      slug: childSlug,
      parentPage: parent._id,
    })
      .populate("parentPage", "title slug")
      .lean<IPage>();

    if (!child) return { success: false, error: "Child page not found" };
    return { success: true, data: safeJson(child), parent: safeJson(parent) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPage(params: {
  title: string;
  slug: string;
  content: string;
  description?: string;
  status: "draft" | "published";
  priority?: number;
  showInNav?: boolean;
  parentPage?: string | null;
  sections?: IPageSection[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}) {
  await requirePermission("dashboard", "create");
  try {
    await connectToDatabase();
    const newPage = await Page.create({
      ...params,
      parentPage: params.parentPage || null,
      sections: params.sections || [],
    });
    revalidatePath("/dashboard/pages");
    revalidatePath(`/${params.slug}`);
    return { success: true, data: safeJson(newPage) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePage(
  id: string,
  params: {
    title?: string;
    slug?: string;
    content?: string;
    description?: string;
    status?: "draft" | "published";
    priority?: number;
    showInNav?: boolean;
    parentPage?: string | null;
    sections?: IPageSection[];
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  },
) {
  await requirePermission("dashboard", "update");
  try {
    await connectToDatabase();
    const updated = await Page.findByIdAndUpdate(
      id,
      { $set: { ...params, parentPage: params.parentPage ?? null } },
      { new: true },
    );
    if (!updated) return { success: false, error: "Page not found" };
    revalidatePath("/dashboard/pages");
    if (params.slug) {
      revalidatePath(`/${params.slug}`);
    }
    return { success: true, data: safeJson(updated) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePage(id: string) {
  await requirePermission("dashboard", "delete");
  try {
    await connectToDatabase();
    const page = await Page.findById(id).lean<IPage>();
    if (!page) return { success: false, error: "Page not found" };

    // Also delete all children of this page
    await Page.deleteMany({ parentPage: page._id });

    await Page.findByIdAndDelete(id);
    revalidatePath("/dashboard/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedDefaultPages() {
  try {
    await connectToDatabase();

    const defaultPages = [
      {
        title: "About Us",
        slug: "about-us",
        content:
          "<p>Welcome to RIZMEC! We are dedicated to empowering communities through education, healthcare, humanitarian aid, environment conservation, and women's rights.</p>",
        status: "published" as const,
      },
      {
        title: "Contact",
        slug: "contact",
        content:
          "<p>Get in touch with us! You can reach us via email or phone.</p>",
        status: "published" as const,
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content:
          "<p>Your privacy is important to us. This policy outlines how we collect and use your information.</p>",
        status: "published" as const,
      },
    ];

    for (const pageData of defaultPages) {
      const existing = await Page.findOne({ slug: pageData.slug });
      if (!existing) {
        await Page.create(pageData);
      }
    }

    console.log("Default pages seeded!");
  } catch (error) {
    console.error("Error seeding default pages:", error);
  }
}
