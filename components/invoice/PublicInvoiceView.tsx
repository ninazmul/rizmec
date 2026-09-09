"use client";

import React from "react";
import RizmecLogo from "@/components/shared/RizmecLogo";
import { Printer, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

interface Props {
  invoice: any;
}

export default function PublicInvoiceView({ invoice }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === "paid";
  const isOverdue = invoice.status === "overdue" || (new Date(invoice.dueDate) < new Date() && !isPaid);

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
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        <div className="p-4 rounded-xl border flex items-center justify-between font-mono text-xs print:hidden">
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
                : "bg-white/10 text-white"
            }`}
          >
            {isPaid ? "PAID" : isOverdue ? "OVERDUE" : invoice.status.toUpperCase()}
          </span>
        </div>

        {/* Main Document Body */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 print:border-none print:p-0 print:bg-white print:text-black">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-white/10 print:border-neutral-300">
            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest print:text-neutral-600">
                TAX INVOICE
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white print:text-black mt-1">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-sm font-mono text-neutral-400 print:text-neutral-600 mt-0.5">
                PROJECT: {invoice.projectName}
              </p>
            </div>

            <div className="sm:text-right space-y-1 text-xs font-mono text-neutral-400 print:text-neutral-600">
              <div><strong className="text-white print:text-black">Remit To:</strong> RIZMEC Inc.</div>
              <div>100 Montgomery St, Suite 2400</div>
              <div>San Francisco, CA 94104</div>
              <div><a href="mailto:hello@rizmec.com" className="hover:underline">hello@rizmec.com</a></div>
            </div>
          </div>

          {/* Client & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200">
              <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600">
                Billed To:
              </div>
              <div className="text-sm font-bold text-white print:text-black">{invoice.clientName}</div>
              {invoice.clientCompany && <div className="text-neutral-300 print:text-neutral-700">{invoice.clientCompany}</div>}
              <div className="text-neutral-400 print:text-neutral-600">{invoice.clientEmail}</div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] print:bg-neutral-50 print:border-neutral-200 space-y-1.5">
              <div className="text-neutral-400 uppercase tracking-wider mb-2 print:text-neutral-600">
                Invoice Details:
              </div>
              <div>
                <span className="text-neutral-400">Issue Date:</span>{" "}
                <span className="text-white print:text-black">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-neutral-400">Due Date:</span>{" "}
                <span className="text-white print:text-black">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-neutral-400">Currency:</span>{" "}
                <span className="text-white print:text-black">{invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Itemized Services
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase print:border-neutral-300 print:text-neutral-600">
                    <th className="py-3 px-2">Description</th>
                    <th className="py-3 px-2 text-center">Qty</th>
                    <th className="py-3 px-2 text-right">Rate</th>
                    <th className="py-3 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200 font-mono">
                  {(invoice.lineItems || []).map((item: any, idx: number) => (
                    <tr key={idx}>
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
                        {invoice.currency} {item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-white print:text-black">
                        {invoice.currency} {item.total?.toLocaleString()}
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
                  {invoice.currency} {invoice.subtotal?.toLocaleString()}
                </span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                  <span>Tax:</span>
                  <span className="text-white print:text-black">
                    {invoice.currency} {invoice.taxAmount?.toLocaleString()}
                  </span>
                </div>
              )}
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-neutral-400">
                  <span>Discount:</span>
                  <span className="text-emerald-400">
                    -{invoice.currency} {invoice.discountAmount?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10 print:border-neutral-300 print:text-black">
                <span>Total Invoiced:</span>
                <span>
                  {invoice.currency} {invoice.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Amount Paid:</span>
                <span>
                  {invoice.currency} {(invoice.amountPaid || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10 print:border-neutral-400 print:text-black">
                <span>Amount Due:</span>
                <span className={invoice.amountDue > 0 ? "text-rose-400 print:text-black" : "text-emerald-400"}>
                  {invoice.currency} {invoice.amountDue?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Wiring / Payment Instructions */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.01] space-y-2 text-xs font-mono print:bg-neutral-50 print:border-neutral-200">
            <div className="text-neutral-400 uppercase tracking-wider print:text-neutral-600">
              Payment Instructions & Wire Routing:
            </div>
            <p className="text-neutral-300 leading-relaxed font-sans print:text-neutral-700">
              {invoice.paymentInstructions ||
                "Bank Wire Transfer: Account Name: RIZMEC Engineering Inc. | SWIFT: RIZMUS33 | IBAN: US34RIZM000192837465"}
            </p>
            {invoice.notes && (
              <p className="text-neutral-400 pt-2 border-t border-white/5 print:text-neutral-600">
                Note: {invoice.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
