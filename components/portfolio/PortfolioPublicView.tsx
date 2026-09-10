"use client";

import React, { useState } from "react";
import { PortfolioNav } from "./PortfolioNav";
import { PortfolioHero3D } from "./PortfolioHero3D";
import { TechMasteryMatrix } from "./TechMasteryMatrix";
import { ProjectShowcase3D } from "./ProjectShowcase3D";
import { CareerTimeline } from "./CareerTimeline";
import { DirectContactSection } from "./DirectContactSection";
import { ParticleConstellation } from "./ParticleConstellation";
import { ResumePrintView } from "./ResumePrintView";

interface PortfolioPublicViewProps {
  member: any;
  assignedProjects?: any[];
}

export function PortfolioPublicView({ member, assignedProjects = [] }: PortfolioPublicViewProps) {
  const initialTheme = member.themeConfig?.preset || "obsidian";
  const [theme, setTheme] = useState<string>(initialTheme);

  // Combine customProjects with any assigned projects if available
  const allProjects = [
    ...(member.customProjects || []).map((p: any) => ({
      ...p,
      metrics: (p.metrics || []).map((m: any) =>
        typeof m === "string"
          ? m
          : m?.label && m?.value
          ? `${m.label}: ${m.value}${m.change ? ` (${m.change})` : ""}`
          : String(m)
      ),
    })),
    ...assignedProjects.map((p) => ({
      title: p.title,
      description: p.summary || p.description,
      role: p.role || "Lead Engineer",
      technologies: p.technologies || [],
      liveUrl: p.liveUrl || `/work/${p.slug}`,
      githubUrl: p.githubUrl,
      imageUrl: p.coverImage || p.images?.[0],
      metrics: (p.metrics || []).map((m: any) =>
        typeof m === "string"
          ? m
          : m?.label && m?.value
          ? `${m.label}: ${m.value}${m.change ? ` (${m.change})` : ""}`
          : typeof m === "object"
          ? m?.value || m?.label || ""
          : String(m)
      ),
      featured: p.featured,
    })),
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Theme styling configurations
  const themeBackgroundMap: Record<string, string> = {
    obsidian: "bg-[#09090b] text-neutral-100",
    sapphire: "bg-[#050b14] text-sky-50",
    emerald: "bg-[#05110d] text-emerald-50",
    cyber: "bg-[#0d0714] text-purple-50",
  };

  const currentBg = themeBackgroundMap[theme] || themeBackgroundMap.obsidian;

  return (
    <div className={`min-h-screen ${currentBg} selection:bg-white selection:text-black relative transition-colors duration-500`}>
      {/* 3D Particle Constellation (disabled during print) */}
      <div className="no-print">
        <ParticleConstellation theme={theme} />
      </div>

      {/* Floating Unbranded Navigation */}
      <div className="no-print">
        <PortfolioNav
          name={member.name}
          activeTheme={theme}
          onThemeChange={setTheme}
          onPrintResume={handlePrint}
          resumeUrl={member.resumeUrl}
        />
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 no-print">
        {/* Hero Section */}
        <PortfolioHero3D member={member} theme={theme} onPrintResume={handlePrint} />

        {/* Tech Mastery & Specializations */}
        <TechMasteryMatrix
          skills={member.skills || []}
          technologies={member.technologies || []}
          theme={theme}
        />

        {/* 3D Project Showcase */}
        <ProjectShowcase3D projects={allProjects} theme={theme} />

        {/* Career Timeline, Education & Credentials */}
        <CareerTimeline
          experience={member.experience || []}
          education={member.education || []}
          certifications={member.certifications || []}
          achievements={member.achievements || []}
          theme={theme}
        />

        {/* Personalized Direct Contact Channels */}
        <DirectContactSection
          memberId={member._id}
          name={member.name}
          contactInfo={member.contactInfo}
          theme={theme}
        />

        {/* Footer with Rizmec Reference */}
        <footer className="py-12 border-t border-white/10 text-center font-mono text-xs text-neutral-500 space-y-3">
          <p className="text-neutral-400">&copy; {new Date().getFullYear()} {member.name}. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <span>Powered by</span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-bold tracking-wider text-neutral-300 hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>RIZMEC</span>
            </a>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-neutral-500 font-light">Verified Engineering Network</span>
          </div>
        </footer>
      </main>

      {/* ATS Printable Resume View (activated during window.print()) */}
      <ResumePrintView member={member} />
    </div>
  );
}
