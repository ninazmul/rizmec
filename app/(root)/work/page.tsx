import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/actions/project.actions";

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
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Production Case Studies
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Verified systems engineered for real-world impact.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Explore our architectural engagements across Tier-1 financial institutions, healthcare research consortia, and aerospace logistics leaders.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-12">
        {projects.map((project: any) => (
          <div
            key={project.slug}
            className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-neutral-950 hover:border-white/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                <span className="text-white uppercase font-bold">{project.clientName}</span>
                <span>//</span>
                <span>{project.industry}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {project.summary}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {(project.metrics || []).map((m: any) => (
                  <div key={m.label}>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">{m.value}</div>
                    <div className="text-[11px] text-neutral-400 font-mono uppercase mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
