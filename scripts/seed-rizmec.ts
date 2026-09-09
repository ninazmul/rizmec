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
    tagline: "Intelligence. Engineered.",
    positioning: "Global Technology Engineering & Mission-Critical Systems",
    philosophy: "From algorithms to intelligent systems.",
    contactEmail: "hello@rizmec.com",
    contactPhone: "+1 (888) 749-6320",
    address: "100 Montgomery St, Suite 2400, San Francisco, CA 94104",
    globalLocations: ["San Francisco, CA", "London, UK", "Tokyo, JP", "Singapore"],
    socialLinks: {
      github: "https://github.com/rizmec",
      linkedin: "https://linkedin.com/company/rizmec",
      twitter: "https://x.com/rizmec_tech",
    },
    defaultCurrency: "USD",
    quotationTerms:
      "All engineering deliverables are subject to the Master Services Agreement. Estimates are valid for 30 days from generation date.",
    invoiceTerms: "Net 15 days. Wire and ACH preferred.",
    seo: {
      siteTitle: "RIZMEC — Intelligence. Engineered.",
      siteMetaDescription:
        "RIZMEC is a global technology engineering company delivering high-performance software systems, AI architectures, distributed platforms, and cloud infrastructure.",
      keywords: [
        "RIZMEC",
        "Intelligence Engineered",
        "Software Engineering",
        "AI Systems",
        "Cloud Infrastructure",
        "Enterprise Platforms",
      ],
      canonicalUrl: "https://rizmec.com",
    },
  });

  // 2. Team Members & Profiles
  console.log(" Seeding Team Members...");
  await TeamMember.deleteMany({});
  const members = await TeamMember.create([
    {
      name: "Nazmul I.",
      slug: "nazmul-i",
      title: "Chief Architect & Principal Systems Engineer",
      tagline: "High-concurrency distributed engines & deep neural pipelines.",
      bio: "12+ years designing distributed transaction layers, enterprise fault-tolerant systems, and applied AI infrastructure for Tier-1 technology companies globally.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      role: "leadership",
      email: "nazmulsaw@gmail.com",
      location: "San Francisco, CA",
      skills: [
        { name: "Distributed Systems Architecture", level: 98, category: "Architecture" },
        { name: "Deep Learning Infrastructure", level: 94, category: "AI" },
        { name: "High-Throughput Go & Rust", level: 95, category: "Languages" },
        { name: "Full-Stack Next.js / TypeScript", level: 96, category: "Engineering" },
      ],
      technologies: ["Next.js", "TypeScript", "Go", "Rust", "Python", "Kubernetes", "PyTorch", "Kafka"],
      experience: [
        {
          company: "RIZMEC",
          role: "Chief Architect",
          period: "2023 — Present",
          description: "Leads engineering architecture across multi-region AI systems and mission-critical SaaS platforms.",
        },
        {
          company: "Apex Distributed Labs",
          role: "Staff Infrastructure Engineer",
          period: "2019 — 2023",
          description: "Engineered ultra-low latency event streaming pipelines processing 4M+ req/sec.",
        },
      ],
      education: [
        { degree: "M.S. Computer Science & Systems", institution: "Stanford University", year: "2018" },
      ],
      certifications: [
        { name: "AWS Certified Solutions Architect — Professional", issuer: "Amazon Web Services", year: "2023" },
        { name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation", year: "2022" },
      ],
      achievements: [
        "Architected core consensus layer processing >$2B annual GMV",
        "Author of 4 open-source distributed computing frameworks",
      ],
      socialLinks: {
        github: "https://github.com/rizmec",
        linkedin: "https://linkedin.com/in/rizmec",
        twitter: "https://x.com/rizmec",
      },
      order: 1,
      featured: true,
      published: true,
    },
    {
      name: "Dr. Elena Vance",
      slug: "elena-vance",
      title: "VP of Artificial Intelligence & Neural Systems",
      tagline: "Transforming raw neural weights into deterministic business logic.",
      bio: "Former researcher at MIT CSAIL with 15+ peer-reviewed papers on agentic reasoning, sparse mixture-of-experts, and autonomous inference optimization.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
      role: "ai_systems",
      email: "elena.vance@rizmec.com",
      location: "Boston, MA",
      skills: [
        { name: "Agentic LLM Architectures", level: 97, category: "AI" },
        { name: "Vector Search & Embeddings", level: 95, category: "AI" },
        { name: "Model Quantization & TensorRT", level: 92, category: "Optimization" },
      ],
      technologies: ["PyTorch", "vLLM", "CUDA", "Python", "Triton", "Qdrant"],
      experience: [
        { company: "RIZMEC", role: "VP of AI", period: "2023 — Present", description: "Directs applied AI research and model fine-tuning." },
        { company: "Cortex AI Systems", role: "Principal Scientist", period: "2020 — 2023", description: "Supervised foundation model fine-tuning and safety alignment." },
      ],
      education: [{ degree: "Ph.D. in Artificial Intelligence", institution: "MIT", year: "2019" }],
      certifications: [{ name: "NVIDIA Deep Learning Institute Specialist", issuer: "NVIDIA", year: "2021" }],
      achievements: ["Keynote speaker at NeurIPS Applied Workshops", "Holds 3 patents in adaptive multi-agent retrieval"],
      socialLinks: { github: "https://github.com", linkedin: "https://linkedin.com" },
      order: 2,
      featured: true,
      published: true,
    },
    {
      name: "Marcus Aurelius Chen",
      slug: "marcus-chen",
      title: "Head of Cloud & Resiliency Engineering",
      tagline: "Zero-downtime multi-cloud topologies across 5 continents.",
      bio: "Specializes in multi-region Kubernetes topologies, disaster recovery orchestration, and sub-millisecond edge routing.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      role: "engineering",
      email: "marcus.chen@rizmec.com",
      location: "Seattle, WA",
      skills: [
        { name: "Kubernetes & Mesh Topologies", level: 96, category: "Cloud" },
        { name: "Terraform & GitOps", level: 94, category: "DevOps" },
        { name: "Site Reliability & Chaos Testing", level: 93, category: "Resilience" },
      ],
      technologies: ["Kubernetes", "Terraform", "AWS", "GCP", "Istio", "Prometheus"],
      experience: [
        { company: "RIZMEC", role: "Head of Cloud", period: "2024 — Present", description: "Oversees enterprise cloud contracts and SRE squads." },
      ],
      education: [{ degree: "B.S. Computer Engineering", institution: "UC Berkeley", year: "2017" }],
      certifications: [{ name: "Google Cloud Certified Fellow", issuer: "Google", year: "2023" }],
      achievements: ["Engineered 99.999% SLA across 40 global cluster deployments"],
      socialLinks: { github: "https://github.com", linkedin: "https://linkedin.com" },
      order: 3,
      featured: true,
      published: true,
    },
    {
      name: "Sophia Sterling",
      slug: "sophia-sterling",
      title: "Director of Product Architecture & Design Systems",
      tagline: "Balancing high information density with effortless ergonomics.",
      bio: "Pioneers clean, typography-driven product interfaces and design engineering for mission-critical enterprise consoles.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      role: "product",
      email: "sophia.sterling@rizmec.com",
      location: "London, UK",
      skills: [
        { name: "Design Systems & Tokens", level: 98, category: "Product" },
        { name: "Full-Stack UI Engineering", level: 92, category: "Engineering" },
        { name: "Enterprise Usability Engineering", level: 95, category: "UX" },
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Figma", "Framer Motion"],
      experience: [
        { company: "RIZMEC", role: "Director of Product Architecture", period: "2023 — Present", description: "Designs and standardizes corporate design systems." },
      ],
      education: [{ degree: "B.A. Interaction Design", institution: "Royal College of Art", year: "2018" }],
      certifications: [{ name: "Human Factors Certified Professional", issuer: "HFI", year: "2020" }],
      achievements: ["Led UI overhaul for Fortune 50 FinTech terminal"],
      socialLinks: { github: "https://github.com", linkedin: "https://linkedin.com" },
      order: 4,
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
      title: "Rizmec VectorFlow AI",
      slug: "vectorflow-ai",
      tagline: "Enterprise Neural Knowledge & Agentic Inference Gateway",
      category: "AI Engine",
      summary:
        "High-concurrency LLM routing, continuous embedding caching, and deterministic multi-agent execution designed for security-first enterprise intranets.",
      description:
        "VectorFlow acts as the secure neural spine of the enterprise. It decouples proprietary data from public model providers, providing transparent PII scrubbing, sub-millisecond semantic cache hits, and unified tool-calling telemetry.",
      features: [
        "Semantic vector cache reducing LLM API costs by up to 68%",
        "Zero-retention PII anonymizer and compliance filter",
        "Deterministic JSON schema enforcement at the logits level",
        "Built-in multi-model latency and cost benchmark engine",
      ],
      techStack: ["PyTorch", "vLLM", "Qdrant", "FastAPI", "Next.js", "Docker"],
      screenshots: [
        { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80", caption: "VectorFlow Neural Telemetry Console" },
      ],
      demoUrl: "https://rizmec.com/products/vectorflow-ai",
      githubUrl: "https://github.com/rizmec/vectorflow-core",
      pricingTiers: [
        { name: "Team Node", price: "$1,800", period: "per month", description: "Up to 500,000 monthly inference cycles", features: ["1 Dedicated Vector Node", "Standard PII Scrubbing", "99.9% SLA"] },
        { name: "Enterprise Cluster", price: "$4,500", period: "per month", description: "Unlimited inference & custom fine-tuned adapters", features: ["Multi-Region Dedicated Clustered Inference", "Custom Embeddings Ingestion", "24/7 SRE Direct Slack Support", "Air-Gapped Deployment Option"], isPopular: true },
      ],
      status: "active",
      order: 1,
      featured: true,
      published: true,
    },
    {
      title: "HyperEdge Cloud Orchestrator",
      slug: "hyperedge",
      tagline: "Autonomous Multi-Cloud Kubernetes & Resiliency Plane",
      category: "Enterprise Cloud",
      summary:
        "A single pane of glass for managing, auditing, and auto-scaling Kubernetes clusters across AWS, GCP, and private bare-metal facilities.",
      description:
        "HyperEdge automates the tedious aspects of cloud native infrastructure. With zero-trust service mesh configuration and automated spot-instance arbitrage, it lowers cloud infrastructure costs while increasing availability.",
      features: [
        "Dynamic multi-cloud spot instance migration with zero dropped connections",
        "Automated Istio service mesh configuration and mTLS enforcement",
        "Cryptographic change verification tied to Git commit signatures",
      ],
      techStack: ["Go", "Kubernetes", "Rust", "Terraform", "React", "Prometheus"],
      screenshots: [
        { url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1000&auto=format&fit=crop&q=80", caption: "HyperEdge Global Topology Map" },
      ],
      demoUrl: "https://rizmec.com/products/hyperedge",
      pricingTiers: [
        { name: "Platform Tier", price: "$2,200", period: "per month", description: "Up to 25 Kubernetes clusters", features: ["Continuous Compliance Scans", "Automated GitOps Sync", "99.99% Control Plane SLA"] },
      ],
      status: "active",
      order: 2,
      featured: true,
      published: true,
    },
    {
      title: "Synthetix API Gateway & Event Fabric",
      slug: "synthetix",
      tagline: "Sub-Millisecond Event Streaming & Rate Limiting Proxy",
      category: "Developer Tool",
      summary:
        "Engineered in Rust, Synthetix handles 2,000,000+ RPS with sub-millisecond P99 latency, distributed rate limiting, and cryptographic token verification.",
      description:
        "High-performance API proxy built for FinTech, algorithmic gaming, and global IoT networks requiring ironclad security without performance penalty.",
      features: [
        "Sub-millisecond P99 routing latency across global edge pops",
        "Distributed sliding-window rate limiting with Redis cluster sync",
        "Zero-allocation payload validator against OpenAPI 3.1 schemas",
      ],
      techStack: ["Rust", "Tokio", "Redis", "WebAssembly", "TypeScript"],
      screenshots: [
        { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80", caption: "Synthetix Throughput Monitor" },
      ],
      demoUrl: "https://rizmec.com/products/synthetix",
      pricingTiers: [
        { name: "Pro", price: "$450", period: "per month", description: "Up to 100M monthly requests", features: ["Global Edge Routing", "DDoS Protection", "Custom Wasm Filters"] },
      ],
      status: "active",
      order: 3,
      featured: true,
      published: true,
    },
    {
      title: "OmniLedger FinTech Suite",
      slug: "omniledger",
      tagline: "Immutable Double-Entry Financial Engine & Settlement Core",
      category: "SaaS Platform",
      summary:
        "Cryptographically verifiable ledger platform providing multi-currency settlement, automated reconciliations, and compliance reporting.",
      description:
        "Built for neo-banks, market makers, and enterprise commerce platforms needing absolute mathematical precision and auditability across all transactions.",
      features: [
        "Double-entry bookkeeping engine with zero balance discrepancies",
        "Real-time SWIFT and FedNow payment settlement bridge",
        "Automated financial reconciliation across 120+ payment gateways",
      ],
      techStack: ["Go", "PostgreSQL", "Next.js", "Tailwind CSS", "Redis"],
      screenshots: [
        { url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80", caption: "OmniLedger Reconciliation Matrix" },
      ],
      status: "beta",
      order: 4,
      featured: false,
      published: true,
      pricingTiers: [],
    },
  ]);

  // 5. Dynamic Case Studies / Work
  console.log(" Seeding Case Studies...");
  await Project.deleteMany({});
  await Project.create([
    {
      title: "Autonomous Algorithmic Trading Infrastructure for Quant Capital",
      slug: "quant-capital-infrastructure",
      clientName: "Aethelgard Capital Management",
      industry: "Quantitative Finance",
      summary:
        "Engineered an ultra-low latency event mesh and risk engine processing $4.2B daily trading volume with deterministic P99 latency under 12 microseconds.",
      challenge:
        "The client was experiencing trade execution slippage during high-volatility market opens. Their legacy C++ and Java distributed broker stack incurred intermittent 150ms garbage collection pauses that caused adverse selection on exchange books.",
      solution:
        "RIZMEC re-architected the entire order management and risk verification system in zero-allocation Rust and DPDK user-space networking, connected to an FPGA tick-to-trade fabric with real-time web telemetry.",
      results:
        "Eliminated GC latency pauses completely. Decreased average tick-to-order turnaround from 84ms to 11.2 microseconds, yielding a 28% increase in executed strategy alpha.",
      metrics: [
        { label: "P99 Execution Latency", value: "11.2 μs", change: "-99.9%" },
        { label: "Daily Transaction Volume", value: "$4.2B", change: "+140%" },
        { label: "System Uptime Across FY25", value: "99.999%", change: "Flawless" },
      ],
      services: ["Cloud Infrastructure", "Custom Automation", "Full-Stack Web"],
      technologies: ["Rust", "DPDK", "Next.js", "C++", "Kafka", "WebSockets"],
      gallery: [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
      completionDate: "Q4 2025",
      teamMemberIds: [members[0]._id, members[2]._id],
      testimonial: {
        quote:
          "RIZMEC is the only engineering partner we have ever trusted to touch our core execution stack. Their architectural rigor is unmatched internationally.",
        author: "Julian Thorne",
        role: "Chief Technology Officer, Aethelgard Capital",
      },
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "Global Clinical Intelligence & Telemetry Platform for BioPharma",
      slug: "biopharma-telemetry-platform",
      clientName: "Novaris Health Systems",
      industry: "Healthcare & Life Sciences",
      summary:
        "Designed and deployed a HIPAA & GDPR compliant neural telemetry platform connecting 120 global research hospitals in real-time.",
      challenge:
        "Clinical trials across 4 continents were delayed by siloed patient telemetry data, disparate hospital EHR systems, and weeks of manual compliance verification.",
      solution:
        "RIZMEC built a unified clinical data pipeline using edge-anonymized vector databases, deterministic HL7/FHIR converters, and real-time biometric anomaly detection agents.",
      results:
        "Accelerated Phase III clinical trial data synthesis by 65%, enabling safety alerts to be generated in 4 minutes instead of 72 hours.",
      metrics: [
        { label: "Data Synthesis Acceleration", value: "65%", change: "+65%" },
        { label: "Connected Hospital Centers", value: "120+", change: "Global" },
        { label: "Compliance Verification Time", value: "< 4 min", change: "-98%" },
      ],
      services: ["AI Systems", "Enterprise SaaS", "Web Applications"],
      technologies: ["Python", "PyTorch", "Next.js", "PostgreSQL", "FHIR", "Docker"],
      gallery: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      completionDate: "Q3 2025",
      teamMemberIds: [members[0]._id, members[1]._id, members[3]._id],
      testimonial: {
        quote:
          "The speed and technical clarity RIZMEC brought to our clinical software transformed how we run international drug trials.",
        author: "Dr. Marianne Davies",
        role: "Head of Digital Clinical Operations, Novaris Health",
      },
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: "Sub-Second Global Logistics & Fleet Routing Engine",
      slug: "global-logistics-routing-engine",
      clientName: "Vanguard Global Freight",
      industry: "Supply Chain & Aerospace Logistics",
      summary:
        "Autonomous algorithmic routing platform coordinating 18,000 active maritime and air-cargo assets across 42 countries.",
      challenge:
        "Unpredictable weather disruptions, port bottlenecks, and volatile fuel pricing required 400+ logistics dispatchers to make manual rerouting calculations.",
      solution:
        "Engineered an automated graph-optimization solver paired with real-time AIS maritime transponder feeds, weather radar telemetry, and automated cost recalculation.",
      results:
        "Reduced fleet operational fuel expenditure by $32M annually while improving on-time arrival rate to 99.4%.",
      metrics: [
        { label: "Annual Fuel Savings", value: "$32M", change: "-14%" },
        { label: "On-Time Arrival Rate", value: "99.4%", change: "+8.2%" },
        { label: "Concurrent Asset Telemetry", value: "18,000", change: "Live" },
      ],
      services: ["Custom Automation", "Cloud Infrastructure", "Mobile Applications"],
      technologies: ["Go", "Next.js", "Redis", "Mapbox", "Kubernetes", "TypeScript"],
      gallery: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
      ],
      thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      completionDate: "Q2 2025",
      teamMemberIds: [members[2]._id, members[3]._id],
      testimonial: {
        quote:
          "A masterpiece of software engineering. RIZMEC delivered our complex routing engine on schedule with flawless reliability.",
        author: "Henrik Lindqvist",
        role: "VP of Global Operations, Vanguard Freight",
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
      clientName: "Alexander Vance",
      company: "Apex Global FinTech",
      position: "Chief Information Officer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      content:
        "RIZMEC is in a league of their own. They don't build generic SaaS templates; they build serious, bulletproof distributed systems that handle our highest traffic peaks without flinching.",
      rating: 5,
      featured: true,
      published: true,
      order: 1,
    },
    {
      clientName: "Claire Sterling",
      company: "Cognitive Robotics Inc.",
      position: "VP of Autonomous Systems",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      content:
        "Their engineers understand deep systems architecture from the bare-metal kernel up to the cinematic UI. Working with RIZMEC elevated our entire internal technology culture.",
      rating: 5,
      featured: true,
      published: true,
      order: 2,
    },
    {
      clientName: "Marcus Brody",
      company: "Stratum Aerospace",
      position: "Head of Digital Infrastructure",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      content:
        "The level of precision, architectural depth, and international polish RIZMEC delivers is unmatched in the modern software engineering space.",
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
