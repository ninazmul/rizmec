import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/actions/product.actions";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Proprietary Platforms & Developer Tools — RIZMEC",
  description:
    "Explore RIZMEC's suite of proprietary software engines, SaaS platforms, and developer infrastructure: VectorFlow AI, HyperEdge Orchestrator, and Synthetix.",
};

export default async function ProductsCatalogPage() {
  const res = await getProducts({ published: true });
  const products = res.success ? res.data : [];

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Product Ecosystem
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Engineered platforms built from our own hard problems.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Proprietary neural gateways, multi-cloud Kubernetes orchestrators, and high-performance API event meshes developed by RIZMEC and deployed into production worldwide.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {products.map((product: any) => (
          <div
            key={product.slug}
            className="p-8 sm:p-12 rounded-2xl border border-white/10 bg-neutral-950 hover:border-white/30 transition-all flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border border-white/15 bg-white/5 text-neutral-300">
                  {product.category}
                </span>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                  {product.status === "active" ? "PRODUCTION" : "BETA"}
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {product.title}
                </h2>
                <p className="text-sm font-mono text-neutral-400 mt-1">
                  {product.tagline}
                </p>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {product.summary}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {(product.features || []).map((feat: string) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {(product.techStack || []).slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-neutral-400 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all"
              >
                <span>Inspect Platform</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
