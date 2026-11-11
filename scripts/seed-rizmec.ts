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
    companyName: "Rizmec",
    tagline: "Software Engineering & Intelligent Automation",
    positioning: "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale.",
    philosophy: "From algorithms to engineered intelligence.",
    contactEmail: "hello@rizmec.com",
    contactPhone: "",
    address: "Dhaka, Bangladesh",
    globalLocations: ["Dhaka, Bangladesh", "United Kingdom", "Australia", "United Arab Emirates"],
    socialLinks: {
      github: "https://github.com/ninazmul",
      linkedin: "https://linkedin.com/company/rizmec",
      twitter: "https://x.com/rizmec_tech",
    },
    defaultCurrency: "USD",
    quotationTerms:
      "All engineering deliverables are subject to the Master Services Agreement. Estimates are valid for 30 days from generation date.",
    invoiceTerms: "Net 15 days. Wire and international transfer preferred.",
    seo: {
      siteTitle: "Rizmec — Software Engineering & Intelligent Automation",
      siteMetaDescription:
        "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. Custom business software, education technology platforms, and intelligent automation systems.",
      keywords: [
        "Rizmec",
        "Software Engineering",
        "Intelligent Automation",
        "Education Technology",
        "PartnerOS",
        "Business Platforms",
      ],
      canonicalUrl: "https://rizmec.com",
    },
  });

  // 2. Team Members & Profiles
  console.log(" Seeding Team Members...");
  await TeamMember.deleteMany({});
  const members = await TeamMember.create([
    {
      name: "N.I. Nazmul",
      slug: "nazmul-i",
      title: "Founder & Chief Architect",
      tagline: "Engineering digital infrastructure that helps businesses operate, automate, and scale.",
      bio: "Senior full-stack software architect specializing in custom business applications, education technology platforms, and intelligent workflow automation.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      role: "leadership",
      email: "hello@rizmec.com",
      location: "Dhaka, Bangladesh",
      skills: [
        { name: "Full-Stack Architecture", level: 96, category: "Architecture" },
        { name: "Next.js & TypeScript", level: 95, category: "Engineering" },
        { name: "Workflow Automation & AI", level: 92, category: "AI" },
        { name: "Database Modeling & API Design", level: 94, category: "Backend" },
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS", "Docker"],
      experience: [
        {
          company: "Rizmec",
          role: "Founder & Chief Architect",
          period: "2023 — Present",
          description: "Directs software architecture, custom platform engineering, and intelligent automation for international business clients.",
        },
      ],
      education: [
        { degree: "B.S. in Computer Science & Engineering", institution: "University of Information Technology and Sciences (UITS)", year: "2023" },
      ],
      certifications: [],
      achievements: [
        "Architected custom business operating systems and education partner portals for international clients",
        "Pioneered modular PartnerOS configurable solution architecture",
      ],
      socialLinks: {
        github: "https://github.com/ninazmul",
        linkedin: "https://linkedin.com/company/rizmec",
        twitter: "https://x.com/rizmec_tech",
      },
      order: 1,
      featured: true,
      published: true,
    },
  ]);

  // Link Super Admin user to the first team member
  await User.findOneAndUpdate(
    { email: "nazmulsaw@gmail.com" },
    {
      name: "Nazmul I.",
      role: "super_admin",
      status: "active",
      teamMemberId: members[0]._id,
    },
    { upsert: true },
  );

  // 3. Dynamic Services
  console.log(" Seeding Services...");
  await Service.deleteMany({});
  await Service.create([
    {
      title: "Applied AI Systems & Autonomous Agents",
      slug: "ai-systems",
      tagline: "Autonomous neural pipelines embedded directly into enterprise operational loops.",
      shortDescription:
        "Architecting deterministic neural pipelines, self-healing agent swarms, and RAG knowledge fabrics that transform enterprise data into proactive execution.",
      fullDescription:
        "We move beyond conversational novelties to build hard-engineered AI systems. Our engineering squads design custom retrieval engines, model quantization pipelines, and multi-agent coordination architectures guaranteed with deterministic constraints and audit trails.",
      iconName: "Cpu",
      features: [
        { title: "Autonomous Multi-Agent Swarms", description: "State-machine guided agentic execution with guardrails and rollback checkpoints." },
        { title: "Hybrid Vector-Graph Retrieval", description: "Sub-15ms semantic and relational hybrid graph search over petabyte-scale knowledge bases." },
        { title: "Deterministic Output Verification", description: "Grammar-constrained sampling ensuring 100% schema-valid JSON generation." },
      ],
      deliverables: ["Custom fine-tuned weights", "Self-hosted inference cluster", "Observability & hallucination telemetry", "API gateway & auth"],
      process: [
        { step: "01", title: "Data Architecture Audit", description: "Profiling embeddings, ingestion velocity, and data governance boundaries." },
        { step: "02", title: "Model Benchmark & Quantization", description: "Benchmarking SOTA models against custom domain eval suites." },
        { step: "03", title: "Agent Orchestration", description: "Developing deterministic state trees and tool-calling execution engines." },
        { step: "04", title: "Production Hardening", description: "Zero-trust verification, rate limiting, and automated drift detection." },
      ],
      technologies: ["PyTorch", "vLLM", "Qdrant", "Python", "LangGraph", "Docker"],
      order: 1,
      featured: true,
      published: true,
    },
    {
      title: "Distributed Cloud Systems & Resiliency",
      slug: "cloud-systems",
      tagline: "Zero-downtime multi-region cloud topology engineered for five-nines reliability.",
      shortDescription:
        "Fault-tolerant infrastructure, Kubernetes mesh topologies, and automated failover systems built for high-throughput global scale.",
      fullDescription:
        "We engineer cloud systems designed to survive catastrophic regional cloud failures without user-perceptible interruptions. Utilizing immutable infrastructure as code and automated chaos verification, we ensure your platform remains indestructible.",
      iconName: "Server",
      features: [
        { title: "Multi-Cloud Kubernetes Topology", description: "Seamless workload portability across AWS, GCP, and bare-metal environments." },
        { title: "Zero-Loss Disaster Recovery", description: "Synchronous storage replication and automated DNS failover under 3 seconds." },
        { title: "Infrastructure-as-Code Auditing", description: "100% Terraform and GitOps compliance with cryptographic audit logs." },
      ],
      deliverables: ["Terraform blueprint modules", "Multi-region cluster manifest", "Prometheus & Grafana dashboard suites", "SOP runbooks"],
      process: [
        { step: "01", title: "Topology Assessment", description: "Analyzing latency topology, transit costs, and SLA vulnerabilities." },
        { step: "02", title: "IaC Standardization", description: "Automating cloud provisioning with continuous GitOps validation." },
        { step: "03", title: "Chaos Injection", description: "Simulating availability zone dropouts to prove automated recovery." },
        { step: "04", title: "Telemetry Handover", description: "Configuring synthetic alerts and on-call escalation routes." },
      ],
      technologies: ["Kubernetes", "Terraform", "AWS", "GCP", "Istio", "ArgoCD"],
      order: 2,
      featured: true,
      published: true,
    },
    {
      title: "Mission-Critical Full-Stack Web Applications",
      slug: "web-applications",
      tagline: "Sub-second real-time web applications with cinematic user experiences.",
      shortDescription:
        "High-performance Next.js architectures, streaming hydration, and edge-distributed caching engineered for instant tactile interaction.",
      fullDescription:
        "Modern web software must feel instantaneous. We pair strict server-component architectures with ultra-refined client micro-interactions, producing web applications that outperform native desktop clients in responsiveness and visual authority.",
      iconName: "Globe",
      features: [
        { title: "Zero-Layout-Shift SSR", description: "Pre-rendered streaming server components targeting 100/100 Core Web Vitals." },
        { title: "Edge Distributed State", description: "Global edge caching delivering dynamic data at sub-30ms latencies worldwide." },
        { title: "High-Density Data Grids", description: "Virtualized tables capable of smoothly scrolling 250,000+ live data rows." },
      ],
      deliverables: ["Production Next.js application codebase", "Design system component library", "Automated Cypress/Playwright test suites", "CI/CD pipelines"],
      process: [
        { step: "01", title: "Information Hierarchy", description: "Mapping data schemas, server components, and dynamic boundaries." },
        { step: "02", title: "Design System Assembly", description: "Building custom high-contrast monochrome design tokens and components." },
        { step: "03", title: "State & Query Optimization", description: "Implementing selective field projection and optimistic UI updates." },
        { step: "04", title: "Lighthouse Performance Verification", description: "Eliminating render blocking assets and optimizing LCP." },
      ],
      technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "MongoDB", "PostgreSQL"],
      order: 3,
      featured: true,
      published: true,
    },
    {
      title: "Enterprise SaaS & Business Operating Platforms",
      slug: "enterprise-saas",
      tagline: "End-to-end digital business operating engines with granular RBAC and billing.",
      shortDescription:
        "Scalable multitenant SaaS platforms engineered with multi-tiered permissions, automated billing, and compliance auditing built-in.",
      fullDescription:
        "We build enterprise SaaS products from the ground up: complete with cryptographic tenant isolation, role-based access control, real-time analytics pipelines, and dynamic client transaction workflows.",
      iconName: "Layers",
      features: [
        { title: "Granular Multi-Tier RBAC", description: "Server-side permission enforcement across modules, actions, and roles." },
        { title: "Automated Document Workflows", description: "Quotations, e-signatures, immutable snapshots, and invoice tracking." },
        { title: "Audit Trail Compliance", description: "Tamper-evident logs of every administrative transaction and data mutation." },
      ],
      deliverables: ["Full SaaS platform source", "RBAC governance documentation", "Automated invoice generation engine", "API documentation"],
      process: [
        { step: "01", title: "Domain Modeling", description: "Structuring relational and document entities for infinite horizontal scaling." },
        { step: "02", title: "Security & Auth Pipeline", description: "Integrating zero-trust session management and privilege gates." },
        { step: "03", title: "Transaction Loop Integration", description: "Connecting quotes, electronic acceptance, and automated invoicing." },
        { step: "04", title: "Auditing & Handover", description: "Conducting penetration tests and role-delegation verification." },
      ],
      technologies: ["Next.js", "Mongoose", "Clerk", "Nodemailer", "TypeScript", "Tailwind CSS"],
      order: 4,
      featured: true,
      published: true,
    },
    {
      title: "Mobile Applications & Native Systems",
      slug: "mobile-applications",
      tagline: "Native performance across iOS and Android with offline-first synchronization.",
      shortDescription:
        "High-performance mobile clients with fluid 120Hz gesture physics, local SQLite sync, and secure biometric authentication.",
      fullDescription:
        "We engineer mobile applications for industrial, clinical, and financial environments where connectivity drops and sub-millisecond responsiveness is mandatory.",
      iconName: "Smartphone",
      features: [
        { title: "Offline-First Synchronization", description: "Conflict-free replicated data types (CRDTs) ensuring transparent offline writes." },
        { title: "Hardware Sensor Integration", description: "Biometric authentication, camera vision pipelines, and BLE peripheral telemetry." },
        { title: "120 FPS Motion Design", description: "Native thread animated transitions with zero main-thread hitching." },
      ],
      deliverables: ["iOS and Android production builds", "App Store & Play Store publishing scripts", "Offline sync backend handlers"],
      process: [
        { step: "01", title: "Hardware Ergonomics", description: "Specifying touch targets, offline cache ceilings, and battery constraints." },
        { step: "02", title: "Sync Engine Architecture", description: "Building delta-based background sync with server reconcilers." },
        { step: "03", title: "Device Matrix Testing", description: "Validating across 30+ physical device configurations." },
        { step: "04", title: "Store Submission", description: "Handling compliance, privacy manifests, and release automation." },
      ],
      technologies: ["React Native", "TypeScript", "Swift", "Kotlin", "SQLite"],
      order: 5,
      featured: false,
      published: true,
    },
    {
      title: "Custom Automation & Workflow Engines",
      slug: "automation",
      tagline: "Eliminating manual corporate friction through event-driven algorithmic pipelines.",
      shortDescription:
        "Bespoke data processing pipelines, webhooks, and asynchronous workers eliminating human latency from business processes.",
      fullDescription:
        "Connect fragmented software suites into unified, self-healing automated workflows with continuous health telemetry and retry orchestration.",
      iconName: "Workflow",
      features: [
        { title: "Event-Driven Worker Queues", description: "High-throughput asynchronous task processing with exponential backoff." },
        { title: "Intelligent Document Extraction", description: "Automatic OCR and entity parsing for contracts, invoices, and forms." },
        { title: "Bidirectional CRM Synchronization", description: "Real-time synchronization across proprietary databases and external SaaS." },
      ],
      deliverables: ["Worker queue services", "Event listener webhook endpoints", "Failure recovery dashboard"],
      process: [
        { step: "01", title: "Workflow Mapping", description: "Identifying bottlenecks, failure modes, and rate limit boundaries." },
        { step: "02", title: "Queue Engine Construction", description: "Configuring idempotent event handlers and dead-letter queues." },
        { step: "03", title: "Integration Verification", description: "Running stress simulations under burst load." },
      ],
      technologies: ["Redis", "RabbitMQ", "Node.js", "Python", "PostgreSQL"],
      order: 6,
      featured: false,
      published: true,
    },
  ]);

  // 4. Dynamic Products / Platforms
  console.log(" Seeding Products...");
  await Product.deleteMany({});
  await Product.create([
    {
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
        { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80", caption: "PartnerOS Agency Console" },
      ],
      demoUrl: "https://rizmec.com/products/partneros",
      status: "active",
      order: 1,
      featured: true,
      published: true,
    },
  ]);

  // 5. Dynamic Case Studies / Work
  console.log(" Seeding Case Studies...");
  await Project.deleteMany({});
  await Project.create([
    {
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
      ],
      gallery: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      completionDate: "Production Deployed",
      teamMemberIds: [members[0]._id],
      testimonial: {
        quote:
          "Centralizing our sub-agent network and student application tracking into one structured platform eliminated administrative confusion and gave our counselors complete clarity across all partner intakes.",
        author: "Admissions Operations Lead",
        role: "International Education Consultancy",
      },
      featured: true,
      published: true,
      order: 1,
    },
    {
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
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Mongoose",
        "Tailwind CSS",
        "Nodemailer",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      completionDate: "Production Deployed",
      teamMemberIds: [members[0]._id],
      testimonial: {
        quote:
          "The ability to generate dynamic quotes, have clients accept them with immutable snapshots, and immediately trigger invoices has completely streamlined our commercial operations.",
        author: "Managing Director",
        role: "B2B Technology Services Enterprise",
      },
      featured: true,
      published: true,
      order: 2,
    },
    {
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
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "TipTap",
        "Edge Caching",
      ],
      gallery: [
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      completionDate: "Production Deployed",
      teamMemberIds: [members[0]._id],
      testimonial: {
        quote:
          "Our digital publication now loads instantaneously across every mobile device. The editorial workflow is effortless, and our Core Web Vitals are consistently in the green.",
        author: "Head of Editorial Operations",
        role: "Multi-Region Media Publication",
      },
      featured: true,
      published: true,
      order: 3,
    },
  ]);

  // 6. Testimonials
  console.log(" Seeding Testimonials...");
  await Testimonial.deleteMany({});
  await Testimonial.create([
    {
      clientName: "David Sterling",
      company: "International Education Consultancies Ltd",
      position: "Admissions Operations Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      content:
        "Centralizing our sub-agent network and student application tracking into one structured platform eliminated administrative confusion and gave our counselors complete clarity across all partner intakes.",
      rating: 5,
      featured: true,
      published: true,
      order: 1,
    },
    {
      clientName: "Marcus Vance",
      company: "B2B Technology Services Enterprise",
      position: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      content:
        "The ability to generate dynamic quotes, have clients accept them with immutable snapshots, and immediately trigger invoices has completely streamlined our commercial operations.",
      rating: 5,
      featured: true,
      published: true,
      order: 2,
    },
    {
      clientName: "Sarah Al-Mansoor",
      company: "Digital Media Publishing Group",
      position: "Head of Editorial Operations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      content:
        "Our digital publication now loads instantaneously across every mobile device. The editorial workflow is effortless, and our Core Web Vitals are consistently in the green.",
      rating: 5,
      featured: true,
      published: true,
      order: 3,
    },
  ]);

  // 7. Clients, Leads, Quotation & Invoice
  console.log(" Seeding Clients, Leads, Quotations & Invoices...");
  await Client.deleteMany({});
  const client = await Client.create({
    company: "Aethelgard Capital Management",
    contactPerson: "Julian Thorne",
    email: "j.thorne@aethelgard.com",
    phone: "+1 (212) 849-2041",
    country: "United States",
    website: "https://aethelgard.com",
    notes: "Tier-1 Quantitative Trading client. Quarterly architecture reviews.",
    status: "active",
  });

  await Lead.deleteMany({});
  await Lead.create([
    {
      name: "Marcus Brody",
      company: "Stratum Aerospace",
      email: "m.brody@stratumaero.com",
      phone: "+1 (415) 890-1234",
      country: "United States",
      source: "referral",
      serviceInterest: "Cloud Systems & Resiliency",
      budget: "$150k - $250k",
      status: "proposal",
      priority: "high",
      tags: ["Enterprise", "Aerospace", "Kubernetes"],
      timeline: [
        { date: new Date(), note: "Proposal submitted for multi-cloud telemetry plane.", author: "Nazmul I." },
      ],
    },
    {
      name: "Sophia Lind",
      company: "Nordic Health Digital",
      email: "sophia@nordichealth.se",
      phone: "+46 8 123 4567",
      country: "Sweden",
      source: "website",
      serviceInterest: "Applied AI Systems",
      budget: "$75k - $150k",
      status: "qualified",
      priority: "medium",
      tags: ["Healthcare", "AI", "Europe"],
      timeline: [
        { date: new Date(), note: "Technical scoping call completed.", author: "Elena Vance" },
      ],
    },
    {
      name: "David Kim",
      company: "Seoul Quantum Systems",
      email: "dkim@seoulquantum.kr",
      phone: "+82 2 987 6543",
      country: "South Korea",
      source: "linkedin",
      serviceInterest: "Distributed Cloud Systems",
      budget: "$250k+",
      status: "negotiation",
      priority: "urgent",
      tags: ["FinTech", "APAC", "Zero-Latency"],
      timeline: [
        { date: new Date(), note: "Contract terms review underway.", author: "Nazmul I." },
      ],
    },
  ]);

  await Quotation.deleteMany({});
  const quote = await Quotation.create({
    quoteNumber: "RIZ-Q-2026-0001",
    secureToken: "8f9e2b1c4a7d6e5f0a3b2c1d",
    clientId: client._id,
    clientName: "Julian Thorne",
    clientCompany: "Aethelgard Capital Management",
    clientEmail: "j.thorne@aethelgard.com",
    clientPhone: "+1 (212) 849-2041",
    projectName: "FPGA & Rust Ultra-Low Latency Order Routing Engine",
    description: "Architectural engineering, implementation, and deployment of deterministic order gateway.",
    lineItems: [
      { item: "Distributed Rust Kernel & Order Router", description: "Zero-allocation order book reconciler", quantity: 1, unitPrice: 48000, discount: 0, total: 48000 },
      { item: "DPDK Kernel-Bypass Networking Engine", description: "Sub-10 microsecond network interface bindings", quantity: 1, unitPrice: 32000, discount: 0, total: 32000 },
      { item: "Real-Time Telemetry & Failover Console", description: "Next.js 16 high-density telemetry console", quantity: 1, unitPrice: 20000, discount: 0, total: 20000 },
    ],
    subtotal: 100000,
    discountTotal: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 100000,
    currency: "USD",
    paymentTerms: "50% upfront, 50% upon benchmark validation",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "sent",
    notes: "Includes 90 days of Tier-1 SRE post-deployment standby.",
    termsConditions: "Subject to Master Engineering Agreement. Code intellectual property transfers upon final payment.",
  });

  await Invoice.deleteMany({});
  await Invoice.create({
    invoiceNumber: "RIZ-INV-2026-0001",
    secureToken: "7a6b5c4d3e2f1a0b9c8d7e6f",
    quotationId: quote._id,
    clientId: client._id,
    clientName: "Julian Thorne",
    clientCompany: "Aethelgard Capital Management",
    clientEmail: "j.thorne@aethelgard.com",
    projectName: "FPGA & Rust Ultra-Low Latency Order Routing Engine",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    currency: "USD",
    lineItems: [
      { item: "Engineering Milestone 1: Core Kernel", description: "Initial 50% project retainer", quantity: 1, unitPrice: 50000, total: 50000 },
    ],
    subtotal: 50000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 50000,
    amountPaid: 0,
    amountDue: 50000,
    status: "sent",
    notes: "Milestone 1 invoice. Please reference RIZ-INV-2026-0001 in wire memo.",
  });

  console.log(" Seed complete! Database successfully populated for RIZMEC.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
