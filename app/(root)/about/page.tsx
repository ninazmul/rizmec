import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Cpu, Code2, Globe2, Sparkles, Terminal } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";

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
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // About RIZMEC
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          We engineer the digital foundations of the next industrial era.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          RIZMEC was founded with a singular conviction: as the global economy transitions from simple software scripts to autonomous neural systems, the world demands an engineering partner with the mathematical precision and architectural depth to build systems that cannot fail.
        </p>
      </div>

      {/* Brand Philosophy / Manifesto */}
      <div className="p-8 sm:p-14 rounded-2xl border border-white/10 bg-neutral-950 space-y-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
            THE RIZMEC MANIFESTO
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          "From algorithms to intelligent systems."
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-400 leading-relaxed font-sans">
          <p>
            Software is no longer merely a digitized version of paper forms. Modern enterprise platforms are distributed event-driven matrices coordinating hundreds of thousands of concurrent autonomous agents, real-time financial trades, and mission-critical cloud pipelines.
          </p>
          <p>
            At RIZMEC, we do not view technology through superficial trends or template-driven shortcuts. We engineer with first-principles physics: static memory guarantees, fault-tolerant consensus, deterministic neural boundaries, and cinematic user interfaces that respect the cognitive bandwidth of human operators.
          </p>
        </div>
      </div>

      {/* Engineering Principles */}
      <div className="space-y-12">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
            // Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            How We Build
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] space-y-4">
            <div className="font-mono text-2xl font-black text-white">01</div>
            <h3 className="text-lg font-bold text-white">Deterministic by Default</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We constrain probabilistic outputs with strict grammar schemas, type boundaries, and automated audit checks before any data touches the database.
            </p>
          </div>

          <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] space-y-4">
            <div className="font-mono text-2xl font-black text-white">02</div>
            <h3 className="text-lg font-bold text-white">Zero-Downtime Topologies</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We design multi-region Kubernetes meshes that tolerate whole data-center dropouts with automated sub-3-second failover and synchronous replication.
            </p>
          </div>

          <div className="p-8 rounded-xl border border-white/10 bg-white/[0.01] space-y-4">
            <div className="font-mono text-2xl font-black text-white">03</div>
            <h3 className="text-lg font-bold text-white">Cinematic Ergonomics</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              High engineering density does not mean ugly software. Our interfaces are designed with editorial typography, instant sub-second response times, and zero layout shift.
            </p>
          </div>
        </div>
      </div>

      {/* Global Locations Strip */}
      <div className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-black flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white tracking-tight">Worldwide Engineering Presence</h3>
          <p className="text-xs text-neutral-400 font-mono">
            Operating across continuous time-zones with hubs in San Francisco, London, Tokyo, and Singapore.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0"
        >
          Engage Our Teams
        </Link>
      </div>

      {/* Team Showcase */}
      <div className="space-y-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Squad
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
              Principal Architects & Leadership
            </h2>
          </div>
          <Link
            href="/team"
            className="text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider"
          >
            All Members &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member: any) => (
            <Link
              key={member.slug}
              href={`/team/${member.slug}`}
              className="p-6 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/30 transition-all space-y-4 group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-white/10">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{member.name}</h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{member.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
