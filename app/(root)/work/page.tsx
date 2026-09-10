import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/actions/project.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Portfolio & Case Studies — RIZMEC",
  description:
    "Explore RIZMEC's verified engineering case studies across quantitative finance, healthcare telemetry, global logistics, and autonomous systems.",
};

export default async function WorkCatalogPage() {
  const res = await getProjects({ published: true });
  const projects = res.success ? res.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          // Production Case Studies
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Verified systems engineered for real-world impact.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Explore our architectural engagements across Tier-1 financial
          institutions, healthcare research consortia, and aerospace logistics
          leaders.
        </p>
      </div>

      {/* Projects List with 3D Tilt */}
      <div className="space-y-12 relative">
        {projects.map((project: any) => (
          <TiltCard key={project.slug} maxTilt={4} glareOpacity={0.12}>
            <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-2xl hover:border-white/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="text-white uppercase font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    {project.clientName}
                  </span>
                  <span>//</span>
                  <span className="text-cyan-300">{project.industry}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
                  {project.title}
                </h2>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {project.summary}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {(project.metrics || []).map((m: any) => (
                    <div key={m.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">
                        {m.value}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono uppercase mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-widest uppercase btn-shimmer btn-glow group/btn"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 shadow-2xl">
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
    </div>
  );
}
