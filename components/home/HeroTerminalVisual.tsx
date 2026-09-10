"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from "lucide-react";

export function HeroTerminalVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 relative w-full"
    >
      {/* Background Glow Ring */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-xl opacity-50 pointer-events-none" />

      {/* Floating Badge overlay on top */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-30 glass px-4 py-2.5 rounded-xl border border-white/25 bg-[#121218]/95 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-none"
      >
        <Sparkles
          className="w-4 h-4 text-amber-300 animate-spin"
          style={{ animationDuration: "6s" }}
        />
        <span className="text-[11px] font-bold text-white uppercase tracking-wider">
          AI & Cloud Ecosystems
        </span>
      </motion.div>

      {/* Code / Architecture Window Card */}
      <div className="relative glass rounded-3xl p-6 border border-white/15 bg-neutral-950/70 backdrop-blur-xl shadow-2xl overflow-hidden group">
        {/* Ambient Glows inside Card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />

        {/* Window Controls Header */}
        <div className="relative flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-white/40 text-[11px] font-mono">
            <Terminal className="w-3.5 h-3.5 text-white/50" />
            <span>rizmec.config.ts</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              Active
            </span>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="relative font-mono text-xs text-white/75 space-y-2.5 leading-relaxed overflow-x-auto py-2">
          <p className="text-white/40">// Enterprise System Blueprint</p>
          <p>
            <span className="text-purple-400 font-semibold">import</span>{" "}
            {"{"} <span className="text-cyan-300">Studio</span> {"}"}{" "}
            <span className="text-purple-400 font-semibold">from</span>{" "}
            <span className="text-emerald-300">&quot;@rizmec/core&quot;</span>;
          </p>
          <br />
          <p>
            <span className="text-purple-400 font-semibold">export const</span>{" "}
            <span className="text-yellow-300 font-semibold">app</span> ={" "}
            <span className="text-purple-400 font-semibold">new</span>{" "}
            <span className="text-cyan-300">Studio</span>({"{"}
          </p>
          <p className="pl-4">
            <span className="text-white/60">architecture:</span>{" "}
            <span className="text-emerald-300">&quot;Cloud Native&quot;</span>,
          </p>
          <p className="pl-4">
            <span className="text-white/60">stack:</span> [
            <span className="text-emerald-300">&quot;Next.js&quot;</span>,{" "}
            <span className="text-emerald-300">&quot;TypeScript&quot;</span>,{" "}
            <span className="text-emerald-300">&quot;AI&quot;</span>],
          </p>
          <p className="pl-4">
            <span className="text-white/60">performance:</span>{" "}
            <span className="text-yellow-300 font-semibold">100</span>,
          </p>
          <p className="pl-4">
            <span className="text-white/60">security:</span>{" "}
            <span className="text-emerald-300">&quot;Enterprise Grade&quot;</span>,
          </p>
          <p>{"}"});</p>
          <br />
          <p className="text-emerald-400 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>await app.deploy(); // Deployed to Edge</span>
          </p>
        </div>

        {/* Interactive Feature Pills inside Card */}
        <div className="relative grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 p-3 rounded-xl glass border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white">100/100 Score</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider">
                Lighthouse CWV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl glass border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white">SOC-2 Standards</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider">
                Security First
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
