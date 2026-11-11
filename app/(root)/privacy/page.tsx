import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RIZMEC",
  description: "Enterprise privacy policy and data governance practices at RIZMEC.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-36 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Legal & Compliance
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Privacy Policy & Data Governance
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          LAST REVISED: MARCH 2026 // VERSION 3.2
        </p>
      </div>

      <div className="prose prose-invert prose-neutral max-w-none text-neutral-400 text-sm leading-relaxed space-y-8 font-sans">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Commitment to Client Data Sovereignty</h2>
          <p>
            RIZMEC (&quot;RIZMEC&quot;, &quot;we&quot;, &quot;our&quot;) maintains a strict commitment to data privacy, confidentiality, and technical integrity. We engineer custom software solutions designed with security-conscious practices, adhering to international data protection principles including GDPR and CCPA requirements where applicable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Information Collection & Usage</h2>
          <p>
            We collect information provided directly by clients and prospective partners solely for the purpose of architectural scoping, project execution, and technical communication. This includes business contact details, technical specifications, and project briefs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Client Data & AI Integrations</h2>
          <p>
            RIZMEC enforces a strict confidentiality policy regarding client proprietary data. Client data processed through custom software, AI integration pipelines, or automated workflows is never used to train generalized foundation models without explicit authorization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Security Controls & Encryption</h2>
          <p>
            All data at rest is encrypted using AES-256-GCM. All data in transit is encrypted using TLS 1.3. Cryptographic tokens and audit snapshots are immutably signed to prevent tampering.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">5. Contact Information</h2>
          <p>
            For privacy inquiries or compliance requests, contact our Data Governance Officer at <span className="text-white font-mono">privacy@rizmec.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
