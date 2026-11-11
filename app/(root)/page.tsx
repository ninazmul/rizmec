import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Layers,
  Database,
  Users2,
  Lock,
  Sparkles,
  ArrowRight,
  Briefcase,
  GitFork,
  FileCheck2,
  BarChart3,
} from "lucide-react";
import { HeroTerminalVisual } from "@/components/home/HeroTerminalVisual";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { getPublishedProjects } from "@/lib/actions/project.actions";
import { getTestimonials } from "@/lib/actions/testimonial.actions";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { CopyCodeButton } from "@/components/shared/CopyCodeButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rizmec — Software Engineering & Intelligent Automation",
  description:
    "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. Custom business software, education technology platforms, and intelligent automation systems.",
  keywords: [
    "Rizmec",
    "rizmec",
    "rizmec.com",
    "software engineering company",
    "intelligent automation",
    "custom software development",
    "education technology",
    "student recruitment software",
    "business ERP development",
    "Next.js agency",
    "full stack engineering",
  ],
  alternates: {
    canonical: "https://rizmec.com",
  },
};

export default async function HomePage() {
  const [projectsRes, testimonialsRes] = await Promise.all([
    getPublishedProjects({ featured: true, limit: 3 }),
    getTestimonials({ published: true, featured: true, limit: 12 }),
  ]);

  const projects = projectsRes.success ? projectsRes.data : [];
  const testimonials = testimonialsRes.success ? testimonialsRes.data : [];

  return (
    <div className="relative overflow-hidden bg-[#09090b]">
      {/* Cinematic 3D Ambient Mesh & Grid Background */}
      <CyberGlowMesh intensity="medium" />
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

      {/* ========================================================
          1. HERO SECTION: Value Proposition & Visual Authority
      ======================================================== */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            {/* System Telemetry Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-lg border-glow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
                RIZMEC // SOFTWARE ENGINEERING &amp; INTELLIGENT AUTOMATION
              </span>
              <span className="text-neutral-600">|</span>
              <span className="font-mono text-xs text-neutral-400">
                FOUNDER-LED
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-chrome">
              Engineering Digital <br />
              <span className="text-neutral-400">Infrastructure.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed">
              From custom business software to intelligent automation, Rizmec builds technology that helps organizations operate smarter and scale confidently. Serving international businesses across the United Kingdom, Australia, UAE, and global markets.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow group shadow-xl hover:bg-neutral-200 transition-all"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm hover:bg-white/5 transition-all"
              >
                <span>Explore Our Work</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Interactive Preview Card */}
          <HeroTerminalVisual />
        </div>

        {/* ========================================================
            2. TRUST & GENUINE CAPABILITIES STRIP
        ======================================================== */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Stack Core</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Next.js &amp; TypeScript
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Strict typing &amp; server performance
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client Autonomy</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              100% IP Ownership
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Zero per-seat software tax
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Specialized Domain</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Education Technology
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Partner portals &amp; workflows
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Engagement Model</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Architect-Led Delivery
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Direct technical collaboration
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CORE SOLUTIONS: 3 Commercial Disciplines
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                // Core Commercial Disciplines
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
                Commercial Engineering Disciplines
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                Clear solutions designed to solve real business operational bottlenecks and deliver measurable value.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.02] text-xs font-mono text-neutral-300 uppercase tracking-wider btn-glow-outline hover:text-white shrink-0"
            >
              <span>Explore Capability Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Discipline 1: Custom Software Engineering */}
            <TiltCard maxTilt={6} glareOpacity={0.16}>
              <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all flex flex-col justify-between space-y-8 h-full">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Custom Software Engineering
                    </h3>
                    <p className="text-xs font-mono text-cyan-300 mt-1">
                      Web Applications, ERPs, CRMs &amp; SaaS
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                    We architect bespoke business applications, transactional platforms, and internal operational tooling built to eliminate spreadsheet chaos and support business growth.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Custom web application development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Business ERP &amp; CRM operating systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Client &amp; partner extranet portals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>API development &amp; multi-tool integrations</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <Link
                    href="/services#custom-software"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>View Software Capabilities</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TiltCard>

            {/* Discipline 2: AI & Intelligent Automation */}
            <TiltCard maxTilt={6} glareOpacity={0.16}>
              <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all flex flex-col justify-between space-y-8 h-full">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      AI &amp; Intelligent Automation
                    </h3>
                    <p className="text-xs font-mono text-emerald-300 mt-1">
                      Workflow Automation, Document OCR &amp; Triage
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                    Practical, verifiable AI systems that eliminate human latency. From automated document parsing and smart lead triage to event-driven business process pipelines.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Custom AI integration &amp; API connectors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Intelligent document OCR &amp; parsing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Business process event automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Bounded AI agents with human review gates</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <Link
                    href="/services#ai-automation"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>View Automation Capabilities</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TiltCard>

            {/* Discipline 3: Education Technology (Flagship) */}
            <TiltCard maxTilt={6} glareOpacity={0.16}>
              <div className="p-8 sm:p-10 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-neutral-900/60 to-neutral-950 backdrop-blur-xl hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-8 h-full shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-bold">
                      FLAGSHIP PRACTICE
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Education Technology
                    </h3>
                    <p className="text-xs font-mono text-cyan-300 mt-1">
                      Rizmec PartnerOS &amp; Agency Portals
                    </p>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                    Specialized operational infrastructure for international student recruitment agencies, admission consultancies, and multi-agent education partner networks.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Student application pipeline tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Multi-tier agent &amp; sub-agent management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Automated commission &amp; payout engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Centralized document verification vault</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/industries/education-technology"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>Explore EdTech Solutions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/products/partneros"
                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                  >
                    PartnerOS &rarr;
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURED PROJECTS: 3 Real Architectural Case Studies
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              // Verified Engineering Deliveries
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              Featured Case Studies
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              Explore how we design and deploy mission-critical systems that resolve operational bottlenecks.
            </p>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.02] text-xs font-mono text-neutral-300 uppercase tracking-wider btn-glow-outline hover:text-white shrink-0"
          >
            <span>All Case Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-12">
          {projects.map((project: any) => (
            <TiltCard key={project.slug} maxTilt={4} glareOpacity={0.12}>
              <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-2xl hover:border-white/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group shadow-xl">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                    <span className="text-white uppercase font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      {project.clientName}
                    </span>
                    <span>//</span>
                    <span className="text-cyan-300">{project.industry}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-neutral-100 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
                    {project.summary}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    {(project.metrics || []).map((m: any) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="text-xl sm:text-2xl font-black text-white font-mono">
                          {m.value}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono uppercase mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(project.technologies || []).slice(0, 4).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-neutral-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-widest uppercase btn-shimmer btn-glow group/btn shadow-md hover:bg-neutral-200 transition-all"
                    >
                      <span>Read Architectural Breakdown</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. ENGINEERING PROCESS: Delivery Methodology
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              // Delivery Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              How We Engineer &amp; Deliver
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              A transparent, six-stage engineering process designed to eliminate project surprises and deliver reliable software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 01
              </div>
              <h3 className="text-lg font-bold text-white">Discovery &amp; Consultation</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                We deep-dive into your operational workflows, existing tools, team pain points, and commercial requirements to define an actionable scope.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 02
              </div>
              <h3 className="text-lg font-bold text-white">Requirements &amp; Architecture</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                We architect database schemas, API contracts, role-based permission matrices, and security models before writing production code.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 03
              </div>
              <h3 className="text-lg font-bold text-white">UI/UX &amp; Engineering</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Iterative full-stack development using Next.js and strict TypeScript. Fast server rendering, clean typography, and intuitive user ergonomics.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 04
              </div>
              <h3 className="text-lg font-bold text-white">Testing &amp; Quality Assurance</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Automated regression testing, edge-case validation, permission security audits, and cross-device responsive verification.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 05
              </div>
              <h3 className="text-lg font-bold text-white">Deployment &amp; Integration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Seamless rollout to your dedicated cloud instance, database migration execution, and third-party webhook integrations.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Stage 06
              </div>
              <h3 className="text-lg font-bold text-white">Maintenance &amp; Evolution</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
                Long-term technical partnership: performance telemetry, continuous feature iterations, and regular architectural reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. WHY RIZMEC: Actual Engineering Differentiators
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            // Why Rizmec
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            Built for Businesses That Value Technical Substance
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            We are not a generic web agency that resells templates, nor are we a fragile gig marketplace. We operate as your dedicated engineering partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Founder-Led Engineering</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              Every project is guided directly by our Chief Architect, ensuring sound architectural foundations and zero non-technical translation layers.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Tailored System Architecture</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              We build around your actual workflows rather than forcing your business processes into rigid, ill-fitting third-party software constraints.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Code &amp; IP Ownership</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              You own your software, your database, and your intellectual property outright. No recurring per-seat penalties and zero vendor lock-in.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Practical AI Implementation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              We integrate AI to solve tangible operational pain points: document verification, intake triage, and automated OCR with strict validation checks.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Transparent Delivery</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              Clear scope, weekly demonstration checkpoints, predictable milestones, and proactive technical advisory throughout the project lifecycle.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Long-Term Partnership</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
              We continue supporting your platform post-launch with performance tuning, cloud maintenance, and ongoing feature evolution.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. VERIFIED TESTIMONIALS & OUTCOMES
      ======================================================== */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialsMarquee testimonials={testimonials} />
      )}

      {/* ========================================================
          8. HOSTINGER OFFICIAL PARTNER — CLOUD HOSTING
      ======================================================== */}
      <section className="py-16 border-t border-white/10 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#673DE6]/15 via-[#09090b] to-[#673DE6]/10 p-6 sm:p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#673DE6]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                  aria-label="Hostinger Official Partner"
                >
                  <img
                    src="/assets/hostinger/badge-brand-dark-320x120.png"
                    alt="Hostinger Official Partner"
                    width="140"
                    height="52"
                    className="h-8 w-auto hover:opacity-90 transition-opacity"
                  />
                </a>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                    Deploy on High-Performance Cloud.{" "}
                    <span className="text-[#9D80F4]">Save 20%.</span>
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Use referral code <CopyCodeButton code="RIZMEC" /> for an exclusive 20% discount on Hostinger cloud infrastructure.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#673DE6] text-white font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow-purple group whitespace-nowrap w-full sm:w-auto"
                >
                  <span>Get 20% Off</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. VIDEO ADS & MEDIA SHOWCASE
      ======================================================== */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-500/[0.04] blur-[180px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-widest text-red-400 uppercase font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                // Video &amp; Creative Media
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
                Video Ads &amp; Motion Content
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
                Explore our curated collection of short-form reels and full-length video media engineered to captivate audiences and scale your brand across digital channels.
              </p>
              <div className="pt-2">
                <Link
                  href="/ads"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow group shadow-xl hover:bg-neutral-200 transition-all"
                >
                  <span>Explore Full Video Gallery</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden aspect-[9/16] relative group hover:border-red-500/30 transition-all flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-red-400 uppercase">
                  9:16 Reel
                </div>
              </div>
              <div className="col-span-2 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden aspect-video relative group hover:border-red-500/30 transition-all self-center flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-red-400 uppercase">
                  16:9 Video
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. FINAL CONVERSION CTA
      ======================================================== */}
      <section className="py-28 border-t border-white/10 bg-black text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase">DISCUSS YOUR PROJECT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight text-chrome">
            Have a Business Challenge Worth Engineering?
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tell us what you are trying to build, improve, or automate. Let&apos;s explore the right technical solution and evaluate feasibility.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow group shadow-xl hover:bg-neutral-200 transition-all"
            >
              <span>Start a Conversation</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm hover:bg-white/5 transition-all"
            >
              <span>Explore Our Work</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
