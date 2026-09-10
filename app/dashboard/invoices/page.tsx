"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Copy,
  Edit2,
  Trash2,
  Clock,
  Send,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  X,
  Layers,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
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

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  sent: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  viewed: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  partially_paid: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  overdue: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  cancelled: "bg-neutral-800 text-neutral-500 border-neutral-700",
};

const DEFAULT_FORM = {
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  projectName: "",
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "USD",
  milestoneLabel: "",
  taxAmount: 0,
  discountAmount: 0,
  notes: "",
  lineItems: [{ item: "", description: "", quantity: 1, unitPrice: 0 }],
};

export default function InvoicesDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create / Edit Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...DEFAULT_FORM });

  // Record Payment Modal
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<any>("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Reminder Modal
  const [reminderModalInvoice, setReminderModalInvoice] = useState<any | null>(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  // Delete Confirmation Modal
  const [deleteModalInvoice, setDeleteModalInvoice] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    const res = await getInvoices({ limit: 100 });
    if (res.success) {
      setInvoices(res.data);
    } else {
      toast.error(res.error || "Failed to load invoices.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ─── Filtered Invoices ───────────────────────────────────────────────────────

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const isOverdue =
        inv.status !== "paid" &&
        inv.status !== "cancelled" &&
        new Date(inv.dueDate) < new Date();

      if (statusFilter === "unpaid") {
        if (inv.status === "paid" || inv.status === "cancelled") return false;
      } else if (statusFilter === "overdue") {
        if (!isOverdue) return false;
      } else if (statusFilter !== "all") {
        if (inv.status !== statusFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = inv.invoiceNumber?.toLowerCase().includes(q);
        const matchClient = inv.clientName?.toLowerCase().includes(q);
        const matchEmail = inv.clientEmail?.toLowerCase().includes(q);
        const matchProject = inv.projectName?.toLowerCase().includes(q);
        const matchMilestone = inv.milestoneLabel?.toLowerCase().includes(q);
        if (!matchNum && !matchClient && !matchEmail && !matchProject && !matchMilestone) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  // ─── Telemetry Calculations ─────────────────────────────────────────────────

  const metrics = useMemo(() => {
    let totalBilled = 0;
    let totalCollected = 0;
    let totalDue = 0;
    let overdueCount = 0;
    const now = new Date();

    invoices.forEach((inv) => {
      if (inv.status !== "cancelled") {
        totalBilled += inv.totalAmount || 0;
        totalCollected += inv.amountPaid || 0;
        totalDue += inv.amountDue || 0;
        if (inv.status !== "paid" && new Date(inv.dueDate) < now) {
          overdueCount++;
        }
      }
    });

    return { totalBilled, totalCollected, totalDue, overdueCount };
  }, [invoices]);

  // ─── Form Handlers ──────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
      milestoneLabel: inv.milestoneLabel || "",
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
    setForm({ ...DEFAULT_FORM });
  };

  const addLineItem = () => {
    setForm({
      ...form,
      lineItems: [...form.lineItems, { item: "", description: "", quantity: 1, unitPrice: 0 }],
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

  const computedSubtotal = useMemo(() => {
    return form.lineItems.reduce((acc, li) => acc + (li.quantity || 1) * (li.unitPrice || 0), 0);
  }, [form.lineItems]);

  const computedTotal = useMemo(() => {
    return Math.max(0, computedSubtotal + Number(form.taxAmount || 0) - Number(form.discountAmount || 0));
  }, [computedSubtotal, form.taxAmount, form.discountAmount]);

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const filteredLineItems = form.lineItems.filter((li) => li.item && li.item.trim() !== "");
    if (filteredLineItems.length === 0) {
      toast.error("At least one line item title is required.");
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
      toast.error(err.message || "Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Payment Handler ────────────────────────────────────────────────────────

  const openPaymentModal = (inv: any) => {
    setSelectedInvoiceForPayment(inv);
    setPaymentAmount(inv.amountDue || 0);
    setPaymentMethod("bank_transfer");
    setPaymentReference("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;
    if (paymentAmount <= 0) {
      toast.error("Payment amount must be greater than zero.");
      return;
    }

    setRecordingPayment(true);
    const res = await recordInvoicePayment(selectedInvoiceForPayment._id, {
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference: paymentReference,
    });
    setRecordingPayment(false);

    if (res.success) {
      toast.success("Payment recorded successfully.");
      setSelectedInvoiceForPayment(null);
      fetchInvoices();
    } else {
      toast.error(res.error || "Failed to record payment.");
    }
  };

  // ─── Reminder Handlers ──────────────────────────────────────────────────────

  const openReminderModal = (inv: any) => {
    setReminderModalInvoice(inv);
  };

  const handleSendReminderFromModal = async () => {
    if (!reminderModalInvoice) return;

    setSendingReminder(true);
    const res = await sendInvoicePaymentReminder(reminderModalInvoice._id, "manual");
    setSendingReminder(false);

    if (res.success) {
      toast.success(res.message || "Payment reminder sent to client!");
      setReminderModalInvoice(null);
      fetchInvoices();
    } else {
      toast.error(res.error || "Failed to dispatch reminder.");
    }
  };

  // ─── Delete Handlers ────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteModalInvoice) return;
    setDeleting(true);
    const res = await deleteInvoice(deleteModalInvoice._id);
    setDeleting(false);

    if (res.success) {
      toast.success("Invoice deleted successfully.");
      setDeleteModalInvoice(null);
      fetchInvoices();
    } else {
      toast.error(res.error || "Failed to delete invoice.");
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
      {/* Page Header */}
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg hover:shadow-white/10"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
            <span>Total Invoiced</span>
            <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${metrics.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            Across {invoices.length} active invoices
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
            <span>Collected</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ${metrics.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-500/70 font-mono">
            {metrics.totalBilled > 0
              ? `${Math.round((metrics.totalCollected / metrics.totalBilled) * 100)}% recovery rate`
              : "0% recovery rate"}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
            <span>Outstanding Due</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            ${metrics.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            Pending client settlement
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
            <span>Overdue Invoices</span>
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">
            {metrics.overdueCount}
          </div>
          <div className="text-[10px] text-rose-500/70 font-mono">
            {metrics.overdueCount > 0 ? "Requires payment reminder" : "All accounts up to date"}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Invoices" },
            { id: "unpaid", label: "Unpaid / Pending" },
            { id: "partially_paid", label: "Partial" },
            { id: "paid", label: "Settled" },
            { id: "overdue", label: "Overdue" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all uppercase tracking-wider whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-white text-black font-bold shadow"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search invoice, client, milestone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-900/80 border border-white/10 rounded-lg text-white font-mono text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/60">
                <th className="py-3 px-4">Invoice / Milestone</th>
                <th className="py-3 px-4">Client & Project</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Settlement Progress</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Amount Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-400" />
                    Loading enterprise invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-neutral-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-neutral-600 opacity-60" />
                    No invoice records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isOverdue =
                    inv.status !== "paid" &&
                    inv.status !== "cancelled" &&
                    new Date(inv.dueDate) < new Date();
                  const percentPaid =
                    inv.totalAmount > 0
                      ? Math.min(100, Math.round(((inv.amountPaid || 0) / inv.totalAmount) * 100))
                      : 0;

                  return (
                    <tr key={inv._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Invoice # & Milestone */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-white tracking-wide">
                          {inv.invoiceNumber}
                        </div>
                        {inv.milestoneLabel ? (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            <Layers className="w-2.5 h-2.5" />
                            <span>{inv.milestoneLabel}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-1">Full Scope</div>
                        )}
                      </td>

                      {/* Client & Project */}
                      <td className="py-4 px-4 align-top">
                        <div className="text-white font-semibold">{inv.clientName}</div>
                        <div className="text-neutral-400 text-[11px] truncate max-w-[180px]">
                          {inv.projectName}
                        </div>
                        <div className="text-neutral-500 text-[10px]">{inv.clientEmail}</div>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 align-top">
                        <div
                          className={`font-semibold ${
                            isOverdue ? "text-rose-400" : "text-neutral-300"
                          }`}
                        >
                          {new Date(inv.dueDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        {isOverdue && (
                          <div className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-400 mt-0.5 uppercase tracking-wider">
                            <Clock className="w-2.5 h-2.5" />
                            Overdue
                          </div>
                        )}
                      </td>

                      {/* Settlement Progress */}
                      <td className="py-4 px-4 align-top">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-neutral-400">{percentPaid}%</span>
                            <span className="text-neutral-500">
                              {inv.currency} {(inv.amountPaid || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                percentPaid === 100
                                  ? "bg-emerald-400"
                                  : percentPaid > 0
                                  ? "bg-amber-400"
                                  : "bg-transparent"
                              }`}
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-top font-bold text-white">
                        {inv.currency} {inv.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Amount Due */}
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`font-bold ${
                            (inv.amountDue || 0) > 0 ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {inv.currency} {(inv.amountDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            STATUS_STYLES[inv.status] || STATUS_STYLES.draft
                          }`}
                        >
                          {inv.status?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Public URL */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/invoice/${inv.secureToken}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-neutral-400 hover:text-white font-mono text-[11px] px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => copyPublicLink(inv.secureToken)}
                            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
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

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-wrap justify-end items-center gap-1.5">
                          {/* Log Payment */}
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => openPaymentModal(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/20 text-white font-mono text-[10px] uppercase hover:bg-white/10 transition-colors"
                              title="Record payment"
                            >
                              <CreditCard className="w-3 h-3 text-emerald-400" />
                              <span>Log Pay</span>
                            </button>
                          )}

                          {/* Send Reminder */}
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => openReminderModal(inv)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase transition-colors"
                              title="Dispatch payment reminder"
                            >
                              <Bell className="w-3 h-3 text-amber-400" />
                              <span>Reminder</span>
                              {inv.remindersCount > 0 && (
                                <span className="ml-0.5 px-1 py-0.2 bg-white/20 rounded-full text-[8px]">
                                  {inv.remindersCount}
                                </span>
                              )}
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => openEdit(inv)}
                            className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Edit invoice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteModalInvoice(inv)}
                            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal 1: Reminder Confirmation Modal ────────────────────────────── */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Dispatch Payment Reminder
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {reminderModalInvoice.invoiceNumber} — {reminderModalInvoice.projectName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Client Recipient:</span>
                  <span className="text-white font-semibold">
                    {reminderModalInvoice.clientName} ({reminderModalInvoice.clientEmail})
                  </span>
                </div>
                {reminderModalInvoice.milestoneLabel && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Milestone Phase:</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                      {reminderModalInvoice.milestoneLabel}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Due Date:</span>
                  <span className="text-white">
                    {new Date(reminderModalInvoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Invoiced:</span>
                  <span className="text-white">
                    {reminderModalInvoice.currency} {reminderModalInvoice.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="text-white font-bold">Outstanding Balance:</span>
                  <span className="text-rose-400 font-black">
                    {reminderModalInvoice.currency} {reminderModalInvoice.amountDue?.toLocaleString()}
                  </span>
                </div>
              </div>

              {reminderModalInvoice.lastReminderSentAt && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 text-[11px]">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    Last reminder dispatched:{" "}
                    <span className="text-white font-medium">
                      {new Date(reminderModalInvoice.lastReminderSentAt).toLocaleString()}
                    </span>{" "}
                    (Total sent: {reminderModalInvoice.remindersCount || 1})
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-neutral-300 text-[11px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Anti-Fatigue Delivery Guard
                </div>
                <p>
                  Clicking send will dispatch a high-priority branded email via Nodemailer with direct payment
                  links and banking wires. A 24-hour rate limiter prevents multiple notifications within a single day.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setReminderModalInvoice(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
                disabled={sendingReminder}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReminderFromModal}
                disabled={sendingReminder}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black font-bold uppercase hover:bg-neutral-200 disabled:opacity-50 transition-all"
              >
                {sendingReminder ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reminder Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Record Payment Modal ───────────────────────────────────── */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase">
                    Record Client Payment
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {selectedInvoiceForPayment.invoiceNumber} — {selectedInvoiceForPayment.clientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-neutral-400 uppercase">
                    Payment Amount ({selectedInvoiceForPayment.currency}) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(selectedInvoiceForPayment.amountDue || 0)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Pay Full Due
                  </button>
                </div>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={selectedInvoiceForPayment.amountDue}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-white/30"
                />
                <p className="text-[10px] text-neutral-500">
                  Current outstanding: {selectedInvoiceForPayment.currency}{" "}
                  {selectedInvoiceForPayment.amountDue?.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                >
                  <option value="bank_transfer">Bank Wire Transfer (SWIFT / FedNow)</option>
                  <option value="wire">Direct Wire Transfer</option>
                  <option value="stripe">Stripe / Credit Card</option>
                  <option value="credit_card">Corporate Credit Card</option>
                  <option value="other">ACH / Check / Direct Settlement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Transaction Ref / Wire Confirmation</label>
                <input
                  type="text"
                  placeholder="e.g. WIRE-TR-904124 / Stripe ID"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
                  disabled={recordingPayment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black font-bold uppercase hover:bg-neutral-200 disabled:opacity-50"
                >
                  {recordingPayment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Record Payment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 3: Delete Confirmation Modal ──────────────────────────────── */}
      {deleteModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-950 border border-rose-500/20 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  Delete Invoice
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {deleteModalInvoice.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-neutral-300">
              <p>
                Are you sure you want to permanently delete this invoice for{" "}
                <strong className="text-white">{deleteModalInvoice.clientName}</strong>?
              </p>
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-300 text-[11px]">
                Warning: All linked payment receipts will also be removed. This action cannot be reversed.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeleteModalInvoice(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-600 text-white font-bold uppercase hover:bg-rose-500 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 4: Create / Edit Form Modal ───────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  {editingId ? "Update Invoice" : "Create New Invoice"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Specify client details, milestone phase, and line items.
                </p>
              </div>
              <button onClick={closeForm} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Client Company</label>
                  <input
                    type="text"
                    value={form.clientCompany}
                    onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.projectName}
                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Milestone Phase</label>
                  <input
                    type="text"
                    placeholder="e.g. Advance – 30%"
                    value={form.milestoneLabel}
                    onChange={(e) => setForm({ ...form, milestoneLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="BDT">BDT (৳)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase">Tax Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.taxAmount}
                    onChange={(e) => setForm({ ...form, taxAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-white uppercase font-bold text-xs tracking-wider">
                    Line Items
                  </span>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs text-white underline hover:text-neutral-300"
                  >
                    + Add Item
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
                      <div className="space-y-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Line item description / milestone component"
                            required
                            value={item.item}
                            onChange={(e) => updateLineItem(idx, "item", e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={item.quantity}
                              onChange={(e) =>
                                updateLineItem(idx, "quantity", Number(e.target.value))
                              }
                              className="w-full px-2 py-1.5 bg-black border border-white/10 rounded-lg text-white font-mono text-center text-xs"
                            />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                              Unit Price ({form.currency})
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateLineItem(idx, "unitPrice", Number(e.target.value))
                              }
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-lg text-white font-mono text-right text-xs"
                            />
                          </div>
                          <div className="col-span-3 flex items-end justify-end font-mono text-[11px] text-neutral-400 pb-1.5">
                            {form.currency}{" "}
                            {((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Bar */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>
                    {form.currency} {computedSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {form.taxAmount > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Tax:</span>
                    <span>+{form.currency} {Number(form.taxAmount).toLocaleString()}</span>
                  </div>
                )}
                {form.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Discount:</span>
                    <span>-{form.currency} {Number(form.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Due:</span>
                  <span className="text-emerald-400">
                    {form.currency} {computedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase">Notes & Wiring Details</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Payment instructions, bank wire info, or invoice notes"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white/30"
                />
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
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black font-bold uppercase hover:bg-neutral-200 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingId ? "Update Invoice" : "Create Invoice"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
