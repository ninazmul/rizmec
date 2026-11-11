import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowUpRight,
  Cpu,
  Server,
  Globe,
  Layers,
  Terminal,
  Code2,
  Workflow,
  ChevronRight,
  Lock,
  Smartphone,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { HeroTerminalVisual } from "@/components/home/HeroTerminalVisual";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { getServices } from "@/lib/actions/service.actions";
import { getPublishedProjects } from "@/lib/actions/project.actions";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { getTestimonials } from "@/lib/actions/testimonial.actions";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import {
  FOUNDER_INFO,
  ENGINEERING_APPROACH,
  COMPANY_IDENTITY,
} from "@/constants/verifiedData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RIZMEC — Software Engineering & Intelligent Automation",
  description:
    "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. We build custom software, business platforms, and practical intelligent automation systems.",
  keywords: [
    "RIZMEC",
    "rizmec",
    "rizmec.com",
    "software engineering company",
    "custom software development",
    "business web applications",
    "ERP CRM development",
    "education technology",
    "student management system",
    "AI integration",
    "workflow automation",
    "API development",
    "founder-led software engineering",
  ],
  alternates: {
    canonical: "https://rizmec.com",
  },
};

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-white" />,
  Server: <Server className="w-5 h-5 text-white" />,
  Globe: <Globe className="w-5 h-5 text-white" />,
  Layers: <Layers className="w-5 h-5 text-white" />,
  Smartphone: <Smartphone className="w-5 h-5 text-white" />,
  Workflow: <Workflow className="w-5 h-5 text-white" />,
  Terminal: <Terminal className="w-5 h-5 text-white" />,
  Code2: <Code2 className="w-5 h-5 text-white" />,
};

export default async function HomePage() {
  const [servicesRes, projectsRes, teamRes, testimonialsRes] =
    await Promise.all([
      getServices({ published: true, limit: 6 }),
      getPublishedProjects({ featured: true, limit: 3 }),
      getTeamMembers({ published: true, featured: true, limit: 4 }),
      getTestimonials({ published: true, featured: true, limit: 12 }),
    ]);

  const services = servicesRes.success ? servicesRes.data : [];
  const projects = projectsRes.success ? projectsRes.data : [];
  const teamMembers = teamRes.success ? teamRes.data : [FOUNDER_INFO];
  const testimonials = testimonialsRes.success ? testimonialsRes.data : [];

  return (
    <div className="relative overflow-hidden bg-[#09090b]">
      {/* Cinematic Ambient Mesh & Grid Background */}
      <CyberGlowMesh intensity="medium" />
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

      {/* ========================================================
          1. HERO SECTION: Editorial Authority & Visual Preview
      ======================================================== */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            {/* System Telemetry Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-lg border-glow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
                RIZMEC // SOFTWARE ENGINEERING &amp; INTELLIGENT AUTOMATION
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-chrome">
              Engineering Digital <br />
              <span className="text-neutral-400">Infrastructure for Modern Businesses.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed font-sans">
              From custom business software to intelligent automation, Rizmec builds practical technology solutions that help organizations operate smarter and scale.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm"
              >
                <span>Explore Our Work</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Preview */}
          <HeroTerminalVisual />
        </div>

        {/* Hero Architectural Credibility Strip */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Production Architecture
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              Reliable by Design
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Automated backups, monitoring &amp; recovery
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Engineering Delivery
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              Founder-Led
            </div>
            <div className="text-child text-[11px] text-neutral-500 mt-1">
              Direct architectural oversight &amp; code quality
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Modern Deployment
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              Cloud &amp; VPS Ready
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Scalable, cost-effective infrastructure
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Security Practices
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              Security-Conscious
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Role-based access, encryption &amp; privacy
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. POSITIONING & PHILOSOPHY: From Algorithms to Engineered Intelligence
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              // Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              From algorithms to engineered intelligence.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
              We reject brittle software templates and superficial AI novelties.
              Sustainable business software demands clean architectural discipline,
              verifiable database integrity, and dependable long-term engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TiltCard maxTilt={10} glareOpacity={0.18}>
              <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Custom Engineering
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Type-safe TypeScript, clean modular architectures, and scalable full-stack codebases tailored to your exact operational requirements.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>01</span>
                  <span>/</span>
                  <span>CLEAN_CODE</span>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={10} glareOpacity={0.18}>
              <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Practical AI &amp; Automation
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Integrating document extraction, workflow triggers, and domain-constrained AI assistants that eliminate manual bottlenecks and save hours.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>02</span>
                  <span>/</span>
                  <span>OPERATIONAL_ROI</span>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={10} glareOpacity={0.18}>
              <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Reliable Architecture
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Cloud and VPS deployment architectures configured with continuous monitoring, automated backups, and structured schema migrations.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>03</span>
                  <span>/</span>
                  <span>STABLE_UPTIME</span>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={10} glareOpacity={0.18}>
              <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Data Protection &amp; Security
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Granular role-based permissions (RBAC), tamper-evident audit logs, encrypted tokens, and strict input validation across all server endpoints.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>04</span>
                  <span>/</span>
                  <span>DATA_GOVERNANCE</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CORE SERVICES (Custom Software, Platforms, AI Automation)
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              // Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 text-chrome">
              Engineering Disciplines
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.02] text-xs font-mono text-neutral-300 uppercase tracking-wider btn-glow-outline"
          >
            <span>View All Capabilities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service: any) => {
            const icon = iconMap[service.iconName] || (
              <Terminal className="w-5 h-5 text-white" />
            );
            return (
              <TiltCard key={service.slug} maxTilt={8} glareOpacity={0.14}>
                <Link
                  href={`/services/${service.slug}`}
                  className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl hover:border-white/30 transition-all flex flex-col justify-between space-y-6 h-full group"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {icon}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs font-mono text-neutral-400 mt-1">
                        {service.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                    <span>Inspect Capability</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. INDUSTRY SPECIALIZATION: Education Technology
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Specialization Context */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                // Initial Market Specialization
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
                Education Technology &amp; Partner Portals
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
                Rizmec specializes in building custom business platforms for international student recruitment agencies, education consultancies, and multi-tier agent networks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Student Application Pipeline
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Stage-by-stage application tracking from initial lead intake to university offer and visa issuance.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Agent &amp; Sub-Agent Portals
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Hierarchical partner portals with role-based access, document uploads, and application visibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Document Verification
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Structured document checklists, intake validation, and status reminders to prevent enrollment delays.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Commission Reconciliation
                  </div>
                  <p className="text-xs text-neutral-400 font-sans">
                    Automated partner commission calculations, payout tracking, and financial status reporting.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
                >
                  <span>Discuss EdTech Requirements</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/work/education-partner-management-platform"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
                >
                  <span>View Case Study</span>
                </Link>
              </div>
            </div>

            {/* Right: Technical Diagram Card */}
            <div className="lg:col-span-5">
              <TiltCard maxTilt={6} glareOpacity={0.16}>
                <div className="p-8 rounded-3xl border border-white/15 bg-neutral-900/60 backdrop-blur-2xl space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>EDTECH_PLATFORM_ARCHITECTURE</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      MODULAR
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-neutral-300">
                    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                      <div className="text-white font-semibold flex items-center justify-between">
                        <span>Central Administration Portal</span>
                        <span className="text-[10px] text-cyan-400">Master Level</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Application overview, staff assignment, commission rules, and executive reports.
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                      <div className="text-white font-semibold flex items-center justify-between">
                        <span>Partner &amp; Agent Network</span>
                        <span className="text-[10px] text-emerald-400">Multi-Tier</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Partner agent accounts, branch sub-agents, application submissions, and payout ledgers.
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                      <div className="text-white font-semibold flex items-center justify-between">
                        <span>Student Admission Workflow</span>
                        <span className="text-[10px] text-amber-400">Stage Engine</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Document uploads, condition checks, university submission, and automated alerts.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                    <span>Tailored to Your Agency&apos;s Workflow</span>
                    <span className="text-emerald-400">Production Tested</span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED CASE STUDIES / WORK (Genuine Engineering Work)
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              // Engineering Case Studies
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2 text-chrome">
              Selected Projects &amp; Platforms
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.02] text-xs font-mono text-neutral-300 uppercase tracking-wider btn-glow-outline"
          >
            <span>All Case Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-12">
          {projects.map((project: any) => (
            <TiltCard key={project.slug} maxTilt={4} glareOpacity={0.12}>
              <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-2xl hover:border-white/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                    <span className="text-white uppercase font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      {project.clientName}
                    </span>
                    <span>//</span>
                    <span className="text-cyan-300">{project.industry}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-neutral-100">
                    {project.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    {project.summary}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    {(project.metrics || []).map((m: any) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="text-lg sm:text-xl font-bold text-white font-mono">
                          {m.value}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono uppercase mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-widest uppercase btn-shimmer btn-glow group/btn"
                    >
                      <span>Read Architectural Breakdown</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-950">
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
          6. ENGINEERING APPROACH (6-Step Methodology)
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              // Delivery Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              How We Engineer Software
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
              Every software project at Rizmec follows a disciplined 6-stage lifecycle — ensuring clear milestones, transparent communication, and reliable production handovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENGINEERING_APPROACH.map((step) => (
              <div
                key={step.step}
                className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="font-mono text-2xl font-black text-white text-chrome">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FOUNDER & LEADERSHIP PRESENTATION
      ======================================================== */}
      <section className="py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              // Engineering Leadership
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              Founder-Led Technical Delivery
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
              Rizmec is founded and led by N.I. Nazmul. We operate as a high-conviction software engineering company where the architect who scopes your requirements is directly involved in designing and delivering your solution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Founder Card */}
            <div className="lg:col-span-7">
              <TiltCard maxTilt={5} glareOpacity={0.14}>
                <div className="p-8 sm:p-10 rounded-3xl border border-white/15 bg-neutral-900/60 backdrop-blur-2xl space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 bg-neutral-950 shrink-0">
                      <img
                        src={FOUNDER_INFO.avatar}
                        alt={FOUNDER_INFO.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                          Active Founder &amp; Architect
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-1">
                        {FOUNDER_INFO.name}
                      </h3>
                      <p className="text-xs font-mono text-cyan-300 mt-0.5">
                        {FOUNDER_INFO.title}, {COMPANY_IDENTITY.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    {FOUNDER_INFO.bio}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Core Specializations
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FOUNDER_INFO.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded text-xs font-mono bg-white/5 text-neutral-200 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/p/${FOUNDER_INFO.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                    >
                      <span>View Founder Dossier</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                      <a
                        href={FOUNDER_INFO.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        GitHub
                      </a>
                      <span>/</span>
                      <a
                        href={FOUNDER_INFO.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Operating Model Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Direct Technical Accountability
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  No layers of sales reps, account managers, or outsourced junior developers. You work directly with senior engineering leadership on architecture and delivery.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-cyan-400" />
                  Agile Collaborator Model
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  For complex multi-stack engagements, our Founder leads architecture and code review while drawing upon a vetted network of specialized engineering contractors.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  International Client Experience
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Based in Dhaka, Bangladesh, we partner with businesses across the UK, Europe, Australia, and North America — providing clear English communication and synchronous delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. TESTIMONIALS (Marquee - rendered only if genuine verified reviews exist)
      ======================================================== */}
      {testimonials.length > 0 && (
        <TestimonialsMarquee testimonials={testimonials} />
      )}

      {/* ========================================================
          9. HOSTINGER OFFICIAL PARTNER — COMPACT CTA
      ======================================================== */}
      <section className="py-16 border-t border-white/10 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#673DE6]/15 via-[#09090b] to-[#673DE6]/10 p-6 sm:p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#673DE6]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hostinger Official Partner"
                  className="shrink-0"
                >
                  <img
                    src="/assets/hostinger/Badge_brand_dark_320×120.png"
                    alt="Hostinger Official Partner"
                    width="140"
                    height="52"
                    className="w-32 sm:w-36 h-auto hover:opacity-90 transition-opacity"
                  />
                </a>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#9D80F4] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RECOMMENDED CLOUD &amp; VPS HOSTING</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Reliable Cloud Hosting Partnered with Rizmec
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-xl">
                    Deploy your custom applications on optimized cloud and VPS hosting. Use coupon code <span className="text-white font-mono font-bold">RIZMEC</span> for exclusive partner discounts.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#673DE6] text-white font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow-purple group whitespace-nowrap w-full sm:w-auto"
                >
                  <span>Explore Hosting</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. VIDEO ADS & MEDIA SHOWCASE
      ======================================================== */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-500/[0.06] blur-[180px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-widest text-red-400 uppercase font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                // Video Content
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
                Our Video Ads &amp; Media
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg font-sans">
                Explore our curated collection of short-form reels and
                video content — engineered to present, demonstrate,
                and showcase digital products and software platforms.
              </p>
              <div className="pt-2">
                <Link
                  href="/ads"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
                >
                  <span>Explore Video Gallery</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Right: Video Preview Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Reel Preview */}
              <div className="rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden aspect-[9/16] relative group hover:border-red-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-red-500/80 group-hover:border-red-400/50 transition-all">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    Reel
                  </span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950" />
              </div>

              {/* Full Video Preview */}
              <div className="col-span-2 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden aspect-video relative group hover:border-red-500/30 transition-all self-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-red-500/80 group-hover:border-red-400/50 transition-all">
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    Video Showcase
                  </span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          11. FINAL COMMERCIAL CTA: Discuss Your Project
      ======================================================== */}
      <section className="py-28 border-t border-white/10 bg-black text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase">DIRECT ARCHITECTURAL CONSULTATION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight text-chrome">
            Have a Business Challenge Worth Engineering?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Tell us what you want to build, improve, or automate. Let&apos;s explore the right technical solution.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
            >
              <span>Start a Conversation</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm"
            >
              <span>Explore Capabilities</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
