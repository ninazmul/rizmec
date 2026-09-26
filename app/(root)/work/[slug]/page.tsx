import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowUpRight,
  ArrowLeft,
  ExternalLink,
  Globe,
  Layers,
  Zap,
  Users,
  Quote,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { getPublishedProjectBySlug } from "@/lib/actions/project.actions";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublishedProjectBySlug(slug);
  if (!res.success || !res.data) {
    return { title: "Case Study Not Found" };
  }
  return {
    title: `${res.data.title} — RIZMEC Engineering Case Study`,
    description: res.data.summary,
    openGraph: {
      title: `${res.data.title} — RIZMEC Engineering Case Study`,
      description: res.data.summary,
      images: res.data.thumbnail ? [{ url: res.data.thumbnail }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getPublishedProjectBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const project = res.data;

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 relative overflow-hidden pt-32 sm:pt-36 pb-24">
      {/* Background Cyber Glow */}
      <CyberGlowMesh intensity="low" />

      {/* ── TOP NAV / BACK BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors backdrop-blur-md bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full hover:border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>All Case Studies</span>
        </Link>
      </div>

      {/* ── HERO SPLIT SECTION: METADATA & 1:1 SHOWCASE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Project Narrative & Actions */}
          <div
            className={`${project.thumbnail ? "lg:col-span-7" : "lg:col-span-12"} space-y-6`}
          >
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-semibold uppercase tracking-wider">
                {project.clientName}
              </span>
              <span className="text-white/20">//</span>
              <span className="text-cyan-400 font-mono tracking-wide">
                {project.industry}
              </span>
              {project.completionDate && (
                <>
                  <span className="text-white/20 hidden sm:inline">//</span>
                  <span className="text-neutral-400 font-mono hidden sm:inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    {project.completionDate}
                  </span>
                </>
              )}
              {project.status && (
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${
                    project.status === "completed"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : project.status === "in_progress"
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                        : "bg-neutral-500/10 border-neutral-500/30 text-neutral-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      project.status === "completed"
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-cyan-400"
                    }`}
                  />
                  {project.status.replace("_", " ")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-chrome">
              {project.title}
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl">
              {project.summary}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 hover:shadow-cyan-500/20"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Live App</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <span>Start Similar Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>

            {/* Quick Tech Preview */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="pt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mr-1">
                  Stack:
                </span>
                {project.technologies.slice(0, 5).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-neutral-300 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="text-[10px] font-mono text-neutral-500">
                    +{project.technologies.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Column: 1:1 Image Showcase Card (Anchored next to text) */}
          {project.thumbnail && (
            <div className="lg:col-span-5 relative">
              {/* Radial glow background */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

              {/* Hardware/Card Frame */}
              <div className="relative rounded-2xl border border-white/15 bg-neutral-950/90 backdrop-blur-xl overflow-hidden shadow-2xl p-3 sm:p-4 space-y-3">
                {/* Micro-header bar */}
                <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-400/90 tracking-widest uppercase text-[10px]">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>1:1 Production Spec</span>
                  </div>
                </div>

                {/* 1:1 Aspect Container — shows full uncropped image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900/60 border border-white/10 flex items-center justify-center group">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Micro-footer bar */}
                <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-mono text-neutral-500">
                  <span className="truncate max-w-[200px]">
                    {project.clientName}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── METRICS BAR ── */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            {project.metrics.map((m: any, i: number) => (
              <div
                key={m.label || i}
                className="bg-neutral-950 p-6 space-y-1.5 group hover:bg-neutral-900/80 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  {m.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                  {m.value}
                </div>
                {m.change && (
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <span>↑</span>
                    <span>{m.change}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT: NARRATIVE & SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── LEFT: Narrative Deep-Dive ── */}
          <div className="lg:col-span-8 space-y-12">
            {/* Challenge */}
            {project.challenge && (
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-rose-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    The Architectural Challenge
                  </h2>
                </div>
                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light pl-4 border-l border-white/10">
                  {project.challenge}
                </p>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-cyan-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    The Engineering Solution
                  </h2>
                </div>
                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light pl-4 border-l border-white/10">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Results */}
            {project.results && (
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Quantified Results
                  </h2>
                </div>
                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light pl-4 border-l border-white/10">
                  {project.results}
                </p>
              </div>
            )}

            {/* Gallery / System Architecture */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                    System Architecture & Telemetry
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-xl group aspect-square flex items-center justify-center p-3"
                    >
                      <img
                        src={img}
                        alt={`${project.title} — Architecture view ${idx + 1}`}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial with First Letter Avatar Fallback */}
            {project.testimonial?.quote && (
              <div className="relative p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl overflow-hidden shadow-xl">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5" />
                <p className="text-lg text-neutral-200 italic leading-relaxed relative z-10">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 relative z-10">
                  {project.testimonial.avatar &&
                  !project.testimonial.avatar.includes("placeholder") ? (
                    <img
                      src={project.testimonial.avatar}
                      alt={project.testimonial.author}
                      className="w-10 h-10 rounded-full object-cover border border-white/15"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-purple-600/25 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-xs font-bold text-cyan-300 uppercase">
                        {project.testimonial.author?.charAt(0) ?? "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">
                      {project.testimonial.author}
                    </div>
                    <div className="text-xs font-mono text-neutral-400">
                      {project.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live App Card */}
            {project.liveUrl && (
              <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Deployment</span>
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/25 transition-all group font-mono text-xs font-semibold"
                >
                  <span className="truncate">
                    {project.liveUrl.replace(/^https?:\/\//, "")}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                </a>
              </div>
            )}

            {/* Engineering Squad */}
            {project.teamMemberIds && project.teamMemberIds.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  <span>Engineering Squad</span>
                </div>
                <div className="space-y-3">
                  {project.teamMemberIds.map((m: any) => (
                    <Link
                      key={m._id || m.slug}
                      href={`/p/${m.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
                    >
                      <img
                        src={m.avatar || "/assets/images/rizmec-icon.png"}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-cyan-400/40 transition-all"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {m.name}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 truncate">
                          {m.title}
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-cyan-400 ml-auto shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t: string) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-neutral-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {project.services && project.services.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  Services Delivered
                </div>
                <ul className="space-y-2">
                  {project.services.map((s: string) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm text-neutral-300 font-light"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Initiate Project Card */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-6 space-y-4">
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Interested in a similar high-performance solution for your
                organization?
              </p>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg hover:shadow-cyan-500/10"
              >
                <span>Initiate Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
