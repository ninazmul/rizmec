"use client";

import React, { useState } from "react";
import { Star, Quote, ShieldCheck, Pause, Play } from "lucide-react";

interface TestimonialItem {
  _id: string;
  clientName: string;
  company: string;
  position: string;
  avatar?: string;
  content: string;
  rating?: number;
}

interface TestimonialsMarqueeProps {
  testimonials: TestimonialItem[];
}

function TestimonialAvatar({
  avatar,
  name,
}: {
  avatar?: string;
  name: string;
}) {
  const [imageError, setImageError] = useState(false);

  // If no avatar, or is a placeholder filename that might be missing, or failed loading
  const isInvalidAvatar =
    !avatar ||
    avatar.trim() === "" ||
    avatar.includes("placeholder") ||
    imageError;

  const firstLetter = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (isInvalidAvatar) {
    return (
      <div
        className="w-11 h-11 rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 flex items-center justify-center shrink-0 shadow-inner shadow-cyan-500/10"
        title={name}
      >
        <span className="text-sm font-bold text-cyan-300 tracking-wider">
          {firstLetter}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-11 h-11 shrink-0">
      <img
        src={avatar}
        alt={name}
        onError={() => setImageError(true)}
        className="w-11 h-11 rounded-full object-cover border border-white/15 grayscale hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const rating = item.rating && item.rating > 0 ? item.rating : 5;

  return (
    <div className="group relative w-[340px] sm:w-[400px] shrink-0 p-7 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-cyan-500/40 hover:bg-neutral-900/80 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 select-none">
      {/* Top ambient highlight on card hover */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header: Rating & Quote Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-neutral-700"
              }`}
            />
          ))}
          <span className="ml-1.5 text-[11px] font-mono text-neutral-400">
            5.0
          </span>
        </div>
        <Quote className="w-5 h-5 text-white/10 group-hover:text-cyan-400/30 transition-colors" />
      </div>

      {/* Quote text */}
      <p className="text-sm text-neutral-300 leading-relaxed italic line-clamp-4">
        &ldquo;{item.content}&rdquo;
      </p>

      {/* Footer: Avatar + Client Info + Verified tag */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <TestimonialAvatar avatar={item.avatar} name={item.clientName} />
          <div className="min-w-0">
            <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {item.clientName}
            </div>
            <div className="text-xs text-neutral-400 font-mono truncate">
              {item.position ? `${item.position}, ` : ""}
              {item.company}
            </div>
          </div>
        </div>

        <div
          className="shrink-0 ml-2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest bg-cyan-500/5 border border-cyan-500/20 px-2 py-0.5 rounded-full"
          title="Verified Client"
        >
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate items enough times so the marquee is continuous with no empty gaps
  // We repeat at least until we have 8+ items in a single track
  let itemsToLoop = [...testimonials];
  while (itemsToLoop.length < 8) {
    itemsToLoop = [...itemsToLoop, ...testimonials];
  }

  return (
    <section className="py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            // Client Validation
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight text-chrome">
            Verified Partner Feedback
          </h2>
        </div>

        {/* Auto-scroll status & Pause toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-scrolling • Hover card to pause</span>
          </div>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume auto scroll" : "Pause auto scroll"}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-neutral-400" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Carousel Track with Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent z-10" />

        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#09090b] via-[#09090b]/80 to-transparent z-10" />

        {/* Marquee Row */}
        <div
          className={`animate-marquee flex items-stretch gap-6 py-4 px-3 ${
            isPaused ? "animate-marquee-paused" : ""
          }`}
          style={
            {
              "--marquee-duration": `${Math.max(itemsToLoop.length * 5, 30)}s`,
            } as React.CSSProperties
          }
        >
          {/* First set */}
          {itemsToLoop.map((t, idx) => (
            <TestimonialCard key={`track-a-${t._id || idx}-${idx}`} item={t} />
          ))}
          {/* Second duplicate set for seamless -50% translateX loop */}
          {itemsToLoop.map((t, idx) => (
            <TestimonialCard key={`track-b-${t._id || idx}-${idx}`} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
