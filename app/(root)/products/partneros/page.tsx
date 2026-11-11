import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  GraduationCap,
  Users2,
  GitFork,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  BarChart3,
  BellRing,
  Bot,
  Layers,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Sparkles,
  Info,
} from "lucide-react";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { TiltCard } from "@/components/ui/TiltCard";

export const metadata: Metadata = {
  title: "Rizmec PartnerOS — Education Operations & Partner Management Platform",
  description:
    "A modular, configurable education operations platform architecture. Unify student application tracking, sub-agent hierarchies, commission calculation, and document verification.",
  keywords: [
    "Rizmec PartnerOS",
    "education operations platform",
    "student recruitment CRM",
    "education agent portal architecture",
    "sub-agent management system",
    "admission workflow software",
  ],
  alternates: {
    canonical: "https://rizmec.com/products/partneros",
  },
};

const modules = [
  {
    number: "01",
    title: "Student Management",
    description:
      "Centralized student repository containing academic background, test scores, target destination countries, program preferences, and counselor assignments.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Agent Management",
    description:
      "Comprehensive partner directory for onboarding, certifying, and tracking licensed education recruitment agencies and regional partners.",
    icon: Users2,
  },
  {
    number: "03",
    title: "Sub-Agent Management",
    description:
      "Hierarchical parent-agent to sub-agent relationship structures with scoped access, sub-partner lead attribution, and branch-level analytics.",
    icon: GitFork,
  },
  {
    number: "04",
    title: "Application Tracking",
    description:
      "Multi-stage admission workflow tracking from intake selection and application submission through conditional offers, CAS/COE issuance, and visa grants.",
    icon: Layers,
  },
  {
    number: "05",
    title: "Document Management & Vault",
    description:
      "Structured digital document checklists, file verification workflows, expiry alerts, and tamper-resistant storage for transcripts, SOPs, and IDs.",
    icon: FileCheck2,
  },
  {
    number: "06",
    title: "Commission Management",
    description:
      "Automated commission calculation rules based on institution contracts, partner tiers, and enrollment milestones with transparent payout statements.",
    icon: DollarSign,
  },
  {
    number: "07",
    title: "Role-Based Access Control (RBAC)",
    description:
      "Strict data segregation between super administrators, branch managers, counselors, admission processing officers, and external partner accounts.",
    icon: ShieldCheck,
  },
  {
    number: "08",
    title: "Business Reporting & Analytics",
    description:
      "Real-time operational dashboards covering intake pipelines, conversion ratios, partner productivity, destination yield, and revenue forecasts.",
    icon: BarChart3,
  },
  {
    number: "09",
    title: "Automated Notifications",
    description:
      "Event-driven alerts via email and messaging webhooks notifying students and partners of milestone updates, missing documents, and offer deadlines.",
    icon: BellRing,
  },
  {
    number: "10",
    title: "AI-Assisted Administrative Workflows",
    description:
      "Intelligent document parsing, automated transcript extraction, and AI draft generation for partner updates and follow-up communications.",
    icon: Bot,
  },
];

export default function PartnerOSProductPage() {
  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="medium" />

      {/* Breadcrumb */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Platforms</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-4xl space-y-6 relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold">
            EDUCATION BUSINESS INFRASTRUCTURE
          </span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CONFIGURABLE SOLUTION ARCHITECTURE</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Rizmec PartnerOS
        </h1>

        <p className="text-xl sm:text-2xl text-neutral-300 font-light leading-relaxed">
          The purpose-engineered operations platform for international student recruitment agencies, admission consultancies, and multi-agent education networks.
        </p>

        {/* Product Status Disclosure */}
        <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md flex items-start gap-3.5 text-xs text-neutral-300">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-white">Solution Status &amp; Deployment Model:</div>
            <p className="text-neutral-400 leading-relaxed font-sans text-xs">
              PartnerOS is engineered as a <strong>modular, configurable platform architecture</strong>. Rather than an inflexible multi-tenant SaaS with per-seat user fees, Rizmec deploys and customizes this architecture directly for your organization, aligned with your specific agency workflows, intake pipelines, and partner tiers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow shadow-xl hover:bg-neutral-200 transition-all"
          >
            <span>Request Architecture Scoping</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/industries/education-technology"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            <span>Read Industry Context</span>
          </Link>
        </div>
      </div>

      {/* 10 Architectural Modules */}
      <div className="space-y-12 relative">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            // Platform Modules
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            10 Core Operational Modules
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Each module is constructed as an independent, extensible service that can be customized to match your internal procedures and reporting hierarchies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <TiltCard key={mod.number} maxTilt={6} glareOpacity={0.14}>
                <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-mono text-xs text-neutral-500 font-bold">
                        {mod.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Engineering Advantages */}
      <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-neutral-900/50 backdrop-blur-xl space-y-8 relative">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            // Why Custom Deployment Beats Off-the-Shelf SaaS
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Agency Autonomy &amp; Long-Term Value
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-neutral-300 font-sans">
          <div className="p-6 rounded-xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-bold text-white text-sm font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Per-Seat Fees</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Scale your team to 50, 100, or 500 counselors and sub-agents without incurring punishing per-user monthly SaaS fees.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-bold text-white text-sm font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dedicated Data Sovereignty</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Your student leads, applicant passport documents, and commercial partner contracts reside in your own secure cloud instance.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-black/40 space-y-3">
            <div className="font-bold text-white text-sm font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Custom Workflow Fit</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Custom application stages, intake milestones, commission split agreements, and document checklists matched to your exact markets.
            </p>
          </div>
        </div>
      </div>

      {/* Engagement CTA */}
      <div className="text-center py-12 space-y-6 max-w-2xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
          Evaluate PartnerOS for Your Agency
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Let&apos;s review your current student intake volume, partner network size, and operational pain points to determine the ideal modular deployment plan.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow shadow-xl hover:bg-neutral-200 transition-all"
          >
            <span>Discuss PartnerOS Implementation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
