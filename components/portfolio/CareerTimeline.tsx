"use client";

import React from "react";
import { Briefcase, GraduationCap, Award, ExternalLink, Calendar } from "lucide-react";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

interface CareerTimelineProps {
  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  achievements?: string[];
  theme?: string;
}

export function CareerTimeline({
  experience = [],
  education = [],
  certifications = [],
  achievements = [],
  theme = "obsidian",
}: CareerTimelineProps) {
  return (
    <section id="experience" className="space-y-16 pt-16 border-t border-white/10">
      {/* Experience Timeline */}
      {experience.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>// Professional History</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Work Experience & Career Trajectory
            </h2>
          </div>

          <div className="relative border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-10">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-neutral-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />

                <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-md hover:border-white/20 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-neutral-300">
                        {exp.company}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/5 self-start sm:self-auto">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{exp.period}</span>
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light whitespace-pre-line pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>// Academic Credentials</span>
              </span>
              <h3 className="text-2xl font-bold text-white">Education</h3>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-md space-y-1.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                    <span className="font-mono text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>// Verified Accreditations</span>
              </span>
              <h3 className="text-2xl font-bold text-white">Certifications</h3>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-md space-y-1.5 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">{cert.name}</h4>
                    <p className="text-xs font-mono text-neutral-400">
                      {cert.issuer} &bull; {cert.year}
                    </p>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 text-neutral-300 hover:text-white transition-all"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verified Milestones / Honors */}
      {achievements.length > 0 && (
        <div className="p-8 rounded-3xl border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-4">
          <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Notable Engineering Honors & Milestones</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-neutral-300 flex items-start gap-3"
              >
                <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                <span className="leading-relaxed">{ach}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
