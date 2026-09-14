"use client";

import React, { useState } from "react";
import Link from "next/link";
import RizmecLogo from "@/components/shared/RizmecLogo";
import {
  Printer,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Layers,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { markInvoicePaid, markInvoiceUnpaid } from "@/lib/actions/invoice.actions";
import toast from "react-hot-toast";

interface Props {
  invoice: any;
  isAdmin?: boolean;
}

export default function PublicInvoiceView({ invoice, isAdmin = false }: Props) {
  const [currentStatus, setCurrentStatus] = useState(invoice.status);
  const [currentAmountDue, setCurrentAmountDue] = useState(invoice.amountDue);
  const [currentAmountPaid, setCurrentAmountPaid] = useState(invoice.amountPaid || 0);
  const [toggling, setToggling] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkPaid = async () => {
    if (!isAdmin) {
      toast.error("Only administrators are authorized to mark invoices as paid.");
      return;
    }
    setToggling(true);
    try {
      const res = await markInvoicePaid(invoice._id, true);
      if (res.success) {
        setCurrentStatus("paid");
        setCurrentAmountDue(0);
        setCurrentAmountPaid(invoice.totalAmount);
        toast.success(res.message || "Invoice marked as Paid!");
      } else {
        toast.error(res.error || "Failed to mark as Paid.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setToggling(false);
    }
  };

  const handleMarkUnpaid = async () => {
    if (!isAdmin) {
      toast.error("Only administrators are authorized to revert invoices to unpaid.");
      return;
    }
    setToggling(true);
    try {
      const res = await markInvoiceUnpaid(invoice._id);
      if (res.success) {
        setCurrentStatus("sent");
        setCurrentAmountDue(invoice.totalAmount);
        setCurrentAmountPaid(0);
        toast.success(res.message || "Invoice reverted to Unpaid.");
      } else {
        toast.error(res.error || "Failed to revert to Unpaid.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setToggling(false);
    }
  };

  const isPaid = currentStatus === "paid";
  const isOverdue =
    currentStatus === "overdue" ||
    (new Date(invoice.dueDate) < new Date() && !isPaid);

  return (
    <>
      {/* Strict Print CSS: isolates ONLY the invoice card and forces crisp white paper rendering */}
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
            /* Hide all page elements outside the invoice card */
            body * {
              visibility: hidden !important;
            }
            /* Render ONLY the invoice card */
            #invoice-print-card,
            #invoice-print-card * {
              visibility: visible !important;
            }
            #invoice-print-card {
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
          {/* Web-only Top Bar */}
          <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <RizmecLogo variant="white" size="md" showTagline={true} />

            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <>
                  <Link
                    href="/dashboard/invoices"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>

                  {isPaid ? (
                    <button
                      onClick={handleMarkUnpaid}
                      disabled={toggling}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs font-mono font-medium text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                      title="Revert invoice to Unpaid"
                    >
                      {toggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Mark as Unpaid</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkPaid}
                      disabled={toggling}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-xs font-mono font-medium text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all shadow-sm shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
                      title="Mark invoice as Paid and notify client via email"
                    >
                      {toggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Mark as Paid</span>
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-xs font-mono font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* Web-only Status Notification Banner */}
          <div className="no-print p-4 rounded-xl border flex items-center justify-between font-mono text-xs bg-neutral-900/60 border-white/10">
            {isPaid ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>INVOICE PAID IN FULL // THANK YOU</span>
              </div>
            ) : isOverdue ? (
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span>PAYMENT OVERDUE // PLEASE REMIT OUTSTANDING BALANCE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>PAYMENT DUE BY: {new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                isPaid
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : isOverdue
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-white/10 text-white border border-white/20"
              }`}
            >
              {isPaid ? "PAID" : isOverdue ? "OVERDUE" : currentStatus.toUpperCase()}
            </span>
          </div>

          {/* PRINTABLE INVOICE DOCUMENT CARD */}
          <div
            id="invoice-print-card"
            className="bg-neutral-950 border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 print:border-none print:p-4 print:space-y-6 print:bg-white print:text-neutral-900"
          >
            {/* Invoice Header: Brand & Status Stamp */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10 print:border-neutral-200">
              <div>
                {/* Screen mode logo (white) */}
                <div className="print:hidden">
                  <RizmecLogo variant="white" size="md" showTagline={true} />
                </div>
                {/* Print mode logo (crisp black) */}
                <div className="hidden print:block">
                  <RizmecLogo variant="black" size="md" showTagline={true} />
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${
                    isPaid
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 print:border-emerald-600 print:text-emerald-700 print:bg-emerald-50"
                      : isOverdue
                      ? "border-rose-500/40 text-rose-400 bg-rose-500/10 print:border-rose-600 print:text-rose-700 print:bg-rose-50"
                      : "border-white/20 text-neutral-300 bg-white/5 print:border-neutral-300 print:text-neutral-800 print:bg-neutral-50"
                  }`}
                >
                  {isPaid ? "PAID IN FULL" : isOverdue ? "PAYMENT OVERDUE" : `STATUS: ${currentStatus.toUpperCase()}`}
                </span>
              </div>
            </div>

            {/* Title & Remit-To Coordinates */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-white/10 print:border-neutral-200">
              <div>
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest print:text-neutral-600">
                  TAX INVOICE
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white print:text-neutral-900 mt-1">
                  {invoice.invoiceNumber}
                </h1>
                <p className="text-sm font-mono text-neutral-400 print:text-neutral-600 mt-0.5">
                  PROJECT: <span className="text-white print:text-neutral-900 font-semibold">{invoice.projectName}</span>
                </p>
              </div>

              <div className="sm:text-right space-y-1 text-xs font-mono text-neutral-400 print:text-neutral-600">
                <div><strong className="text-white print:text-neutral-900">Remit To:</strong> RIZMEC Inc.</div>
                <div>100 Montgomery St, Suite 2400</div>
                <div>San Francisco, CA 94104</div>
                <div>
                  <a href="mailto:hello@rizmec.com" className="text-neutral-300 hover:text-white print:text-neutral-900 hover:underline">
                    hello@rizmec.com
                  </a>
                </div>
              </div>
            </div>

            {/* Client & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200">
                <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600 font-semibold">
                  Billed To:
                </div>
                <div className="text-sm font-bold text-white print:text-neutral-900">{invoice.clientName}</div>
                {invoice.clientCompany && (
                  <div className="text-neutral-300 print:text-neutral-700 mt-0.5">{invoice.clientCompany}</div>
                )}
                <div className="text-neutral-400 print:text-neutral-600 mt-1">{invoice.clientEmail}</div>
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200 space-y-2">
                <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600 font-semibold">
                  Invoice Details:
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Issue Date:</span>
                  <span className="text-white print:text-neutral-900 font-medium">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Due Date:</span>
                  <span className="text-white print:text-neutral-900 font-medium">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 print:text-neutral-600">Currency:</span>
                  <span className="text-white print:text-neutral-900 font-medium">{invoice.currency}</span>
                </div>
                {invoice.milestoneLabel && (
                  <div className="flex justify-between items-center pt-2 border-t border-white/5 print:border-neutral-200">
                    <span className="text-neutral-400 print:text-neutral-600">Milestone Phase:</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold font-mono">
                      {invoice.milestoneLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Schedule Context (if split from quotation) */}
            {invoice.paymentSchedule && invoice.paymentSchedule.length > 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400 print:text-neutral-800" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 print:text-neutral-800">
                      Project Payment Milestones
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 print:text-neutral-600">
                    {invoice.paymentSchedule.map((m: any) => `${m.percent}%`).join(" / ")} Schedule
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  {invoice.paymentSchedule.map((m: any, idx: number) => {
                    const isCurrent = invoice.milestoneLabel?.toLowerCase().includes(m.milestone.toLowerCase());
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border ${
                          isCurrent
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white print:bg-neutral-100 print:border-neutral-400"
                            : "bg-white/[0.02] border-white/5 text-neutral-400 print:bg-neutral-50 print:border-neutral-200"
                        }`}
                      >
                        <div className="flex justify-between font-bold">
                          <span>{m.milestone}</span>
                          <span>{m.percent}%</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                          {m.trigger}
                        </div>
                        {isCurrent && (
                          <div className="text-[9px] font-bold text-cyan-400 print:text-neutral-800 mt-1 uppercase tracking-wider">
                            ● Current Invoice
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 print:text-neutral-700 font-semibold">
                Itemized Services
              </div>
              <div className="overflow-x-auto rounded-lg border border-white/10 print:border-neutral-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-mono uppercase print:border-neutral-200 print:bg-neutral-100 print:text-neutral-900">
                      <th className="py-3 px-3">Description</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Rate</th>
                      <th className="py-3 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-neutral-200 font-mono">
                    {(invoice.lineItems || []).map((item: any, idx: number) => (
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
                          {invoice.currency} {item.unitPrice?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-white print:text-neutral-900">
                          {invoice.currency} {item.total?.toLocaleString()}
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
                    {invoice.currency} {invoice.subtotal?.toLocaleString()}
                  </span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                    <span>Tax:</span>
                    <span className="text-white print:text-neutral-900 font-medium">
                      {invoice.currency} {invoice.taxAmount?.toLocaleString()}
                    </span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                    <span>Discount:</span>
                    <span className="text-emerald-400 print:text-emerald-700 font-medium">
                      -{invoice.currency} {invoice.discountAmount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2.5 border-t border-white/10 print:border-neutral-200 print:text-neutral-900">
                  <span>Total Invoiced:</span>
                  <span>
                    {invoice.currency} {invoice.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400 print:text-neutral-600">
                  <span>Amount Paid:</span>
                  <span className="text-white print:text-neutral-900">
                    {invoice.currency} {currentAmountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2.5 border-t border-white/10 print:border-neutral-300 print:text-neutral-900">
                  <span>Amount Due:</span>
                  <span
                    className={
                      currentAmountDue > 0
                        ? "text-rose-400 print:text-neutral-900"
                        : "text-emerald-400 print:text-emerald-700"
                    }
                  >
                    {invoice.currency} {currentAmountDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Wiring / Payment Instructions */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] space-y-2 text-xs font-mono print:bg-neutral-50 print:border-neutral-200">
              <div className="text-neutral-400 uppercase tracking-wider print:text-neutral-700 font-semibold">
                Payment Instructions & Wire Routing:
              </div>
              <p className="text-neutral-300 leading-relaxed font-sans print:text-neutral-800 whitespace-pre-wrap">
                {invoice.paymentInstructions ||
                  "Bank Wire Transfer: Account Name: RIZMEC Engineering Inc. | SWIFT: RIZMUS33 | IBAN: US34RIZM000192837465"}
              </p>
              {invoice.notes && (
                <p className="text-neutral-400 pt-2 border-t border-white/5 print:border-neutral-200 print:text-neutral-600">
                  Note: {invoice.notes}
                </p>
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
