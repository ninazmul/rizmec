import React from 'react';
import { Metadata } from 'next';
import { YouTubePlaylist } from '@/components/YouTubePlaylist';

export const metadata: Metadata = {
  title: 'Video Ads & Reels — RIZMEC',
  description:
    'Explore our curated collection of short-form reels and full-length video ads from RIZMEC — crafted to captivate and convert at scale.',
};

export default function AdsPage() {
  const playlistId = 'PLE5kaJHpWsA0';

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/[0.06] blur-[200px] rounded-full pointer-events-none" />

      {/* Header */}
      <section className="pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono tracking-widest text-red-400 uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            // Video Content Gallery
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-chrome">
            Our Ads &amp; Reels
          </h1>
          <p className="text-lg text-neutral-400 font-light leading-relaxed max-w-2xl">
            Short-form reels in 9:16 and full-length videos in 16:9 — all
            engineered to amplify brand presence and drive measurable impact.
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <YouTubePlaylist playlistId={playlistId} />
      </section>
    </div>
  );
}
