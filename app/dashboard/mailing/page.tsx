"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, Plus, Users, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
import {
  getMailCampaigns,
  createMailCampaign,
  sendMailCampaign,
  updateMailCampaign,
  deleteMailCampaign,
} from "@/lib/actions/mailing.actions";
import toast from "react-hot-toast";

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
  "nurture",
];

const DEFAULT_FORM = {
  name: "",
  subject: "",
  previewText: "",
  contentHtml: "<p>Dear {{name}},</p><p>We are announcing new enterprise neural inference benchmarks at RIZMEC.</p>",
  targetStatus: ["qualified", "proposal"] as string[],
};

export default function MailingCampaignsDashboardPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchCampaigns = async () => {
    setLoading(true);
    const res = await getMailCampaigns();
    if (res.success) {
      setCampaigns(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      targetStatus: ["qualified", "proposal"],
    });
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c._id);
    setForm({
      name: c.name || "",
      subject: c.subject || "",
      previewText: c.previewText || "",
      contentHtml: c.contentHtml || DEFAULT_FORM.contentHtml,
      targetStatus:
        c.targetStatus && Array.isArray(c.targetStatus) && c.targetStatus.length > 0
          ? [...c.targetStatus]
          : ["qualified", "proposal"],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      targetStatus: ["qualified", "proposal"],
    });
  };

  const toggleTargetStatus = (status: string) => {
    const current = new Set(form.targetStatus);
    if (current.has(status)) {
      current.delete(status);
    } else {
      current.add(status);
    }
    setForm({ ...form, targetStatus: Array.from(current) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.targetStatus.length === 0) {
      toast.error("Select at least one audience segment (lead status).");
      return;
    }
    setSaving(true);

    try {
      let res;
      if (editingId) {
        res = await updateMailCampaign(editingId, form as any);
      } else {
        res = await createMailCampaign(form);
      }

      if (res.success) {
        toast.success(editingId ? "Campaign updated successfully." : "Campaign saved successfully.");
        closeModal();
        fetchCampaigns();
      } else {
        toast.error(res.error || "Failed to save campaign.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this campaign? This action cannot be undone.")) return;
    const res = await deleteMailCampaign(id);
    if (res.success) {
      toast.success("Campaign deleted.");
      fetchCampaigns();
    } else {
      toast.error(res.error || "Failed to delete campaign.");
    }
  };

  const handleSend = async (id: string) => {
    if (confirm("Execute campaign batch delivery via Nodemailer?")) {
      setDispatchingId(id);
      setFeedback("Dispatching campaign in rate-limited batches...");
      const res = await sendMailCampaign(id);
      setDispatchingId(null);
      if (res.success) {
        const msg = `Campaign executed! Sent: ${res.data?.sentCount}, Failed: ${res.data?.failedCount}`;
        setFeedback(msg);
        toast.success(msg);
        fetchCampaigns();
      } else {
        setFeedback(`Error: ${res.error}`);
        toast.error(res.error || "Failed to send campaign.");
      }
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  const isEditable = (c: any) => c.status !== "completed" && c.status !== "sending";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            EMAIL MARKETING & COMMUNICATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Mailing Campaigns & Dispatch Engine
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl border border-white/20 bg-neutral-900 font-mono text-xs text-white flex items-center gap-3">
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Subject Line</th>
                <th className="py-3 px-4">Audience Segment</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    Loading campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No campaigns created yet.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white font-sans text-sm">
                      {c.name}
                      {c.previewText && (
                        <div className="text-[10px] text-neutral-500 font-mono mt-1 max-w-xs truncate">
                          {c.previewText}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {c.subject}
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      <div className="flex flex-wrap gap-1">
                        {(c.targetStatus || []).map((s: string) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase"
                          >
                            {s.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-neutral-500" />
                        <span>{c.recipientCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          c.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : c.status === "sending"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-white/10 text-neutral-300"
                        }`}
                      >
                        {c.status} ({c.sentCount || 0} sent)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(c)}
                          disabled={!isEditable(c)}
                          className={`p-1.5 rounded border ${
                            isEditable(c)
                              ? "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                              : "border-white/5 text-neutral-600 cursor-not-allowed"
                          }`}
                          title={
                            isEditable(c)
                              ? "Edit campaign"
                              : `Cannot edit — campaign is ${c.status}`
                          }
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={c.status === "sending"}
                          className={`p-1.5 rounded border ${
                            c.status !== "sending"
                              ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                              : "border-white/5 text-neutral-600 cursor-not-allowed"
                          }`}
                          title={c.status === "sending" ? "Cannot delete during send" : "Delete campaign"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {c.status !== "completed" && (
                          <button
                            onClick={() => handleSend(c._id)}
                            disabled={dispatchingId === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-black font-bold uppercase text-[10px] hover:bg-neutral-200 disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            <span>{dispatchingId === c._id ? "Sending..." : "Dispatch Campaign"}</span>
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
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  {editingId ? "Update Campaign" : "New Campaign"}
                </h3>
                {editingId && (
                  <p className="text-[11px] text-amber-400/80 font-mono mt-1">
                    Editing is locked once campaign starts sending.
                  </p>
                )}
              </div>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Q1 Neural Systems Benchmark Update"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Email Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Advancing Enterprise Inference Architecture"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Preview / Inbox Snippet</label>
                  <input
                    type="text"
                    value={form.previewText}
                    onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                    placeholder="Short text shown after subject in inbox"
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-neutral-400 uppercase block">
                  Audience Segments (Lead Status) *
                </label>
                <div className="p-3 rounded-lg border border-white/10 bg-neutral-900 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LEAD_STATUSES.map((status) => {
                    const active = form.targetStatus.includes(status);
                    return (
                      <label
                        key={status}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded border cursor-pointer select-none transition-colors ${
                          active
                            ? "bg-white/10 border-white/30 text-white"
                            : "bg-transparent border-white/10 text-neutral-400 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-white"
                          checked={active}
                          onChange={() => toggleTargetStatus(status)}
                        />
                        <span className="text-[11px] font-mono capitalize">
                          {status.replace("_", " ")}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  Selected: {form.targetStatus.length} segment
                  {form.targetStatus.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Personalized Message HTML *</label>
                <p className="text-[10px] text-neutral-500 font-mono">
                  Variables available: {"{{name}}"}, {"{{company}}"}
                </p>
                <textarea
                  rows={8}
                  required
                  value={form.contentHtml}
                  onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-xs"
                />
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
                  {saving ? "Saving..." : editingId ? "Update Campaign" : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
