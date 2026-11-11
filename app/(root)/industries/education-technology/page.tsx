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
  ArrowUpRight,
  CheckCircle2,
  Layers,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { TiltCard } from "@/components/ui/TiltCard";

export const metadata: Metadata = {
  title: "Education Technology Solutions — International Recruitment & Consultancy Infrastructure",
  description:
    "Tailored digital infrastructure for international student recruitment agencies, admission consultancies, and education networks. Streamline agent workflows, application tracking, and commission management.",
  keywords: [
    "education technology solutions",
    "education consultancy software",
    "student recruitment CRM",
    "education agent portal",
    "sub-agent management system",
    "admission workflow automation",
    "education business infrastructure",
    "Rizmec PartnerOS",
  ],
  alternates: {
    canonical: "https://rizmec.com/industries/education-technology",
  },
};

const operationalPains = [
  {
    title: "Fragmented Student Application Tracking",
    description:
      "Applications scattered across emails, spreadsheets, and messaging apps lead to missed admission deadlines, lost documents, and frustrated applicants.",
    icon: AlertCircle,
  },
  {
    title: "Uncoordinated Agent & Sub-Agent Networks",
    description:
      "Managing dozens of external recruitment partners without centralized visibility leads to duplicate submissions, disputed leads, and lack of accountability.",
    icon: GitFork,
  },
  {
    title: "Complex Commission & Payout Disputes",
    description:
      "Multi-tier commission calculations, split agreements, and variable university payout terms create administrative overhead and partner friction.",
    icon: DollarSign,
  },
  {
    title: "Disorganized Document Verification",
    description:
      "Academic transcripts, language tests, passports, and visas handled manually without version control create compliance and visa rejection risks.",
    icon: FileCheck2,
  },
  {
    title: "Inconsistent Staff Permissions & Data Leaks",
    description:
      "Without strict role-based access control, sensitive applicant data and commercial commission structures are exposed across team members.",
    icon: ShieldCheck,
  },
  {
    title: "Blind Operational Reporting",
    description:
      "Leadership lacks real-time visibility into conversion rates by destination country, partner productivity, counselor workload, and pipeline revenue.",
    icon: BarChart3,
  },
];

const solutions = [
  {
    number: "01",
    title: "Centralized Student Application Pipeline",
    description:
      "End-to-end status tracking from initial inquiry and document collection through university offer letter, visa filing, and final enrollment.",
    benefits: ["Kanban & table views", "Automated stage alerts", "Duplicate detection"],
  },
  {
    number: "02",
    title: "Multi-Tier Agent & Sub-Agent Hierarchy",
    description:
      "Dedicated partner portals allowing certified referral agents and sub-agents to submit leads, monitor progress, and upload documents securely.",
    benefits: ["Independent partner logins", "Lead ownership attribution", "Sub-agent branch tracking"],
  },
  {
    number: "03",
    title: "Automated Commission & Payout Engine",
    description:
      "Transparent commission calculation based on university contracts, partner tiers, and enrollment milestones with full audit trails.",
    benefits: ["Milestone-based triggers", "Partner statement generation", "Multi-currency reporting"],
  },
  {
    number: "04",
    title: "Structured Document Vault & Verification",
    description:
      "Centralized document repository with automated completeness checklists, expiry tracking, and review status for admissions teams.",
    benefits: ["Secure cloud storage", "Applicant checklist auto-gen", "Audit logs"],
  },
  {
    number: "05",
    title: "Granular Role-Based Access Control (RBAC)",
    description:
      "Isolate counselors, admissions officers, finance teams, and external partner accounts so each user only sees authorized data.",
    benefits: ["Counselor assignment gates", "Financial data masking", "Session security"],
  },
  {
    number: "06",
    title: "AI-Assisted Workflow Automation",
    description:
      "Automated WhatsApp/Email status notifications to students, smart document extraction, and intake deadline reminders.",
    benefits: ["Event-driven triggers", "Reduced manual follow-ups", "Higher student conversion"],
  },
];

export default function EducationTechnologyPage() {
  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <CyberGlowMesh intensity="medium" />

      {/* ── HERO SECTION ── */}
      <div className="max-w-4xl space-y-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
          <GraduationCap className="w-4 h-4" />
          <span>SPECIALIZED INDUSTRY FOCUS // EDUCATION TECHNOLOGY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome leading-[1.08]">
          Digital Infrastructure for International Education &amp; Student Recruitment.
        </h1>

        <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
          We architect custom portals, admission workflow engines, and partner management systems
          for international student recruitment agencies, admission consultancies, and education networks.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow shadow-xl"
          >
            <span>Discuss Your Education Solution</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products/partneros"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
          >
            <span>Explore PartnerOS Concept</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── TARGET CLIENTS STRIP ── */}
      <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl relative">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4">
          Engineered for international education organizations:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-semibold text-white">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Student Recruitment Agencies</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Admission Consultancies</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-Agent Education Networks</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Training &amp; Language Institutes</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: OPERATIONAL BOTTLENECKS ── */}
      <div className="space-y-12 relative">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            // Operational Bottlenecks
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            Why Generic CRMs Fail Education Consultancies
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Standard sales CRMs treat students like short-cycle leads. International education involves complex multi-stakeholder relationships, visa dependencies, sub-agent hierarchies, and multi-month admission pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operationalPains.map((pain) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="p-8 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-xl space-y-4 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                  {pain.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {pain.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: RIZMEC SOLUTION ARCHITECTURE ── */}
      <div className="space-y-12 relative">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            // Engineered Solution Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            Custom Infrastructure Designed for Education Growth
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Rather than forcing your business into rigid off-the-shelf software with expensive per-seat pricing, Rizmec constructs tailored operational platforms adapted to your exact agency workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol) => (
            <TiltCard key={sol.number} maxTilt={6} glareOpacity={0.14}>
              <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="font-mono text-2xl font-black text-white text-chrome">
                    {sol.number}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {sol.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  {sol.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-[11px] font-mono text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: FLAGSHIP CONCEPT: PARTNEROS SPOTLIGHT ── */}
      <div className="p-8 sm:p-14 rounded-3xl border border-white/15 bg-gradient-to-br from-neutral-900/80 via-neutral-950 to-neutral-900/50 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>FLAGSHIP SOLUTION ARCHITECTURE // RIZMEC PARTNEROS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to streamline your education agency operations?
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Explore how our modular <strong>PartnerOS</strong> platform architecture consolidates student application tracking, sub-agent hierarchies, commission management, and document workflows into a single high-performance system.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/products/partneros"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg"
              >
                <span>View PartnerOS Architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                <span>Discuss Your Agency Needs</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md space-y-3 font-mono text-xs text-neutral-300">
            <div className="text-white font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-white/10">
              Technical Guarantees
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Ownership:</span>
              <span className="text-white">100% Client Code Ownership</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Hosting:</span>
              <span className="text-white">Dedicated Cloud / Self-Hosted</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Per-Seat Fees:</span>
              <span className="text-emerald-400 font-bold">$0 (No Per-User Penalty)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Architecture:</span>
              <span className="text-white">Next.js + TypeScript + Node</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="text-center py-12 space-y-6 max-w-2xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
          Have an Education Agency Challenge Worth Engineering?
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Whether you need a dedicated portal for 50+ sub-agents or a bespoke workflow engine for thousands of international student applications, let&apos;s evaluate the right technical solution.
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

