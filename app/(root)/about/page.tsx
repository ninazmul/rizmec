import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Code2,
  Globe2,
  Sparkles,
  Terminal,
  CheckCircle2,
  Layers,
  Rocket,
  Users2,
  Briefcase,
} from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Rizmec — Software Engineering & Intelligent Automation Philosophy",
  description:
    "Learn about Rizmec's origin, founder-led engineering philosophy, business evolution, and commitment to building reliable digital infrastructure for international businesses.",
  keywords: [
    "About Rizmec",
    "Rizmec engineering",
    "N.I. Nazmul",
    "Chief Architect",
    "software engineering company",
    "intelligent automation",
    "founder-led technology partner",
  ],
  alternates: {
    canonical: "https://rizmec.com/about",
  },
};

export default async function AboutPage() {
  const teamRes = await getTeamMembers({ published: true });
  const teamMembers = teamRes.success ? teamRes.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <CyberGlowMesh intensity="low" />

      {/* ── HERO SECTION ── */}
      <div className="max-w-4xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          // About Rizmec
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome leading-[1.08]">
          Engineering Digital Infrastructure for Modern Businesses.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
          Originating from Bangladesh and serving ambitious international businesses across the United Kingdom, Australia, the United Arab Emirates, and global markets—Rizmec builds software that helps organizations operate smarter, automate workflows, and scale confidently.
        </p>
      </div>

      {/* ── BRAND CONCEPT & MANIFESTO ── */}
      <TiltCard maxTilt={4} glareOpacity={0.12}>
        <div className="p-8 sm:p-14 rounded-3xl border border-white/15 bg-neutral-900/50 backdrop-blur-2xl space-y-8 shadow-2xl relative">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BRAND CONCEPT // AL-KHWARIZMI &amp; ALGORITHMS
            </span>
            <span className="text-neutral-500">//</span>
            <span className="text-neutral-400">PRONUNCIATION: RIZ-mek</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
            &quot;From algorithms to engineered intelligence.&quot;
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-300 leading-relaxed font-sans font-light">
            <p>
              The name <strong>Rizmec</strong> is inspired by Muhammad ibn Musa al-Khwarizmi, the 9th-century polymath whose foundational treatises gave the modern world the word <em>algorithm</em>. At Rizmec, we believe that enduring technology is grounded in computational discipline: structured logic, rigorous schemas, and intentional architecture.
            </p>
            <p>
              We reject brittle software shortcuts and superficial AI wrappers. Real business technology requires deep engineering integrity: strict type safety, predictable database modeling, verifiable data boundaries, and clean ergonomic interfaces that respect the time and cognitive bandwidth of human operators.
            </p>
          </div>
        </div>
      </TiltCard>

      {/* ── FOUNDER-LED ENGINEERING ADVANTAGE ── */}
      <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl relative space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              // Technical Leadership
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Founder-Led Engineering Partnership
            </h3>
          </div>
          <div className="text-xs font-mono text-neutral-400">
            N.I. NAZMUL — FOUNDER &amp; CHIEF ARCHITECT
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm text-neutral-300 font-light leading-relaxed">
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Technical Communication</span>
            </h4>
            <p className="text-xs text-neutral-400">
              When you work with Rizmec, you communicate directly with senior software architects who understand system design, database indexing, and API ergonomics—not non-technical account managers.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tailored, Maintainable Code</span>
            </h4>
            <p className="text-xs text-neutral-400">
              We engineer custom business software using strict TypeScript, modern Next.js server components, and clean modular boundaries that your organization owns 100% without vendor lock-in.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Practical, Verifiable AI</span>
            </h4>
            <p className="text-xs text-neutral-400">
              We apply artificial intelligence to solve concrete business problems: automated document processing, intelligent triage, and data extraction with strict validation boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4-STAGE BUSINESS EVOLUTION ── */}
      <div className="space-y-12 relative">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            // Strategic Vision
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            The Rizmec Business Evolution
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Our company roadmap is structured across four progressive phases of technological growth and commercial impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 01
              </div>
              <h3 className="text-lg font-bold text-white">Software Engineering Services</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                High-touch custom web applications, business platforms, and workflow automation projects that generate tangible ROI for international clients.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest pt-4 border-t border-white/5">
              ACTIVE EXECUTION
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 02
              </div>
              <h3 className="text-lg font-bold text-white">Recurring Tech Partnerships</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Long-term technical stewardship: continuous development, cloud infrastructure monitoring, performance tuning, and technical advisory.
              </p>
            </div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pt-4 border-t border-white/5">
              ONGOING EXPANSION
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 03
              </div>
              <h3 className="text-lg font-bold text-white">Proprietary Platforms</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Transforming recurring industry problems into modular, configurable products, headlined by Rizmec PartnerOS for international education.
              </p>
            </div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pt-4 border-t border-white/5">
              MODULAR ROLLOUT
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 04
              </div>
              <h3 className="text-lg font-bold text-white">Global Tech Ecosystem</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                International partnerships, a high-caliber distributed engineering network, and integrated enterprise solutions serving global markets.
              </p>
            </div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pt-4 border-t border-white/5">
              LONG-TERM VISION
            </div>
          </div>
        </div>
      </div>

      {/* ── ENGINEERING PRINCIPLES ── */}
      <div className="space-y-12 relative">
        <div>
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            // Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 text-chrome">
            How We Build Software
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">01</div>
              <h3 className="text-lg font-bold text-white">Deterministic by Default</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                We enforce strict data type boundaries, automated validation schemas, and predictable business rules before state ever mutates.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">02</div>
              <h3 className="text-lg font-bold text-white">Maintainability First</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Codebases are designed for long-term clarity: well-documented server actions, modular component architecture, and zero unnecessary dependencies.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">03</div>
              <h3 className="text-lg font-bold text-white">Ergonomic Precision</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                High information density balanced with clean typography, fast page loads, and responsive layouts that empower operators to work quickly.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* ── INTERNATIONAL COLLABORATION STRIP ── */}
      <TiltCard maxTilt={3} glareOpacity={0.1}>
        <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-neutral-950/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">International Client Collaboration</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Operating from Dhaka, Bangladesh, we collaborate seamlessly across UK, Australian, UAE, and US business hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 shadow-lg btn-shimmer btn-glow"
          >
            Discuss Your Project
          </Link>
        </div>
      </TiltCard>
    </div>
  );
}
