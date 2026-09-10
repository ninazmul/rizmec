import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Leadership & Technical Directory — RIZMEC",
  description:
    "Meet RIZMEC's team of principal software architects, AI research scientists, and distributed systems engineers.",
};

export default async function TeamDirectoryPage() {
  const res = await getTeamMembers({ published: true });
  const members = res.success ? res.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // Human Capital
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Principal architects, AI scientists, and systems engineers.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Every engineer at RIZMEC possesses deep algorithmic specialization.
          Explore our team members' individual professional portfolios and verified
          technical credentials.
        </p>
      </div>

      {/* Team Grid with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {members.map((member: any) => (
          <TiltCard key={member.slug} maxTilt={8} glareOpacity={0.15}>
            <Link
              href={`/team/${member.slug}`}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all flex flex-col justify-between space-y-6 group h-full"
            >
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-white/10 relative shadow-inner">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    {member.title}
                  </p>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                  {member.tagline || member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                <span>View Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
