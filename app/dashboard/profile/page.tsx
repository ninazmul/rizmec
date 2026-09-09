"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Save, CheckCircle2, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { updateMyProfile, getTeamMembers } from "@/lib/actions/team.actions";

export default function MemberProfileDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    tagline: "",
    bio: "",
    avatar: "",
    technologies: "",
    socialGithub: "",
    socialLinkedin: "",
    socialTwitter: "",
    skills: [
      { name: "Distributed Systems Architecture", level: 95 },
      { name: "Full-Stack Next.js / TypeScript", level: 92 },
    ],
    experience: [
      { company: "RIZMEC", role: "Software Engineer", period: "2024 — Present", description: "Engineers high-throughput backend services and frontends." },
    ],
    education: [
      { degree: "B.S. Computer Science", institution: "University", year: "2022" },
    ],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2023" },
    ],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const techArray = form.technologies.split(",").map((t) => t.trim()).filter(Boolean);

    const res = await updateMyProfile({
      title: form.title,
      tagline: form.tagline,
      bio: form.bio,
      avatar: form.avatar,
      technologies: techArray,
      skills: form.skills,
      experience: form.experience,
      education: form.education,
      certifications: form.certifications,
      socialLinks: {
        github: form.socialGithub,
        linkedin: form.socialLinkedin,
        twitter: form.socialTwitter,
      },
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(res.error || "Failed to update profile.");
    }
  };

  const addSkill = () => {
    setForm({
      ...form,
      skills: [...form.skills, { name: "New Skill", level: 90 }],
    });
  };

  const removeSkill = (index: number) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            MEMBER PORTFOLIO DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            My Professional Public Profile
          </h1>
        </div>

        {success && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Synchronized!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 font-sans text-xs">
        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 font-mono">
            {error}
          </div>
        )}

        {/* Basic Bio Section */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">Core Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-neutral-400 uppercase">Job Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Distributed Systems Engineer"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-neutral-400 uppercase">Tagline / Motto</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="High-throughput systems & low-latency engines"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Profile Photo URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Professional Biography</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Describe your engineering trajectory, systems designed, and technical specializations..."
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-neutral-400 uppercase">Technologies (Comma Separated)</label>
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="Next.js, TypeScript, Go, Kubernetes, Kafka, PyTorch"
              className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono"
            />
          </div>
        </div>

        {/* Skills Management */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white font-mono uppercase">Skills & Competency</h3>
            <button
              type="button"
              onClick={addSkill}
              className="text-xs font-mono text-white underline"
            >
              + Add Skill
            </button>
          </div>

          <div className="space-y-3">
            {form.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...form.skills];
                    updated[idx].name = e.target.value;
                    setForm({ ...form, skills: updated });
                  }}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const updated = [...form.skills];
                    updated[idx].level = Number(e.target.value);
                    setForm({ ...form, skills: updated });
                  }}
                  className="w-20 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-center"
                />
                <span className="text-neutral-500 font-mono">%</span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="p-1 text-neutral-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950 space-y-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">External Profiles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase">GitHub URL</label>
              <input
                type="text"
                value={form.socialGithub}
                onChange={(e) => setForm({ ...form, socialGithub: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase">LinkedIn URL</label>
              <input
                type="text"
                value={form.socialLinkedin}
                onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase">Twitter / X URL</label>
              <input
                type="text"
                value={form.socialTwitter}
                onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Synchronizing Profile..." : "Save Public Portfolio"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
