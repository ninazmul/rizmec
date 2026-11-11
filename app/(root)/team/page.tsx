import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Users, Workflow, Code2, Globe } from "lucide-react";
import { getTeamMembers } from "@/lib/actions/team.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";
import { FOUNDER_INFO, COMPANY_IDENTITY } from "@/constants/verifiedData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Leadership & Team — RIZMEC",
  description:
    "Meet RIZMEC's founder-led engineering leadership. Learn how our Founder & Chief Architect directs architectural design and delivery for international clients.",
};

export default async function TeamDirectoryPage() {
  const res = await getTeamMembers({ published: true });
  const members = res.success && res.data?.length > 0 ? res.data : [FOUNDER_INFO];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // Leadership &amp; Engineering Model
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Founder-led technical leadership.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed font-sans">
          Rizmec operates as an ambitious, founder-led software engineering company based in Bangladesh.
          For every client engagement, architectural design, database schemas, and technical execution are directed by our Founder &amp; Chief Architect, supported by a trusted network of specialized engineering collaborators.
        </p>
      </div>

      {/* Team Grid with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {members.map((member: any) => (
          <div key={member.slug} className="relative group perspective-2000">
            {/* Background Animated Gradient Halo */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-indigo-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <TiltCard
              maxTilt={8}
              glareOpacity={0.2}
              glowColor="rgba(56, 189, 248, 0.25)"
              className="w-full h-full"
            >
              <Link
                href={`/p/${member.slug}`}
                className="relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-2xl hover:border-white/30 transition-all flex flex-col justify-between space-y-6 h-full overflow-hidden group shadow-2xl"
              >
                {/* Ambient Glow Orbs inside Card */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />

                <div className="space-y-5 relative z-10">
                  <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-white/10 relative shadow-inner">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                    {/* Active Status Badge on Avatar */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-emerald-300 font-medium tracking-wider uppercase">
                          Active Lead
                        </span>
                      </div>
                      <span className="text-neutral-400">/p/{member.slug}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {member.name}
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      {member.title}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-3">
                    {member.tagline || member.bio}
                  </p>

                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(member.technologies || []).slice(0, 4).map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors relative z-10">
                  <span>Inspect Engineering Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            </TiltCard>
          </div>
        ))}
      </div>

      {/* Operating Model Breakdown */}
      <div className="pt-12 border-t border-white/10 space-y-8">
        <div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            // Operating Structure
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2 text-chrome">
            How Rizmec Delivers For Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Founder Architectural Direction</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Our Founder &amp; Chief Architect personally scopes every client project, designs database models, establishes security boundaries, and conducts strict code reviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Specialized Technical Collaborators</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              As project requirements scale, we draw upon a curated bench of specialized frontend developers, backend engineers, and automation specialists who work under our architectural supervision.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Client Collaboration</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Clients communicate directly with technical builders. We provide weekly video updates, milestone demonstrations, and rapid feedback loops with zero agency bureaucracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
