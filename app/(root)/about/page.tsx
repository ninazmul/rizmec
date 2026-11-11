import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Cpu, Code2, Globe2, Sparkles, Terminal, CheckCircle2 } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { COMPANY_IDENTITY, FOUNDER_INFO } from "@/constants/verifiedData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About RIZMEC — Software Engineering Philosophy & Architecture",
  description:
    "Learn about RIZMEC's founder-led software engineering company, our architectural principles, capabilities, and commitment to building reliable digital infrastructure for modern businesses.",
  keywords: [
    "About RIZMEC",
    "RIZMEC software engineering",
    "founder-led software company",
    "custom software development",
    "business web applications",
    "software company Bangladesh",
  ],
  alternates: {
    canonical: "https://rizmec.com/about",
  },
};

export default async function AboutPage() {
  const teamRes = await getTeamMembers({ published: true });
  const teamMembers = teamRes.success && teamRes.data?.length > 0 ? teamRes.data : [FOUNDER_INFO];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // About RIZMEC
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Engineering digital infrastructure that helps businesses scale.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed font-sans">
          Rizmec is an ambitious, founder-led technology engineering company based in Bangladesh, targeting international clients. We engineer custom software, business operating platforms, and practical automation systems that give businesses operational control and clarity.
        </p>
      </div>

      {/* Brand Philosophy / Manifesto with 3D Depth */}
      <TiltCard maxTilt={4} glareOpacity={0.12}>
        <div className="p-8 sm:p-14 rounded-3xl border border-white/15 bg-neutral-900/50 backdrop-blur-2xl space-y-8 shadow-2xl relative">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
              THE RIZMEC PHILOSOPHY
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
            &quot;From Algorithms to Engineered Intelligence.&quot;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-300 leading-relaxed font-sans">
            <p>
              Software should not be an endless chain of fragile templates or superficial wrappers. Real businesses require systems that accurately model their operational rules, safeguard critical data, and operate reliably day in and day out.
            </p>
            <p>
              At Rizmec, we build from first-principles engineering: clean data schemas, strict type safety, responsive user interfaces, and practical automation pipelines that eliminate manual bottlenecks and deliver measurable commercial return on investment.
            </p>
          </div>
        </div>
      </TiltCard>

      {/* Engineering Principles */}
      <div className="space-y-12 relative">
        <div>
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            // Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 text-chrome">
            How We Approach Software
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">01</div>
              <h3 className="text-lg font-bold text-white">Business-First Architecture</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                We start with your operational workflows, user roles, and business constraints — designing software that directly solves operational bottlenecks rather than adding unnecessary complexity.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">02</div>
              <h3 className="text-lg font-bold text-white">Production Reliability</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                We design scalable cloud and VPS deployment solutions with continuous health monitoring, automated backups, and structured schema migrations to guarantee long-term system stability.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">03</div>
              <h3 className="text-lg font-bold text-white">Direct Technical Ownership</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Founder-led technical leadership ensures senior-level architectural oversight, strict code reviews, and transparent communication across every milestone of your engagement.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Global Client Focus Strip */}
      <TiltCard maxTilt={3} glareOpacity={0.1}>
        <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-neutral-950/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Headquartered in Bangladesh, Engineering Globally
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Operating out of Dhaka, Bangladesh — delivering custom software and platforms for international business partners worldwide.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 shadow-lg"
          >
            Discuss Your Project
          </Link>
        </div>
      </TiltCard>

      {/* Founder & Leadership Showcase */}
      <div className="space-y-12 relative">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              // Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 text-chrome">
              Founder &amp; Engineering Direction
            </h2>
          </div>
          <Link
            href="/team"
            className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>Team Overview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member: any) => (
            <TiltCard key={member.slug} maxTilt={8} glareOpacity={0.14}>
              <Link
                href={`/p/${member.slug}`}
                className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl hover:border-white/30 transition-all space-y-4 group h-full block"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shadow-inner">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    {member.title}
                  </p>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-3 font-sans leading-relaxed">
                  {member.tagline || member.bio}
                </p>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
