"use client";

import React, { useState, useEffect } from "react";
import { Download, Palette, Menu, X, Sparkles } from "lucide-react";
import { getResumeDownloadUrl } from "@/lib/utils";

interface PortfolioNavProps {
  name: string;
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  onPrintResume?: () => void;
  resumeUrl?: string;
}

export function PortfolioNav({
  name,
  activeTheme,
  onThemeChange,
  onPrintResume,
  resumeUrl,
}: PortfolioNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute initials
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DEV";

  const themes = [
    { id: "obsidian", label: "Obsidian", color: "bg-neutral-800" },
    { id: "sapphire", label: "Sapphire", color: "bg-sky-500" },
    { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
    { id: "cyber", label: "Cyberpunk", color: "bg-purple-500" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand */}
        <a href="#overview" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-white text-black font-mono font-black flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors hidden sm:inline-block">
            {name}
          </span>
        </a>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-400">
          <a href="#overview" className="hover:text-white transition-colors">
            Overview
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Actions: Theme & Resume */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setPaletteOpen(!paletteOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Change 3D Theme Preset"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {paletteOpen && (
              <div className="absolute right-0 mt-2 w-44 p-2 rounded-2xl bg-neutral-900 border border-white/15 shadow-2xl space-y-1 z-50">
                <div className="px-2 py-1 text-[10px] font-mono text-neutral-400 uppercase">
                  Theme Preset
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id);
                      setPaletteOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      activeTheme === t.id
                        ? "bg-white/10 text-white font-bold"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download Resume / Print Button */}
          <button
            onClick={() => {
              const downloadUrl = getResumeDownloadUrl(resumeUrl);
              if (downloadUrl) {
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.download = `${(name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                if (onPrintResume) onPrintResume();
                else window.print();
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md"
            title={resumeUrl ? "Download PDF Resume" : "Print Resume"}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-neutral-950/95 border-b border-white/10 backdrop-blur-2xl space-y-4 font-mono text-xs uppercase tracking-wider">
          <a
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white"
          >
            Overview
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white"
          >
            Skills & Mastery
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white"
          >
            Showcase Projects
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white"
          >
            Career History
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white"
          >
            Direct Contact
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const downloadUrl = getResumeDownloadUrl(resumeUrl);
              if (downloadUrl) {
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.download = `${(name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                if (onPrintResume) onPrintResume();
                else window.print();
              }
            }}
            className="w-full mt-2 py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{resumeUrl ? "Download PDF Resume" : "Download Resume (Print)"}</span>
          </button>
        </div>
      )}
    </header>
  );
}
