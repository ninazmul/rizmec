"use client";

import React from "react";
import { FolderGit2, ArrowUpRight, ExternalLink, Activity, Code2 } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

interface ProjectItem {
  title: string;
  description: string;
  role?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  metrics?: string[];
  featured?: boolean;
  slug?: string;
}

interface ProjectShowcase3DProps {
  projects: ProjectItem[];
  theme?: string;
}

export function ProjectShowcase3D({ projects = [], theme = "obsidian" }: ProjectShowcase3DProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="space-y-10 pt-16 border-t border-white/10">
      <div className="space-y-2">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
          <FolderGit2 className="w-4 h-4" />
          <span>// Engineering Showcase</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Featured Architecture & Projects
        </h2>
        <p className="text-sm text-neutral-400 font-light max-w-xl">
          Mission-critical systems, distributed applications, and open-source contributions engineered with measurable impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <TiltCard key={idx} maxTilt={8} glareOpacity={0.2}>
            <div className="h-full p-7 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                {/* Image Preview if available */}
                {project.imageUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10 relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Role / Subtitle Header */}
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="text-cyan-400 font-semibold uppercase tracking-wider">
                    {project.role || "Lead Architect"}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Measurable Impact & Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Key Verified Outcomes</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.metrics.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-200"
                        >
                          ⚡ {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] text-neutral-300 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live App</span>
                    </a>
                  )}
                </div>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-white font-bold group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-neutral-500">Case Study</span>
                )}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
