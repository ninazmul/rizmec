import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Lock, Terminal, Cpu, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Trust Architecture — RIZMEC",
  description: "Enterprise security protocols, encryption benchmarks, and SOC2 readiness at RIZMEC.",
};

export default function SecurityPage() {
  return (
    <div className="pt-36 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="space-y-4">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Trust & Integrity
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Security & Cryptographic Architecture
        </h1>
        <p className="text-lg text-neutral-400 font-light leading-relaxed">
          How RIZMEC guarantees data integrity, tenant isolation, and verifiable zero-trust execution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-8 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <Lock className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white">Cryptographic Public Tokens</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            All public client document endpoints (quotations, invoices) utilize unpredictable 192-bit cryptographic entropy tokens, completely eliminating MongoDB object enumeration.
          </p>
        </div>

        <div className="p-8 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <FileCheck className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white">Immutable Document Snapshots</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            When a client electronically accepts a quotation, the entire document state is frozen into an immutable snapshot to prevent retroactive disputes.
          </p>
        </div>

        <div className="p-8 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <ShieldCheck className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white">Server-Side RBAC Enforcement</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Authorization gates operate strictly in Server Actions and Route Handlers. Frontend interface controls are purely cosmetic mirrors of server policies.
          </p>
        </div>

        <div className="p-8 rounded-xl border border-white/10 bg-neutral-950 space-y-3">
          <Terminal className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white">Tamper-Evident Audit Logging</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every administrative mutation, permission elevation, and financial transaction creates a non-repudiable audit record with IP, actor ID, and delta metadata.
          </p>
        </div>
      </div>
    </div>
  );
}
