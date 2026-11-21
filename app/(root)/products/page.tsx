import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Globe } from "lucide-react";
import { getProducts } from "@/lib/actions/product.actions";
import { TiltCard } from "@/components/ui/TiltCard";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products & Developer Infrastructure — RIZMEC Software Systems",
  description:
    "Explore RIZMEC's suite of proprietary software engines, SaaS platforms, and developer infrastructure built by our engineering teams.",
  keywords: [
    "RIZMEC products",
    "RIZMEC software tools",
    "developer infrastructure",
    "SaaS tools",
    "proprietary software",
  ],
  alternates: {
    canonical: "https://rizmec.com/products",
  },
};

export default async function ProductsCatalogPage() {
  const res = await getProducts({ published: true });
  const products = res.success ? res.data : [];

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          // Solution Blueprints &amp; Platforms
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Engineered platforms &amp; solution blueprints.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed font-sans">
          Rizmec engineers repeatable software architectures, internal platforms, and functional prototypes that accelerate our custom engineering engagements. The solutions below represent our internal tools, proprietary architectures, and engineering prototypes.
        </p>
      </div>

      {/* Products Grid with 3D Tilt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {products.map((product: any) => {
          const statusLabel =
            product.status === "internal"
              ? "INTERNAL PLATFORM"
              : product.status === "prototype"
              ? "ARCHITECTURE PROTOTYPE"
              : product.status === "concept"
              ? "CONCEPT BLUEPRINT"
              : "PRODUCTION READY";

          return (
            <TiltCard key={product.slug} maxTilt={6} glareOpacity={0.16}>
              <div className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl hover:border-white/30 transition-all flex flex-col justify-between space-y-8 h-full group">
                <div className="space-y-6">
                  {/* Product Image preview if provided */}
                  {product.image && (
                    <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-neutral-950 relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-200">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {product.title}
                    </h2>
                    {product.tagline && (
                      <p className="text-sm font-mono text-cyan-300 mt-1">
                        {product.tagline}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {product.summary}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-white/5">
                    {(product.features || []).map((feat: string) => (
                      <div
                        key={feat}
                        className="flex items-start gap-2.5 text-xs text-neutral-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(product.techStack || []).slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 text-neutral-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider uppercase transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live Site</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                      </a>
                    )}
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider btn-shimmer btn-glow"
                    >
                      <span>Inspect Platform</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
