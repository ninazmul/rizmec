"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RizmecLogo from "./RizmecLogo";
import { Menu, X, ArrowUpRight, Cpu } from "lucide-react";

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
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Products", href: "/products" },
    { label: "Case Studies", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Telemetry */}
          <div className="flex items-center gap-5">
            <RizmecLogo variant="white" size="md" showWordmark={true} />
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-neutral-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="tracking-wider">ENGINEERED INTELLIGENCE</span>
              <span className="text-neutral-600">|</span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-400" />
                GLOBAL DELIVERY
              </span>
            </div>
          </div>

          {/* Desktop Navigation Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/80 p-1.5 rounded-full border border-white/15 backdrop-blur-xl shadow-xl">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
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
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase group btn-shimmer btn-glow shadow-md hover:bg-neutral-200 transition-all"
            >
              <span>Discuss Your Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/contact"
              className="px-3.5 py-1.5 text-xs font-semibold bg-white text-black rounded-full uppercase tracking-wider btn-shimmer btn-glow"
            >
              Discuss Project
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-2xl border border-white/15 bg-neutral-950/95 backdrop-blur-2xl shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-white text-black font-bold"
                        : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
