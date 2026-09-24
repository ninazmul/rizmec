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
} from "lucide-react";
import { getProjectBySlug } from "@/lib/actions/project.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);
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
  const res = await getProjectBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const project = res.data;

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100">

      {/* ── BACK NAV ── */}
      <div className="pt-8 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white uppercase tracking-wider transition-colors backdrop-blur-sm bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>All Case Studies</span>
        </Link>
      </div>

      {/* ── HERO IMAGE — full 1:1 uncropped ── */}
      {project.thumbnail && (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* ── PROJECT HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-10 pb-4 space-y-4">
        {/* Breadcrumb meta */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest">
          <span className="text-white/80 font-bold">{project.clientName}</span>
          <span className="text-white/20">·</span>
          <span>{project.industry}</span>
          {project.completionDate && (
            <>
              <span className="text-white/20">·</span>
              <span>Completed {project.completionDate}</span>
            </>
          )}
          {project.status && (
            <>
              <span className="text-white/20">·</span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                  project.status === "completed"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : project.status === "in_progress"
                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                    : "bg-neutral-500/15 border-neutral-500/30 text-neutral-400"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-lg shadow-white/10"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live App</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-semibold uppercase tracking-widest hover:bg-white/15 transition-all"
          >
            <span>Start Similar Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 space-y-16">

        {/* Metrics Bar */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
            {project.metrics.map((m: any, i: number) => (
              <div
                key={m.label || i}
                className="bg-neutral-950 p-6 space-y-1.5 group hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <Zap className="w-3 h-3 text-cyan-500" />
                  {m.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                  {m.value}
                </div>
                {m.change && (
                  <div className="text-xs text-emerald-400 font-mono">{m.change}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Narrative + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── LEFT: Narrative ── */}
          <div className="lg:col-span-8 space-y-12">

            {/* Challenge */}
            {project.challenge && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-rose-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    The Architectural Challenge
                  </h2>
                </div>
                <p className="text-neutral-400 text-base leading-relaxed font-light pl-4 border-l border-white/5">
                  {project.challenge}
                </p>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-cyan-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    The Engineering Solution
                  </h2>
                </div>
                <p className="text-neutral-400 text-base leading-relaxed font-light pl-4 border-l border-white/5">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Results */}
            {project.results && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-emerald-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Quantified Results
                  </h2>
                </div>
                <p className="text-neutral-400 text-base leading-relaxed font-light pl-4 border-l border-white/5">
                  {project.results}
                </p>
              </div>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                    System Architecture & Telemetry
                  </h3>
                </div>
                <div className="space-y-4">
                  {project.gallery.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-xl"
                    >
                      <img
                        src={img}
                        alt={`${project.title} — Architecture view ${idx + 1}`}
                        className="w-full h-auto object-contain bg-neutral-950"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {project.testimonial?.quote && (
              <div className="relative p-8 sm:p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5" />
                <p className="text-lg text-neutral-200 italic leading-relaxed relative z-10">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 relative z-10">
                  {project.testimonial.avatar ? (
                    <img
                      src={project.testimonial.avatar}
                      alt={project.testimonial.author}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full border border-white/10 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white uppercase">
                        {project.testimonial.author?.charAt(0) ?? "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">{project.testimonial.author}</div>
                    <div className="text-xs font-mono text-neutral-400">{project.testimonial.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Live App Card */}
            {project.liveUrl && (
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Deployment</span>
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all group font-mono text-xs"
                >
                  <span className="truncate">{project.liveUrl.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}

            {/* Engineering Squad */}
            {project.teamMemberIds && project.teamMemberIds.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-5">
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
                        src={m.avatar || "/assets/images/placeholder.webp"}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-white/30 transition-all"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {m.name}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 truncate">{m.title}</div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-cyan-400 ml-auto shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
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
              <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  Services Delivered
                </div>
                <ul className="space-y-2">
                  {project.services.map((s: string) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-neutral-300 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Interested in a similar solution for your organization?
              </p>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all"
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
