"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RizmecLogo from "./RizmecLogo";
import { Menu, X, ArrowUpRight, Activity } from "lucide-react";

export default function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Capabilities", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Engineering", href: "/work" },
    { label: "Team", href: "/team" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Live Telemetry */}
          <div className="flex items-center gap-6">
            <RizmecLogo variant="white" size="md" showWordmark={true} />
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-neutral-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="tracking-wider">SYS_OPERATIONAL</span>
              <span className="text-neutral-600">|</span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                99.999%
              </span>
            </div>
          </div>

          {/* Desktop Navigation Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/70 p-1.5 rounded-full border border-white/15 backdrop-blur-xl shadow-xl">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black shadow-lg font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors px-3 py-2 uppercase"
            >
              PORTAL
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase group btn-shimmer btn-glow"
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/contact"
              className="px-3.5 py-1.5 text-xs font-semibold bg-white text-black rounded-full uppercase tracking-wider btn-shimmer btn-glow"
            >
              Engage
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-8 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg font-mono transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm uppercase tracking-wider text-neutral-400 hover:text-white rounded-lg font-mono transition-colors"
            >
              Client / Employee Portal
            </Link>
          </div>
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase btn-shimmer btn-glow"
            >
              <span>Initiate Engineering Engagement</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
