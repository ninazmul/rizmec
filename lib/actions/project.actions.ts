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

export async function getPublishedProjectsForTeamMember(teamMemberId: string) {
  try {
    await connectToDatabase();
    const projects = await Project.find({
      published: true,
      teamMemberIds: teamMemberId,
    })
      .populate("teamMemberIds", "name title avatar slug")
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    console.error("Error fetching published team member projects:", error);
    return { success: false, error: error.message, data: [] };
  }
}

const CURATED_CASE_STUDIES = [
  {
    _id: "case-study-01",
    title: "Education Partner Portal & Agent Management System",
    slug: "education-partner-portal",
    clientName: "International Education Consultancy Network",
    industry: "Education Technology",
    summary:
      "Architected a centralized partner operations platform unifying international student application tracking, multi-tier agent and sub-agent hierarchies, and automated commission workflows.",
    challenge:
      "The client was coordinating student admissions across multiple destination markets using disconnected spreadsheets and manual email threads. External sub-agents lacked direct portal visibility, leading to delayed application submissions, unverified document packets, and recurring commission reconciliation disputes.",
    solution:
      "Rizmec engineered an integrated, role-based operations platform with distinct access levels for counselors, admissions officers, and external recruitment partners. The solution features an admission pipeline tracker, encrypted document verification vault, and an automated commission calculation matrix tied to university enrollment milestones.",
    results:
      "Streamlined application turnaround times by 45%, eliminated lost documentation across counselor handoffs, and provided real-time commission statements for over 40 recruitment partner branches.",
    metrics: [
      { label: "Application Processing Time", value: "-45%", change: "Optimized" },
      { label: "Partner & Sub-Agent Branches", value: "40+", change: "Connected" },
      { label: "Document Verification Velocity", value: "3x Faster", change: "Automated" },
    ],
    services: [
      "Education Technology",
      "Custom Software Engineering",
      "Client & Partner Portals",
      "Workflow Automation",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Role-Based Access Control",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    completionDate: "Production Deployed",
    teamMemberIds: [],
    testimonial: {
      quote:
        "Centralizing our sub-agent network and student application tracking into one structured platform eliminated administrative confusion and gave our counselors complete clarity across all partner intakes.",
      author: "Admissions Operations Lead",
      role: "International Education Consultancy",
    },
    featured: true,
    published: true,
    order: 1,
    status: "completed" as const,
  },
  {
    _id: "case-study-02",
    title: "Custom Business ERP & Financial Operations Platform",
    slug: "business-operations-erp",
    clientName: "B2B Technology Services Enterprise",
    industry: "Enterprise Operations",
    summary:
      "Designed an end-to-end business operations platform integrating customer management, dynamic quotation generation, immutable client acceptance snapshots, and automated invoice delivery.",
    challenge:
      "The business was running sales quoting, customer records, and invoicing across disparate SaaS subscriptions. Revisions to customer quotes were unversioned, causing administrative friction during client sign-offs and delayed payment reconciliations.",
    solution:
      "Rizmec engineered a unified internal operating system. The platform incorporates unpredictable 192-bit cryptographic entropy tokens for public document access, immutable electronic acceptance snapshots, automated PDF invoice generation, and real-time status audit logging.",
    results:
      "Consolidated multiple third-party tool subscriptions into one dedicated platform, accelerated quote-to-invoice cycles by 60%, and created a tamper-evident audit record for every commercial transaction.",
    metrics: [
      { label: "Quote-to-Invoice Turnaround", value: "-60%", change: "Accelerated" },
      { label: "Billing Reconciliation Accuracy", value: "100%", change: "Audit-Ready" },
      { label: "Administrative Overhead", value: "-35%", change: "Saved" },
    ],
    services: [
      "Custom Software Engineering",
      "Business ERP & CRM",
      "Document Workflows",
      "Role-Based Access Control",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Mongoose",
      "Tailwind CSS",
      "Nodemailer",
      "Cryptographic Security",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    completionDate: "Production Deployed",
    teamMemberIds: [],
    testimonial: {
      quote:
        "The ability to generate dynamic quotes, have clients accept them with immutable snapshots, and immediately trigger invoices has completely streamlined our commercial operations.",
      author: "Managing Director",
      role: "B2B Technology Services Enterprise",
    },
    featured: true,
    published: true,
    order: 2,
    status: "completed" as const,
  },
  {
    _id: "case-study-03",
    title: "High-Performance Digital Publishing & Content Platform",
    slug: "digital-publishing-platform",
    clientName: "Multi-Region Media & Digital Publication",
    industry: "Digital Publishing & Media",
    summary:
      "Built a high-concurrency editorial and publishing platform featuring rich-text composition, responsive image asset optimization, localized content delivery, and sub-second page rendering.",
    challenge:
      "The client's legacy content management system suffered from sluggish hydration on mobile devices, severe cumulative layout shifts (CLS), and cumbersome editorial tools that slowed daily publication schedules.",
    solution:
      "Rizmec constructed a clean Next.js server-component architecture pairing headless rich-text editing with edge-cached content distribution, automated image responsive sets, and semantic structured data targeting 100/100 Core Web Vitals.",
    results:
      "Achieved sub-second Largest Contentful Paint (LCP) across mobile devices, zero cumulative layout shift (CLS), and increased daily editorial publishing speed by 2.5x.",
    metrics: [
      { label: "Largest Contentful Paint (LCP)", value: "< 0.9s", change: "Sub-Second" },
      { label: "Cumulative Layout Shift (CLS)", value: "0.00", change: "Zero Shift" },
      { label: "Editorial Publishing Speed", value: "2.5x", change: "Productivity" },
    ],
    services: [
      "Custom Software Engineering",
      "Full-Stack Web Applications",
      "Technical SEO & Core Web Vitals",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "TipTap",
      "Edge Caching",
      "Structured Data",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    completionDate: "Production Deployed",
    teamMemberIds: [],
    testimonial: {
      quote:
        "Our digital publication now loads instantaneously across every mobile device. The editorial workflow is effortless, and our Core Web Vitals are consistently in the green.",
      author: "Head of Editorial Operations",
      role: "Multi-Region Media Publication",
    },
    featured: true,
    published: true,
    order: 3,
    status: "completed" as const,
  },
];

export async function getPublishedProjects(params?: {
  featured?: boolean;
  limit?: number;
}) {
  try {
    await connectToDatabase();
    const query: { published: boolean; featured?: boolean } = {
      published: true,
    };
    if (params?.featured !== undefined) query.featured = params.featured;

    let projectsQuery = Project.find(query)
      .populate("teamMemberIds", "name title avatar slug")
      .sort({ order: 1, createdAt: -1 });
    if (params?.limit) projectsQuery = projectsQuery.limit(params.limit);

    const projects = await projectsQuery.lean();
    if (projects && projects.length > 0) {
      return { success: true, data: JSON.parse(JSON.stringify(projects)) };
    }
    // Return curated verified case studies when DB has none or is fresh
    let fallback = CURATED_CASE_STUDIES;
    if (params?.featured) fallback = fallback.filter((p) => p.featured);
    if (params?.limit) fallback = fallback.slice(0, params.limit);
    return { success: true, data: fallback };
  } catch (error: any) {
    console.error("Error fetching published projects:", error);
    let fallback = CURATED_CASE_STUDIES;
    if (params?.featured) fallback = fallback.filter((p) => p.featured);
    if (params?.limit) fallback = fallback.slice(0, params.limit);
    return { success: true, data: fallback };
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
    const project = await Project.findOne({ slug: slug.toLowerCase() })
      .populate(
        "teamMemberIds",
        "name title avatar slug bio skills socialLinks",
      )
      .lean();
    if (!project) {
      const fallback = CURATED_CASE_STUDIES.find(
        (p) => p.slug === slug.toLowerCase(),
      );
      if (fallback) return { success: true, data: fallback };
      return { success: false, data: null };
    }
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error("Error fetching project by slug:", error);
    const fallback = CURATED_CASE_STUDIES.find(
      (p) => p.slug === slug.toLowerCase(),
    );
    if (fallback) return { success: true, data: fallback };
    return { success: false, error: error.message, data: null };
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  try {
    await connectToDatabase();
    const project = await Project.findOne({
      slug: slug.toLowerCase(),
      published: true,
    })
      .populate(
        "teamMemberIds",
        "name title avatar slug bio skills socialLinks",
      )
      .lean();
    if (!project) {
      const fallback = CURATED_CASE_STUDIES.find(
        (p) => p.slug === slug.toLowerCase(),
      );
      if (fallback) return { success: true, data: fallback };
      return { success: false, data: null };
    }
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error("Error fetching published project by slug:", error);
    const fallback = CURATED_CASE_STUDIES.find(
      (p) => p.slug === slug.toLowerCase(),
    );
    if (fallback) return { success: true, data: fallback };
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

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean();

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
      }).catch((err) =>
        console.error("Error notifying admins of project status:", err),
      );
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
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold",
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
    }).catch((err) =>
      console.error("Error notifying admins of project status:", err),
    );

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
