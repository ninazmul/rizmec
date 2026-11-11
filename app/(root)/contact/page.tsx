"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Send,
  ShieldCheck,
  Mail,
  MapPin,
  Clock,
  User as UserIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import {
  PROJECT_CATEGORIES,
  BUDGET_TIERS,
  TIMELINE_OPTIONS,
  COMPANY_IDENTITY,
} from "@/constants/verifiedData";

export default function ContactPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    country: "",
    service: PROJECT_CATEGORIES[0],
    budget: BUDGET_TIERS[2],
    timeline: TIMELINE_OPTIONS[1],
    message: "",
    hp: "", // Anti-spam honeypot
  });

  // Automatically pre-fill authenticated Clerk user information if present
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
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      setError("Please provide a valid business email address.");
      return;
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      setError("Please describe your project requirements (minimum 10 characters).");
      return;
    }

    setLoading(true);
    const res = await submitContactMessage(form);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit inquiry. Please try again or email hello@rizmec.com.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError("");
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
      email: primaryEmail,
      company: "",
      website: "",
      country: "",
      service: PROJECT_CATEGORIES[0],
      budget: BUDGET_TIERS[2],
      timeline: TIMELINE_OPTIONS[1],
      message: "",
      hp: "",
    });
  };

  return (
    <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          // Commercial Engagement
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white text-chrome">
          Discuss Your Project With Rizmec.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
          Tell us about what you want to build, automate, or scale. Every inquiry is personally reviewed by our Founder &amp; Chief Architect to assess technical feasibility, scope, and timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        {/* Contact Form Container */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="p-10 sm:p-14 rounded-2xl border border-white/20 bg-neutral-950 space-y-6 text-center max-w-xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Inquiry Successfully Received
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Thank You for Reaching Out
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                Your project brief has been logged into our engineering CRM and assigned directly to our Founder &amp; Chief Architect. We review technical requirements and respond with an initial assessment within 24 business hours to <span className="text-white font-mono font-medium">{form.email}</span>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full border border-white/20 text-xs font-mono text-white uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  Submit Another Inquiry
                </button>
                <Link
                  href="/work"
                  className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Explore Our Work
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-neutral-950 p-6 sm:p-10 rounded-2xl border border-white/10 shadow-2xl"
              noValidate
            >
              {/* Optional Authenticated Status Banner */}
              {isSignedIn && (
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
                        <span>{user?.fullName || "Signed-in User"}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Authenticated
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                        {form.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="form-hp">Website Security Check</label>
                <input
                  id="form-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.hp}
                  onChange={(e) => setForm({ ...form, hp: e.target.value })}
                />
              </div>

              {/* Grid 1: Name & Business Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Business Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. alex@company.com"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Grid 2: Company Name & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Company / Organization
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Acme Global or Consultancy Name"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-website" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Website URL (Optional)
                  </label>
                  <input
                    id="contact-website"
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="e.g. https://yourcompany.com"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Grid 3: Country & Project Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-country" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Country / Region
                  </label>
                  <input
                    id="contact-country"
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. United Kingdom, Australia, Canada"
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-service" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Project Category <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    id="contact-service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-950 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 4: Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-budget" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Estimated Budget (USD)
                  </label>
                  <select
                    id="contact-budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    {BUDGET_TIERS.map((tier) => (
                      <option key={tier} value={tier} className="bg-neutral-950 text-white">
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-timeline" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Expected Timeline
                  </label>
                  <select
                    id="contact-timeline"
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white transition-colors font-sans"
                  >
                    {TIMELINE_OPTIONS.map((time) => (
                      <option key={time} value={time} className="bg-neutral-950 text-white">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Project Description &amp; Requirements <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you want to build, automate, or improve. Include any current bottlenecks, key features, or system integrations needed."
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Inquiry</span>
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Engineering Contacts
            </h3>
            <div className="space-y-5 text-xs font-mono">
              <div className="flex items-start gap-3 text-neutral-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">OFFICIAL INBOX</div>
                  <a href={`mailto:${COMPANY_IDENTITY.contactEmail}`} className="hover:text-white transition-colors">
                    {COMPANY_IDENTITY.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">RESPONSE WINDOW</div>
                  <div>Within 24 Business Hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">HEADQUARTERS</div>
                  <div>{COMPANY_IDENTITY.headquarters}</div>
                  <div className="text-neutral-500 mt-0.5">Serving clients worldwide</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIDENTIALITY &amp; NDA</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Every project inquiry is treated with strict commercial confidentiality. We are happy to execute mutual non-disclosure agreements prior to detailed technical discovery.
              </p>
            </div>
          </div>

          {/* Founder Direct Review Note */}
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FOUNDER-LED ENGAGEMENT</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              You will communicate directly with our Founder &amp; Chief Architect throughout the scoping and engineering phase — no sales middlemen or account representatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
