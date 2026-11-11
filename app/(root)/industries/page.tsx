import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Layers,
} from "lucide-react";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { TiltCard } from "@/components/ui/TiltCard";

export const metadata: Metadata = {
  title: "Industries Served — Tailored Software & Engineering Infrastructure",
  description:
    "Explore the key industries Rizmec serves: Education Technology & Recruitment Consultancies, International SMEs, High-Growth Startups, and Professional Service Enterprises.",
  keywords: [
    "education technology",
    "student recruitment software",
    "SME software engineering",
    "startup technology partner",
    "custom enterprise software",
    "Rizmec industries",
  ],
  alternates: {
    canonical: "https://rizmec.com/industries",
  },
};

const industries = [
  {
    id: "education-technology",
    slug: "education-technology",
    title: "Education Technology & Recruitment Consultancies",
    tagline: "Flagship Specialization: Portals, Application Workflows & Commission Engines",
    description:
      "Purpose-built operations software for student recruitment agencies, admission consultancies, and multi-agent education networks. Eliminate messy spreadsheets, streamline sub-agent management, and automate document tracking.",
    features: [
      "Student application lifecycle tracking",
      "Multi-tier agent and sub-agent management",
      "Automated partner commission calculations",
      "Secure document verification vault",
    ],
    highlight: true,
    badge: "FLAGSHIP SPECIALIZATION",
    ctaText: "Explore Education Technology Solutions",
    ctaHref: "/industries/education-technology",
    icon: GraduationCap,
  },
  {
    id: "smes",
    slug: "smes",
    title: "International SMEs & Growing Businesses",
    tagline: "Custom Business Platforms, ERP & Operations Automation",
    description:
      "We replace fragmented off-the-shelf subscriptions with unified internal operating software. From quotation pipelines and invoice billing to inventory tracking and customer portals, we engineer systems that scale with your team.",
    features: [
      "Custom ERP & CRM development",
      "Client & partner self-service portals",
      "Automated billing & financial reporting",
      "Granular role-based access control",
    ],
    highlight: false,
    badge: "CORE ENGINEERING",
    ctaText: "Discuss Business Software",
    ctaHref: "/contact",
    icon: Briefcase,
  },
  {
    id: "startups",
    slug: "startups",
    title: "Startups & Emerging Technology Ventures",
    tagline: "MVP Architecture, SaaS Engineering & Scalable Foundations",
    description:
      "Transform validated concepts into production-grade digital products. We work directly with founders to architect high-performance web applications, API integrations, and robust database models built to withstand growth.",
    features: [
      "Full-stack Next.js & TypeScript architecture",
      "Production-ready authentication & billing loops",
      "API design & third-party integrations",
      "Maintainable codebase with clean documentation",
    ],
    highlight: false,
    badge: "PRODUCT ENGINEERING",
    ctaText: "Discuss Your MVP / Platform",
    ctaHref: "/contact",
    icon: Rocket,
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "E-Commerce & Digital Commerce Platforms",
    tagline: "High-Performance Transaction Flow & Inventory Synchronization",
    description:
      "Engineered commerce architectures with sub-second page loads, custom checkout flows, warehouse integrations, and localized payment gateway processing.",
    features: [
      "Custom catalog & order management workflows",
      "Multi-currency & localized payment processing",
      "Warehouse & logistics API synchronization",
      "Zero-layout-shift responsive shopping ergonomics",
    ],
    highlight: false,
    badge: "COMMERCE INFRASTRUCTURE",
    ctaText: "Discuss Commerce Solutions",
    ctaHref: "/contact",
    icon: ShoppingBag,
  },
];

export default function IndustriesOverviewPage() {
  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // Market Domains & Focus
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Industries We Engineer For.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          While our core engineering discipline applies across modern software systems, we specialize in high-impact operational domains where off-the-shelf tools fall short.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {industries.map((ind) => {
          const Icon = ind.icon;
          return (
            <TiltCard key={ind.id} maxTilt={5} glareOpacity={0.14}>
              <div
                className={`p-8 sm:p-10 rounded-2xl border backdrop-blur-xl flex flex-col justify-between h-full space-y-8 transition-all ${
                  ind.highlight
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-neutral-900/60 to-neutral-950 shadow-2xl"
                    : "border-white/10 bg-neutral-900/50 hover:border-white/25"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border font-semibold ${
                        ind.highlight
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 bg-white/5 text-neutral-300"
                      }`}
                    >
                      {ind.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {ind.title}
                    </h2>
                    <p className="text-xs font-mono text-cyan-300 mt-1">
                      {ind.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    {ind.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {ind.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2 text-xs text-neutral-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <Link
                    href={ind.ctaHref}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
                      ind.highlight
                        ? "bg-white text-black hover:bg-neutral-200 shadow-lg btn-shimmer btn-glow"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{ind.ctaText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Operating in a different industry domain?
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
            We regularly architect specialized internal software, data engines, and custom platforms across diverse commercial verticals. Let&apos;s review your specific requirements.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-all shrink-0 shadow-lg"
        >
          <span>Discuss Your Project</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

