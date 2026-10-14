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
  Lock,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { getCompanySettings } from "@/lib/actions/setting.actions";

export default function ContactPage() {
  const { user, isLoaded, isSignedIn } = useUser();
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
    email: "",
    phone: "",
    service: "Applied AI Systems & Autonomous Agents",
    budget: "$5k - $10k",
    timeline: "1 - 3 Months",
    message: "",
  });

  // Automatically take user's email and full name from Clerk session
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
        email: primaryEmail,
        name: prev.name ? prev.name : fullName,
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
      setError(res.error || "Failed to submit inquiry. Please try again.");
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
      email: primaryEmail,
      phone: "",
      service: "Applied AI Systems & Autonomous Agents",
      budget: "$5k - $10k",
      timeline: "1 - 3 Months",
      message: "",
    });
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
        {/* Contact Form Container */}
        <div className="lg:col-span-8">
          {!isLoaded ? (
            <div className="p-16 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Verifying Clerk credentials...
              </p>
            </div>
          ) : !isSignedIn ? (
            /* Secure Authentication Gate */
            <div className="p-8 sm:p-14 rounded-2xl border border-white/10 bg-neutral-950 space-y-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/15 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-3 max-w-xl mx-auto">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Secure Access Required
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Sign in with Clerk to access the inquiry form
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  To protect architectural proposals and maintain verified enterprise correspondence, you must be signed in with Clerk. Your verified email will be automatically linked to your submission.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/sign-in?redirect_url=${encodeURIComponent("/contact")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In with Clerk</span>
                </Link>
                <Link
                  href={`/sign-up?redirect_url=${encodeURIComponent("/contact")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-xs font-mono text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  <span>Create Account</span>
                </Link>
              </div>

              <div className="pt-8 border-t border-white/10 text-left text-xs font-mono text-neutral-500 space-y-2">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Identity & NDA Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  All enterprise briefs are cryptographically attributed to your Clerk authentication identifier for compliance, security, and spam prevention.
                </p>
              </div>
            </div>
          ) : submitted ? (
            <div className="p-10 rounded-2xl border border-white/20 bg-neutral-950 space-y-6 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Engagement Request Received</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Your architectural inquiry has been logged into our CRM pipeline and attributed to your verified email (<span className="text-white font-medium">{form.email}</span>). A Principal Solutions Architect will review your scope and follow up with a technical assessment.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono text-white uppercase hover:bg-white/5 transition-colors"
              >
                Submit Additional Brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-950 p-8 sm:p-12 rounded-2xl border border-white/10">
              {/* Authenticated Identity Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                <div className="flex items-center gap-3">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "User Avatar"}
                      className="w-10 h-10 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-white">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{user?.fullName || "Authenticated Client"}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Account
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      {form.email || user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    Security Level
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">
                    Clerk Authenticated
                  </span>
                </div>
              </div>

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

                {/* Email Field - Auto-filled from Clerk and Protected */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Corporate Email *
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Auto-filled from Clerk
                    </span>
                  </div>
                  <input
                    type="email"
                    required
                    readOnly
                    value={form.email}
                    className="w-full px-4 py-3 bg-neutral-900/60 border border-emerald-500/30 rounded-lg text-sm text-neutral-200 cursor-not-allowed focus:outline-none font-sans select-none"
                    title="Automatically captured from your authenticated Clerk account"
                  />
                  <p className="text-[11px] font-mono text-neutral-500">
                    Captured automatically from your authenticated profile.
                  </p>
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
                    <option value="< $1k">&lt; $1k (Micro-Task / Consultation)</option>
                    <option value="$1k - $5k">$1k - $5k (MVP / Prototype)</option>
                    <option value="$5k - $10k">$5k - $10k (Small Project)</option>
                    <option value="$10k - $25k">$10k - $25k (Standard System)</option>
                    <option value="$25k - $50k">$25k - $50k (Growth & Scale)</option>
                    <option value="$50k - $100k">$50k - $100k (Advanced Platform)</option>
                    <option value="$100k - $250k">$100k - $250k (Enterprise Tier)</option>
                    <option value="$250k+">$250k+ (Strategic Scale)</option>
                    <option value="Flexible / Undecided">Flexible / Undecided</option>
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
                  {contactPhone ? (
                    <a
                      href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {contactPhone}
                    </a>
                  ) : (
                    <div>Not configured</div>
                  )}
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
