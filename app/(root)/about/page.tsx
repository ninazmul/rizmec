import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Cpu, Code2, Globe2, Sparkles, Terminal } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About RIZMEC — Engineering Philosophy & Manifesto",
  description:
    "Learn about RIZMEC's mission, engineering principles, leadership, and our commitment to building mission-critical technology platforms internationally.",
};

export default async function AboutPage() {
  const teamRes = await getTeamMembers({ published: true });
  const teamMembers = teamRes.success ? teamRes.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          // About RIZMEC
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          We engineer the digital foundations of the next industrial era.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          RIZMEC was founded with a singular conviction: as the global economy transitions from simple software scripts to autonomous neural systems, the world demands an engineering partner with the mathematical precision and architectural depth to build systems that cannot fail.
        </p>
      </div>

      {/* Brand Philosophy / Manifesto with 3D Depth */}
      <TiltCard maxTilt={4} glareOpacity={0.12}>
        <div className="p-8 sm:p-14 rounded-3xl border border-white/15 bg-neutral-900/50 backdrop-blur-2xl space-y-8 shadow-2xl relative">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
              THE RIZMEC MANIFESTO
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight text-chrome">
            &quot;From algorithms to intelligent systems.&quot;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-300 leading-relaxed font-sans">
            <p>
              Software is no longer merely a digitized version of paper forms. Modern enterprise platforms are distributed event-driven matrices coordinating hundreds of thousands of concurrent autonomous agents, real-time financial trades, and mission-critical cloud pipelines.
            </p>
            <p>
              At RIZMEC, we do not view technology through superficial trends or template-driven shortcuts. We engineer with first-principles physics: static memory guarantees, fault-tolerant consensus, deterministic neural boundaries, and cinematic user interfaces that respect the cognitive bandwidth of human operators.
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
            How We Build
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">01</div>
              <h3 className="text-lg font-bold text-white">Deterministic by Default</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We constrain probabilistic outputs with strict grammar schemas, type boundaries, and automated audit checks before any data touches the database.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">02</div>
              <h3 className="text-lg font-bold text-white">Zero-Downtime Topologies</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We design multi-region Kubernetes meshes that tolerate whole data-center dropouts with automated sub-3-second failover and synchronous replication.
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glareOpacity={0.15}>
            <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-4 h-full">
              <div className="font-mono text-2xl font-black text-white text-chrome">03</div>
              <h3 className="text-lg font-bold text-white">Cinematic Ergonomics</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                High engineering density does not mean ugly software. Our interfaces are designed with editorial typography, instant sub-second response times, and zero layout shift.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Global Locations Strip */}
      <TiltCard maxTilt={3} glareOpacity={0.1}>
        <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-neutral-950/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">Worldwide Engineering Presence</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Operating across continuous time-zones with hubs in San Francisco, London, Tokyo, and Singapore.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 shadow-lg"
          >
            Engage Our Teams
          </Link>
        </div>
      </TiltCard>

      {/* Team Showcase */}
      <div className="space-y-12 relative">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              // Squad
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 text-chrome">
              Principal Architects & Leadership
            </h2>
          </div>
          <Link
            href="/team"
            className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <span>All Members</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member: any) => (
            <TiltCard key={member.slug} maxTilt={8} glareOpacity={0.14}>
              <Link
                href={`/team/${member.slug}`}
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
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">{member.name}</h4>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{member.title}</p>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
