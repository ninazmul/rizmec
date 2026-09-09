import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowUpRight, Check, ArrowLeft, ExternalLink } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
import { getProductBySlug } from "@/lib/actions/product.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlug(slug);
  if (!res.success || !res.data) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${res.data.title} — RIZMEC Platforms`,
    description: res.data.summary,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Navigation */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Platforms</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-300">
            {product.category}
          </span>
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            {product.status === "active" ? "PRODUCTION GRADE" : "BETA"}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          {product.title}
        </h1>
        <p className="text-xl sm:text-2xl text-neutral-400 font-light leading-relaxed">
          {product.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all"
          >
            <span>Request Enterprise Access</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          {product.githubUrl && (
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-mono text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Core</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Content & Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        <div className="lg:col-span-8 space-y-12">
          {/* Detailed Summary */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">System Specification</h2>
            <p className="text-neutral-400 text-base leading-relaxed font-light">
              {product.description || product.summary}
            </p>
          </div>

          {/* Screenshots */}
          {product.screenshots && product.screenshots.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Telemetry & Interface
              </h3>
              <div className="space-y-4">
                {product.screenshots.map((s: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-white/10 bg-neutral-900"
                  >
                    <img
                      src={s.url}
                      alt={s.caption || product.title}
                      className="w-full h-auto object-cover"
                    />
                    {s.caption && (
                      <div className="p-3 text-xs font-mono text-neutral-400 border-t border-white/10 bg-black">
                        {s.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Architecture Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(product.features || []).map((feat: string) => (
                <div
                  key={feat}
                  className="p-5 rounded-xl border border-white/10 bg-neutral-950 flex items-start gap-3"
                >
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-300 leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Tiers if available */}
          {product.pricingTiers && product.pricingTiers.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Deployment Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.pricingTiers.map((tier: any) => (
                  <div
                    key={tier.name}
                    className={`p-8 rounded-2xl border ${
                      tier.isPopular ? "border-white bg-white/[0.03]" : "border-white/10 bg-neutral-950"
                    } space-y-6 flex flex-col justify-between`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                          {tier.name}
                        </span>
                        {tier.isPopular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white text-black font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white font-mono">{tier.price}</div>
                        <div className="text-xs text-neutral-400 font-mono mt-0.5">{tier.period}</div>
                      </div>
                      <p className="text-xs text-neutral-400">{tier.description}</p>
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        {(tier.features || []).map((f: string) => (
                          <div key={f} className="text-xs text-neutral-300 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="w-full text-center py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all"
                    >
                      Select Tier
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Technical Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {(product.techStack || []).map((t: string) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded text-xs font-mono bg-white/5 text-white border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Support & SLA
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Includes 24/7 dedicated SRE support channel, weekly security scans, and continuous telemetry monitoring.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                <span>Deploy Platform</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
