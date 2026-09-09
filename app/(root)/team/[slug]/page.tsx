import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  CheckCircle2,
  MapPin,
  Mail,
} from "lucide-react";

// Inline SVGs for social icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { getTeamMemberBySlug } from "@/lib/actions/team.actions";
import { getProjects } from "@/lib/actions/project.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getTeamMemberBySlug(slug);
  if (!res.success || !res.data) {
    return { title: "Engineer Not Found" };
  }
  return {
    title: `${res.data.name} — ${res.data.title} | RIZMEC Portfolio`,
    description: res.data.bio || res.data.tagline,
  };
}

export default async function TeamMemberPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const res = await getTeamMemberBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const member = res.data;

  // Also fetch any projects where this member is assigned
  const projectsRes = await getProjects({ published: true });
  const allProjects = projectsRes.success ? projectsRes.data : [];
  const assignedProjects = allProjects.filter((p: any) =>
    (p.teamMemberIds || []).some((m: any) => m.slug === slug || m._id === member._id),
  );

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Back link */}
      <div>
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Engineers</span>
        </Link>
      </div>

      {/* Hero: Personal Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 relative shadow-2xl">
            <img
              src={member.avatar || "/assets/images/placeholder.webp"}
              alt={member.name}
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] font-mono text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest">{member.role}</span>
            {member.location && (
              <>
                <span className="text-neutral-600">|</span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <MapPin className="w-3 h-3" /> {member.location}
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            {member.name}
          </h1>

          <p className="text-xl sm:text-2xl font-light text-neutral-300">
            {member.title}
          </p>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl font-light">
            {member.tagline || member.bio}
          </p>

          {/* Social Links & Direct Contact */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {member.socialLinks?.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks?.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Twitter"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
            )}

            <Link
              href={`/contact?engineer=${encodeURIComponent(member.name)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all ml-2"
            >
              <span>Engage Architect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Biography & Skills Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/10">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Biography & Background</h2>
          <div className="text-neutral-400 leading-relaxed font-light text-base space-y-4">
            <p>{member.bio}</p>
          </div>

          {/* Key Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-white" />
                <span>Verified Milestones & Impact</span>
              </h3>
              <div className="space-y-3">
                {member.achievements.map((ach: string) => (
                  <div
                    key={ach}
                    className="p-4 rounded-xl border border-white/10 bg-neutral-950 text-xs text-neutral-300 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills Radar / Bars */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-white" />
              <span>Skill Specializations</span>
            </h3>

            <div className="space-y-4">
              {(member.skills || []).map((skill: any) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-200">{skill.name}</span>
                    <span className="text-neutral-400">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Technology Competencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {(member.technologies || []).map((t: string) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-white/10">
        {/* Experience Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
            <Briefcase className="w-5 h-5 text-white" />
            <span>Career Experience</span>
          </h3>

          <div className="space-y-4">
            {(member.experience || []).map((exp: any, i: number) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white">{exp.role}</h4>
                    <p className="text-xs text-neutral-400 font-mono">{exp.company}</p>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">{exp.period}</span>
                </div>
                {exp.description && (
                  <p className="text-xs text-neutral-400 leading-relaxed pt-2">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
              <GraduationCap className="w-5 h-5 text-white" />
              <span>Academic Education</span>
            </h3>

            <div className="space-y-4">
              {(member.education || []).map((edu: any, i: number) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                    <span className="font-mono text-xs text-neutral-400">{edu.year}</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {member.certifications && member.certifications.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
                <Award className="w-5 h-5 text-white" />
                <span>Certifications</span>
              </h3>

              <div className="space-y-4">
                {member.certifications.map((cert: any, i: number) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-white/10 bg-neutral-950 space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-white">{cert.name}</h4>
                      <span className="font-mono text-xs text-neutral-400">{cert.year}</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authored / Assigned Case Studies */}
      {assignedProjects.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-white/10">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              // Direct Engagement Portfolio
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Projects Engineered by {member.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assignedProjects.map((p: any) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="p-6 rounded-2xl border border-white/10 bg-neutral-950 hover:border-white/30 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400">
                    {p.clientName} // {p.industry}
                  </div>
                  <h4 className="text-xl font-bold text-white group-hover:text-neutral-200">
                    {p.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {p.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span>Inspect Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
