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
} from "lucide-react";
import {
  getQuotations,
  createQuotation,
  convertQuotationToInvoice,
} from "@/lib/actions/quotation.actions";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New quotation state with dynamic line items
  const [form, setForm] = useState({
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientPhone: "",
    projectName: "",
    description: "",
    currency: "USD",
    taxRate: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    lineItems: [
      { item: "Core Systems Architecture & Engineering", description: "Architecture specification and kernel setup", quantity: 1, unitPrice: 35000, discount: 0 },
    ],
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createQuotation(form as any);
    if (res.success) {
      setIsModalOpen(false);
      fetchQuotations();
    }
  };

  const handleConvertToInvoice = async (quoteId: string) => {
    if (confirm("Generate an active invoice from this accepted quotation?")) {
      const res = await convertQuotationToInvoice(quoteId);
      if (res.success) {
        alert("Invoice successfully generated! Accessible in Invoices module.");
        fetchQuotations();
      } else {
        alert(res.error || "Failed to convert quotation.");
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
      {/* Header */}
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
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Quotation</span>
        </button>
      </div>

      {/* Table */}
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
                      {q.status === "accepted" && (
                        <button
                          onClick={() => handleConvertToInvoice(q._id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white text-black font-bold uppercase text-[10px] hover:bg-neutral-200"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Convert to Invoice</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  Generate Engineering Scope Quotation
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Calculates totals and issues unpredictable cryptographic token.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6 text-xs font-sans">
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

              {/* Dynamic Line Items */}
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
                    <div key={idx} className="p-4 rounded-xl border border-white/10 bg-neutral-900 space-y-2">
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
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Deliverable title"
                            required
                            value={item.item}
                            onChange={(e) => updateLineItem(idx, "item", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            required
                            value={item.quantity}
                            onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-center"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            placeholder="Rate (USD)"
                            required
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(idx, "unitPrice", Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase"
                >
                  Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
