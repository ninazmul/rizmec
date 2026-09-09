import React from "react";
import Link from "next/link";
import RizmecLogo from "./RizmecLogo";
import { ArrowUpRight, Globe, Sparkles } from "lucide-react";

// Inline SVGs for social icons not available in this lucide-react version
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

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

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function PublicFooter() {
  const capabilities = [
    { label: "Applied AI & Agent Swarms", href: "/services/ai-systems" },
    { label: "Cloud Systems & Resiliency", href: "/services/cloud-systems" },
    { label: "High-Throughput Web Apps", href: "/services/web-applications" },
    { label: "Enterprise SaaS Platforms", href: "/services/enterprise-saas" },
    { label: "Mobile Systems", href: "/services/mobile-applications" },
    { label: "Algorithmic Automation", href: "/services/automation" },
  ];

  const products = [
    { label: "VectorFlow AI Engine", href: "/products/vectorflow-ai" },
    { label: "HyperEdge Orchestrator", href: "/products/hyperedge" },
    { label: "Synthetix API Gateway", href: "/products/synthetix" },
    { label: "OmniLedger FinTech", href: "/products/omniledger" },
  ];

  const company = [
    { label: "Engineering Ethos", href: "/about" },
    { label: "Technical Leadership", href: "/team" },
    { label: "Selected Case Studies", href: "/work" },
    { label: "Enterprise Inquiries", href: "/contact" },
    { label: "Client Portal", href: "/dashboard" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Engineering", href: "/terms" },
    { label: "Security & Compliance", href: "/security" },
  ];

  return (
    <footer className="bg-black text-neutral-400 border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand Statement & Coordinates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-6">
            <RizmecLogo variant="white" size="lg" showTagline={true} />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md font-sans">
              RIZMEC is a premier global technology engineering company. We
              architect, build, and operate mission-critical software systems,
              autonomous AI pipelines, and distributed cloud infrastructures
              that power modern enterprise scale.
            </p>
            <div className="flex items-center gap-4 text-neutral-400">
              <a
                href="https://github.com/rizmec"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/rizmec"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/rizmec_tech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-white hover:border-white/40 transition-colors"
                aria-label="X (Twitter)"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase mb-5 font-semibold">
                Capabilities
              </h4>
              <ul className="space-y-3 text-xs">
                {capabilities.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase mb-5 font-semibold">
                Platforms
              </h4>
              <ul className="space-y-3 text-xs">
                {products.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase mb-5 font-semibold">
                Enterprise
              </h4>
              <ul className="space-y-3 text-xs">
                {company.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Tier: Global Locations */}
        <div className="py-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>GLOBAL HUBS:</span>
          </div>
          <div className="flex flex-wrap gap-6 text-neutral-400">
            <span>SAN FRANCISCO [37.77° N, 122.41° W]</span>
            <span>LONDON [51.50° N, 0.12° W]</span>
            <span>TOKYO [35.67° N, 139.65° E]</span>
            <span>SINGAPORE [1.35° N, 103.81° E]</span>
          </div>
        </div>

        {/* Hostinger Official Partner Tier */}
        <div className="py-10 border-b border-white/10">
          <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#673DE6]/10 via-neutral-950 to-[#673DE6]/10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hostinger Official Partner — Claim 20% Off"
                  className="shrink-0"
                >
                  <img
                    src="/assets/hostinger/Badge_brand_dark_320×120.png"
                    alt="Hostinger Official Partner"
                    width="160"
                    height="60"
                    className="w-40 sm:w-44 h-auto hover:opacity-90 transition-opacity"
                  />
                </a>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9D80F4] uppercase font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Hostinger Partner Program</span>
                  </div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed max-w-xl">
                    RIZMEC clients receive an exclusive{" "}
                    <span className="text-white font-bold">EXTRA 20% OFF</span>{" "}
                    on any Hostinger plan — auto-applied via link, or use code{" "}
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono font-bold text-xs select-all">
                      RIZMEC
                    </span>{" "}
                    at checkout. Valid on your first purchase.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-black/50">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Promo Code
                  </span>
                  <span className="text-sm font-black text-white font-mono tracking-widest select-all">
                    RIZMEC
                  </span>
                </div>
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#673DE6] text-white font-mono text-[11px] font-semibold tracking-widest uppercase hover:bg-[#5A32CC] active:scale-95 transition-all shadow shadow-[#673DE6]/20 group"
                >
                  <span>Get 20% Off Hosting</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} RIZMEC Inc. All technical rights
            reserved. "Intelligence. Engineered." is a registered mark.
          </div>
          <div className="flex items-center gap-6">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-neutral-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
