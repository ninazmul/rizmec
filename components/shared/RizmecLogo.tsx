"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface RizmecLogoProps {
  className?: string;
  variant?: "auto" | "white" | "black";
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showTagline?: boolean;
  href?: string;
  iconOnly?: boolean;
}

export default function RizmecLogo({
  className = "",
  variant = "auto",
  size = "md",
  showWordmark = true,
  showTagline = false,
  href = "/",
  iconOnly = false,
}: RizmecLogoProps) {
  const sizes = {
    sm: { h: 28, wordmark: "text-lg", tag: "text-[9px]" },
    md: { h: 36, wordmark: "text-xl", tag: "text-[10px]" },
    lg: { h: 48, wordmark: "text-2xl", tag: "text-xs" },
    xl: { h: 64, wordmark: "text-3xl", tag: "text-sm" },
  };

  const currentSize = sizes[size] || sizes.md;

  // Determine which logo image to use based on variant
  let logoSrc: string;
  if (iconOnly) {
    logoSrc = "/assets/images/rizmec-icon.png";
  } else if (variant === "white") {
    logoSrc = "/assets/images/rizmec-white.png";
  } else if (variant === "black") {
    logoSrc = "/assets/images/rizmec-black.png";
  } else {
    // Auto: use white for dark mode (since site is dark by default)
    logoSrc = "/assets/images/rizmec-white.png";
  }

  // Tagline color
  let tagClass = "";
  if (variant === "white") {
    tagClass = "text-neutral-400";
  } else if (variant === "black") {
    tagClass = "text-neutral-600";
  } else {
    tagClass = "text-neutral-500 dark:text-neutral-400";
  }

  const logoContent = (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-opacity duration-200 ${className}`}
    >
      <Image
        src={logoSrc}
        alt="RIZMEC Logo"
        height={currentSize.h}
        width={iconOnly ? currentSize.h : currentSize.h * 5}
        className="h-auto w-auto object-contain shrink-0"
        style={{ height: currentSize.h, width: "auto" }}
        priority
        unoptimized
      />
      {showTagline && !iconOnly && (
        <span
          className={`font-mono font-medium tracking-[0.18em] uppercase ${currentSize.tag} ${tagClass} hidden sm:inline-block`}
        >
          Intelligence. Engineered.
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block group focus:outline-none"
        aria-label="RIZMEC Home"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
