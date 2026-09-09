import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, Cpu, Server, Globe, Layers, Workflow, Terminal } from "lucide-react";
import { getServices } from "@/lib/actions/service.actions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Disciplines & Capabilities — RIZMEC",
  description:
    "Explore RIZMEC's full technical capability matrix: Applied AI, Distributed Cloud Infrastructure, High-Throughput Web Apps, Enterprise SaaS, and Native Mobile Systems.",
};

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6 text-white" />,
  Server: <Server className="w-6 h-6 text-white" />,
  Globe: <Globe className="w-6 h-6 text-white" />,
  Layers: <Layers className="w-6 h-6 text-white" />,
  Workflow: <Workflow className="w-6 h-6 text-white" />,
  Terminal: <Terminal className="w-6 h-6 text-white" />,
};

export default async function ServicesCatalogPage() {
  const res = await getServices({ published: true });
  const services = res.success ? res.data : [];

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Capability Taxonomy
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Engineering disciplines built for mission-critical scale.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          From deterministic AI pipelines to multi-region cloud meshes, explore the core technical disciplines RIZMEC deploys for international enterprise partners.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service: any) => {
          const icon = iconMap[service.iconName] || <Terminal className="w-6 h-6 text-white" />;
          return (
            <div
              key={service.slug}
              className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-neutral-950 hover:border-white/30 transition-all flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                    {icon}
                  </div>
                  <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                    SLA 99.999%
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {service.title}
                  </h2>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    {service.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {(service.features || []).slice(0, 3).map((f: any) => (
                    <div key={f.title} className="text-xs text-neutral-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                      <span>{f.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {(service.technologies || []).slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-400 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono text-white tracking-widest uppercase hover:underline"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
