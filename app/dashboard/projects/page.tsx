"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Clock, CheckCircle2, Users, AlertCircle, ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/actions/project.actions";

export default function ProjectManagementDashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getProjects();
      if (res.success) {
        setProjects(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            INTERNAL OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Project Delivery & Team Assignments
          </h1>
        </div>

        <Link
          href="/dashboard/work"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Engineering Engagement</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading active engagements...
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-neutral-400">
                    {p.clientName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    {p.status || "ACTIVE"}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-1">{p.industry}</p>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {p.summary}
                </p>

                {/* Team Members assigned */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">
                    Assigned Contributors:
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(p.teamMemberIds || []).map((m: any) => (
                      <div
                        key={m._id || m.slug}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/10"
                        title={`${m.name} (${m.role || m.title || "Team"})`}
                      >
                        <img
                          src={m.avatar || "/assets/images/placeholder.webp"}
                          alt={m.name}
                          className="w-5 h-5 rounded-full border border-white/10 object-cover"
                        />
                        <span className="text-[11px] text-neutral-300 font-mono">{m.name}</span>
                        {m.role === "intern" && (
                          <span className="text-[9px] text-cyan-400 font-bold uppercase font-mono">
                            Intern
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-neutral-400">
                <span>Completed: {p.completionDate || "In Progress"}</span>
                <Link
                  href={`/work/${p.slug}`}
                  target="_blank"
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>Public</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
