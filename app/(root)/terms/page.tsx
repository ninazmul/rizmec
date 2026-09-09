import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Engineering Services — RIZMEC",
  description: "Standard terms and conditions governing RIZMEC engineering deliverables.",
};

export default function TermsPage() {
  return (
    <div className="pt-36 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Legal Terms
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Master Engineering Agreement Terms
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          LAST REVISED: MARCH 2026 // VERSION 4.1
        </p>
      </div>

      <div className="prose prose-invert prose-neutral max-w-none text-neutral-400 text-sm leading-relaxed space-y-8 font-sans">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Scope of Engagement</h2>
          <p>
            These Terms govern all engineering deliverables, statements of work (SOWs), quotations, and software platform licenses executed between RIZMEC Inc. and the client entity specified in the relevant agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Electronic Quotations & Immutable Signatures</h2>
          <p>
            Quotations generated via the RIZMEC business platform and accepted electronically by the client constitute legally binding agreements. Upon client electronic signing, an immutable cryptographic snapshot of the quotation terms, line items, and schedule is recorded.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Intellectual Property Transfer</h2>
          <p>
            Unless explicitly negotiated otherwise, all custom source code, documentation, and architectural artifacts developed under a project are transferred to the client upon receipt of full milestone payment, subject to standard non-exclusive open-source library inclusions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Warranties & System SLAs</h2>
          <p>
            RIZMEC warrants that software deliverables will conform to specified technical acceptance criteria. Maintenance and SLA support agreements are governed by the specific tier designated in the engagement schedule.
          </p>
        </section>
      </div>
    </div>
  );
}
