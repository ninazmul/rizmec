"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyberGlowMeshProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function CyberGlowMesh({ className = "", intensity = "medium" }: CyberGlowMeshProps) {
  const opacityMap = {
    low: "opacity-25",
    medium: "opacity-40",
    high: "opacity-60",
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${opacityMap[intensity]} ${className}`}>
      {/* Deep Spatial Orb 1 (Cyan/Teal) */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px]"
      />

      {/* Deep Spatial Orb 2 (Violet/Indigo) */}
      <motion.div
        animate={{
          x: [0, -50, 20, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-24 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px]"
      />

      {/* Accent Emerald Core Orb */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-[150px]"
      />
    </div>
  );
}
