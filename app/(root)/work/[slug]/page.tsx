import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowUpRight, ArrowLeft, CheckCircle2 } from "lucide-react";
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
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Navigation */}
      <div>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Case Studies</span>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="text-white uppercase font-bold">{project.clientName}</span>
          <span>//</span>
          <span>{project.industry}</span>
          {project.completionDate && (
            <>
              <span>//</span>
              <span>COMPLETED: {project.completionDate}</span>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          {project.title}
        </h1>
        <p className="text-xl sm:text-2xl text-neutral-400 font-light leading-relaxed">
          {project.summary}
        </p>
      </div>

      {/* Verified Metrics Hero Bar */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-neutral-950 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {project.metrics.map((m: any) => (
            <div key={m.label} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">{m.value}</div>
              <div className="text-xs font-mono text-neutral-400 uppercase">{m.label}</div>
              {m.change && (
                <div className="text-xs text-emerald-400 font-mono mt-1">{m.change}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Narrative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        <div className="lg:col-span-8 space-y-12">
          {/* Challenge */}
          {project.challenge && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">The Architectural Challenge</h2>
              <p className="text-neutral-400 text-base leading-relaxed font-light">
                {project.challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">The Engineering Solution</h2>
              <p className="text-neutral-400 text-base leading-relaxed font-light">
                {project.solution}
              </p>
            </div>
          )}

          {/* Results */}
          {project.results && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Quantified Results & Production Alpha</h2>
              <p className="text-neutral-400 text-base leading-relaxed font-light">
                {project.results}
              </p>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                System Telemetry & Architecture
              </h3>
              <div className="space-y-4">
                {project.gallery.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900"
                  >
                    <img src={img} alt="Architecture view" className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial Quote */}
          {project.testimonial?.quote && (
            <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
              <p className="text-lg text-neutral-200 italic leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div className="text-sm font-bold text-white">
                {project.testimonial.author}
                <span className="block text-xs font-mono text-neutral-400 font-normal">
                  {project.testimonial.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Assigned Engineers & Stack */}
        <div className="lg:col-span-4 space-y-8">
          {/* Assigned Engineers */}
          {project.teamMemberIds && project.teamMemberIds.length > 0 && (
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Engineering Squad
              </h3>
              <div className="space-y-4">
                {project.teamMemberIds.map((m: any) => (
                  <Link
                    key={m._id || m.slug}
                    href={`/p/${m.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <img
                      src={m.avatar || "/assets/images/placeholder.webp"}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover grayscale"
                    />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-neutral-200">
                        {m.name}
                      </div>
                      <div className="text-xs font-mono text-neutral-400">{m.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stack & Services */}
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Technologies Utilized
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((t: string) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                <span>Initiate Similar Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
