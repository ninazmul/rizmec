"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  Receipt,
  Copy,
  CheckCircle2,
  Trash2,
  FileCheck2,
  Edit2,
} from "lucide-react";
import {
  getQuotations,
  createQuotation,
  convertQuotationToInvoice,
  updateQuotation,
  deleteQuotation,
} from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  clientPhone: "",
  projectName: "",
  description: "",
  currency: "USD",
  taxRate: 0,
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  notes: "",
  termsConditions: "",
  lineItems: [
    { item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 },
  ],
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchQuotations = async () => {
    setLoading(true);
    const res = await getQuotations({ limit: 50 });
    if (res.success) {
      setQuotations(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      lineItems: [
        { item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEdit = (q: any) => {
    setEditingId(q._id);
    setForm({
      clientName: q.clientName || "",
      clientCompany: q.clientCompany || "",
      clientEmail: q.clientEmail || "",
      clientPhone: q.clientPhone || "",
      projectName: q.projectName || "",
      description: q.description || "",
      currency: q.currency || "USD",
      taxRate: q.taxRate ?? 0,
      validUntil: q.validUntil
        ? new Date(q.validUntil).toISOString().split("T")[0]
        : DEFAULT_FORM.validUntil,
      notes: q.notes || "",
      termsConditions: q.termsConditions || "",
      lineItems:
        q.lineItems && q.lineItems.length > 0
          ? q.lineItems.map((li: any) => ({
              item: li.item || "",
              description: li.description || "",
              quantity: li.quantity ?? 1,
              unitPrice: li.unitPrice ?? 0,
              discount: li.discount ?? 0,
            }))
          : [{ item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 }],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      lineItems: [
        { item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 },
      ],
    });
  };

  const addLineItem = () => {
    setForm({
      ...form,
      lineItems: [
        ...form.lineItems,
        { item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const filteredLineItems = form.lineItems.filter((li) => li.item && li.item.trim() !== "");
    const payload = { ...form, lineItems: filteredLineItems };

    try {
      let res;
      if (editingId) {
        res = await updateQuotation(editingId, payload as any);
      } else {
        res = await createQuotation(payload as any);
      }

      if (res.success) {
        toast.success(editingId ? "Quotation updated successfully." : "Quotation issued successfully.");
        closeModal();
        fetchQuotations();
      } else {
        toast.error(res.error || "Failed to save quotation.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this quotation? This action cannot be undone.")) return;
    const res = await deleteQuotation(id);
    if (res.success) {
      toast.success("Quotation deleted.");
      fetchQuotations();
    } else {
      toast.error(res.error || "Failed to delete quotation.");
    }
  };

  const handleConvertToInvoice = async (quoteId: string) => {
    if (confirm("Generate an active invoice from this accepted quotation?")) {
      const res = await convertQuotationToInvoice(quoteId);
      if (res.success) {
        toast.success("Invoice successfully generated! Accessible in Invoices module.");
        fetchQuotations();
      } else {
        toast.error(res.error || "Failed to convert quotation.");
      }
    }
  };

  const copyPublicLink = (secureToken: string) => {
    const url = `${window.location.origin}/quote/${secureToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(secureToken);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            QUOTATIONS & E-SIGNATURES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Dynamic Quotations & Client Agreements
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Quotation</span>
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Public URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Loading quotation records...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No quotation records generated yet.
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white">
                      {q.quoteNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{q.clientCompany || q.clientName}</div>
                      <div className="text-neutral-500 text-[11px]">{q.clientEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300 font-sans truncate max-w-xs">
                      {q.projectName}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {q.currency} {q.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          q.status === "accepted"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : q.status === "sent"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/10 text-neutral-300"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/quote/${q.secureToken}`}
                          target="_blank"
                          className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => copyPublicLink(q.secureToken)}
                          className="p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-white"
                          title="Copy public link"
                        >
                          {copiedToken === q.secureToken ? (
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
                          onClick={() => openEdit(q)}
                          className="p-1.5 rounded border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                          title="Edit quotation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="p-1.5 rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete quotation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {q.status === "accepted" && (
                          <button
                            onClick={() => handleConvertToInvoice(q._id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white text-black font-bold uppercase text-[10px] hover:bg-neutral-200"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Convert to Invoice</span>
                          </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  {editingId ? "Update Engineering Scope Quotation" : "Generate Engineering Scope Quotation"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Calculates totals and issues unpredictable cryptographic token.
                </p>
              </div>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
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
                  <label className="font-mono text-neutral-400 uppercase">Client Company *</label>
                  <input
                    type="text"
                    required
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
                  <label className="font-mono text-neutral-400 uppercase">Client Phone</label>
                  <input
                    type="tel"
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="font-mono text-neutral-400 uppercase">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.projectName}
                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1 grid grid-cols-2 gap-3">
                  <div>
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
                  <div>
                    <label className="font-mono text-neutral-400 uppercase">Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.taxRate}
                      onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Valid Until Date</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Project Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief scope summary"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white uppercase font-bold">Line Items & Deliverables</span>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs text-white underline"
                  >
                    + Add Deliverable
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
                            placeholder="Deliverable title"
                            required
                            value={item.item}
                            onChange={(e) => updateLineItem(idx, "item", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Deliverable description (optional)"
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-3">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">Qty</label>
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
                          <div className="col-span-4">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">Rate</label>
                            <input
                              type="number"
                              placeholder="Rate"
                              required
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(idx, "unitPrice", Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-right"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">Discount %</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={item.discount}
                              onChange={(e) => updateLineItem(idx, "discount", Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-right"
                            />
                          </div>
                          <div className="col-span-2 flex items-end justify-end font-mono text-[11px] text-neutral-400 pb-1.5">
                            {((item.quantity || 1) * (item.unitPrice || 0) * (1 - (item.discount || 0) / 100)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Not visible to client"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={form.termsConditions}
                    onChange={(e) => setForm({ ...form, termsConditions: e.target.value })}
                    placeholder="Visible to client on quotation document"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={closeModal}
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
                  {saving ? "Saving..." : editingId ? "Update Quotation" : "Issue Quotation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
