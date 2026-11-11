/**
 * RIZMEC — Source of Truth Constants
 * Factually accurate, commercially credible, and verified data for Rizmec.
 */

export const COMPANY_IDENTITY = {
  name: "RIZMEC",
  legalName: "Rizmec",
  website: "https://www.rizmec.com/",
  tagline: "From Algorithms to Engineered Intelligence",
  headline: "Engineering Digital Infrastructure for Modern Businesses.",
  heroDescription:
    "From custom business software to intelligent automation, Rizmec builds practical technology solutions that help organizations operate smarter and scale.",
  positioning:
    "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale.",
  philosophy: "From Algorithms to Engineered Intelligence.",
  model:
    "Ambitious, founder-led technology engineering company based in Bangladesh, targeting international clients.",
  location: "Dhaka, Bangladesh",
  headquarters: "Gazipur 1750, Dhaka, Bangladesh",
  contactEmail: "hello@rizmec.com",
  socialLinks: {
    github: "https://github.com/ninazmul",
    companyGithub: "https://github.com/rizmec",
    linkedin: "https://www.linkedin.com/company/rizmec",
    twitter: "https://x.com/rizmec_tech",
  },
};

export const FOUNDER_INFO = {
  name: "N.I. Nazmul",
  slug: "ninazmul",
  title: "Founder & Chief Architect",
  company: "Rizmec",
  tagline:
    "Architecting reliable business software, full-stack platforms, and intelligent automation.",
  bio: "Founder and Chief Architect at Rizmec. Specializes in custom business applications, full-stack web platforms, workflow automation, and practical AI integration for international businesses.",
  location: "Gazipur, Dhaka, Bangladesh",
  email: "nazmulsaw@gmail.com",
  avatar: "https://github.com/ninazmul.png",
  role: "founder",
  order: 1,
  featured: true,
  published: true,
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
    linkedin: "https://www.linkedin.com/company/rizmec",
  },
};

export const CORE_CAPABILITIES = [
  {
    title: "Custom Software Engineering",
    slug: "custom-software-engineering",
    tagline: "Tailored web applications built for performance, security, and maintainability.",
    shortDescription:
      "Bespoke web applications, SaaS products, client portals, and administrative dashboards engineered using modern full-stack architectures.",
    iconName: "Code2",
    features: [
      { title: "Bespoke Web Applications", description: "Clean Next.js and TypeScript codebases designed for high responsiveness." },
      { title: "Client & Partner Portals", description: "Role-based portals with secure document sharing, authentication, and reporting." },
      { title: "Internal Dashboards & Tools", description: "Operational control centers tailored to your team's exact business logic." },
    ],
    technologies: ["Next.js", "TypeScript", "React", "Node.js", "Tailwind CSS", "MongoDB"],
  },
  {
    title: "Business Platforms (ERP & CRM)",
    slug: "business-platforms-erp-crm",
    tagline: "End-to-end digital operations systems connecting clients, quotes, invoices, and workflows.",
    shortDescription:
      "Centralized operations management software replacing fragmented spreadsheets with structured pipelines, quotation tracking, and audit trails.",
    iconName: "Layers",
    features: [
      { title: "Client & Lead Management", description: "Unified pipelines to track inquiries, communications, and customer interactions." },
      { title: "Quotation & Invoicing Engines", description: "Automated quote generation, electronic client acceptance, and payment tracking." },
      { title: "Role-Based Access Control", description: "Granular administrative permissions and immutable transaction audit logs." },
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "PostgreSQL", "Tailwind CSS"],
  },
  {
    title: "AI & Workflow Automation",
    slug: "ai-workflow-automation",
    tagline: "Practical AI integration and business process automation delivering real ROI.",
    shortDescription:
      "Eliminating manual data entry, automating document extraction, and integrating purpose-built AI assistants directly into your operational loops.",
    iconName: "Cpu",
    features: [
      { title: "Document Processing & Extraction", description: "Automated OCR and structured data extraction from invoices, forms, and IDs." },
      { title: "AI-Powered Customer Support", description: "Domain-constrained assistants trained on your internal documentation and FAQs." },
      { title: "Cross-System Process Automation", description: "Automated triggers connecting CRMs, email, payment systems, and databases." },
    ],
    technologies: ["Python", "Node.js", "LangChain", "OpenAI APIs", "Docker", "REST APIs"],
  },
  {
    title: "Education Technology & Portals",
    slug: "education-technology",
    tagline: "Specialized platforms for student recruitment agencies, consultancies, and institutions.",
    shortDescription:
      "Comprehensive education business platforms supporting multi-tier agent networks, application tracking, document verification, and commission reporting.",
    iconName: "Globe",
    features: [
      { title: "Agent & Sub-Agent Management", description: "Hierarchical partner portals with dedicated application pipelines." },
      { title: "Student Application Tracking", description: "Stage-by-stage admission tracking from inquiry to visa issuance." },
      { title: "Commission & Payment Reconciliation", description: "Automated commission calculation, payout tracking, and financial reports." },
    ],
    technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Tailwind CSS"],
  },
  {
    title: "API Development & Integration",
    slug: "api-development-integration",
    tagline: "Secure, well-documented REST APIs connecting your disparate business systems.",
    shortDescription:
      "Bridging external platforms, payment gateways, third-party SaaS services, and legacy databases with reliable, documented API architectures.",
    iconName: "Workflow",
    features: [
      { title: "Custom RESTful APIs", description: "Type-safe endpoints with strict input validation, rate limiting, and authentication." },
      { title: "Third-Party Connectors", description: "Integrating Stripe, PayPal, CRMs, accounting systems, and messaging providers." },
      { title: "Database Migrations & Sync", description: "Structured data pipelines migrating legacy data into modern databases." },
    ],
    technologies: ["Node.js", "Express", "TypeScript", "Python", "MongoDB", "PostgreSQL"],
  },
  {
    title: "Ongoing Software Maintenance",
    slug: "ongoing-software-maintenance",
    tagline: "Dedicated engineering maintenance keeping your business software secure and reliable.",
    shortDescription:
      "Continuous monitoring, framework upgrades, security patches, database backups, and feature improvements for long-term platform health.",
    iconName: "Server",
    features: [
      { title: "Proactive Health Monitoring", description: "Automated error alerts, uptime monitoring, and performance telemetry." },
      { title: "Security Updates & Backups", description: "Scheduled database snapshots, dependency security patches, and audit reviews." },
      { title: "Iterative Feature Development", description: "Continuous improvements and feature additions as your business scales." },
    ],
    technologies: ["Docker", "Linux VPS", "Cloudflare", "GitHub Actions", "Vercel"],
  },
];

export const VERIFIED_CASE_STUDIES = [
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
    thumbnail:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
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
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
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
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    featured: true,
    published: true,
    order: 3,
  },
];

export const ENGINEERING_APPROACH = [
  {
    step: "01",
    title: "Discovery & Analysis",
    description:
      "We begin by understanding your exact business processes, user roles, bottlenecks, and commercial goals — ensuring every engineering hour targets tangible business value.",
  },
  {
    step: "02",
    title: "Architecture & Schema Design",
    description:
      "We map database schemas, API boundaries, security gates, and integration touchpoints into a solid architectural blueprint before writing code.",
  },
  {
    step: "03",
    title: "Design & Development",
    description:
      "Building clean, type-safe full-stack software with Next.js, modern databases, and responsive interfaces that your team and customers will actually enjoy using.",
  },
  {
    step: "04",
    title: "Testing & Quality Assurance",
    description:
      "Rigorous functional testing, boundary condition verification, security checks, and cross-device validation to ensure stability under real operational conditions.",
  },
  {
    step: "05",
    title: "Deployment & Onboarding",
    description:
      "Configuring automated CI/CD pipelines, provisioning production cloud or VPS hosting, migrating data, and guiding your team through a smooth rollout.",
  },
  {
    step: "06",
    title: "Ongoing Support & Evolution",
    description:
      "Providing continuous monitoring, timely security patches, database backups, and iterative feature development as your business operations expand.",
  },
];

export const PROJECT_CATEGORIES = [
  "Custom Software Engineering",
  "Business Web Applications",
  "ERP & CRM Systems",
  "Education Technology & Portals",
  "E-commerce Platforms",
  "AI & Workflow Automation",
  "API Development & Integration",
  "Ongoing Software Maintenance",
  "Other Engineering Project",
];

export const BUDGET_TIERS = [
  "< $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "To be scoped",
];

export const TIMELINE_OPTIONS = [
  "< 1 Month",
  "1 - 3 Months",
  "3 - 6 Months",
  "Flexible / Ongoing",
];

export const VERIFIED_PLATFORMS = [
  {
    title: "Rizmec Operations Engine",
    slug: "business-operations-core",
    category: "Internal Platform",
    status: "internal",
    tagline: "Centralized client lifecycle, quotation, and invoice management system.",
    summary:
      "The internal business operating engine developed by Rizmec to manage customer inquiries, generate verifiable quotations with electronic sign-offs, and track invoice reconciliation.",
    features: [
      "Cryptographic public quotation access tokens",
      "Immutable acceptance snapshots",
      "Multi-tier role-based access control (RBAC)",
      "Automated lead creation and CRM pipeline",
    ],
    techStack: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Tailwind CSS"],
    pricing: [],
    published: true,
  },
  {
    title: "Education Partner & Admission Portal",
    slug: "education-partner-platform",
    category: "Architecture Blueprint",
    status: "prototype",
    tagline: "Modular student recruitment and agent network coordination portal.",
    summary:
      "A ready-to-deploy software architecture for education consultancies and agencies, featuring multi-tiered agent portals, student application tracking, document collection, and commission reconciliation.",
    features: [
      "Agent and sub-agent management hierarchy",
      "Stage-by-stage student admission pipeline",
      "Secure document collection and verification",
      "Commission calculation and reporting dashboards",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB"],
    pricing: [],
    published: true,
  },
  {
    title: "Workflow & AI Integration Fabric",
    slug: "workflow-integration-gateway",
    category: "Engineering Prototype",
    status: "prototype",
    tagline: "Reusable connectors, document extraction pipelines, and process automation.",
    summary:
      "A modular integration fabric developed by Rizmec to accelerate custom automation projects, connecting databases, OCR extraction pipelines, and LLM task execution into reliable business workflows.",
    features: [
      "Automated structured data extraction from invoices and documents",
      "Domain-constrained knowledge retrieval for customer support",
      "Bidirectional sync between CRM and operational databases",
      "Automated webhook and notification dispatchers",
    ],
    techStack: ["Python", "Node.js", "OpenAI APIs", "Docker", "REST APIs"],
    pricing: [],
    published: true,
  },
];

