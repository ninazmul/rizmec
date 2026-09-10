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
  Mail,
  Send,
  AlertTriangle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Percent,
  Calendar,
  Info,
} from "lucide-react";
import {
  getQuotations,
  createQuotation,
  convertQuotationToInvoice,
  updateQuotation,
  deleteQuotation,
  sendQuotationEmail,
} from "@/lib/actions/quotation.actions";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentMilestone {
  milestone: string;
  percent: number;
  trigger: string;
  dueDate?: string;
}

interface LineItem {
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

// ─── Payment Term Presets ─────────────────────────────────────────────────────

const PAYMENT_PRESETS: {
  id: string;
  label: string;
  description: string;
  schedule: PaymentMilestone[];
}[] = [
  {
    id: "30-40-30",
    label: "30 / 40 / 30",
    description: "Advance · Midpoint · Delivery",
    schedule: [
      { milestone: "Advance", percent: 30, trigger: "On project start / contract signing" },
      { milestone: "Midpoint", percent: 40, trigger: "When project is 50% complete" },
      { milestone: "Delivery", percent: 30, trigger: "On final delivery & handover" },
    ],
  },
  {
    id: "50-50",
    label: "50 / 50",
    description: "Upfront · Delivery",
    schedule: [
      { milestone: "Advance", percent: 50, trigger: "On project start / contract signing" },
      { milestone: "Delivery", percent: 50, trigger: "On final delivery & handover" },
    ],
  },
  {
    id: "100",
    label: "100% Upfront",
    description: "Full payment before start",
    schedule: [
      { milestone: "Full Payment", percent: 100, trigger: "Before project commencement" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    description: "Define your own milestones",
    schedule: [],
  },
];

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
  ] as LineItem[],
  paymentTerms: "30/40/30 — Advance · Midpoint · Delivery",
  paymentSchedule: [...PAYMENT_PRESETS[0].schedule] as PaymentMilestone[],
  selectedPreset: "30-40-30",
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  sent: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  viewed: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  accepted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  expired: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [showPaymentSection, setShowPaymentSection] = useState(true);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchQuotations = async () => {
    setLoading(true);
    const res = await getQuotations({ limit: 50 });
    if (res.success) setQuotations(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ── Form helpers ───────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...DEFAULT_FORM, paymentSchedule: [...PAYMENT_PRESETS[0].schedule] });
    setIsModalOpen(true);
  };

  const openEdit = (q: any) => {
    setEditingId(q._id);
    const preset = q.paymentSchedule?.length > 0 ? "custom" : "30-40-30";
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
        q.lineItems?.length > 0
          ? q.lineItems.map((li: any) => ({
              item: li.item || "",
              description: li.description || "",
              quantity: li.quantity ?? 1,
              unitPrice: li.unitPrice ?? 0,
              discount: li.discount ?? 0,
            }))
          : [{ item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 }],
      paymentTerms: q.paymentTerms || DEFAULT_FORM.paymentTerms,
      paymentSchedule:
        q.paymentSchedule?.length > 0
          ? q.paymentSchedule
          : [...PAYMENT_PRESETS[0].schedule],
      selectedPreset: preset,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ ...DEFAULT_FORM, paymentSchedule: [...PAYMENT_PRESETS[0].schedule] });
  };

  // ── Payment preset selection ───────────────────────────────────────────────

  const applyPreset = (presetId: string) => {
    const preset = PAYMENT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (presetId === "custom") {
      setForm((f) => ({
        ...f,
        selectedPreset: "custom",
        paymentTerms: "Custom payment schedule",
        paymentSchedule:
          f.paymentSchedule.length > 0
            ? f.paymentSchedule
            : [
                { milestone: "Advance", percent: 30, trigger: "On project start" },
                { milestone: "Midpoint", percent: 40, trigger: "At 50% completion" },
                { milestone: "Delivery", percent: 30, trigger: "On final delivery" },
              ],
      }));
    } else {
      setForm((f) => ({
        ...f,
        selectedPreset: presetId,
        paymentTerms: `${preset.label} — ${preset.description}`,
        paymentSchedule: [...preset.schedule],
      }));
    }
  };

  const updateMilestone = (idx: number, field: keyof PaymentMilestone, value: any) => {
    const updated = [...form.paymentSchedule];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm((f) => ({ ...f, paymentSchedule: updated }));
  };

  const addMilestone = () => {
    setForm((f) => ({
      ...f,
      paymentSchedule: [
        ...f.paymentSchedule,
        { milestone: "Milestone", percent: 0, trigger: "" },
      ],
    }));
  };

  const removeMilestone = (idx: number) => {
    setForm((f) => ({
      ...f,
      paymentSchedule: f.paymentSchedule.filter((_, i) => i !== idx),
    }));
  };

  const percentSum = form.paymentSchedule.reduce((s, m) => s + (m.percent || 0), 0);

  // ── Line items ─────────────────────────────────────────────────────────────

  const addLineItem = () =>
    setForm((f) => ({
      ...f,
      lineItems: [...f.lineItems, { item: "", description: "", quantity: 1, unitPrice: 0, discount: 0 }],
    }));

  const removeLineItem = (i: number) =>
    setForm((f) => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));

  const updateLineItem = (i: number, field: string, value: any) => {
    const updated = [...form.lineItems];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, lineItems: updated }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.paymentSchedule.length > 0 && percentSum !== 100) {
      toast.error(`Payment schedule must total 100% (currently ${percentSum}%)`);
      return;
    }

    setSaving(true);
    const filteredLineItems = form.lineItems.filter((li) => li.item?.trim());
    const payload = {
      ...form,
      lineItems: filteredLineItems,
      paymentSchedule: form.paymentSchedule.map((m) => ({
        ...m,
        dueDate: m.dueDate || undefined,
      })),
    };

    try {
      const res = editingId
        ? await updateQuotation(editingId, payload as any)
        : await createQuotation(payload as any);

      if (res.success) {
        toast.success(editingId ? "Quotation updated." : "Quotation issued.");
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

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSendEmail = async (q: any) => {
    setSendingId(q._id);
    try {
      const res = await sendQuotationEmail(q._id);
      if (res.success) {
        toast.success(res.message || `Quotation sent to ${q.clientEmail}`);
        fetchQuotations();
      } else {
        toast.error(res.error || res.message || "Failed to send email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setSendingId(null);
    }
  };

  const handleConvertToInvoice = async (q: any) => {
    setConvertingId(q._id);
    try {
      const res = await convertQuotationToInvoice(q._id);
      if (res.success) {
        const count = (res as any).milestoneCount || 1;
        toast.success(
          count > 1
            ? `${count} milestone invoices created! View in Invoices.`
            : "Invoice created! View in Invoices."
        );
        fetchQuotations();
      } else {
        toast.error(res.error || "Failed to convert.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConvertingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteQuotation(deleteTarget._id);
      if (res.success) {
        toast.success("Quotation deleted.");
        setDeleteTarget(null);
        fetchQuotations();
      } else {
        toast.error(res.error || "Failed to delete.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyPublicLink = (secureToken: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/quote/${secureToken}`);
    setCopiedToken(secureToken);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

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
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Generate Quotation
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Loading quotation records...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No quotation records yet.
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white">{q.quoteNumber}</td>
                    <td className="py-4 px-4">
                      <div className="text-white">{q.clientCompany || q.clientName}</div>
                      <div className="text-neutral-500 text-[11px]">{q.clientEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300 truncate max-w-[160px]">
                      {q.projectName}
                    </td>
                    <td className="py-4 px-4">
                      {q.paymentSchedule?.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {q.paymentSchedule.map((m: any, i: number) => (
                            <span key={i} className="text-[10px] text-neutral-400">
                              <span className="text-white font-bold">{m.percent}%</span>{" "}
                              {m.milestone}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">
                          {q.paymentTerms || "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {q.currency} {q.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-bold ${
                          STATUS_STYLES[q.status] || "bg-white/10 text-neutral-300 border-white/10"
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
                          className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <span>View</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => copyPublicLink(q.secureToken)}
                          className="p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-white"
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
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(q)}
                          className="p-1.5 rounded border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Send Email */}
                        {q.status !== "accepted" && (
                          <button
                            onClick={() => handleSendEmail(q)}
                            disabled={sendingId === q._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 font-mono text-[10px] uppercase disabled:opacity-50 transition-all"
                            title="Send to client"
                          >
                            {sendingId === q._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            <span>{sendingId === q._id ? "Sending..." : "Send"}</span>
                          </button>
                        )}

                        {/* Convert to Invoice */}
                        {q.status === "accepted" && (
                          <button
                            onClick={() => handleConvertToInvoice(q)}
                            disabled={convertingId === q._id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-black font-bold font-mono text-[10px] uppercase hover:bg-neutral-200 disabled:opacity-50"
                          >
                            {convertingId === q._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Receipt className="w-3 h-3" />
                            )}
                            <span>
                              {convertingId === q._id ? "Converting..." : "→ Invoice"}
                            </span>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="p-1.5 rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Create / Edit Modal
      ═══════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/15 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  {editingId ? "Update Quotation" : "Generate Quotation"}
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Calculates totals and issues a cryptographic access token.
                </p>
              </div>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Client Name *", field: "clientName", required: true },
                  { label: "Client Company *", field: "clientCompany", required: true },
                  { label: "Client Email *", field: "clientEmail", type: "email", required: true },
                  { label: "Client Phone", field: "clientPhone", type: "tel" },
                ].map(({ label, field, type = "text", required }) => (
                  <div key={field} className="space-y-1">
                    <label className="font-mono text-neutral-400 uppercase">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={(form as any)[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Project + Currency + Tax */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.projectName}
                    onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:border-white/25 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-neutral-400 uppercase">Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:border-white/25 focus:outline-none"
                    >
                      {["USD", "EUR", "GBP", "BDT"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-neutral-400 uppercase">Tax Rate %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.taxRate}
                      onChange={(e) => setForm((f) => ({ ...f, taxRate: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:border-white/25 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Valid Until + Description */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Valid Until</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:border-white/25 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Brief scope summary"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:border-white/25 focus:outline-none"
                  />
                </div>
              </div>

              {/* ── Payment Terms ── */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPaymentSection((v) => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-white" />
                    <span className="font-mono text-white uppercase font-bold text-xs">
                      Payment Schedule
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-400 text-[10px] font-mono">
                      {form.paymentTerms}
                    </span>
                  </div>
                  {showPaymentSection ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {showPaymentSection && (
                  <div className="space-y-4">
                    {/* Preset pills */}
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => applyPreset(p.id)}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider transition-all ${
                            form.selectedPreset === p.id
                              ? "bg-white text-black border-white font-bold"
                              : "border-white/15 text-neutral-400 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Milestone rows */}
                    <div className="space-y-2">
                      {form.paymentSchedule.map((m, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={m.milestone}
                              onChange={(e) => updateMilestone(idx, "milestone", e.target.value)}
                              placeholder="Milestone"
                              className="w-full px-2 py-1.5 bg-neutral-900 border border-white/10 rounded text-white text-xs focus:border-white/25 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={m.percent}
                                onChange={(e) =>
                                  updateMilestone(idx, "percent", Number(e.target.value))
                                }
                                className="w-full px-2 py-1.5 pr-6 bg-neutral-900 border border-white/10 rounded text-white font-mono text-xs text-right focus:border-white/25 focus:outline-none"
                              />
                              <Percent className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 pointer-events-none" />
                            </div>
                          </div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={m.trigger}
                              onChange={(e) => updateMilestone(idx, "trigger", e.target.value)}
                              placeholder="Trigger / condition"
                              className="w-full px-2 py-1.5 bg-neutral-900 border border-white/10 rounded text-white text-xs focus:border-white/25 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="date"
                              value={m.dueDate || ""}
                              onChange={(e) => updateMilestone(idx, "dueDate", e.target.value)}
                              title="Optional due date"
                              className="w-full px-1 py-1.5 bg-neutral-900 border border-white/10 rounded text-white text-[10px] focus:border-white/25 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            {form.paymentSchedule.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMilestone(idx)}
                                className="text-rose-400 hover:text-rose-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sum validation + add row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-xs font-mono font-bold ${
                            percentSum === 100
                              ? "text-emerald-400"
                              : percentSum > 100
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          Total: {percentSum}%{" "}
                          {percentSum === 100
                            ? "✓"
                            : percentSum > 100
                            ? "(exceeds 100%)"
                            : `(${100 - percentSum}% remaining)`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="text-[11px] font-mono text-neutral-400 hover:text-white underline underline-offset-2"
                      >
                        + Add Milestone
                      </button>
                    </div>

                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                      <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-blue-300/70 font-mono">
                        When converting to invoice, each milestone becomes a separate invoice
                        with its own due date and amount. The first milestone (Advance) is
                        immediately sent to the client.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Line Items ── */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white uppercase font-bold">
                    Line Items & Deliverables
                  </span>
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
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-white/10 bg-neutral-900 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-neutral-400 text-[11px]">
                          Item #{idx + 1}
                        </span>
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
                      <input
                        type="text"
                        placeholder="Deliverable title"
                        required
                        value={item.item}
                        onChange={(e) => updateLineItem(idx, "item", e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white"
                      />
                      <textarea
                        placeholder="Description (optional)"
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs"
                      />
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                          <label className="block text-[10px] font-mono text-neutral-500 mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
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
                            value={item.discount}
                            onChange={(e) => updateLineItem(idx, "discount", Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white font-mono text-right"
                          />
                        </div>
                        <div className="col-span-2 flex items-end justify-end font-mono text-[11px] text-neutral-400 pb-1.5">
                          {(
                            (item.quantity || 1) *
                            (item.unitPrice || 0) *
                            (1 - (item.discount || 0) / 100)
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes + T&C */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Not visible to client"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs focus:border-white/25 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={form.termsConditions}
                    onChange={(e) => setForm((f) => ({ ...f, termsConditions: e.target.value }))}
                    placeholder="Visible to client on quotation document"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs focus:border-white/25 focus:outline-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (form.paymentSchedule.length > 0 && percentSum !== 100)}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving..." : editingId ? "Update Quotation" : "Issue Quotation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Delete Confirmation Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/15 rounded-2xl max-w-sm w-full p-6 space-y-5">
            <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Delete Quotation</h3>
              <p className="text-sm text-neutral-400 mt-1">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">{deleteTarget.quoteNumber}</span>?
                <br />
                <span className="text-xs text-red-400 mt-1 block">
                  This cannot be undone.
                </span>
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 font-mono text-xs font-bold uppercase disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
