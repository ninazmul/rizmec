import fs from "fs";
import mongoose from "mongoose";
try {
  if (process.loadEnvFile) {
    process.loadEnvFile(".env.local");
  } else {
    const envConfig = fs.readFileSync(".env.local", "utf8");
    envConfig.split("\n").forEach((line) => {
      const [key, ...values] = line.split("=");
      if (key && values.length) {
        process.env[key.trim()] = values.join("=").trim();
      }
    });
  }
} catch (e) {
  // ignore if file not found
}

// Import models
import "@/lib/database/models/user.model";
import "@/lib/database/models/teamMember.model";
import "@/lib/database/models/service.model";
import "@/lib/database/models/product.model";
import "@/lib/database/models/project.model";
import "@/lib/database/models/client.model";
import "@/lib/database/models/lead.model";
import "@/lib/database/models/quotation.model";
import "@/lib/database/models/invoice.model";
import "@/lib/database/models/testimonial.model";
import "@/lib/database/models/companySetting.model";

import User from "@/lib/database/models/user.model";
import TeamMember from "@/lib/database/models/teamMember.model";
import Service from "@/lib/database/models/service.model";
import Product from "@/lib/database/models/product.model";
import Project from "@/lib/database/models/project.model";
import Client from "@/lib/database/models/client.model";
import Lead from "@/lib/database/models/lead.model";
import Quotation from "@/lib/database/models/quotation.model";
import Invoice from "@/lib/database/models/invoice.model";
import Testimonial from "@/lib/database/models/testimonial.model";
import CompanySetting from "@/lib/database/models/companySetting.model";

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set");
    process.exit(1);
  }

  console.log("⚡ Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: "rizmec" });
  console.log(" Connected to MongoDB: rizmec");

  // 1. Company Settings
  console.log(" Seeding Company Settings...");
  await CompanySetting.deleteMany({});
  await CompanySetting.create({
    companyName: "RIZMEC",
    tagline: "From Algorithms to Engineered Intelligence",
    positioning: "Engineering digital infrastructure that helps businesses operate, automate, and scale.",
    philosophy: "From Algorithms to Engineered Intelligence.",
    contactEmail: "hello@rizmec.com",
    contactPhone: "",
    address: "Gazipur 1750, Dhaka, Bangladesh",
    globalLocations: ["Dhaka, Bangladesh"],
    socialLinks: {
      github: "https://github.com/ninazmul",
      linkedin: "https://linkedin.com/company/rizmec",
      twitter: "https://x.com/rizmec_tech",
    },
    defaultCurrency: "USD",
    quotationTerms:
      "All engineering deliverables are subject to the Master Services Agreement. Estimates are valid for 30 days from generation date.",
    invoiceTerms: "Net 15 days.",
    paymentInstructions:
      "Bank Wire / International Transfer: Inquire with billing at hello@rizmec.com for verified account details.",
    seo: {
      siteTitle: "RIZMEC — Software Engineering & Intelligent Automation",
      siteMetaDescription:
        "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. Custom software engineering, business platforms, and practical intelligent automation.",
      keywords: [
        "RIZMEC",
        "From Algorithms to Engineered Intelligence",
        "Software Engineering",
        "Business Platforms",
        "Education Technology",
        "Workflow Automation",
      ],
      canonicalUrl: "https://rizmec.com",
    },
  });

  // 2. Team Members (Founder only — no fictional personas)
  console.log(" Seeding Verified Team Members...");
  await TeamMember.deleteMany({});
  const members = await TeamMember.create([
    {
      name: "N.I. Nazmul",
      slug: "ninazmul",
      title: "Founder & Chief Architect",
      tagline: "Architecting reliable business software, full-stack platforms, and intelligent automation.",
      bio: "Founder and Chief Architect at Rizmec. Specializes in custom business applications, full-stack web platforms, workflow automation, and practical AI integration for international businesses.",
      avatar: "https://github.com/ninazmul.png",
      role: "founder",
      email: "nazmulsaw@gmail.com",
      location: "Gazipur, Dhaka, Bangladesh",
      skills: [
        { name: "Full-Stack Web Architecture", level: 96, category: "Architecture" },
        { name: "Next.js, React & TypeScript", level: 95, category: "Engineering" },
        { name: "Backend Systems & APIs (Node.js, Python)", level: 92, category: "Engineering" },
        { name: "Database Design (MongoDB, PostgreSQL)", level: 90, category: "Data" },
        { name: "Workflow & Business Process Automation", level: 92, category: "Automation" },
        { name: "Practical AI & LLM Integration", level: 88, category: "AI" },
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Docker",
        "REST & GraphQL APIs",
      ],
      experience: [
        {
          company: "Rizmec",
          role: "Founder & Chief Architect",
          period: "2023 — Present",
          description:
            "Directs architectural strategy, custom software engineering, and client platform delivery across web, ERP/CRM, and automation systems.",
        },
        {
          company: "Software Engineering & Technical Consultancy",
          role: "Lead Full-Stack Architect",
          period: "2020 — 2023",
          description:
            "Engineered business software, database systems, client management portals, and cloud integrations for international clients.",
        },
      ],
      education: [
        {
          degree: "Computer Science & Engineering Studies",
          institution: "Dhaka, Bangladesh",
          year: "2020",
        },
      ],
      certifications: [],
      achievements: [
        "Architected and deployed custom business management platforms and partner portals for education and enterprise operations.",
        "Engineered robust automation workflows reducing manual operational cycles.",
      ],
      socialLinks: {
        github: "https://github.com/ninazmul",
        linkedin: "https://linkedin.com/company/rizmec",
      },
      order: 1,
      featured: true,
      published: true,
    },
  ]);

  // Link Super Admin user to Founder
  await User.findOneAndUpdate(
    { email: "nazmulsaw@gmail.com" },
    {
      name: "N.I. Nazmul",
      role: "super_admin",
      status: "active",
      teamMemberId: members[0]._id,
    },
    { upsert: true },
  );

  // 3. Dynamic Services
  console.log(" Seeding Verified Services...");
  await Service.deleteMany({});
  await Service.create([
    {
      title: "Custom Software Engineering",
      slug: "custom-software-engineering",
      tagline: "Tailored web applications built for performance, security, and maintainability.",
      shortDescription:
        "Bespoke web applications, SaaS products, client portals, and administrative dashboards engineered using modern full-stack architectures.",
      fullDescription:
        "We build bespoke software tailored to your specific operational workflows. Pairing modern Next.js architectures with clean TypeScript and robust databases, we deliver reliable applications that help your business operate with efficiency.",
      iconName: "Code2",
      features: [
        { title: "Bespoke Web Applications", description: "Clean Next.js and TypeScript codebases designed for high responsiveness." },
        { title: "Client & Partner Portals", description: "Role-based portals with secure document sharing, authentication, and reporting." },
        { title: "Internal Dashboards & Tools", description: "Operational control centers tailored to your team's exact business logic." },
      ],
      deliverables: ["Full source code repository", "Interactive design tokens & components", "Automated test suites", "Deployment scripts & documentation"],
      process: [
        { step: "01", title: "Discovery", description: "Analyzing operational workflows and user role requirements." },
        { step: "02", title: "Architecture", description: "Structuring data schemas and API endpoints." },
        { step: "03", title: "Development", description: "Iterative sprints with working milestone demonstrations." },
        { step: "04", title: "Handover", description: "Production deployment and team onboarding." },
      ],
      technologies: ["Next.js", "TypeScript", "React", "Node.js", "Tailwind CSS", "MongoDB"],
      order: 1,
      featured: true,
      published: true,
    },
    {
      title: "Business Platforms (ERP & CRM)",
      slug: "business-platforms-erp-crm",
      tagline: "End-to-end digital operations systems connecting clients, quotes, invoices, and workflows.",
      shortDescription:
        "Centralized operations management software replacing fragmented spreadsheets with structured pipelines, quotation tracking, and audit trails.",
      fullDescription:
        "We build enterprise operations software from the ground up: complete with client pipelines, automated quotation generation with cryptographic acceptance tokens, invoice tracking, and role-based permissions.",
      iconName: "Layers",
      features: [
        { title: "Client & Lead Management", description: "Unified pipelines to track inquiries, communications, and customer interactions." },
        { title: "Quotation & Invoicing Engines", description: "Automated quote generation, electronic client acceptance, and payment tracking." },
        { title: "Role-Based Access Control", description: "Granular administrative permissions and immutable transaction audit logs." },
      ],
      deliverables: ["Platform source code", "Role-based permission matrix", "Automated PDF and invoice generation", "Deployment runbooks"],
      process: [
        { step: "01", title: "Workflow Mapping", description: "Mapping quotation, invoicing, and customer lifecycles." },
        { step: "02", title: "Security & RBAC", description: "Implementing granular role gates and audit trails." },
        { step: "03", title: "Integration", description: "Connecting email alerts and client acceptance loops." },
        { step: "04", title: "Deployment", description: "Production rollout and operational training." },
      ],
      technologies: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Tailwind CSS"],
      order: 2,
      featured: true,
      published: true,
    },
    {
      title: "AI & Workflow Automation",
      slug: "ai-workflow-automation",
      tagline: "Practical AI integration and business process automation delivering real ROI.",
      shortDescription:
        "Eliminating manual data entry, automating document extraction, and integrating purpose-built AI assistants directly into your operational loops.",
      fullDescription:
        "We focus on practical, ROI-driven AI and automation: document extraction, customer support assistants constrained by your domain knowledge, and cross-platform integrations that remove repetitive manual labor.",
      iconName: "Cpu",
      features: [
        { title: "Document Processing & Extraction", description: "Automated OCR and structured data extraction from invoices, forms, and IDs." },
        { title: "AI-Powered Customer Support", description: "Domain-constrained assistants trained on your internal documentation and FAQs." },
        { title: "Cross-System Process Automation", description: "Automated triggers connecting CRMs, email, payment systems, and databases." },
      ],
      deliverables: ["Custom automation pipelines", "Document processing connectors", "API integration handlers", "Maintenance documentation"],
      process: [
        { step: "01", title: "Process Audit", description: "Identifying manual bottlenecks and repetitive data flows." },
        { step: "02", title: "Integration Design", description: "Creating automated triggers and schema validations." },
        { step: "03", title: "Validation & Testing", description: "Benchmarking extraction accuracy and fallback rules." },
        { step: "04", title: "Production Hardening", description: "Error handling, rate limiting, and alert notifications." },
      ],
      technologies: ["Python", "Node.js", "LangChain", "OpenAI APIs", "Docker", "REST APIs"],
      order: 3,
      featured: true,
      published: true,
    },
    {
      title: "Education Technology & Portals",
      slug: "education-technology",
      tagline: "Specialized platforms for student recruitment agencies, consultancies, and institutions.",
      shortDescription:
        "Comprehensive education business platforms supporting multi-tier agent networks, application tracking, document verification, and commission reporting.",
      fullDescription:
        "Designed specifically for international education consultancies and student recruitment agencies. Centralize student applications, coordinate partner agent branches, collect required documentation, and reconcile commission payouts in one platform.",
      iconName: "Globe",
      features: [
        { title: "Agent & Sub-Agent Management", description: "Hierarchical partner portals with dedicated application pipelines." },
        { title: "Student Application Tracking", description: "Stage-by-stage admission tracking from inquiry to visa issuance." },
        { title: "Commission & Payment Reconciliation", description: "Automated commission calculation, payout tracking, and financial reports." },
      ],
      deliverables: ["Admin, agent, and student portal modules", "Document upload and verification workflow", "Commission reporting engine", "Setup and configuration guide"],
      process: [
        { step: "01", title: "Agency Workflow Discovery", description: "Understanding intake requirements, partner tiers, and commission terms." },
        { step: "02", title: "Portal Architecture", description: "Configuring multi-role access controls and document requirements." },
        { step: "03", title: "Pipeline Assembly", description: "Building application stage tracking and automated email alerts." },
        { step: "04", title: "Release & Verification", description: "Deploying production platform and partner testing." },
      ],
      technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Tailwind CSS"],
      order: 4,
      featured: true,
      published: true,
    },
    {
      title: "API Development & Integration",
      slug: "api-development-integration",
      tagline: "Secure, well-documented REST APIs connecting your disparate business systems.",
      shortDescription:
        "Bridging external platforms, payment gateways, third-party SaaS services, and legacy databases with reliable, documented API architectures.",
      fullDescription:
        "We build robust, type-safe REST APIs and microservice endpoints that allow your software systems to talk to each other seamlessly, whether integrating Stripe, payment providers, third-party CRMs, or legacy enterprise databases.",
      iconName: "Workflow",
      features: [
        { title: "Custom RESTful APIs", description: "Type-safe endpoints with strict input validation, rate limiting, and authentication." },
        { title: "Third-Party Connectors", description: "Integrating Stripe, PayPal, CRMs, accounting systems, and messaging providers." },
        { title: "Database Migrations & Sync", description: "Structured data pipelines migrating legacy data into modern databases." },
      ],
      deliverables: ["Documented OpenAPI / Swagger endpoints", "Integration connectors", "Automated endpoint test suites", "Deployment manifests"],
      process: [
        { step: "01", title: "Contract Design", description: "Defining JSON schemas, endpoints, and error formats." },
        { step: "02", title: "Implementation", description: "Developing type-safe handlers with security gates." },
        { step: "03", title: "Stress & Edge Testing", description: "Validating input bounds and edge cases." },
        { step: "04", title: "Documentation Handover", description: "Delivering Postman/OpenAPI specs and integration keys." },
      ],
      technologies: ["Node.js", "Express", "TypeScript", "Python", "MongoDB", "PostgreSQL"],
      order: 5,
      featured: true,
      published: true,
    },
    {
      title: "Ongoing Software Maintenance",
      slug: "ongoing-software-maintenance",
      tagline: "Dedicated engineering maintenance keeping your business software secure and reliable.",
      shortDescription:
        "Continuous monitoring, framework upgrades, security patches, database backups, and feature improvements for long-term platform health.",
      fullDescription:
        "Software needs continuous attention to remain fast and secure. We provide ongoing engineering maintenance agreements covering routine backups, security vulnerability patches, framework updates, and regular feature enhancements.",
      iconName: "Server",
      features: [
        { title: "Proactive Health Monitoring", description: "Automated error alerts, uptime monitoring, and performance telemetry." },
        { title: "Security Updates & Backups", description: "Scheduled database snapshots, dependency security patches, and audit reviews." },
        { title: "Iterative Feature Development", description: "Continuous improvements and feature additions as your business scales." },
      ],
      deliverables: ["Monthly health audit reports", "Automated daily/weekly snapshot schedules", "Priority bug resolution desk", "Staging environment sync"],
      process: [
        { step: "01", title: "Baseline Audit", description: "Reviewing existing codebase, dependencies, and hosting setup." },
        { step: "02", title: "Telemetry Setup", description: "Configuring uptime checks, error logging, and backup routines." },
        { step: "03", title: "Proactive Updates", description: "Executing dependency upgrades and security patches." },
        { step: "04", title: "Continuous Iteration", description: "Implementing prioritized feature requests and improvements." },
      ],
      technologies: ["Docker", "Linux VPS", "Cloudflare", "GitHub Actions", "Vercel"],
      order: 6,
      featured: true,
      published: true,
    },
  ]);

  // 4. Products / Solution Blueprints (No fictional enterprise pricing)
  console.log(" Seeding Solution Blueprints & Prototypes...");
  await Product.deleteMany({});
  await Product.create([
    {
      title: "Rizmec Operations Engine",
      slug: "business-operations-core",
      tagline: "Centralized client lifecycle, quotation, and invoice management system.",
      category: "Internal Platform",
      summary:
        "The internal business operating engine developed by Rizmec to manage customer inquiries, generate verifiable quotations with electronic sign-offs, and track invoice reconciliation.",
      description:
        "Engineered to run Rizmec's own commercial operations. Includes a structured quotation builder, cryptographic public document tokens for clients, an immutable electronic acceptance snapshot mechanism, and team audit logging.",
      features: [
        "Cryptographic public quotation access tokens",
        "Immutable acceptance snapshots",
        "Multi-tier role-based access control (RBAC)",
        "Automated lead creation and CRM pipeline",
      ],
      techStack: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Tailwind CSS"],
      pricingTiers: [],
      screenshots: [],
      status: "internal",
      order: 1,
      featured: true,
      published: true,
    },
    {
      title: "Education Partner & Admission Portal",
      slug: "education-partner-platform",
      tagline: "Modular student recruitment and agent network coordination portal.",
      category: "Architecture Blueprint",
      summary:
        "A ready-to-deploy software architecture for education consultancies and agencies, featuring multi-tiered agent portals, student application tracking, document collection, and commission reconciliation.",
      description:
        "Engineered specifically for international student recruitment networks. Solves the friction of managing international student applications across dozens of partner agents with structured stage pipelines and transparent commission accounting.",
      features: [
        "Agent and sub-agent management hierarchy",
        "Stage-by-stage student admission pipeline",
        "Secure document collection and verification",
        "Commission calculation and reporting dashboards",
      ],
      techStack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB"],
      pricingTiers: [],
      screenshots: [],
      status: "prototype",
      order: 2,
      featured: true,
      published: true,
    },
    {
      title: "Workflow & AI Integration Fabric",
      slug: "workflow-integration-gateway",
      tagline: "Reusable connectors, document extraction pipelines, and process automation.",
      category: "Engineering Prototype",
      summary:
        "A modular integration fabric developed by Rizmec to accelerate custom automation projects, connecting databases, OCR extraction pipelines, and LLM task execution into reliable business workflows.",
      description:
        "A collection of tested connectors and automation modules designed to streamline document processing, structured data extraction, and CRM synchronization for business clients.",
      features: [
        "Automated structured data extraction from invoices and documents",
        "Domain-constrained knowledge retrieval for customer support",
        "Bidirectional sync between CRM and operational databases",
        "Automated webhook and notification dispatchers",
      ],
      techStack: ["Python", "Node.js", "OpenAI APIs", "Docker", "REST APIs"],
      pricingTiers: [],
      screenshots: [],
      status: "prototype",
      order: 3,
      featured: true,
      published: true,
    },
  ]);

  // 5. Real / Anonymized Case Studies
  console.log(" Seeding Verified Case Studies...");
  await Project.deleteMany({});
  await Project.create([
    {
      title: "Education Partner & Admission Management Platform",
      slug: "education-partner-management-platform",
      clientName: "International Education Consultancy",
      industry: "Education Technology & Global Recruitment",
      summary:
        "A centralized partner, agent, and student admission management platform engineered to streamline overseas student recruitment, document collection, and partner commission tracking.",
      challenge:
        "Operating across multiple countries with dozens of recruitment agents resulted in fragmented email chains, lost application documents, and delayed commission tracking that slowed down student enrollments.",
      solution:
        "Architected a multi-role web platform (Central Admin, Partner Agents, and Applicants) with secure document intake, stage-by-stage admission status tracking, automated email notifications, and automated commission reconciliation dashboards.",
      results:
        "Eliminated manual spreadsheet tracking, shortened application submission processing time from days to hours, and established transparency across the partner agent network.",
      metrics: [
        { label: "Application Workflow", value: "Centralized" },
        { label: "Partner Agent Portals", value: "Multi-Tier" },
        { label: "Document Verification", value: "Automated" },
      ],
      services: ["Education Technology", "Custom Software Engineering"],
      technologies: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
      gallery: [],
      thumbnail:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      completionDate: "2024",
      teamMemberIds: [members[0]._id],
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "Operations & Enterprise Workflow Platform",
      slug: "business-erp-operations-platform",
      clientName: "Business Services Enterprise",
      industry: "Enterprise Management & CRM",
      summary:
        "Comprehensive business management system integrating client lifecycles, automated quotation generation, immutable digital client acceptance, invoice tracking, and internal team audit logging.",
      challenge:
        "The client relied on disparate tools for customer tracking, quote generation, and billing, causing quotation discrepancies, slow client sign-offs, and lack of visibility into team administrative actions.",
      solution:
        "Engineered an all-in-one operations platform featuring cryptographic public quotation tokens, immutable acceptance records, automated PDF generation, invoice reconciliation, and server-side role-based access control.",
      results:
        "Consolidated quoting, client onboarding, and invoice tracking into a single unified dashboard with transparent audit trails.",
      metrics: [
        { label: "Core Workflow", value: "End-to-End" },
        { label: "Client Acceptance", value: "Cryptographic" },
        { label: "Audit Logging", value: "Tamper-Evident" },
      ],
      services: ["Business Platforms (ERP & CRM)", "Custom Software Engineering"],
      technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Clerk", "Tailwind CSS"],
      gallery: [],
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      completionDate: "2024",
      teamMemberIds: [members[0]._id],
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: "High-Performance Digital Publishing & Content Platform",
      slug: "digital-publishing-platform",
      clientName: "Digital Publishing & Media Network",
      industry: "Media & Digital Content",
      summary:
        "A fast, SEO-optimized digital publishing and media distribution platform built for high-readability content delivery and structured workflow automation.",
      challenge:
        "Legacy CMS platforms were burdened by heavy plugin overhead, slow mobile loading speeds, poor Core Web Vitals, and complicated editorial publishing workflows.",
      solution:
        "Built a modern server-rendered publishing platform with streaming hydration, optimized asset delivery, automated structured data (JSON-LD), and a focused editorial markdown authoring interface.",
      results:
        "Significantly accelerated page load speeds, achieved excellent Core Web Vitals, and provided editorial teams with a clean, distraction-free publishing workflow.",
      metrics: [
        { label: "Core Web Vitals", value: "Optimized" },
        { label: "Rendering Architecture", value: "SSR / Edge" },
        { label: "SEO Structured Data", value: "Automated" },
      ],
      services: ["Custom Software Engineering", "API Development & Integration"],
      technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Vercel"],
      gallery: [],
      thumbnail:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      completionDate: "2024",
      teamMemberIds: [members[0]._id],
      featured: true,
      published: true,
      order: 3,
    },
  ]);

  // 6. Testimonials (Cleared until genuine, authorized reviews are obtained)
  console.log(" Clearing Unverified Testimonials...");
  await Testimonial.deleteMany({});

  console.log("✅ Seed completed successfully with verified Rizmec data!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
