"use client";

import React, { useState } from "react";
import RizmecLogo from "@/components/shared/RizmecLogo";
import { CheckCircle2, ShieldCheck, Printer, FileCheck2, AlertCircle, Layers } from "lucide-react";
import { signAndAcceptQuotation } from "@/lib/actions/quotation.actions";

interface Props {
  quotation: any;
}

export default function PublicQuoteView({ quotation: initialQuote }: Props) {
  const [quotation, setQuotation] = useState(initialQuote);
  const [signing, setSigning] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState(initialQuote.clientEmail || "");
  const [signatureText, setSignatureText] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isAccepted = quotation.status === "accepted";

  const handleSignAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please acknowledge and agree to the engineering terms.");
      return;
    }
    if (!signerName.trim() || !signatureText.trim()) {
      setError("Please provide your full legal name and typed signature.");
      return;
    }

    setSigning(true);
    setError("");

    const res = await signAndAcceptQuotation(quotation.secureToken, {
      signedByName: signerName.trim(),
      signedByEmail: signerEmail.trim(),
      signatureData: signatureText.trim(),
    });

    setSigning(false);

    if (res.success && res.data) {
      setQuotation(res.data);
      setSuccessMsg("Quotation successfully signed and accepted. Immutable snapshot created.");
    } else {
      setError(res.error || "Failed to submit signature.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            html, body {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #111827 !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #quote-print-card,
            #quote-print-card * {
              visibility: visible !important;
            }
            #quote-print-card {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #111827 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `,
      }} />

      <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:p-0 print:m-0 print:min-h-0">
        <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-full">
          {/* Web-only Top bar */}
          <div className="no-print flex items-center justify-between">
            <RizmecLogo variant="white" size="md" showTagline={true} />
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-mono font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Document</span>
            </button>
          </div>

          {/* Web-only Status Notification Banner */}
          {isAccepted ? (
            <div className="no-print p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <strong>DOCUMENT ACCEPTED & FROZEN:</strong> Signed electronically by{" "}
                <span className="text-white font-semibold">{quotation.signedByName}</span> on{" "}
                {new Date(quotation.signedAt).toLocaleDateString()} at{" "}
                {new Date(quotation.signedAt).toLocaleTimeString()}.
              </div>
            </div>
          ) : (
            <div className="no-print p-4 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3 text-neutral-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>SECURE CLIENT ACCESS TOKEN // VALID UNTIL: {new Date(quotation.validUntil).toLocaleDateString()}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/10 text-white">
                {quotation.status.toUpperCase()}
              </span>
            </div>
          )}

          {/* PRINTABLE QUOTE DOCUMENT CARD */}
          <div
            id="quote-print-card"
            className="bg-neutral-950 border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 print:border-none print:p-4 print:space-y-6 print:bg-white print:text-neutral-900"
          >
            {/* Quote Header: Brand & Status Stamp */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10 print:border-neutral-200">
              <div>
                <div className="print:hidden">
                  <RizmecLogo variant="white" size="md" showTagline={true} />
                </div>
                <div className="hidden print:block">
                  <RizmecLogo variant="black" size="md" showTagline={true} />
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${
                    isAccepted
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 print:border-emerald-600 print:text-emerald-700 print:bg-emerald-50"
                      : "border-white/20 text-neutral-300 bg-white/5 print:border-neutral-300 print:text-neutral-800 print:bg-neutral-50"
                  }`}
                >
                  {isAccepted ? "ACCEPTED & EXECUTED" : `STATUS: ${quotation.status.toUpperCase()}`}
                </span>
              </div>
            </div>

            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-white/10 print:border-neutral-200">
              <div>
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest print:text-neutral-600">
                  ENGINEERING SCOPE QUOTATION
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white print:text-neutral-900 mt-1">
                  {quotation.quoteNumber}
                </h1>
                <p className="text-sm font-mono text-neutral-400 print:text-neutral-600 mt-0.5">
                  PROJECT: <span className="text-white print:text-neutral-900 font-semibold">{quotation.projectName}</span>
                </p>
              </div>

              <div className="sm:text-right space-y-1 text-xs font-mono text-neutral-400 print:text-neutral-600">
                <div><strong className="text-white print:text-neutral-900">Issued By:</strong> RIZMEC Inc.</div>
                <div>100 Montgomery St, Suite 2400</div>
                <div>San Francisco, CA 94104</div>
                <div>
                  <a href="mailto:hello@rizmec.com" className="text-neutral-300 hover:text-white print:text-neutral-900 hover:underline">
                    hello@rizmec.com
                  </a>
                </div>
              </div>
            </div>

            {/* Client Info & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200">
                <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600 font-semibold">
                  Prepared For:
                </div>
                <div className="text-sm font-bold text-white print:text-neutral-900">{quotation.clientName}</div>
                {quotation.clientCompany && (
                  <div className="text-neutral-300 print:text-neutral-700 mt-0.5">{quotation.clientCompany}</div>
                )}
                <div className="text-neutral-400 print:text-neutral-600 mt-1">{quotation.clientEmail}</div>
                {quotation.clientPhone && <div className="text-neutral-400 print:text-neutral-600">{quotation.clientPhone}</div>}
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200 space-y-2">
                <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600 font-semibold">
                  Quotation Metadata:
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Generated Date:</span>
                  <span className="text-white print:text-neutral-900 font-medium">
                    {new Date(quotation.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Valid Through:</span>
                  <span className="text-white print:text-neutral-900 font-medium">
                    {new Date(quotation.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Payment Terms:</span>
                  <span className="text-white print:text-neutral-900 font-medium">{quotation.paymentTerms}</span>
                </div>
              </div>
            </div>

            {/* Project Description */}
            {quotation.description && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 print:text-neutral-700 font-semibold">
                  Project Scope Overview
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed print:text-neutral-800 font-sans">
                  {quotation.description}
                </p>
              </div>
            )}

            {/* Deliverables Table */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 print:text-neutral-700 font-semibold">
                Deliverable Breakdown & Pricing
              </div>
              <div className="overflow-x-auto rounded-lg border border-white/10 print:border-neutral-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-mono uppercase print:border-neutral-200 print:bg-neutral-100 print:text-neutral-900">
                      <th className="py-3 px-3">Deliverable Item</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-neutral-200 font-mono">
                    {(quotation.lineItems || []).map((item: any, idx: number) => (
                      <tr key={idx} className="print:bg-white">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white print:text-neutral-900">{item.item}</div>
                          {item.description && (
                            <div className="text-neutral-400 text-[11px] font-sans mt-0.5 print:text-neutral-600">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center text-neutral-300 print:text-neutral-800">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-3 text-right text-neutral-300 print:text-neutral-800">
                          {quotation.currency} {item.unitPrice?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-white print:text-neutral-900">
                          {quotation.currency} {item.total?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex justify-end pt-4 border-t border-white/10 print:border-neutral-200">
              <div className="w-full sm:w-80 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="text-white print:text-neutral-900 font-medium">
                    {quotation.currency} {quotation.subtotal?.toLocaleString()}
                  </span>
                </div>
                {quotation.discountTotal > 0 && (
                  <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                    <span>Discount:</span>
                    <span className="text-emerald-400 print:text-emerald-700 font-medium">
                      -{quotation.currency} {quotation.discountTotal?.toLocaleString()}
                    </span>
                  </div>
                )}
                {quotation.taxAmount > 0 && (
                  <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                    <span>Tax ({quotation.taxRate}%):</span>
                    <span className="text-white print:text-neutral-900 font-medium">
                      {quotation.currency} {quotation.taxAmount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2.5 border-t border-white/10 print:border-neutral-300 print:text-neutral-900">
                  <span>Total Scope:</span>
                  <span>
                    {quotation.currency} {quotation.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Schedule & Milestones */}
            {((quotation.paymentSchedule && quotation.paymentSchedule.length > 0) || quotation.paymentTerms) && (
              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4 print:bg-neutral-50 print:border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400 print:text-neutral-800" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white print:text-neutral-900">
                      Payment Schedule & Milestones
                    </span>
                  </div>
                  {quotation.paymentTerms && (
                    <span className="text-[11px] font-mono text-neutral-400 print:text-neutral-600">
                      {quotation.paymentTerms}
                    </span>
                  )}
                </div>

                {quotation.paymentSchedule && quotation.paymentSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px] print:border-neutral-200 print:text-neutral-600">
                          <th className="py-2 pr-3">Milestone</th>
                          <th className="py-2 px-3 text-center">Share</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 pl-3 text-left">Trigger / Deliverable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-neutral-200 text-xs">
                        {quotation.paymentSchedule.map((m: any, idx: number) => {
                          const milestoneAmount = Math.round(((quotation.totalAmount * (m.percent || 0)) / 100) * 100) / 100;
                          return (
                            <tr key={idx} className="print:text-neutral-900">
                              <td className="py-2.5 pr-3 font-bold text-white print:text-neutral-900">
                                {m.milestone}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold">
                                  {m.percent}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-white print:text-neutral-900">
                                {quotation.currency} {milestoneAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 pl-3 text-neutral-300 print:text-neutral-700 text-[11px]">
                                {m.trigger}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-neutral-300 print:text-neutral-800">
                    {quotation.paymentTerms}
                  </p>
                )}
              </div>
            )}

            {/* Terms & Conditions */}
            {quotation.termsConditions && (
              <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] space-y-2 text-xs font-mono print:bg-neutral-50 print:border-neutral-200">
                <div className="text-neutral-400 uppercase tracking-wider print:text-neutral-700 font-semibold">
                  Terms & Conditions:
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans print:text-neutral-800">
                  {quotation.termsConditions}
                </p>
              </div>
            )}

            {/* E-Signing Section */}
            <div className="pt-6 border-t border-white/10 print:border-neutral-200">
              {isAccepted ? (
                <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 print:border-emerald-600 print:bg-emerald-50 space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-800 font-bold uppercase tracking-wider">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Electronically Signed & Executed</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block">Signer Name:</span>
                      <span className="text-white print:text-neutral-900 font-bold">{quotation.signedByName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block">Signer Email:</span>
                      <span className="text-white print:text-neutral-900">{quotation.signedByEmail}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block">Timestamp:</span>
                      <span className="text-white print:text-neutral-900">
                        {new Date(quotation.signedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignAndAccept} className="space-y-6 no-print">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                      Acceptance & Electronic Signature
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      By executing this document, you confirm that you have read, understood, and agreed to the engineering deliverables, milestones, and commercial scope detailed above.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                        Legal Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Johnathan Doe"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                        Signer Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        placeholder="signer@company.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                      Electronic Signature (Type Full Legal Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      placeholder="/s/ Johnathan Doe"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-serif italic text-base focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 bg-neutral-900 text-white focus:ring-0"
                    />
                    <span className="text-xs text-neutral-400 leading-relaxed font-sans">
                      I legally attest that I possess the authority to authorize this scope on behalf of the client entity, and agree to the engineering terms outlined herein.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={signing}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all disabled:opacity-50"
                  >
                    {signing ? "Validating & Freezing..." : "Sign & Authorize Scope"}
                  </button>
                </form>
              )}
            </div>

            {/* Clean Formal Print Footer */}
            <div className="pt-6 border-t border-white/10 print:border-neutral-200 text-center text-[11px] text-neutral-500 print:text-neutral-500 font-mono">
              Thank you for partnering with RIZMEC Inc. • Intelligence. Engineered. • rizmec.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
