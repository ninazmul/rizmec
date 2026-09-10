import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/database";
import Project from "@/lib/database/models/project.model";
import Service from "@/lib/database/models/service.model";
import Product from "@/lib/database/models/product.model";
import TeamMember from "@/lib/database/models/teamMember.model";
import PageModel from "@/lib/database/models/page.model";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://rizmec.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic: Projects / Work
  const projects = await Project.find({ published: true })
    .select("slug updatedAt")
    .lean<any[]>();

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic: Services
  const services = await Service.find({ isActive: true })
    .select("slug updatedAt")
    .lean<any[]>();

  const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Dynamic: Products
  const products = await Product.find({ isActive: true })
    .select("slug updatedAt")
    .lean<any[]>();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Dynamic: Team Members
  const teamMembers = await TeamMember.find({ isActive: true })
    .select("slug updatedAt")
    .lean<any[]>();

  const teamUrls: MetadataRoute.Sitemap = teamMembers.map((t) => ({
    url: `${baseUrl}/p/${t.slug}`,
    lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic: CMS pages
  const pages = await PageModel.find({ status: "published" })
    .populate("parentPage", "slug")
    .select("slug updatedAt parentPage")
    .lean<any[]>();

  const pageUrls: MetadataRoute.Sitemap = pages.map((page) => {
    const parentSlug =
      page.parentPage && typeof page.parentPage === "object"
        ? page.parentPage.slug
        : null;
    return {
      url: parentSlug
        ? `${baseUrl}/${parentSlug}/${page.slug}`
        : `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: parentSlug ? 0.5 : 0.6,
    };
  });

  return [
    ...staticPages,
    ...projectUrls,
    ...serviceUrls,
    ...productUrls,
    ...teamUrls,
    ...pageUrls,
  ];
}
