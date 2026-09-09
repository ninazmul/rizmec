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
  Edit2,
  Trash2,
} from "lucide-react";
import {
  getInvoices,
  createInvoice,
  recordInvoicePayment,
  updateInvoice,
  deleteInvoice,
} from "@/lib/actions/invoice.actions";
import { sendInvoicePaymentReminder } from "@/lib/actions/reminder.actions";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  projectName: "",
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "USD",
  taxAmount: 0,
  discountAmount: 0,
  notes: "",
  lineItems: [
    { item: "", description: "", quantity: 1, unitPrice: 0 },
  ],
};

export default function InvoicesDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<any>("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...DEFAULT_FORM });

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

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      lineItems: [{ item: "", description: "", quantity: 1, unitPrice: 0 }],
    });
    setIsFormOpen(true);
  };

  const openEdit = (inv: any) => {
    setEditingId(inv._id);
    setForm({
      clientName: inv.clientName || "",
      clientCompany: inv.clientCompany || "",
      clientEmail: inv.clientEmail || "",
      projectName: inv.projectName || "",
      dueDate: inv.dueDate
        ? new Date(inv.dueDate).toISOString().split("T")[0]
        : DEFAULT_FORM.dueDate,
      currency: inv.currency || "USD",
      taxAmount: inv.taxAmount ?? 0,
      discountAmount: inv.discountAmount ?? 0,
      notes: inv.notes || "",
      lineItems:
        inv.lineItems && inv.lineItems.length > 0
          ? inv.lineItems.map((li: any) => ({
              item: li.item || "",
              description: li.description || "",
              quantity: li.quantity ?? 1,
              unitPrice: li.unitPrice ?? 0,
            }))
          : [{ item: "", description: "", quantity: 1, unitPrice: 0 }],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      lineItems: [{ item: "", description: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const addLineItem = () => {
    setForm({
      ...form,
      lineItems: [
        ...form.lineItems,
        { item: "", description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const removeLineItem = (index: number) => {
    const updated = form.lineItems.filter((_, i) => i !== index);
    setForm({ ...form, lineItems: updated });
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...form.lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, lineItems: updated });
  };

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const filteredLineItems = form.lineItems.filter((li) => li.item && li.item.trim() !== "");
    if (filteredLineItems.length === 0) {
      toast.error("At least one line item is required.");
      setSaving(false);
      return;
    }
    const payload = { ...form, lineItems: filteredLineItems };

    try {
      let res;
      if (editingId) {
        res = await updateInvoice(editingId, payload as any);
      } else {
        res = await createInvoice(payload as any);
      }

      if (res.success) {
        toast.success(editingId ? "Invoice updated successfully." : "Invoice created successfully.");
        closeForm();
        fetchInvoices();
      } else {
        toast.error(res.error || "Failed to save invoice.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Permanently delete this invoice? All linked payments will also be removed. This action cannot be undone.")) return;
    const res = await deleteInvoice(id);
    if (res.success) {
      toast.success("Invoice deleted.");
      fetchInvoices();
    } else {
      toast.error(res.error || "Failed to delete invoice.");
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    setSendingReminderId(invoiceId);
    setReminderStatus("Dispatching reminder via Nodemailer...");

    const res = await sendInvoicePaymentReminder(invoiceId, "manual");
    setSendingReminderId(null);

    if (res.success) {
      setReminderStatus(res.message || "Payment reminder sent!");
      toast.success(res.message || "Payment reminder sent!");
      fetchInvoices();
    } else {
      setReminderStatus(`Notice: ${res.error}`);
      toast.error(res.error || "Failed to send reminder.");
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
      toast.success("Payment recorded successfully.");
      setSelectedInvoice(null);
      setPaymentReference("");
      fetchInvoices();
    } else {
      toast.error(res.error || "Failed to record payment.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            BILLING & RECEIVABLES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Enterprise Invoices & Payment Tracking
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {reminderStatus && (
        <div className="p-4 rounded-xl border border-white/20 bg-neutral-900 font-mono text-xs text-white flex items-center gap-3">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>{reminderStatus}</span>
        </div>
      )}

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
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(inv)}
                          className="p-1.5 rounded border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                          title="Edit invoice"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv._id)}
                          className="p-1.5 rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  {editingId ? "Update Invoice" : "Create New Invoice"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Line items calculate subtotal, tax, and discount auto-apply.
                </p>
              </div>
              <button onClick={closeForm} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Client Company</label>
                  <input
                    type="text"
                    value={form.clientCompany}
                    onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.projectName}
                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BDT">BDT</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Tax Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={form.taxAmount}
                    onChange={(e) => setForm({ ...form, taxAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Discount Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountAmount}
                    onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white uppercase font-bold">Invoice Line Items</span>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs text-white underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-3">
                  {form.lineItems.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/10 bg-neutral-900 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-neutral-400 text-[11px]">Item #{idx + 1}</span>
                        {form.lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(idx)}
                            className="text-rose-400 hover:text-rose-300 font-mono text-[11px]"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Line item title"
                            required
                            value={item.item}
                            onChange={(e) => updateLineItem(idx, "item", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Item description (optional)"
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              required
                              value={item.quantity}
                              onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))}
                              className="w-full px-2 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-center"
                            />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">Unit Price</label>
                            <input
                              type="number"
                              placeholder="Rate"
                              required
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(idx, "unitPrice", Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-right"
                            />
                          </div>
                          <div className="col-span-3 flex items-end justify-end font-mono text-[11px] text-neutral-400 pb-1.5">
                            {((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Notes / Memo</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Payment instructions or reference notes"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <label className="text-neutral-400 uppercase">Payment Amount ({selectedInvoice.currency}) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-sm"
                />
                <p className="text-[10px] text-neutral-500">
                  Outstanding due: {selectedInvoice.currency} {selectedInvoice.amountDue?.toLocaleString()}
                </p>
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
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
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
