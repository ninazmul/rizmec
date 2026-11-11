import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Layers, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/actions/product.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products & Platforms — Configurable Business Software & PartnerOS",
  description:
    "Explore Rizmec's flagship platform architectures and configurable business software solutions, including Rizmec PartnerOS for international education consultancies.",
  keywords: [
    "Rizmec products",
    "Rizmec PartnerOS",
    "education operations platform",
    "custom business software",
    "SaaS architecture",
  ],
  alternates: {
    canonical: "https://rizmec.com/products",
  },
};

export default async function ProductsCatalogPage() {
  const res = await getProducts({ published: true });
  const products = res.success ? res.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          // Platforms & Solution Architectures
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Configurable Platforms &amp; Engineered Systems.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          We identify recurring operational challenges across international businesses and engineer modular, configurable platform architectures that eliminate administrative drag.
        </p>
      </div>

      {/* ── FLAGSHIP PRODUCT SPOTLIGHT: RIZMEC PARTNEROS ── */}
      <div className="relative">
        <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-neutral-900/70 to-neutral-950 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  FLAGSHIP PLATFORM // EDUCATION OPERATIONS
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  CONFIGURABLE SOLUTION ARCHITECTURE
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Rizmec PartnerOS
                </h2>
                <p className="text-sm sm:text-base font-mono text-cyan-300 mt-1">
                  Unified Operations Platform for International Student Recruitment &amp; Consultancies
                </p>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl font-light">
                An extensible platform architecture designed to centralize student application pipelines, multi-tier agent and sub-agent hierarchies, commission milestone calculations, and compliance document verification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Student Application Kanban &amp; Table Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Agent &amp; Sub-Agent Commission Engine</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-Based Access Control (RBAC)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Centralized Document Vault &amp; Expiry Alerts</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/products/partneros"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-wider uppercase hover:bg-neutral-200 transition-all shadow-xl btn-shimmer btn-glow"
                >
                  <span>Explore PartnerOS Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  <span>Request Technical Scoping</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4 font-mono text-xs text-neutral-300">
              <div className="text-white font-bold uppercase tracking-wider text-xs pb-2 border-b border-white/10">
                10 Core Platform Modules
              </div>
              <ul className="space-y-2 text-[11px] text-neutral-400">
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">01</span> Student Management
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">02</span> Agent Management
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">03</span> Sub-Agent Management
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">04</span> Application Tracking
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">05</span> Document Management
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">06</span> Commission Engine
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">07</span> Granular RBAC
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">08</span> Business Reporting
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">09</span> Automated Alerts
                </li>
                <li className="flex items-center gap-2 text-neutral-200">
                  <span className="text-cyan-400 font-bold">10</span> AI Assisted Workflows
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Platforms / Additional Products */}
      <div className="space-y-8 relative">
        <div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            // Custom Engineered Platforms
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1 text-chrome">
            Bespoke Enterprise Software Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TiltCard maxTilt={6} glareOpacity={0.14}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Custom Business ERP &amp; CRM
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Unified platforms connecting customer records, multi-currency quotations, electronic acceptance snapshots, and automated invoice delivery.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/services#custom-software"
                  className="text-xs font-mono text-cyan-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore ERP Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.14}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Client &amp; Partner Self-Service Portals
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Secure extranet environments where external partners, contractors, or clients can upload files, monitor status, and review agreements.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/services#custom-software"
                  className="text-xs font-mono text-cyan-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Portal Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.14}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Intelligent Workflow &amp; Event Engines
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Asynchronous worker queues, document data extraction, and webhook integrations that synchronize data across multi-vendor tools.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/services#ai-automation"
                  className="text-xs font-mono text-cyan-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Automation Engines</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 space-y-6 max-w-2xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
          Need a Custom Platform Engineered?
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Tell us about your operational requirements, user roles, and business goals. Let&apos;s architect the right software solution.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase btn-shimmer btn-glow shadow-xl hover:bg-neutral-200 transition-all"
          >
            <span>Discuss Your Platform</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
