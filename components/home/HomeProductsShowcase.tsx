"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

interface HomeProductsShowcaseProps {
  products: any[];
}

export function HomeProductsShowcase({ products }: HomeProductsShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = products.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 7000);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (!products || products.length === 0) {
    return null;
  }

  const current = products[currentIndex] || products[0];

  const statusLabel =
    current.status === "internal"
      ? "INTERNAL PLATFORM"
      : current.status === "prototype"
      ? "ARCHITECTURE PROTOTYPE"
      : current.status === "concept"
      ? "CONCEPT BLUEPRINT"
      : "PRODUCTION READY";

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      className="py-24 border-t border-white/10 bg-neutral-950/80 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        {/* Top Header & Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-400" />
              // Engineered Products &amp; Platforms
            </span>
            <div className="text-sm text-neutral-400 font-sans">
              Proprietary software engines, business platforms, and deployment blueprints engineered by Rizmec.
            </div>
          </div>

          {/* Carousel Navigation Tabs & Controls */}
          {total > 1 && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Product quick tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 max-w-full overflow-x-auto">
                {products.map((p, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={p.slug || idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-white text-black font-bold shadow-md"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-[10px] opacity-60 mr-1.5">
                        0{idx + 1}
                      </span>
                      <span>{p.title?.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous product"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next product"
                  className="p-2 rounded-lg border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider pl-2"
              >
                <span>All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Animated Full-Space Product Showcase (Previous Manual UI Layout) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug || currentIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column: Product Context & Capabilities (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-400" />
                  // {current.category || "Software Platform"}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-neutral-300 uppercase">
                  {statusLabel}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
                  {current.title}
                </h2>
                {current.tagline && (
                  <p className="text-sm sm:text-base font-mono text-cyan-300 mt-2">
                    {current.tagline}
                  </p>
                )}
              </div>

              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-sans">
                {current.summary}
              </p>

              {/* 2x2 Feature Highlights Grid (Matching Previous Manual UI) */}
              {current.features && current.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {current.features.slice(0, 4).map((feat: string, idx: number) => {
                    const parts = feat.includes(":") ? feat.split(":") : null;
                    const title = parts ? parts[0].trim() : feat;
                    const desc = parts ? parts[1].trim() : null;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1 hover:border-white/20 transition-colors"
                      >
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{title}</span>
                        </div>
                        {desc && (
                          <p className="text-xs text-neutral-400 font-sans pl-6">
                            {desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/products/${current.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow group"
                >
                  <span>Inspect Blueprint</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {current.url && (
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs tracking-wider uppercase hover:bg-cyan-500/20 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Launch Live Platform</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
                >
                  <span>Discuss Requirements</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Visual & Telemetry Card (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <TiltCard maxTilt={6} glareOpacity={0.16}>
                <div className="p-8 rounded-3xl border border-white/15 bg-neutral-900/60 backdrop-blur-2xl space-y-6 shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
                      <Boxes className="w-4 h-4 text-emerald-400" />
                      <span className="truncate max-w-[200px]">
                        {(current.slug || "platform")
                          .toUpperCase()
                          .replace(/-/g, "_")}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {statusLabel}
                    </span>
                  </div>

                  {/* Visual: Image Preview if uploaded, otherwise Architecture Stack */}
                  {current.image ? (
                    <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-neutral-950 relative group">
                      <img
                        src={current.image}
                        alt={current.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90">
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10">
                          {current.category}
                        </span>
                        {current.url && (
                          <span className="flex items-center gap-1 text-cyan-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                            <Globe className="w-3 h-3" />
                            <span>Live Deployed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Architecture Specification Cards */}
                  <div className="space-y-3 font-mono text-xs text-neutral-300">
                    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                      <div className="text-white font-semibold flex items-center justify-between">
                        <span>Core Architecture Model</span>
                        <span className="text-[10px] text-cyan-400">Production Tested</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        {current.summary}
                      </div>
                    </div>

                    {current.techStack && current.techStack.length > 0 && (
                      <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-2">
                        <div className="text-white font-semibold flex items-center justify-between">
                          <span>Technology Stack</span>
                          <span className="text-[10px] text-emerald-400">Modern Infrastructure</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {current.techStack.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Status */}
                  <div className="pt-2 text-[11px] font-mono text-neutral-500 flex items-center justify-between border-t border-white/5">
                    <span>Tailored to Your Operations</span>
                    <span className="text-emerald-400">Verifiable Codebase</span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rotation Indicators (Dots & Timer feedback) */}
        {total > 1 && (
          <div className="pt-4 flex items-center justify-between border-t border-white/5 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">PLATFORM</span>
              <span className="text-white font-bold">
                0{currentIndex + 1} / 0{total}
              </span>
              <span className="text-neutral-600">//</span>
              <span className="text-neutral-400 truncate max-w-[200px] sm:max-w-none">
                {current.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {products.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to product ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    dotIdx === currentIndex
                      ? "w-8 bg-emerald-400"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
