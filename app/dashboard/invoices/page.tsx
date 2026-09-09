"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Printer,
  Copy,
} from "lucide-react";
import { getInvoices, createInvoice, recordInvoicePayment } from "@/lib/actions/invoice.actions";
import { sendInvoicePaymentReminder } from "@/lib/actions/reminder.actions";

export default function InvoicesDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Reminder notification feedback
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  // Payment Recording Modal
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<any>("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    const res = await getInvoices({ limit: 50 });
    if (res.success) {
      setInvoices(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSendReminder = async (invoiceId: string) => {
    setSendingReminderId(invoiceId);
    setReminderStatus("Dispatching reminder via Nodemailer...");

    const res = await sendInvoicePaymentReminder(invoiceId, "manual");
    setSendingReminderId(null);

    if (res.success) {
      setReminderStatus(res.message || "Payment reminder sent!");
      fetchInvoices();
    } else {
      setReminderStatus(`Notice: ${res.error}`);
    }

    setTimeout(() => setReminderStatus(null), 5000);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const res = await recordInvoicePayment(selectedInvoice._id, {
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference: paymentReference,
    });

    if (res.success) {
      setSelectedInvoice(null);
      fetchInvoices();
    } else {
      alert(res.error || "Failed to record payment.");
    }
  };

  const copyPublicLink = (secureToken: string) => {
    const url = `${window.location.origin}/invoice/${secureToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(secureToken);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            BILLING & RECEIVABLES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Enterprise Invoices & Payment Tracking
          </h1>
        </div>
      </div>

      {reminderStatus && (
        <div className="p-4 rounded-xl border border-white/20 bg-neutral-900 font-mono text-xs text-white flex items-center gap-3">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>{reminderStatus}</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Amount Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Public URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Loading invoice telemetry...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No invoice records found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{inv.clientName}</div>
                      <div className="text-neutral-500 text-[11px]">{inv.clientEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {inv.currency} {inv.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-bold text-rose-400">
                      {inv.currency} {inv.amountDue?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          inv.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : inv.status === "partially_paid"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-white/10 text-neutral-300"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/invoice/${inv.secureToken}`}
                          target="_blank"
                          className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>View</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => copyPublicLink(inv.secureToken)}
                          className="p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-white"
                          title="Copy public link"
                        >
                          {copiedToken === inv.secureToken ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {inv.status !== "paid" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPaymentAmount(inv.amountDue);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/20 text-white font-mono text-[10px] uppercase hover:bg-white/5"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Log Payment</span>
                          </button>
                          <button
                            onClick={() => handleSendReminder(inv._id)}
                            disabled={sendingReminderId === inv._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-black font-bold font-mono text-[10px] uppercase hover:bg-neutral-200 disabled:opacity-50"
                          >
                            <Bell className="w-3 h-3" />
                            <span>{sendingReminderId === inv._id ? "Sending..." : "Send Reminder"}</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  Record Client Payment
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {selectedInvoice.invoiceNumber} — {selectedInvoice.clientName}
                </p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 uppercase">Payment Amount (USD) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 uppercase">Payment Channel</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                >
                  <option value="bank_transfer">Bank Wire Transfer (SWIFT / FedNow)</option>
                  <option value="stripe">Stripe / Credit Card</option>
                  <option value="other">Corporate Check / Direct Transfer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 uppercase">Transaction Reference / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. WIRE-TR-904124"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
