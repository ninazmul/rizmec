"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Download,
  Share2,
  Calendar,
  Mail,
  Check,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { getResumeDownloadUrl } from "@/lib/utils";

// Social icon helpers
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

interface PortfolioHero3DProps {
  member: any;
  theme?: string;
  onPrintResume?: () => void;
}

export function PortfolioHero3D({ member, theme = "obsidian", onPrintResume }: PortfolioHero3DProps) {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const availabilityLabel =
    member.availability?.label ||
    (member.availability?.status === "open_to_work"
      ? "Available for New Opportunities"
      : member.availability?.status === "contract"
      ? "Available for Contracts & Consulting"
      : member.availability?.status === "advisory"
      ? "Open to Technical Advisory"
      : "Full-Time Principal Engineer");

  const calendlyUrl = member.contactInfo?.calendlyUrl;

  return (
    <div id="overview" className="relative pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
        {/* 3D Holographic Avatar Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <TiltCard maxTilt={14} glareOpacity={0.25}>
              <div className="relative p-3 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
                {/* Dynamic Ambient Glow Behind Avatar */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/10 to-emerald-500/20 opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />

                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/10">
                  <img
                    src={member.avatar || "/assets/images/placeholder.webp"}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />

                  {/* Availability Badge floating inside card */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-mono font-medium text-emerald-300">
                        {availabilityLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Sub-Bar */}
                <div className="pt-3 px-1 flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{member.location || "Global / Remote"}</span>
                  </span>
                  {localTime && (
                    <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <Clock className="w-3 h-3" />
                      <span>{localTime}</span>
                    </span>
                  )}
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Hero Narrative & Resume Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status & Handle Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] font-mono text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-white">/p/{member.slug}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Verified Technical Portfolio</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
              {member.name}
            </h1>
            <p className="text-xl sm:text-2xl font-light text-neutral-300">
              {member.title}
            </p>
          </div>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light max-w-2xl">
            {member.tagline || member.bio}
          </p>

          {/* Social Profiles & Quick Contact Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {member.socialLinks?.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks?.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all"
                aria-label="Twitter/X Profile"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks?.website && (
              <a
                href={member.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all"
                aria-label="Personal Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={handleCopy}
              className="px-3.5 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all"
              title="Copy public portfolio link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Action CTAs: Resume Print/Download & Direct Engage */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => {
                const downloadUrl = getResumeDownloadUrl(member.resumeUrl);
                if (downloadUrl) {
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  link.download = `${(member.name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  if (onPrintResume) onPrintResume();
                  else window.print();
                }
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg hover:shadow-white/10"
              title={member.resumeUrl ? "Download PDF Resume" : "Print ATS Resume"}
            >
              <Download className="w-4 h-4" />
              <span>Download Resume / CV</span>
            </button>

            {member.resumeUrl && (
              <button
                onClick={() => {
                  if (onPrintResume) onPrintResume();
                  else window.print();
                }}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 font-mono text-xs hover:text-white hover:border-white/20 transition-all"
                title="Print clean ATS formatted resume"
              >
                <span>ATS Print</span>
              </button>
            )}

            {calendlyUrl ? (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/20 bg-neutral-900/60 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-white/40 hover:bg-white/[0.08] transition-all"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Book a Call</span>
              </a>
            ) : (
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/20 bg-neutral-900/60 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-white/40 hover:bg-white/[0.08] transition-all"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Direct</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
