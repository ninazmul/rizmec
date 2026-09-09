import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";

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
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Human Capital
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Principal architects, AI scientists, and systems engineers.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Every engineer at RIZMEC possesses deep algorithmic specialization. Explore our team members' individual professional portfolios and verified technical credentials.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member: any) => (
          <Link
            key={member.slug}
            href={`/team/${member.slug}`}
            className="p-6 rounded-2xl border border-white/10 bg-neutral-950 hover:border-white/30 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-neutral-200">
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
        ))}
      </div>
    </div>
  );
}
