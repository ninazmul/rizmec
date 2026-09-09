"use client";

import React, { useState, useEffect } from "react";
import { Mail, Send, Plus, Users, CheckCircle2, Clock } from "lucide-react";
import { getMailCampaigns, createMailCampaign, sendMailCampaign } from "@/lib/actions/mailing.actions";

export default function MailingCampaignsDashboardPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    previewText: "",
    contentHtml: "<p>Dear {{name}},</p><p>We are announcing new enterprise neural inference benchmarks at RIZMEC.</p>",
    targetStatus: ["qualified", "proposal"],
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createMailCampaign(form);
    if (res.success) {
      setIsModalOpen(false);
      fetchCampaigns();
    }
  };

  const handleSend = async (id: string) => {
    if (confirm("Execute campaign batch delivery via Nodemailer?")) {
      setDispatchingId(id);
      setFeedback("Dispatching campaign in rate-limited batches...");
      const res = await sendMailCampaign(id);
      setDispatchingId(null);
      if (res.success) {
        setFeedback(`Campaign executed! Sent: ${res.data?.sentCount}, Failed: ${res.data?.failedCount}`);
        fetchCampaigns();
      } else {
        setFeedback(`Error: ${res.error}`);
      }
      setTimeout(() => setFeedback(null), 6000);
    }
  };

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
          onClick={() => setIsModalOpen(true)}
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
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    Loading campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No campaigns created yet.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.01]">
                    <td className="py-4 px-4 font-bold text-white font-sans text-sm">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {c.subject}
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {(c.targetStatus || []).join(", ")}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
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
                <label className="font-mono text-neutral-400 uppercase">Personalized Message HTML *</label>
                <p className="text-[10px] text-neutral-500 font-mono">Variables available: {"{{name}}"}, {"{{company}}"}</p>
                <textarea
                  rows={5}
                  required
                  value={form.contentHtml}
                  onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-xs"
                />
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
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
