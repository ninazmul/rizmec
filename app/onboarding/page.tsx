"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { updateMyProfile } from "@/lib/actions/team.actions";
import { useUser } from "@clerk/nextjs";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [form, setForm] = useState({ name: "", title: "", slug: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const fullName = user.fullName || user.firstName || "";
      setForm((prev) => ({
        ...prev,
        name: fullName,
        slug: fullName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      }));
    }
  }, [isLoaded, user]);

  const handleNameChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: slugEdited
        ? prev.slug
        : val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: val.toLowerCase().replace(/[^a-z0-9-]/g, "") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.title.trim() || !form.slug.trim()) {
      setError("All fields are required.");
      return;
    }
    if (form.slug.length < 2) {
      setError("URL handle must be at least 2 characters.");
      return;
    }
    setSaving(true);
    const res = await updateMyProfile({
      name: form.name.trim(),
      title: form.title.trim(),
      slug: form.slug.trim(),
    });
    setSaving(false);
    if (res.success) {
      router.push("/dashboard/profile");
    } else {
      setError(res.error || "Something went wrong. Please try again.");
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-1">RIZMEC PLATFORM</p>
            <h1 className="text-2xl font-black tracking-tight">Set Up Your Profile</h1>
            <p className="text-sm text-neutral-400 mt-1">Complete this once to unlock your portfolio & dashboard.</p>
          </div>
        </div>

        <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Signed in as</p>
              <p className="text-xs font-mono text-white">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Job Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Frontend Engineer / Intern"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Your Portfolio URL *</label>
              <div className="flex items-center border border-white/10 rounded-xl bg-neutral-900 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all overflow-hidden">
                <span className="pl-4 pr-2 text-neutral-500 font-mono text-xs shrink-0">/p/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="your-name"
                  className="flex-1 pr-4 py-2.5 bg-transparent text-white text-sm placeholder-neutral-600 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-neutral-600 font-mono">Shareable on resumes — you can change this later.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating Profile...</span></>
              ) : (
                <><span>Continue to Dashboard</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-neutral-600 font-mono">
          You can edit all details later in your Portfolio Studio.
        </p>
      </div>
    </div>
  );
}
