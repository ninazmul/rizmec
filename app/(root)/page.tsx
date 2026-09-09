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
  Shield,
  Activity,
  Code2,
  Workflow,
  Sparkles,
  ChevronRight,
  Database,
  Lock,
} from "lucide-react";
import { getServices } from "@/lib/actions/service.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { getTestimonials } from "@/lib/actions/testimonial.actions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RIZMEC — Intelligence. Engineered.",
  description:
    "RIZMEC is a premier global technology engineering company. We architect, build, and operate mission-critical software systems, autonomous AI pipelines, and distributed cloud platforms.",
};

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-white" />,
  Server: <Server className="w-5 h-5 text-white" />,
  Globe: <Globe className="w-5 h-5 text-white" />,
  Layers: <Layers className="w-5 h-5 text-white" />,
  Workflow: <Workflow className="w-5 h-5 text-white" />,
  Terminal: <Terminal className="w-5 h-5 text-white" />,
};

export default async function HomePage() {
  const [servicesRes, productsRes, projectsRes, teamRes, testimonialsRes] =
    await Promise.all([
      getServices({ published: true, limit: 6 }),
      getProducts({ published: true, limit: 4 }),
      getProjects({ published: true, featured: true, limit: 3 }),
      getTeamMembers({ published: true, featured: true, limit: 4 }),
      getTestimonials({ published: true, featured: true, limit: 3 }),
    ]);

  const services = servicesRes.success ? servicesRes.data : [];
  const products = productsRes.success ? productsRes.data : [];
  const projects = projectsRes.success ? projectsRes.data : [];
  const teamMembers = teamRes.success ? teamRes.data : [];
  const testimonials = testimonialsRes.success ? testimonialsRes.data : [];

  return (
    <div className="relative overflow-hidden bg-[#09090b]">
      {/* Subtle algorithmic background grid */}
      <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.015] blur-[160px] pointer-events-none rounded-full" />

      {/* ========================================================
          1. HERO SECTION: Cinematic Editorial Authority
      ======================================================== */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 max-w-4xl">
          {/* System Telemetry Badge */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
              GLOBAL TECHNOLOGY ENGINEERING
            </span>
            <span className="text-neutral-600">|</span>
            <span className="font-mono text-xs text-neutral-400">
              P99 &lt; 15MS
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]">
            Intelligence. <br />
            <span className="text-neutral-400">Engineered.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-2xl text-neutral-400 font-light max-w-2xl leading-relaxed">
            From algorithms to intelligent systems. We architect, build, and
            deploy mission-critical software, autonomous neural pipelines, and
            zero-downtime distributed infrastructure for the world's most
            demanding enterprises.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all group"
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
            >
              <span>Explore Case Studies</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </div>

        {/* Hero Architectural Architecture Telemetry Strip */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          <div>
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Scale Reliability
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              99.999%
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Fault-tolerant distributed SLA
            </div>
          </div>
          <div>
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Algorithmic Throughput
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              2.4M RPS
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              P99 sub-millisecond edge latency
            </div>
          </div>
          <div>
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Global Deployments
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              40+ Clusters
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Multi-region active-active topology
            </div>
          </div>
          <div>
            <div className="text-neutral-400 uppercase tracking-wider mb-1">
              Deterministic AI
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              100% Guardrailed
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Audit-ready agentic execution
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. POSITIONING & PHILOSOPHY: The 4 Pillars
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
              From algorithms to intelligent systems.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mt-4">
              We reject brittle software templates and superficial AI wrappers.
              Real international enterprise engineering demands mathematical
              precision, zero-trust security, and deterministic resiliency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Precision Engineering
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strict type safety, static memory guarantees, and formal
                verification preventing catastrophic production regressions.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Deterministic AI
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Converting probabilistic neural outputs into bounded,
                grammar-constrained, audit-verifiable transactional events.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                <Server className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Distributed Resiliency
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Multi-region Kubernetes mesh topologies surviving data center
                outages with automated sub-3-second failover.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Zero-Trust Security
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hardware-backed cryptographic authorization, mTLS service
                isolation, and immutable tamper-evident audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DYNAMIC SERVICES & CAPABILITIES
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
              Engineering Disciplines
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>View All Capabilities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => {
            const icon = iconMap[service.iconName] || (
              <Terminal className="w-5 h-5 text-white" />
            );
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative p-8 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                      {icon}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-neutral-200">
                    {service.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap gap-1.5">
                  {(service.technologies || [])
                    .slice(0, 4)
                    .map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. DYNAMIC PRODUCTS & PLATFORMS
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                // Internal Platforms
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
                Engineered Platforms & SaaS
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>Explore All Platforms</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product: any) => (
              <div
                key={product.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.01] overflow-hidden hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div className="p-8 sm:p-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-300">
                      {product.category}
                    </span>
                    <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                      {product.status === "active"
                        ? "PRODUCTION READY"
                        : "BETA"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {product.title}
                    </h3>
                    <p className="text-sm font-mono text-neutral-400 mt-1">
                      {product.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {product.summary}
                  </p>

                  <div className="space-y-2">
                    {(product.features || [])
                      .slice(0, 3)
                      .map((feat: string) => (
                        <div
                          key={feat}
                          className="flex items-start gap-2.5 text-xs text-neutral-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-8 sm:p-10 pt-0 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(product.techStack || []).slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-neutral-400 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 text-white font-mono text-xs hover:bg-white hover:text-black transition-all"
                  >
                    <span>Inspect Platform</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED CASE STUDIES / WORK
      ======================================================== */}
      <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Proven Track Record
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
              Selected Case Studies
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>All Case Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-12">
          {projects.map((project: any) => (
            <div
              key={project.slug}
              className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="text-white uppercase font-bold">
                    {project.clientName}
                  </span>
                  <span>//</span>
                  <span>{project.industry}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {project.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {project.summary}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {(project.metrics || []).map((m: any) => (
                    <div key={m.label}>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">
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
                    className="inline-flex items-center gap-2 text-xs font-mono text-white tracking-widest uppercase hover:underline"
                  >
                    <span>Read Architectural Breakdown</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. LEADERSHIP & PRINCIPAL ENGINEERS
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                // Human Capital
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
                Engineering Leadership
              </h2>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>Meet The Entire Squad</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member: any) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group p-6 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neutral-200">
                      {member.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      {member.title}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {member.tagline || member.bio}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span>View Full Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. VERIFIED ENTERPRISE TESTIMONIALS
      ======================================================== */}
      {testimonials.length > 0 && (
        <section className="py-24 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Client Validation
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
              Verified Partner Feedback
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t: any) => (
              <div
                key={t._id}
                className="p-8 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between space-y-6"
              >
                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 grayscale"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {t.clientName}
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      {t.position}, {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          8. HOSTINGER OFFICIAL PARTNER — EXCLUSIVE 20% OFF
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#673DE6]/15 via-[#09090b] to-[#09090b] p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#673DE6]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#673DE6]/40 bg-[#673DE6]/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#673DE6] animate-pulse" />
                  <span className="font-mono text-[11px] tracking-widest text-[#9D80F4] uppercase font-semibold">
                    OFFICIAL HOSTINGER PARTNER
                  </span>
                </div>
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-fit"
                  aria-label="Visit Hostinger Official Partner Page"
                >
                  <img
                    src="/assets/hostinger/badge-brand-dark-640x240.webp"
                    alt="Hostinger Official Partner Badge"
                    width="320"
                    height="120"
                    className="w-64 sm:w-72 h-auto opacity-100 hover:opacity-90 transition-opacity"
                  />
                </a>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Deploy faster. Scale further.
                  <br />
                  <span className="text-[#9D80F4]">Save 20% as our guest.</span>
                </h3>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg font-sans">
                  RIZMEC and Hostinger have partnered to deliver
                  enterprise-grade hosting at startup-friendly prices. Use our
                  exclusive referral link or apply code{" "}
                  <span className="text-white font-bold font-mono">RIZMEC</span>{" "}
                  at checkout for an extra 20% off your first purchase.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#673DE6] text-white font-semibold text-xs tracking-widest uppercase hover:bg-[#5A32CC] active:scale-95 transition-all shadow-lg shadow-[#673DE6]/20 group"
                  >
                    <span>Claim Your 20% Discount</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <div className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 bg-white/[0.03]">
                    <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
                      PROMO CODE
                    </span>
                    <span className="font-mono text-sm font-black text-white tracking-widest select-all">
                      RIZMEC
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 max-w-md">
                  <div className="space-y-0.5">
                    <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      99.9%
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-500 font-mono uppercase tracking-wider">
                      Uptime SLA
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      24/7
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-500 font-mono uppercase tracking-wider">
                      Expert Support
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      30d
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-500 font-mono uppercase tracking-wider">
                      Money-Back
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 relative">
                <div className="relative rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400">
                        hostinger.com/checkout?REFERRALCODE=
                        <span className="text-[#9D80F4]">RIZMEC</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
                      <div>
                        <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                          Partner Exclusive Bundle
                        </div>
                        <div className="text-lg font-bold text-white">
                          Business Web Hosting — 48 Months
                        </div>
                        <div className="text-xs font-mono text-neutral-400 mt-1">
                          Free Domain • SSL • Daily Backups • CDN
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-[#673DE6]/20 text-[#673DE6] text-[10px] font-bold font-mono uppercase border border-[#673DE6]/30">
                        Partner Deal
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-400 font-mono text-xs">
                          Standard Retail Price
                        </span>
                        <span className="text-neutral-500 line-through font-mono text-xs">
                          $11.99/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-300 font-mono text-xs">
                          Hostinger Regular Promo
                        </span>
                        <span className="text-neutral-300 font-mono text-xs">
                          $3.99/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-3 rounded-lg border border-[#673DE6]/30 bg-[#673DE6]/10">
                        <span className="text-white font-bold font-mono text-xs uppercase tracking-wider">
                          RIZMEC Partner Price (code{" "}
                          <span className="text-[#9D80F4]">RIZMEC</span>)
                        </span>
                        <span className="text-[#9D80F4] font-black font-mono text-lg tracking-tight">
                          $3.19/mo
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                          You Save
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                          EXTRA 20% OFF
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
                        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                          Applies To
                        </div>
                        <div className="text-sm font-bold text-white font-sans">
                          First Purchase (any plan)
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#673DE6] text-white font-bold font-mono text-xs tracking-widest uppercase hover:bg-[#5A32CC] active:scale-[0.99] transition-all group"
                    >
                      <span>Activate RIZMEC x Hostinger Deal</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <p className="text-center text-[10px] text-neutral-500 font-mono leading-relaxed">
                      Discount automatically applied via referral link.
                      Otherwise use code{" "}
                      <span className="text-white font-bold select-all">
                        RIZMEC
                      </span>{" "}
                      during checkout. Valid for new customers only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. HIGH-IMPACT ENTERPRISE ENGAGEMENT CTA
      ======================================================== */}
      <section className="py-24 border-t border-white/10 bg-black text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
            // NEXT STEPS
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Ready to engineer your next technological leap?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you require an autonomous neural architecture, a
            multi-region distributed cluster, or a mission-critical platform
            overhaul, our engineering teams are ready.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all group"
            >
              <span>Initiate Technical Scoping</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
            >
              <span>Explore Capability Matrix</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
