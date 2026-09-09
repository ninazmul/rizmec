"use client";

import React, { useState } from "react";
import RizmecLogo from "@/components/shared/RizmecLogo";
import { CheckCircle2, ShieldCheck, Printer, FileCheck2, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:p-0">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between print:hidden">
          <RizmecLogo variant="white" size="md" showTagline={true} />
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Document</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {isAccepted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <strong>DOCUMENT ACCEPTED & FROZEN:</strong> Signed electronically by{" "}
              <span className="text-white">{quotation.signedByName}</span> on{" "}
              {new Date(quotation.signedAt).toLocaleDateString()} at{" "}
              {new Date(quotation.signedAt).toLocaleTimeString()}.
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-3 text-neutral-400 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>SECURE CLIENT ACCESS TOKEN // VALID UNTIL: {new Date(quotation.validUntil).toLocaleDateString()}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/10 text-white">
              {quotation.status.toUpperCase()}
            </span>
          </div>
        )}

        {/* Main Document Body */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 print:border-none print:p-0 print:bg-white print:text-black">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-white/10 print:border-neutral-300">
            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest print:text-neutral-600">
                ENGINEERING SCOPE QUOTATION
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white print:text-black mt-1">
                {quotation.quoteNumber}
              </h1>
              <p className="text-sm font-mono text-neutral-400 print:text-neutral-600 mt-0.5">
                PROJECT: {quotation.projectName}
              </p>
            </div>

            <div className="sm:text-right space-y-1 text-xs font-mono text-neutral-400 print:text-neutral-600">
              <div><strong className="text-white print:text-black">Issued By:</strong> RIZMEC Inc.</div>
              <div>100 Montgomery St, Suite 2400</div>
              <div>San Francisco, CA 94104</div>
              <div><a href="mailto:hello@rizmec.com" className="hover:underline">hello@rizmec.com</a></div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200">
              <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600">
                Prepared For:
              </div>
              <div className="text-sm font-bold text-white print:text-black">{quotation.clientName}</div>
              <div className="text-neutral-300 print:text-neutral-700">{quotation.clientCompany}</div>
              <div className="text-neutral-400 print:text-neutral-600">{quotation.clientEmail}</div>
              {quotation.clientPhone && <div className="text-neutral-400">{quotation.clientPhone}</div>}
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200 space-y-1.5">
              <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600">
                Quotation Metadata:
              </div>
              <div>
                <span className="text-neutral-400">Generated Date:</span>{" "}
                <span className="text-white print:text-black">{new Date(quotation.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-neutral-400">Valid Through:</span>{" "}
                <span className="text-white print:text-black">{new Date(quotation.validUntil).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-neutral-400">Payment Terms:</span>{" "}
                <span className="text-white print:text-black">{quotation.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Project Description */}
          {quotation.description && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Project Scope Overview
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed print:text-neutral-800">
                {quotation.description}
              </p>
            </div>
          )}

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Deliverable Breakdown & Pricing
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase print:border-neutral-300 print:text-neutral-600">
                    <th className="py-3 px-2">Deliverable Item</th>
                    <th className="py-3 px-2 text-center">Qty</th>
                    <th className="py-3 px-2 text-right">Unit Price</th>
                    <th className="py-3 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200 font-mono">
                  {(quotation.lineItems || []).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-white print:text-black">{item.item}</div>
                        {item.description && (
                          <div className="text-neutral-400 text-[11px] font-sans mt-0.5 print:text-neutral-600">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-center text-neutral-300 print:text-neutral-700">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-2 text-right text-neutral-300 print:text-neutral-700">
                        {quotation.currency} {item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-white print:text-black">
                        {quotation.currency} {item.total?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-white/10 print:border-neutral-300">
            <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                <span>Subtotal:</span>
                <span className="text-white print:text-black">
                  {quotation.currency} {quotation.subtotal?.toLocaleString()}
                </span>
              </div>
              {quotation.discountTotal > 0 && (
                <div className="flex justify-between text-neutral-400">
                  <span>Discount:</span>
                  <span className="text-emerald-400">
                    -{quotation.currency} {quotation.discountTotal?.toLocaleString()}
                  </span>
                </div>
              )}
              {quotation.taxAmount > 0 && (
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>Tax ({quotation.taxRate}%):</span>
                  <span className="text-white print:text-black">
                    {quotation.currency} {quotation.taxAmount?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10 print:border-neutral-400 print:text-black">
                <span>Total Scope:</span>
                <span>
                  {quotation.currency} {quotation.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          {quotation.termsConditions && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] space-y-2 text-xs font-mono print:bg-neutral-50 print:border-neutral-200">
              <div className="text-neutral-400 uppercase tracking-wider print:text-neutral-600">
                Terms & Conditions:
              </div>
              <p className="text-neutral-400 leading-relaxed font-sans print:text-neutral-700">
                {quotation.termsConditions}
              </p>
            </div>
          )}

          {/* E-Signing Section */}
          <div className="pt-8 border-t border-white/10 print:border-neutral-300">
            {isAccepted ? (
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
                  <FileCheck2 className="w-4 h-4" />
                  <span>Electronically Signed & Executed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Authorized Signer:</span>{" "}
                    <strong>{quotation.signedByName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Signer Email:</span>{" "}
                    <span>{quotation.signedByEmail}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Execution Timestamp:</span>{" "}
                    <span>{new Date(quotation.signedAt).toUTCString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Digital Signature:</span>{" "}
                    <span className="font-serif italic text-base text-white">
                      {quotation.signatureData}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignAndAccept} className="space-y-6 print:hidden">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                    Acceptance & Electronic Signature
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    By signing below, you confirm that you are authorized to accept this scope quotation on behalf of {quotation.clientCompany || quotation.clientName}. An immutable snapshot of this document will be recorded.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase tracking-wider">
                      Signer Legal Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. Julian Thorne"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase tracking-wider">
                      Signer Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      placeholder="signer@company.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <label className="text-neutral-400 uppercase tracking-wider">
                    Electronic Signature (Type Your Legal Name As Signature) *
                  </label>
                  <input
                    type="text"
                    required
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="/s/ Julian Thorne"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/20 rounded-lg text-lg font-serif italic text-white focus:outline-none focus:border-white tracking-wider"
                  />
                </div>

                <div className="flex items-start gap-3 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    id="terms-agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-neutral-900 text-white focus:ring-0"
                  />
                  <label htmlFor="terms-agree" className="leading-relaxed cursor-pointer select-none">
                    I accept the scope, deliverables, and payment terms outlined in quotation {quotation.quoteNumber}, and agree to enter into the Master Engineering Agreement with RIZMEC Inc.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={signing}
                  className="px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
                >
                  {signing ? "Validating & Freezing Snapshot..." : "Sign & Accept Quotation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
