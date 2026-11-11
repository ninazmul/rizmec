"use server";

import { connectToDatabase } from "@/lib/database";
import Service, { IService } from "@/lib/database/models/service.model";
import { requirePermission } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

const CURATED_SERVICES = [
  {
    _id: "service-01",
    title: "Custom Software Engineering",
    slug: "custom-software",
    tagline: "Bespoke digital platforms, operational software, and scalable web applications.",
    shortDescription:
      "We design and build production-grade web applications, business management systems (ERP/CRM), and client portals tailored to your operational workflows.",
    fullDescription:
      "Modern business operations demand software that adapts directly to your organization's business logic, user roles, and commercial relationships. We build custom web applications, multi-tier partner portals, and business management systems using modern Next.js and strict TypeScript architectures that your company owns completely.",
    iconName: "Code2",
    features: [
      {
        title: "Custom Web Applications",
        description:
          "Fast, responsive web applications engineered with Next.js, React, TypeScript, and robust database architectures.",
      },
      {
        title: "Business Management Systems (ERP & CRM)",
        description:
          "Tailored operations platforms consolidating customer records, quotations, invoices, inventory, and staff tasks.",
      },
      {
        title: "Client & Partner Portals",
        description:
          "Secure extranets for external clients, vendors, or agents with authenticated document sharing and status tracking.",
      },
      {
        title: "API Development & Integrations",
        description:
          "Robust REST and GraphQL APIs connecting disparate databases, payment gateways, and third-party SaaS tools.",
      },
    ],
    deliverables: [
      "100% full source code ownership",
      "Production-ready Next.js & TypeScript codebase",
      "Automated database migrations & data schemas",
      "Full API & deployment documentation",
    ],
    process: [
      { step: "01", title: "Discovery & Requirements", description: "Mapping workflows, data boundaries, and operational goals." },
      { step: "02", title: "Architecture & Schema Design", description: "Designing database models, role permissions, and API contracts." },
      { step: "03", title: "Full-Stack Engineering", description: "Building responsive server components and robust backend actions." },
      { step: "04", title: "QA & Cloud Deployment", description: "Rigorous testing, permission checks, and deployment to dedicated cloud." },
    ],
    technologies: ["Next.js", "TypeScript", "React", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS"],
    order: 1,
    featured: true,
    published: true,
  },
  {
    _id: "service-02",
    title: "AI & Intelligent Automation",
    slug: "ai-automation",
    tagline: "Practical AI integration and event-driven automation that eliminate manual friction.",
    shortDescription:
      "Practical AI implementations and event-driven automation pipelines that eliminate manual document processing and streamline business operations.",
    fullDescription:
      "We build practical, verifiable AI systems—not superficial chatbots. From automating repetitive document verification to deploying smart triage workflows and continuous event synchronization, our automation frees your team to focus on high-value work.",
    iconName: "Cpu",
    features: [
      {
        title: "AI Integration & API Solutions",
        description:
          "Embedding advanced language models and vision APIs into your existing business applications with strict schema boundaries.",
      },
      {
        title: "Document Processing & OCR Pipelines",
        description:
          "Extracting structured data from invoices, student transcripts, identity documents, and contracts automatically.",
      },
      {
        title: "Business Process Automation",
        description:
          "Automated event loops connecting CRM updates, notifications, document generation, and status triggers.",
      },
      {
        title: "Bounded Agentic Workflows",
        description:
          "Guardrailed AI workflows with human-in-the-loop review gates for high-stakes operational tasks.",
      },
    ],
    deliverables: [
      "Custom integration connectors & webhooks",
      "Automated queue worker & retry orchestrator",
      "Data validation & schema enforcement pipelines",
      "Operational monitoring & error logging alerts",
    ],
    process: [
      { step: "01", title: "Process Audit", description: "Identifying manual bottlenecks, document formats, and data handoffs." },
      { step: "02", title: "Integration Design", description: "Structuring prompt templates, JSON schema boundaries, and fallback logic." },
      { step: "03", title: "Pipeline Construction", description: "Developing asynchronous event workers and webhook listeners." },
      { step: "04", title: "Verification & Handover", description: "Validating extraction accuracy under edge cases and setting up telemetry." },
    ],
    technologies: ["Python", "Node.js", "TypeScript", "LangChain", "OpenAI APIs", "Docker", "Redis"],
    order: 2,
    featured: true,
    published: true,
  },
  {
    _id: "service-03",
    title: "Education Technology Solutions",
    slug: "edtech",
    tagline: "Dedicated operational software for international recruitment agencies and consultancies.",
    shortDescription:
      "Custom infrastructure for international student recruitment consultancies, multi-agent networks, and training institutes.",
    fullDescription:
      "Our specialized industry practice. We build custom infrastructure for international student recruitment consultancies, multi-agent education networks, and training institutes needing centralized application tracking, sub-agent coordination, and commission management.",
    iconName: "GraduationCap",
    features: [
      {
        title: "Student Application Tracking",
        description:
          "Visual pipeline tracking students across every milestone: counseling, offer letter, tuition payment, and visa grant.",
      },
      {
        title: "Agent & Sub-Agent Management",
        description:
          "Dedicated portals for external recruitment partners and branch offices with verified lead attribution.",
      },
      {
        title: "Commission & Payout Management",
        description:
          "Automated calculations based on university agreements, partner splits, and milestone verification.",
      },
      {
        title: "Document Verification Vault",
        description:
          "Centralized checklists, expiry tracking, and review status for passports, transcripts, and financial records.",
      },
    ],
    deliverables: [
      "Rizmec PartnerOS configurable deployment",
      "Multi-tier role permissions (Counselor, Agent, Admin)",
      "University contract & commission rule matrices",
      "Student intake & reporting dashboard",
    ],
    process: [
      { step: "01", title: "Agency Workflow Mapping", description: "Mapping partner tiers, intake deadlines, and counselor routing." },
      { step: "02", title: "Platform Architecture", description: "Configuring intake pipelines, commission formulas, and document checklists." },
      { step: "03", title: "Portal Customization", description: "Branded partner dashboards with role-based permission gates." },
      { step: "04", title: "Staff Training & Launch", description: "Onboarding counselors, importing initial leads, and going live." },
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "Node.js", "Tailwind CSS", "Role-Based Access Control"],
    order: 3,
    featured: true,
    published: true,
  },
];

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
    if (services && services.length > 0) {
      return { success: true, data: JSON.parse(JSON.stringify(services)) };
    }
    let fallback = CURATED_SERVICES;
    if (params?.featured) fallback = fallback.filter((s) => s.featured);
    if (params?.limit) fallback = fallback.slice(0, params.limit);
    return { success: true, data: fallback };
  } catch (error: any) {
    console.error("Error fetching services:", error);
    let fallback = CURATED_SERVICES;
    if (params?.featured) fallback = fallback.filter((s) => s.featured);
    if (params?.limit) fallback = fallback.slice(0, params.limit);
    return { success: true, data: fallback };
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectToDatabase();
    const service = await Service.findOne({ slug: slug.toLowerCase() }).lean();
    if (service) return { success: true, data: JSON.parse(JSON.stringify(service)) };
    const fallback = CURATED_SERVICES.find((s) => s.slug === slug.toLowerCase());
    if (fallback) return { success: true, data: fallback };
    return { success: false, data: null };
  } catch (error: any) {
    console.error("Error fetching service by slug:", error);
    const fallback = CURATED_SERVICES.find((s) => s.slug === slug.toLowerCase());
    if (fallback) return { success: true, data: fallback };
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
