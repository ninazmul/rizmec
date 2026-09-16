"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  Code2,
  Cpu,
  Workflow,
  Server,
  Users,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Mail,
  MessageCircle,
  Globe,
} from "lucide-react";
import RizmecLogo from "@/components/shared/RizmecLogo";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ============================================================
   IDENTITY TRANSITION COMPONENT — ENGINEERED MOTION SYSTEM
   ============================================================ */

const IdentityTransition = () => {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setHasReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHasReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (hasReducedMotion) {
      setPhase(3);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1900),
      setTimeout(() => setPhase(3), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [hasReducedMotion]);

  const oldWords = ["ARTISTYCODE", "STUDIO"];
  const newWords = ["RIZMEC"];

  return (
    <div className="relative w-full py-4 sm:py-6" aria-live="polite">
      {/* Precision guide rails */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.6s ease" }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}
      />

      {/* OLD IDENTITY */}
      <div
        className="relative"
        style={{
          opacity: phase <= 1 ? 1 : 0,
          transform: phase <= 1 ? "translateY(0)" : "translateY(-8px)",
          filter: phase <= 1 ? "blur(0px)" : "blur(4px)",
          transition: hasReducedMotion
            ? "none"
            : "opacity 0.8s ease 0.6s, transform 0.9s cubic-bezier(0.7,0,0.3,1) 0.4s, filter 0.8s ease 0.6s",
          height: phase >= 2 ? "0px" : "auto",
          overflow: phase >= 2 ? "hidden" : "visible",
        }}
      >
        {oldWords.map((word, i) => (
          <div key={i} className="overflow-hidden">
            <div
              className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-[0.02em] leading-[1.05] text-white will-change-transform"
              style={{
                transform:
                  phase === 1
                    ? `translateY(${i === 0 ? "-6%" : "6%"}) skewY(${i === 0 ? "-0.8deg" : "0.8deg"})`
                    : "none",
                letterSpacing:
                  phase === 1 ? (i === 0 ? "0.15em" : "0.25em") : "0.02em",
                opacity: phase === 1 ? 0.55 : 1,
                transition: hasReducedMotion
                  ? "none"
                  : `transform 1.1s cubic-bezier(0.65,0,0.35,1) ${0.1 + i * 0.12}s, letter-spacing 1.1s cubic-bezier(0.65,0,0.35,1) ${0.1 + i * 0.12}s, opacity 0.7s ease ${0.5 + i * 0.1}s`,
              }}
            >
              <span className="text-chrome">{word}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSFORM PHASE — structural re-organization */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: phase === 2 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden="true"
      >
        {/* Deconstruction bars */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-white/40"
            style={{
              width: hasReducedMotion
                ? "0%"
                : phase === 2
                  ? `${60 + i * 10}%`
                  : "0%",
              top: `${25 + i * 18}%`,
              left: "50%",
              transform: "translateX(-50%)",
              transition: `width 0.7s cubic-bezier(0.7,0,0.3,1) ${i * 0.06}s`,
            }}
          />
        ))}
        {/* Particle dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-white/60"
            style={{
              left: `${10 + i * 7.5}%`,
              top: `${40 + Math.sin(i) * 15}%`,
              transform:
                phase === 2
                  ? "translateX(0) scale(1)"
                  : `translateX(${i < 6 ? "-30px" : "30px"}) scale(0)`,
              opacity: phase === 2 ? 0.8 : 0,
              transition: `all 0.7s cubic-bezier(0.65,0,0.35,1) ${i * 0.04}s`,
            }}
          />
        ))}
      </div>

      {/* NEW IDENTITY */}
      <div
        className="relative"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
          filter: phase >= 3 ? "blur(0px)" : "blur(6px)",
          transition: hasReducedMotion
            ? "none"
            : "opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.2,0.8,0.2,1) 0s, filter 0.9s ease 0.1s",
          height: phase < 3 ? "0px" : "auto",
          overflow: phase < 3 ? "hidden" : "visible",
        }}
      >
        {newWords.map((word, i) => (
          <div key={i} className="overflow-hidden">
            <div
              className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-[0.04em] leading-[1.05] will-change-transform"
              style={{
                transform: phase >= 3 ? "translateY(0)" : "translateY(100%)",
                transition: hasReducedMotion
                  ? "none"
                  : `transform 0.95s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.08}s`,
              }}
            >
              <span className="text-chrome">{word}</span>
            </div>
          </div>
        ))}
        {/* Thin accent underline */}
        <div
          className="mt-4 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent"
          style={{
            transform: phase >= 3 ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "center",
            transition: hasReducedMotion
              ? "none"
              : "transform 1.1s cubic-bezier(0.2,0.8,0.2,1) 0.5s",
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   REVEAL ON SCROLL HOOK (LIGHTWEIGHT, NO DEPS)
   ============================================================ */

const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
};

/* ============================================================
   SECTION WRAPPER WITH REVEAL ANIMATION
   ============================================================ */

const RevealSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================
   TECHNICAL LINE COMPONENT (self-drawing)
   ============================================================ */

const TechLine: React.FC<{ className?: string; direction?: "h" | "v" }> = ({
  className = "",
  direction = "h",
}) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: direction === "h" ? (shown ? "100%" : "0%") : "1px",
        height: direction === "v" ? (shown ? "100%" : "0%") : "1px",
        background:
          direction === "h"
            ? "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)"
            : "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)",
        transformOrigin: direction === "h" ? "left center" : "center top",
        transition: "all 1.4s cubic-bezier(0.2,0.8,0.2,1)",
      }}
    />
  );
};

/* ============================================================
   TRANSITION PAGE CONTENT (CLIENT COMPONENT)
   ============================================================ */

export default function TransitionPageContent() {
  const scrollToNext = () => {
    const next = document.getElementById("the-message");
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const transformations: { from: string; to: string }[] = [
    { from: "Web Development", to: "Software Engineering" },
    { from: "Digital Products", to: "Intelligent Systems" },
    { from: "Individual Projects", to: "Scalable Infrastructure" },
    { from: "Studio", to: "Technology Company" },
    { from: "Building websites", to: "Engineering digital ecosystems" },
  ];

  const constants: {
    label: string;
    title: string;
    body: string;
    Icon: React.FC<{ className?: string }>;
  }[] = [
    {
      label: "01",
      title: "THE PEOPLE",
      body: "The people and relationships behind the work remain at the heart of what we do.",
      Icon: Users,
    },
    {
      label: "02",
      title: "THE STANDARD",
      body: "We remain committed to thoughtful engineering, quality, reliability, and attention to detail.",
      Icon: ShieldCheck,
    },
    {
      label: "03",
      title: "THE RELATIONSHIPS",
      body: "Every client, project, and collaboration that helped shape the journey remains part of the story.",
      Icon: HeartHandshake,
    },
    {
      label: "04",
      title: "THE MINDSET",
      body: "We continue to build with curiosity, precision, and a long-term perspective.",
      Icon: Lightbulb,
    },
  ];

  const pillars: {
    title: string;
    body: string;
    Icon: React.FC<{ className?: string }>;
    accent: string;
  }[] = [
    {
      title: "SOFTWARE ENGINEERING",
      body: "Scalable web platforms, applications, enterprise systems, and digital products.",
      Icon: Code2,
      accent: "emerald",
    },
    {
      title: "AI & INTELLIGENT SYSTEMS",
      body: "AI-powered applications, agents, automation, and intelligent workflows.",
      Icon: Cpu,
      accent: "cyan",
    },
    {
      title: "AUTOMATION",
      body: "Systems designed to reduce repetitive work and increase operational efficiency.",
      Icon: Workflow,
      accent: "amber",
    },
    {
      title: "DIGITAL INFRASTRUCTURE",
      body: "Technology foundations built for scale, reliability, and long-term growth.",
      Icon: Server,
      accent: "indigo",
    },
  ];

  const accentMap: Record<string, string> = {
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    indigo: "text-indigo-400",
  };

  return (
    <div className="relative overflow-hidden bg-[#09090b]">
      {/* Ambient mesh & grid — matching homepage */}
      <CyberGlowMesh intensity="medium" />
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

      {/* ============================================================
          SECTION 1 — HERO: THE TRANSITION
         ============================================================ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-36 pb-16 md:pt-44 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          {/* Technical label */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-lg border-glow mb-10">
            <span className="w-2 h-2 rounded-full bg-amber-400/90 animate-pulse shadow-sm shadow-amber-400/40" />
            <span className="font-mono text-xs tracking-widest text-neutral-300 uppercase">
              AN EVOLUTION OF WHAT WE&apos;VE BUILT
            </span>
          </div>
        </RevealSection>

        {/* Identity transition stage */}
        <div className="relative max-w-4xl">
          <IdentityTransition />
        </div>

        {/* Supporting copy */}
        <RevealSection className="mt-12 max-w-3xl space-y-5" delay={120}>
          <p className="text-xl sm:text-2xl text-neutral-300 font-light leading-relaxed">
            Something we built has become something bigger.
          </p>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            ArtistyCode Studio is evolving into RIZMEC — a technology company
            focused on software engineering, AI, automation, and intelligent
            digital infrastructure.
          </p>
        </RevealSection>

        {/* CTAs */}
        <RevealSection
          className="mt-10 flex flex-wrap items-center gap-4"
          delay={220}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
          >
            <span>ENTER RIZMEC</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            onClick={scrollToNext}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm group"
            aria-label="Scroll to see what is changing"
          >
            <span>SEE WHAT&apos;S CHANGING</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </RevealSection>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 print:hidden">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <button
            onClick={scrollToNext}
            aria-label="Scroll down"
            className="w-8 h-12 rounded-full border border-white/15 flex items-start justify-center p-2 hover:border-white/30 hover:text-neutral-300 transition-all focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 — THE MESSAGE
         ============================================================ */}
      <section
        id="the-message"
        className="py-24 md:py-32 border-t border-white/10 bg-neutral-950/60 relative"
      >
        <TechLine
          className="top-16 left-1/2 -translate-x-1/2 max-w-xs"
          direction="h"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              // Chapter Transition
            </span>
          </RevealSection>

          <RevealSection className="mt-6" delay={80}>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              THIS IS MORE THAN A NAME CHANGE.
            </h2>
          </RevealSection>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <RevealSection className="md:col-span-5" delay={140}>
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
                ArtistyCode Studio was where the journey began.
              </p>
            </RevealSection>
            <RevealSection
              className="md:col-span-7 space-y-6 md:border-l md:border-white/10 md:pl-10"
              delay={220}
            >
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                Over time, the work grew beyond websites and individual digital
                products. We began building larger systems, intelligent
                applications, automation, and technology infrastructure.
              </p>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                RIZMEC is the next expression of that journey.
              </p>
            </RevealSection>
          </div>

          {/* Highlighted statement */}
          <RevealSection className="mt-20 relative" delay={120}>
            <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-200/50 via-amber-200/20 to-transparent" />
            <blockquote className="pl-8 py-4">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-chrome">
                Same foundation. Bigger vision. New identity.
              </p>
            </blockquote>
          </RevealSection>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 — FROM → TO TRANSFORMATION GRID
         ============================================================ */}
      <section className="py-24 md:py-32 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              // Capability Progression
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              From&nbsp;→&nbsp;To.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              The scope has expanded. The engineering has deepened. The name
              reflects the scale of what we now build.
            </p>
          </RevealSection>

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-12 gap-6 mb-8">
            <RevealSection className="md:col-span-5">
              <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase px-6 pb-3 border-b border-white/10">
                ArtistyCode Studio
              </div>
            </RevealSection>
            <RevealSection
              className="md:col-span-2 flex items-center justify-center"
              delay={60}
            >
              <div className="font-mono text-xs text-neutral-500">→</div>
            </RevealSection>
            <RevealSection className="md:col-span-5" delay={120}>
              <div className="font-mono text-[11px] tracking-widest text-neutral-300 uppercase px-6 pb-3 border-b border-white/15">
                RIZMEC
              </div>
            </RevealSection>
          </div>

          {/* Rows */}
          <div className="space-y-4">
            {transformations.map((row, idx) => (
              <RevealSection key={row.from} delay={idx * 70}>
                <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500">
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="font-mono text-xs text-neutral-600 shrink-0 w-6">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="text-base sm:text-lg text-neutral-400 md:pr-6 group-hover:text-neutral-300 transition-colors">
                      {row.from}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex md:justify-center items-center md:my-0 my-1">
                    <div className="w-full md:w-auto flex md:justify-center">
                      <div className="h-px md:h-auto md:w-px bg-gradient-to-r md:bg-gradient-to-b from-white/10 via-white/15 to-white/10 md:from-white/10 md:via-white/15 md:to-white/10 w-8 md:w-px md:h-8" />
                    </div>
                  </div>
                  <div className="md:col-span-5 md:pl-6 md:border-l md:border-white/10">
                    <div className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-chrome transition-all">
                      {row.to}
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — WHAT STAYS THE SAME
         ============================================================ */}
      <section className="py-24 md:py-32 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              // Immutable Principles
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              WHAT DOESN&apos;T CHANGE.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              Some things are too important to rename. These are the foundations
              that carried us here and will carry us forward.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {constants.map(({ label, title, body, Icon }, idx) => (
              <RevealSection key={title} delay={idx * 80}>
                <TiltCard maxTilt={6} glareOpacity={0.12}>
                  <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 hover:bg-neutral-900/70 transition-all h-full relative group overflow-hidden">
                    {/* Warm subtle accent glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200/5 rounded-full blur-[90px] pointer-events-none group-hover:bg-amber-200/10 transition-colors" />

                    <div className="relative space-y-5 flex flex-col h-full">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                          <Icon className="w-[22px] h-[22px] text-amber-200/90" />
                        </div>
                        <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
                          {label} / 04
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                          {title}
                        </h3>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {body}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — WHERE WE'RE GOING
         ============================================================ */}
      <section className="py-24 md:py-32 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              // Technical Roadmap
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
              WHERE WE&apos;RE GOING.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              Four disciplines, one engineering philosophy — systems that scale
              with intention.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map(({ title, body, Icon, accent }, idx) => (
              <RevealSection key={title} delay={idx * 80}>
                <TiltCard maxTilt={7} glareOpacity={0.14}>
                  <Link
                    href="/services"
                    className="group block relative p-8 sm:p-10 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 hover:bg-neutral-900/70 transition-all h-full overflow-hidden"
                  >
                    <div className="relative space-y-6 flex flex-col h-full">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl border border-white/15 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:scale-105 transition-all shadow-inner">
                          <Icon className={`w-6 h-6 ${accentMap[accent]}`} />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-[0.02em] group-hover:text-chrome transition-all">
                          {title}
                        </h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {body}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest group-hover:text-neutral-400 transition-colors">
                        <span>
                          {String(idx + 1).padStart(2, "0")} /{" "}
                          {String(pillars.length).padStart(2, "0")}
                        </span>
                        <span>EXPLORE →</span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 — FOR THE PEOPLE WHO WERE THERE BEFORE
         ============================================================ */}
      <section className="py-24 md:py-32 border-t border-white/10 bg-neutral-950/60 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <TiltCard maxTilt={3} glareOpacity={0.1}>
              <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl border border-white/15 bg-gradient-to-br from-neutral-900/80 via-neutral-900/50 to-neutral-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* Soft warm vignette for emotional tone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/[0.04] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                    <span className="w-2 h-2 rounded-full bg-amber-300/80 animate-pulse" />
                    <span className="font-mono text-[11px] tracking-widest text-neutral-300 uppercase">
                      To Our Clients & Partners
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight text-chrome">
                    IF YOU&apos;VE WORKED WITH US BEFORE — YOU&apos;RE PART OF
                    THIS STORY.
                  </h2>

                  <div className="space-y-5 text-neutral-300 leading-relaxed text-base sm:text-lg">
                    <p>
                      If we&apos;ve worked together under ArtistyCode Studio,
                      thank you.
                    </p>
                    <p>
                      Every project, conversation, challenge, and collaboration
                      helped shape what RIZMEC is becoming.
                    </p>
                    <p>The name is changing.</p>
                    <p>The ambition is growing.</p>
                    <p className="text-white font-semibold">
                      But the relationship continues.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </RevealSection>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — THE NEW IDENTITY
         ============================================================ */}
      <section className="py-24 md:py-36 border-t border-white/10 relative">
        <TechLine className="top-10 left-0 right-0" direction="h" />
        <TechLine className="top-0 bottom-0 left-12" direction="v" />
        <TechLine className="top-0 bottom-0 right-12" direction="v" />
        <TechLine className="bottom-10 left-0 right-0" direction="h" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealSection className="text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-neutral-300 uppercase">
                Identity Reveal
              </span>
            </div>

            {/* Large logo wordmark */}
            <div className="py-10 flex items-center justify-center">
              <RizmecLogo
                variant="white"
                size="xl"
                showWordmark={true}
                href={undefined}
              />
            </div>

            {/* Capability tagline line */}
            <div className="max-w-3xl mx-auto">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8" />
              <p className="font-mono text-xs sm:text-sm tracking-[0.18em] text-neutral-400 uppercase">
                SOFTWARE ENGINEERING &nbsp;·&nbsp; AI &nbsp;·&nbsp; AUTOMATION{" "}
                &nbsp;·&nbsp; INTELLIGENT DIGITAL INFRASTRUCTURE
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mt-8" />
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight text-chrome max-w-3xl mx-auto pt-4">
              Technology built from a different kind of intelligence.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ============================================================
          SECTION 8 — RECONNECT CTA
         ============================================================ */}
      <section className="py-28 md:py-36 border-t border-white/10 bg-black text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-widest uppercase">
                THE NEXT CHAPTER
              </span>
            </div>
          </RevealSection>

          <RevealSection delay={80}>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight text-chrome">
              LET&apos;S BUILD THE NEXT CHAPTER.
            </h2>
          </RevealSection>

          <RevealSection
            className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            delay={160}
          >
            Whether we&apos;ve worked together before or you&apos;re discovering
            RIZMEC for the first time, we&apos;d love to hear what you&apos;re
            building.
          </RevealSection>

          <RevealSection
            className="pt-4 flex flex-wrap justify-center gap-4"
            delay={220}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
            >
              <span>START A CONVERSATION</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase btn-glow-outline backdrop-blur-sm"
            >
              <span>EXPLORE RIZMEC</span>
            </Link>
          </RevealSection>

          {/* Contact channels */}
          <RevealSection className="pt-10" delay={300}>
            <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase mb-5">
              DIRECT CHANNELS
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="https://rizmec.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:border-white/30 hover:bg-white/[0.05] hover:text-white transition-all"
                aria-label="Visit rizmec.com"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>rizmec.com</span>
              </a>
              <a
                href="mailto:hello@rizmec.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:border-white/30 hover:bg-white/[0.05] hover:text-white transition-all"
                aria-label="Email RIZMEC"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>hello@rizmec.com</span>
              </a>
              <a
                href="https://wa.me/1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:border-white/30 hover:bg-white/[0.05] hover:text-white transition-all"
                aria-label="WhatsApp RIZMEC"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://linkedin.com/company/rizmec"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:border-white/30 hover:bg-white/[0.05] hover:text-white transition-all"
                aria-label="RIZMEC LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
