import React from "react";
import Link from "next/link";
import RizmecLogo from "./RizmecLogo";
import { ArrowUpRight, Globe } from "lucide-react";
import { CopyCodeButton } from "./CopyCodeButton";

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
  const serviceCategories = [
    { label: "Custom Software Engineering", href: "/services#custom-software" },
    { label: "AI & Intelligent Automation", href: "/services#ai-automation" },
    { label: "Education Technology", href: "/services#edtech" },
    { label: "Cloud & Distributed Systems", href: "/services#cloud" },
    { label: "Video Ads & Media Production", href: "/ads" },
  ];

  const industryLinks = [
    { label: "Education & Consultancies", href: "/industries/education-technology" },
    { label: "Startups & Emerging Tech", href: "/industries#startups" },
    { label: "Professional Services & SMEs", href: "/industries#smes" },
    { label: "E-Commerce & Digital Platforms", href: "/industries#ecommerce" },
  ];

  const productLinks = [
    { label: "Rizmec PartnerOS", href: "/products/partneros" },
    { label: "Custom Business ERPs", href: "/services#custom-software" },
    { label: "Workflow Automation Engines", href: "/services#ai-automation" },
  ];

  const company = [
    { label: "About Rizmec", href: "/about" },
    { label: "Case Studies & Work", href: "/work" },
    { label: "Engineering Leadership", href: "/about#leadership" },
    { label: "Discuss Your Project", href: "/contact" },
    { label: "Client Portal", href: "/dashboard" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Engineering", href: "/terms" },
    { label: "Security & Architecture", href: "/security" },
  ];

  return (
    <footer className="bg-black text-neutral-400 border-t border-white/10 pt-20 pb-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand Statement & Coordinates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-4 space-y-6">
            <RizmecLogo variant="white" size="lg" showTagline={true} />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-sans">
              Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale.
              From bespoke business platforms to intelligent automation, we build software designed for long-term reliability.
            </p>
            <div className="text-xs font-mono text-neutral-400 space-y-1">
              <div>// RIZ-mek</div>
              <div>From algorithms to engineered intelligence.</div>
            </div>
            <div className="flex items-center gap-4 text-neutral-400 pt-2">
              <a
                href="https://github.com/ninazmul"
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

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-white uppercase mb-5 font-semibold">
                Services
              </h4>
              <ul className="space-y-3 text-xs">
                {serviceCategories.map((item) => (
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
                Industries
              </h4>
              <ul className="space-y-3 text-xs">
                {industryLinks.map((item) => (
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
                {productLinks.map((item) => (
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
                Company
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

        {/* Middle Tier: Genuine International Market Coverage */}
        <div className="py-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-semibold">ENGINEERING ORIGIN:</span>
            <span>DHAKA, BANGLADESH</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-neutral-400">
            <span className="text-neutral-500">CLIENT MARKETS SERVED:</span>
            <span className="text-neutral-300">UNITED KINGDOM</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">AUSTRALIA</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">UNITED ARAB EMIRATES</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">INTERNATIONAL</span>
          </div>
        </div>

        {/* Hostinger Official Partner Tier */}
        <div className="py-6 border-b border-white/10">
          <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#673DE6]/10 via-neutral-950 to-[#673DE6]/10 p-4 sm:px-5 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a
                  href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                  aria-label="Hostinger Official Partner"
                >
                  <img
                    src="/assets/hostinger/badge-brand-dark-320x120.png"
                    alt="Hostinger Official Partner"
                    width="120"
                    height="45"
                    className="h-7 w-auto hover:opacity-90 transition-opacity"
                  />
                </a>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">
                    Official Hostinger Technology Partner
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Use referral promo code <CopyCodeButton code="RIZMEC" /> for an exclusive 20% discount on cloud hosting.
                  </div>
                </div>
              </div>
              <a
                href="https://www.hostinger.com?REFERRALCODE=RIZMEC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#673DE6] text-white font-mono text-[11px] font-semibold tracking-wider uppercase hover:bg-[#5833c7] transition-colors shrink-0"
              >
                <span>Claim Offer</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} RIZMEC. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
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
