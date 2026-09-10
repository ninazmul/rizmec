"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  glowColor?: string;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glareOpacity = 0.15,
  glowColor = "rgba(255, 255, 255, 0.2)",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mouse position in percentage (0% to 100%) for dynamic specular glare
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  // Spring physics for buttery-smooth 3D tilt
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Center offset from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);

    setGlarePosition({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 ${className}`}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-2xl transition-shadow duration-300"
      >
        {/* Dynamic Pointer Follower Specular Glare */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl z-30 transition-opacity duration-300"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(400px circle at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Card Content with 3D Preservation */}
        <div className="relative w-full h-full preserve-3d">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
