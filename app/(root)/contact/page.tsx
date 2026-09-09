"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Send, ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import { submitContactMessage } from "@/lib/actions/contact.actions";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "Applied AI Systems & Autonomous Agents",
    budget: "$100k - $250k",
    timeline: "1 - 3 Months",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await submitContactMessage(form);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          // Enterprise Inquiries
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Initiate an engineering engagement.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Submit your architectural requirements. Our principal engineering teams evaluate technical feasibility, timeline constraints, and deliver an initial scope assessment within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        {/* Contact Form */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="p-10 rounded-2xl border border-white/20 bg-neutral-950 space-y-6 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Engagement Request Received</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Your architectural inquiry has been logged into our CRM pipeline. A Principal Solutions Architect will review your scope and follow up with a technical assessment.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono text-white uppercase hover:bg-white/5"
              >
                Submit Additional Brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-950 p-8 sm:p-12 rounded-2xl border border-white/10">
              {error && (
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Enterprise / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Apex Global Systems"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Phone / Direct Line
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Service & Budget Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Primary Service Focus
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    <option value="Applied AI Systems & Autonomous Agents">Applied AI Systems</option>
                    <option value="Distributed Cloud Systems & Resiliency">Cloud Systems & Mesh</option>
                    <option value="Mission-Critical Full-Stack Web Applications">Full-Stack Web Platforms</option>
                    <option value="Enterprise SaaS & Business Operating Platforms">Enterprise SaaS Platforms</option>
                    <option value="Mobile Applications & Native Systems">Mobile Systems</option>
                    <option value="Custom Automation & Workflow Engines">Custom Automation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Estimated Budget (USD)
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    <option value="$25k - $50k">$25k - $50k</option>
                    <option value="$50k - $100k">$50k - $100k</option>
                    <option value="$100k - $250k">$100k - $250k</option>
                    <option value="$250k+">$250k+ (Enterprise Tier)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Target Delivery Window
                  </label>
                  <select
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    <option value="Urgent (< 1 Month)">Urgent (&lt; 1 Month)</option>
                    <option value="1 - 3 Months">1 - 3 Months</option>
                    <option value="3 - 6 Months">3 - 6 Months</option>
                    <option value="Ongoing Strategic Retainer">Ongoing Strategic Retainer</option>
                  </select>
                </div>
              </div>

              {/* Message Scope */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Project Scope & Technical Objectives *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Outline your systems architecture, expected load/concurrency, data constraints, or key technical hurdles..."
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing Scope Submission...</span>
                ) : (
                  <>
                    <span>Submit Architectural Brief</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Direct Channels
            </h3>
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 text-neutral-400">
                <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">OFFICIAL INBOX</div>
                  <a href="mailto:hello@rizmec.com" className="hover:text-white transition-colors">hello@rizmec.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-neutral-400">
                <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">DIRECT DESK</div>
                  <div>+1 (888) 749-6320</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">HEADQUARTERS</div>
                  <div>100 Montgomery St, Suite 2400<br/>San Francisco, CA 94104</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>NDA & IP GUARANTEE</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All submitted briefs are protected under automatic mutual confidentiality. We never share proprietary architectural details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
