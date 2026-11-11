"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Send,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Globe2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { getCompanySettings } from "@/lib/actions/setting.actions";
import { CyberGlowMesh } from "@/components/ui/CyberGlowMesh";

export default function ContactPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    getCompanySettings().then((settings) => {
      setContactPhone(settings?.contactPhone?.trim() || "");
    });
  }, []);

  const [form, setForm] = useState({
    name: "",
    company: "",
    website: "",
    country: "",
    email: "",
    phone: "",
    service: "Custom Software Engineering",
    budget: "$10k - $25k",
    timeline: "1 - 3 Months",
    message: "",
    honeypot: "",
  });

  // Pre-fill user details if logged into Clerk, but never require login
  useEffect(() => {
    if (isLoaded && user) {
      const primaryEmail =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "";
      const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "";

      setForm((prev) => ({
        ...prev,
        email: prev.email || primaryEmail,
        name: prev.name || fullName,
      }));
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await submitContactMessage(form);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit project inquiry. Please check your inputs and try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    const primaryEmail =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "";
    const fullName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "";

    setForm({
      name: fullName,
      company: "",
      website: "",
      country: "",
      email: primaryEmail,
      phone: "",
      service: "Custom Software Engineering",
      budget: "$10k - $25k",
      timeline: "1 - 3 Months",
      message: "",
      honeypot: "",
    });
  };

  return (
    <div className="relative overflow-hidden pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <CyberGlowMesh intensity="low" />

      {/* Header */}
      <div className="max-w-3xl space-y-6 relative">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // Project Inquiries & Consultation
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Discuss Your Project
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Tell us about the software, intelligent automation, or platform you are looking to build.
          Our team reviews requirements directly and responds within 24 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-white/10 relative">
        {/* Contact Form Container */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="p-10 sm:p-14 rounded-2xl border border-white/20 bg-neutral-900/60 backdrop-blur-xl space-y-6 text-center max-w-xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Project Inquiry Received
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Thank you for reaching out to Rizmec. Your architectural requirements have been routed directly to our engineering leadership. We will evaluate technical scope, feasibility, and schedule a consultation with you via{" "}
                <span className="text-white font-mono font-medium">{form.email}</span>.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full border border-white/20 text-xs font-mono text-white uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-neutral-900/50 backdrop-blur-xl p-8 sm:p-12 rounded-2xl border border-white/10 shadow-2xl"
            >
              {error && (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Honeypot field for anti-spam (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave this empty</label>
                <input
                  id="website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                />
              </div>

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Business Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="sarah@company.com"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Company Name and Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Apex Global Ltd"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Website <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Country / Market and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Country / Market
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. United Kingdom, Australia, UAE, US..."
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Direct Phone / WhatsApp <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: Project Category and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Project Category <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="Custom Software Engineering">Custom Software Engineering (Web Apps, ERP, SaaS)</option>
                    <option value="AI & Intelligent Automation">AI & Intelligent Automation (Agents, Workflows, RAG)</option>
                    <option value="Education Technology">Education Technology (PartnerOS, Portals, Management)</option>
                    <option value="Recurring Technology Partnership">Ongoing Technology Partnership / Maintenance</option>
                    <option value="Other Technical Inquiry">Other Technical Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Estimated Budget (USD)
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="$3k - $5k">$3,000 – $5,000</option>
                    <option value="$5k - $10k">$5,000 – $10,000</option>
                    <option value="$10k - $25k">$10,000 – $25,000</option>
                    <option value="$25k - $50k">$25,000 – $50,000</option>
                    <option value="$50k+">$50,000+</option>
                    <option value="To be determined">To be determined / Consultation</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Timeline */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Target Timeline
                </label>
                <select
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Urgent (< 1 Month)">Immediate / Urgent (&lt; 1 Month)</option>
                  <option value="1 - 3 Months">1 – 3 Months</option>
                  <option value="3 - 6 Months">3 – 6 Months</option>
                  <option value="Ongoing Partnership">Ongoing Strategic Partnership</option>
                </select>
              </div>

              {/* Project Scope Description */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Project Description & Key Objectives <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe what you are looking to build, solve, or automate. Outline your business workflow, technical stack preferences, or specific integration requirements..."
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 shadow-xl btn-shimmer btn-glow"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Discuss Your Project</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Confidentiality & NDA respected</span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-6">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Direct Channels</span>
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 text-neutral-400">
                <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">DIRECT INBOX</div>
                  <a href="mailto:hello@rizmec.com" className="hover:text-cyan-300 transition-colors">
                    hello@rizmec.com
                  </a>
                </div>
              </div>

              {contactPhone && (
                <div className="flex items-start gap-3 text-neutral-400">
                  <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">DIRECT LINE</div>
                    <a
                      href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                      className="hover:text-cyan-300 transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">ENGINEERING BASE</div>
                  <div>Dhaka, Bangladesh</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Serving international clients globally</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-400">
                <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">RESPONSE WINDOW</div>
                  <div>Within 24 business hours</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>FOUNDER-LED ENGAGEMENT</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every technical proposal is reviewed directly by our Chief Architect, ensuring realistic feasibility, clear milestones, and maintainable software architecture.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-xl space-y-3">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
              International Coverage
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We work collaboratively with business founders and engineering leads across the United Kingdom, Australia, United Arab Emirates, North America, and other global markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
