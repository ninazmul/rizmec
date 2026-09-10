"use client";

import React from "react";

interface ResumePrintViewProps {
  member: any;
}

export function ResumePrintView({ member }: ResumePrintViewProps) {
  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black font-sans text-sm p-6 space-y-6">
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          header,
          canvas,
          .no-print,
          #overview,
          #skills,
          #projects,
          #experience,
          #contact {
            display: none !important;
          }
          .print-resume-container {
            display: block !important;
            width: 100% !important;
            color: #111111 !important;
            background: #ffffff !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}</style>

      <div className="print-resume-container space-y-6">
        {/* Header */}
        <div className="border-b pb-4 space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">{member.name}</h1>
          <p className="text-base font-semibold text-neutral-700">{member.title}</p>
          <div className="flex flex-wrap gap-4 text-xs text-neutral-600 pt-1">
            {member.location && <span>📍 {member.location}</span>}
            {member.email && <span>✉️ {member.contactInfo?.personalEmail || member.email}</span>}
            {member.contactInfo?.phone && <span>📞 {member.contactInfo.phone}</span>}
            {member.socialLinks?.github && <span>GitHub: {member.socialLinks.github}</span>}
            {member.socialLinks?.linkedin && <span>LinkedIn: {member.socialLinks.linkedin}</span>}
            {member.socialLinks?.website && <span>Web: {member.socialLinks.website}</span>}
          </div>
        </div>

        {/* Executive Summary */}
        {(member.bio || member.tagline) && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
              Executive Summary
            </h2>
            <p className="text-xs leading-relaxed text-neutral-700">{member.bio || member.tagline}</p>
          </div>
        )}

        {/* Core Competencies */}
        {member.skills && member.skills.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
              Technical Competencies & Specializations
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1">
              {member.skills.map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-medium text-neutral-900">{s.name}</span>
                  <span className="text-neutral-500 font-mono">{s.level}%</span>
                </div>
              ))}
            </div>
            {member.technologies && member.technologies.length > 0 && (
              <p className="text-xs text-neutral-600 pt-2">
                <strong>Technologies:</strong> {member.technologies.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Work Experience */}
        {member.experience && member.experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {member.experience.map((exp: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-neutral-900">{exp.role}</span>
                    <span className="text-xs font-mono text-neutral-500">{exp.period}</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-700">{exp.company}</div>
                  {exp.description && (
                    <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable Projects */}
        {member.customProjects && member.customProjects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
              Featured Projects & System Architecture
            </h2>
            <div className="space-y-2">
              {member.customProjects.map((proj: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-neutral-900">{proj.title}</span>
                    {proj.role && <span className="text-xs text-neutral-500">{proj.role}</span>}
                  </div>
                  <p className="text-xs text-neutral-600">{proj.description}</p>
                  {proj.metrics && proj.metrics.length > 0 && (
                    <p className="text-xs text-neutral-700 italic">
                      Outcomes: {proj.metrics.join(" | ")}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-neutral-500">
                      Stack: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        {(member.education?.length > 0 || member.certifications?.length > 0) && (
          <div className="grid grid-cols-2 gap-6 pt-2">
            {member.education?.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
                  Education
                </h2>
                {member.education.map((edu: any, idx: number) => (
                  <div key={idx} className="text-xs">
                    <div className="font-bold text-neutral-900">{edu.degree}</div>
                    <div className="text-neutral-600">
                      {edu.institution} ({edu.year})
                    </div>
                  </div>
                ))}
              </div>
            )}

            {member.certifications?.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b pb-1">
                  Certifications
                </h2>
                {member.certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="text-xs">
                    <div className="font-bold text-neutral-900">{cert.name}</div>
                    <div className="text-neutral-600">
                      {cert.issuer} ({cert.year})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
