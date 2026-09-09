import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Terminal, ArrowLeft } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/actions/service.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getServiceBySlug(slug);
  if (!res.success || !res.data) {
    return { title: "Service Not Found" };
  }
  return {
    title: `${res.data.title} — RIZMEC Engineering`,
    description: res.data.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getServiceBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const service = res.data;

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Breadcrumb & Navigation */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Capabilities</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-4xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Capability Dossier
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          {service.title}
        </h1>
        <p className="text-xl sm:text-2xl text-neutral-400 font-light leading-relaxed">
          {service.tagline}
        </p>
      </div>

      {/* Overview & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Architectural Overview
          </h2>
          <div className="text-neutral-400 leading-relaxed space-y-4 font-sans text-base sm:text-lg font-light">
            <p>{service.fullDescription || service.shortDescription}</p>
          </div>

          {/* Detailed Features */}
          <div className="space-y-6 pt-8">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Core Technical Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(service.features || []).map((feat: any) => (
                <div
                  key={feat.title}
                  className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-2"
                >
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          {service.process && service.process.length > 0 && (
            <div className="space-y-6 pt-8">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Engineering Methodology & Lifecycle
              </h3>
              <div className="space-y-4">
                {service.process.map((step: any) => (
                  <div
                    key={step.step}
                    className="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex items-start gap-6"
                  >
                    <span className="font-mono text-xl font-black text-white">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white">{step.title}</h5>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Deliverables & Tech */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Deliverables
            </h3>
            <ul className="space-y-3">
              {(service.deliverables || []).map((item: string) => (
                <li key={item} className="flex items-start gap-3 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {(service.technologies || []).map((t: string) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                <span>Engage Squad</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
