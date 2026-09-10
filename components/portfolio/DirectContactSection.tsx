"use client";

import React, { useState } from "react";
import { Mail, Phone, Send, CheckCircle2, MessageSquare, Copy, Check, Calendar, ArrowUpRight } from "lucide-react";
import { submitPortfolioDirectMessage } from "@/lib/actions/team.actions";

interface DirectContactSectionProps {
  memberId: string;
  name: string;
  contactInfo?: {
    personalEmail?: string;
    publicEmail?: boolean;
    phone?: string;
    calendlyUrl?: string;
    telegram?: string;
    whatsapp?: string;
    discord?: string;
  };
  theme?: string;
}

export function DirectContactSection({
  memberId,
  name,
  contactInfo,
  theme = "obsidian",
}: DirectContactSectionProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = contactInfo?.personalEmail;
  const showEmail = contactInfo?.publicEmail !== false && !!email;
  const calendlyUrl = contactInfo?.calendlyUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await submitPortfolioDirectMessage({
      memberId,
      senderName: formData.senderName,
      senderEmail: formData.senderEmail,
      subject: formData.subject,
      message: formData.message,
    });

    setLoading(false);
    if (res.success) {
      setSubmitted(true);
      setFormData({ senderName: "", senderEmail: "", subject: "", message: "" });
    } else {
      setError(res.error || "Failed to send message. Please try again.");
    }
  };

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <section id="contact" className="space-y-12 pt-16 border-t border-white/10">
      <div className="space-y-2">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>// Direct Communication</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Get in Touch with {name}
        </h2>
        <p className="text-sm text-neutral-400 font-light max-w-xl">
          Direct communication for technical advisory, engineering opportunities, or consulting engagements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Channels */}
        <div className="lg:col-span-5 space-y-6">
          {showEmail && (
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono text-neutral-400 uppercase">Direct Email</span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${email}`}
                  className="text-sm sm:text-base font-mono text-white hover:text-cyan-300 transition-colors break-all"
                >
                  {email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-all shrink-0"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {calendlyUrl && (
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono text-neutral-400 uppercase">Schedule Technical Discussion</span>
              <p className="text-xs text-neutral-300 font-light">
                Reserve 30 minutes to discuss architectural roadmaps, role alignment, or high-impact consulting.
              </p>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Open Calendar Booking</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Instant Messengers */}
          {(contactInfo?.whatsapp || contactInfo?.telegram || contactInfo?.discord || contactInfo?.phone) && (
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono text-neutral-400 uppercase">Instant Direct Channels</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {contactInfo.whatsapp && (
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-emerald-400 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all"
                  >
                    WhatsApp
                  </a>
                )}
                {contactInfo.telegram && (
                  <a
                    href={`https://t.me/${contactInfo.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-sky-400 hover:border-sky-400/40 hover:bg-sky-500/10 transition-all"
                  >
                    Telegram
                  </a>
                )}
                {contactInfo.discord && (
                  <span className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-indigo-400">
                    Discord: {contactInfo.discord}
                  </span>
                )}
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:border-white/30 transition-all"
                  >
                    Tel: {contactInfo.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Send Direct Message</h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Transmitted</h4>
                <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto">
                  Your inquiry has been dispatched directly to {name}&apos;s inbox. You will receive a response shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-white transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      placeholder="jane@organization.com"
                      className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 uppercase">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Engineering Role / Consulting Opportunity"
                    className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 uppercase">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your technical initiative, project goals, or opportunity..."
                    className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Transmitting..." : "Send Message to " + name}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
