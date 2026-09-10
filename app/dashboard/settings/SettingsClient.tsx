"use client";

import React, { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { updateCompanySettings } from "@/lib/actions/setting.actions";
import { DashboardAccess } from "@/lib/auth/rbac-rules";

interface Props {
  initialSettings: any;
  access: DashboardAccess;
}

export default function SettingsClient({ initialSettings, access }: Props) {
  const [form, setForm] = useState({
    companyName: initialSettings.companyName || "RIZMEC",
    tagline: initialSettings.tagline || "Intelligence. Engineered.",
    positioning: initialSettings.positioning || "Global Technology Engineering & Mission-Critical Systems",
    philosophy: initialSettings.philosophy || "From algorithms to intelligent systems.",
    contactEmail: initialSettings.contactEmail || "hello@rizmec.com",
    contactPhone: initialSettings.contactPhone || "+1 (888) 749-6320",
    address: initialSettings.address || "100 Montgomery St, Suite 2400, San Francisco, CA 94104",
    defaultCurrency: initialSettings.defaultCurrency || "USD",
    quotationTerms: initialSettings.quotationTerms || "Standard RIZMEC Master Engineering Agreement applies.",
    invoiceTerms: initialSettings.invoiceTerms || "Net 15 days. Wire and ACH preferred.",
    seoTitle: initialSettings.seo?.siteTitle || "RIZMEC — Intelligence. Engineered.",
    seoDescription: initialSettings.seo?.siteMetaDescription || "Global technology engineering company.",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await updateCompanySettings({
      companyName: form.companyName,
      tagline: form.tagline,
      positioning: form.positioning,
      philosophy: form.philosophy,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      address: form.address,
      defaultCurrency: form.defaultCurrency,
      quotationTerms: form.quotationTerms,
      invoiceTerms: form.invoiceTerms,
      seo: {
        siteTitle: form.seoTitle,
        siteMetaDescription: form.seoDescription,
        keywords: ["RIZMEC", "Software Engineering", "AI Systems", "Cloud Infrastructure"],
        canonicalUrl: "https://rizmec.com",
      },
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            ORGANIZATIONAL CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            RIZMEC Global Company Settings
          </h1>
        </div>

        {success && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Synchronized!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand & Positioning */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">Brand Positioning & Philosophy</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-neutral-400 uppercase">Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-neutral-400 uppercase">Positioning Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Corporate Philosophy</label>
            <input
              type="text"
              value={form.philosophy}
              onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Global Positioning Statement</label>
            <textarea
              rows={2}
              value={form.positioning}
              onChange={(e) => setForm({ ...form, positioning: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        {/* Contact & Global Headquarters */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">Headquarters & Coordinates</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase">Primary Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase">Direct Phone Line</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Corporate Headquarters Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
            />
          </div>
        </div>

        {/* Quotation & Invoice Defaults */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">Financial Terms & Agreement Defaults</h3>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Default Base Currency</label>
            <input
              type="text"
              value={form.defaultCurrency}
              onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
              className="w-24 px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Default Quotation Terms & Conditions</label>
            <textarea
              rows={3}
              value={form.quotationTerms}
              onChange={(e) => setForm({ ...form, quotationTerms: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Default Invoice Remittance Instructions</label>
            <textarea
              rows={2}
              value={form.invoiceTerms}
              onChange={(e) => setForm({ ...form, invoiceTerms: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Updating Systems..." : "Save Company Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
