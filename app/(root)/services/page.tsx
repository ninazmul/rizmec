import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Code2,
  Cpu,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Bot,
  Workflow,
  Globe,
  Database,
  ShieldCheck,
  BarChart3,
  Users2,
  FileText,
  Boxes,
} from "lucide-react";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { TiltCard } from "@/components/ui/TiltCard";

export const metadata: Metadata = {
  title: "Services & Engineering Disciplines — Custom Software, AI & EdTech",
  description:
    "Explore Rizmec's three core commercial disciplines: Custom Software Engineering, AI & Intelligent Automation, and Education Technology Solutions.",
  keywords: [
    "custom software development",
    "web application development",
    "AI automation",
    "business process automation",
    "education technology solutions",
    "custom ERP CRM",
    "SaaS development",
    "Rizmec services",
  ],
  alternates: {
    canonical: "https://rizmec.com/services",
  },
};

const serviceGroups = [
  {
    id: "custom-software",
    badge: "CATEGORY A // CORE SOFTWARE",
    title: "Custom Software Engineering",
    tagline: "Bespoke digital platforms, operational software, and scalable web applications.",
    description:
      "We design and build production-grade web applications, internal business operating tools, and transactional platforms tailored to your business rules. We engineer clean, maintainable codebases that your company owns outright.",
    icon: Code2,
    offerings: [
      {
        title: "Custom Web Application Development",
        detail: "Fast, responsive web applications engineered with Next.js, React, TypeScript, and modern backend architectures.",
      },
      {
        title: "Business Management Systems (CRM & ERP)",
        detail: "Tailored operations platforms consolidating customer records, quotations, invoices, inventory, and staff tasks.",
      },
      {
        title: "Client & Partner Portals",
        detail: "Secure extranets for external clients, vendors, or agents with authenticated document sharing and status tracking.",
      },
      {
        title: "SaaS Product Engineering",
        detail: "End-to-end multi-tenant SaaS development with subscription billing, user role permissions, and tenant data isolation.",
      },
      {
        title: "Internal Dashboards & Operational Tooling",
        detail: "High-density administrative consoles and reporting interfaces that eliminate spreadsheet chaos.",
      },
      {
        title: "API Development & System Integrations",
        detail: "Robust REST and GraphQL APIs connecting disparate databases, payment gateways, and third-party SaaS tools.",
      },
    ],
    deliverables: [
      "100% full source code ownership",
      "Production-ready Next.js & TypeScript codebase",
      "Automated database migrations & data schemas",
      "Full API & deployment documentation",
    ],
  },
  {
    id: "ai-automation",
    badge: "CATEGORY B // INTELLIGENT AUTOMATION",
    title: "AI & Intelligent Automation",
    tagline: "Practical AI integration and event-driven automation that eliminate manual friction.",
    description:
      "We build practical, verifiable AI systems—not superficial chatbots. From automating repetitive document verification to deploying smart triage workflows and continuous event synchronization, our automation frees your team to focus on high-value work.",
    icon: Cpu,
    offerings: [
      {
        title: "AI Integration & API Solutions",
        detail: "Embedding advanced language models and vision APIs into your existing business applications with strict schema boundaries.",
      },
      {
        title: "AI-Powered Customer & Lead Triage",
        detail: "Intelligent inquiry routing, automated intent classification, and instant contextual responses.",
      },
      {
        title: "Document Processing & OCR Pipelines",
        detail: "Extracting structured data from invoices, student transcripts, identity documents, and contracts automatically.",
      },
      {
        title: "Business Process Automation",
        detail: "Automated event loops connecting CRM updates, notifications, document generation, and status triggers.",
      },
      {
        title: "Intelligent Data Processing",
        detail: "Transforming unstructured customer communications into clean, categorized database entries with audit logs.",
      },
      {
        title: "Bounded Agentic Workflows",
        detail: "Guardrailed AI workflows with human-in-the-loop review gates for high-stakes operational tasks.",
      },
    ],
    deliverables: [
      "Custom integration connectors & webhooks",
      "Automated queue worker & retry orchestrator",
      "Data validation & schema enforcement pipelines",
      "Operational monitoring & error logging alerts",
    ],
  },
  {
    id: "edtech",
    badge: "CATEGORY C // SPECIALIZED INDUSTRY",
    title: "Education Technology",
    tagline: "Dedicated operational software for international recruitment agencies and consultancies.",
    description:
      "Our specialized industry practice. We build custom infrastructure for international student recruitment consultancies, multi-agent education networks, and training institutes needing centralized application tracking, sub-agent coordination, and commission management.",
    icon: GraduationCap,
    offerings: [
      {
        title: "Student Application Tracking Platforms",
        detail: "Visual pipeline tracking students across every milestone: counseling, offer letter, tuition payment, and visa grant.",
      },
      {
        title: "Agent & Sub-Agent Management Portals",
        detail: "Dedicated portals for external recruitment partners and branch offices with verified lead attribution.",
      },
      {
        title: "Commission & Payout Management",
        detail: "Automated calculations based on university agreements, partner splits, and milestone verification.",
      },
      {
        title: "Admission Document Verification Vault",
        detail: "Centralized checklists, expiry tracking, and review status for passports, transcripts, and financial records.",
      },
      {
        title: "Learning & School Management Systems (LMS)",
        detail: "Custom platforms for course scheduling, student progress tracking, and internal staff coordination.",
      },
      {
        title: "Education Business Automation",
        detail: "Automated SMS/WhatsApp/Email notifications to students, counselors, and partner representatives.",
      },
    ],
    deliverables: [
      "Rizmec PartnerOS configurable deployment",
      "Multi-tier role permissions (Counselor, Agent, Admin)",
      "University contract & commission rule matrices",
      "Student intake & reporting dashboard",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <CyberGlowMesh intensity="medium" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          // Commercial Capabilities & Services
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Engineering Digital Infrastructure That Works.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          We organize our engineering services into three practical commercial disciplines. Each is designed to solve specific operational bottlenecks and deliver measurable business value.
        </p>
      </div>

      {/* Services Breakdown */}
      <div className="space-y-20 relative">
        {serviceGroups.map((group, idx) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.id}
              id={group.id}
              className="scroll-mt-32 p-8 sm:p-14 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-10"
            >
              {/* Group Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 border-b border-white/10">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/5 text-neutral-300">
                    <GroupIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{group.badge}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {group.title}
                  </h2>
                  <p className="text-sm font-mono text-cyan-300">
                    {group.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans pt-1">
                    {group.description}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 self-start btn-shimmer btn-glow shadow-md"
                >
                  <span>Discuss This Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Offerings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.offerings.map((offering) => (
                  <div
                    key={offering.title}
                    className="p-6 rounded-2xl border border-white/5 bg-neutral-950/60 backdrop-blur-sm space-y-3 hover:border-white/20 transition-all"
                  >
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {offering.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {offering.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Deliverables Footer Strip */}
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                  What You Receive:
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-300">
                  {group.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How We Deliver / Engineering Partnership */}
      <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-xl space-y-8 relative">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            // Engineering Engagement Model
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Rizmec Works With You
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            We partner with businesses as long-term technology architects, not transactional gig contractors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-mono text-xs text-cyan-400 uppercase font-bold">Stage 1</div>
            <h4 className="text-base font-bold text-white">Project-Based Engineering</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Defined scope, fixed milestones, transparent architecture, and delivery of custom software, business portals, or automation workflows.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-mono text-xs text-emerald-400 uppercase font-bold">Stage 2</div>
            <h4 className="text-base font-bold text-white">Continuous Technology Partnership</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ongoing technical advisory, feature expansion, performance tuning, and infrastructure management to ensure your systems evolve with your business.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-mono text-xs text-indigo-400 uppercase font-bold">Stage 3</div>
            <h4 className="text-base font-bold text-white">Configurable Platforms</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Deploy modular, proven architectures like Rizmec PartnerOS, customized specifically for your team without recurring per-seat software licensing penalties.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 space-y-6 max-w-2xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
          Have a Business Challenge Worth Engineering?
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Tell us what you are trying to build, improve, or automate. Let&apos;s evaluate the right technical solution.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow shadow-xl hover:bg-neutral-200 transition-all"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
