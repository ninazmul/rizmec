"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  Code2,
  FolderGit2,
  Briefcase,
  Mail,
  Palette,
  Sparkles,
  Layers,
  AlertCircle,
  Download,
} from "lucide-react";
import { getMyProfile, updateMyProfile, checkSlugAvailable } from "@/lib/actions/team.actions";
import { getResumeDownloadUrl } from "@/lib/utils";

export default function MemberProfileDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"identity" | "skills" | "projects" | "career" | "contact" | "theme">("identity");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; error?: string }>({});

  const [form, setForm] = useState({
    name: "",
    slug: "",
    title: "",
    tagline: "",
    bio: "",
    avatar: "",
    coverImage: "",
    location: "",
    availability: {
      status: "open_to_work",
      label: "Open for new opportunities & consulting",
    },
    technologies: "",
    skills: [] as Array<{ name: string; level: number; category: string }>,
    customProjects: [] as Array<{
      title: string;
      description: string;
      role: string;
      technologies: string;
      metrics: string;
      liveUrl: string;
      githubUrl: string;
      imageUrl: string;
      featured: boolean;
    }>,
    experience: [] as Array<{ company: string; role: string; period: string; description: string }>,
    education: [] as Array<{ degree: string; institution: string; year: string }>,
    certifications: [] as Array<{ name: string; issuer: string; year: string; credentialUrl?: string }>,
    achievements: [] as string[],
    contactInfo: {
      personalEmail: "",
      publicEmail: true,
      phone: "",
      calendlyUrl: "",
      telegram: "",
      whatsapp: "",
      discord: "",
    },
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    themeConfig: {
      preset: "obsidian",
      effect3D: "tilt",
      accentColor: "",
    },
    seo: {
      customTitle: "",
      customDescription: "",
    },
    resumeUrl: "",
  });

  // Load profile data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getMyProfile();
      if (res.success && res.data) {
        const d = res.data;
        setForm({
          name: d.name || "",
          slug: d.slug || "",
          title: d.title || "",
          tagline: d.tagline || "",
          bio: d.bio || "",
          avatar: d.avatar || "",
          coverImage: d.coverImage || "",
          location: d.location || "",
          availability: d.availability || {
            status: "open_to_work",
            label: "Open for new opportunities & consulting",
          },
          technologies: Array.isArray(d.technologies) ? d.technologies.join(", ") : "",
          skills: d.skills || [],
          customProjects: (d.customProjects || []).map((p: any) => ({
            ...p,
            technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || "",
            metrics: Array.isArray(p.metrics) ? p.metrics.join(", ") : p.metrics || "",
          })),
          experience: d.experience || [],
          education: d.education || [],
          certifications: d.certifications || [],
          achievements: d.achievements || [],
          resumeUrl: d.resumeUrl || "",
          contactInfo: d.contactInfo || {
            personalEmail: d.email || "",
            publicEmail: true,
            phone: "",
            calendlyUrl: "",
            telegram: "",
            whatsapp: "",
            discord: "",
          },
          socialLinks: d.socialLinks || {},
          themeConfig: d.themeConfig || { preset: "obsidian", effect3D: "tilt" },
          seo: d.seo || {},
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Live slug validation
  const handleSlugChange = async (slugVal: string) => {
    const clean = slugVal.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((prev) => ({ ...prev, slug: clean }));

    if (clean.length >= 2) {
      const res = await checkSlugAvailable(clean);
      setSlugStatus(res);
    } else {
      setSlugStatus({ error: "Slug must be at least 2 characters" });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && form.slug) {
      const origin = window.location.origin;
      navigator.clipboard.writeText(`${origin}/p/${form.slug}`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const techArray = form.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanedProjects = form.customProjects.map((p) => ({
      title: p.title,
      description: p.description,
      role: p.role,
      technologies: p.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      metrics: p.metrics
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      imageUrl: p.imageUrl,
      featured: p.featured,
    }));

    const res = await updateMyProfile({
      name: form.name,
      slug: form.slug,
      title: form.title,
      tagline: form.tagline,
      bio: form.bio,
      avatar: form.avatar,
      coverImage: form.coverImage,
      location: form.location,
      availability: form.availability,
      technologies: techArray,
      skills: form.skills,
      customProjects: cleanedProjects,
      experience: form.experience,
      education: form.education,
      certifications: form.certifications,
      achievements: form.achievements,
      resumeUrl: form.resumeUrl,
      contactInfo: form.contactInfo,
      socialLinks: form.socialLinks,
      themeConfig: form.themeConfig,
      seo: form.seo,
    });

    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(res.error || "Failed to update portfolio.");
    }
  };

  // Helper arrays mutations
  const addSkill = () => {
    setForm({
      ...form,
      skills: [...form.skills, { name: "System Architecture", level: 90, category: "Core" }],
    });
  };

  const removeSkill = (index: number) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const addProject = () => {
    setForm({
      ...form,
      customProjects: [
        ...form.customProjects,
        {
          title: "New High-Performance Architecture",
          description: "Engineered low-latency distributed event streaming engine.",
          role: "Lead Architect",
          technologies: "Next.js, TypeScript, Go, Kafka",
          metrics: "Reduced latency by 45%, 100k req/sec",
          liveUrl: "",
          githubUrl: "",
          imageUrl: "",
          featured: true,
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    setForm({
      ...form,
      customProjects: form.customProjects.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { company: "Organization", role: "Principal Engineer", period: "2023 — Present", description: "" },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { degree: "B.S. Computer Science", institution: "University", year: "2022" }],
    });
  };

  const removeEducation = (index: number) => {
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });
  };

  const addCertification = () => {
    setForm({
      ...form,
      certifications: [
        ...form.certifications,
        { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2024", credentialUrl: "" },
      ],
    });
  };

  const removeCertification = (index: number) => {
    setForm({ ...form, certifications: form.certifications.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-neutral-400 font-mono text-xs">
        Loading Portfolio Studio...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Studio Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO STUDIO & RESUME BUILDER</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Personal Public Portfolio
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Your unbranded, resume-ready public portfolio. Zero corporate references. Fully customized by you.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {form.slug && (
            <>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? "Copied!" : "Copy Resume Link"}</span>
              </button>

              <a
                href={`/p/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
              >
                <span>Live View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Portfolio"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Portfolio synchronized! Changes are immediately live at /p/{form.slug}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-3 no-scrollbar font-mono text-xs">
        {[
          { id: "identity", label: "Identity & URL", icon: Globe },
          { id: "skills", label: "Tech Mastery", icon: Code2 },
          { id: "projects", label: "Showcase Projects", icon: FolderGit2 },
          { id: "career", label: "Career & Education", icon: Briefcase },
          { id: "contact", label: "Contact Channels", icon: Mail },
          { id: "theme", label: "3D Visual Theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: IDENTITY & CUSTOM URL */}
      {activeTab === "identity" && (
        <div className="space-y-6">
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Custom URL & Public Route</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Custom Handle / Slug (Shareable on Resumes) *
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 bg-neutral-900 border border-r-0 border-white/10 rounded-l-xl text-neutral-400 font-mono text-xs">
                  /p/
                </span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="alex-rivera"
                  className="w-full px-3.5 py-2.5 bg-neutral-900/60 border border-white/10 rounded-r-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              {slugStatus.error && (
                <p className="text-[11px] font-mono text-rose-400">{slugStatus.error}</p>
              )}
              {slugStatus.available && (
                <p className="text-[11px] font-mono text-emerald-400">✓ URL handle is available!</p>
              )}
            </div>

            {/* Google Drive PDF / Resume Download Link */}
            <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-mono text-cyan-300 font-bold uppercase flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>External Resume Link (Google Drive PDF / Document)</span>
                </label>
                {form.resumeUrl && (
                  <a
                    href={getResumeDownloadUrl(form.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-200 underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Test Download</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Paste your Google Drive PDF share link or direct resume link. When visitors click <strong className="text-neutral-200">"Download Resume / CV"</strong> or <strong className="text-neutral-200">"Resume"</strong> on your public portfolio, this file will be automatically triggered for download.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Full Legal / Professional Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Professional Job Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Principal Distributed Systems Architect"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">Tagline / Mission Motto</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Architecting high-throughput distributed engines, sub-millisecond pipelines, and AI systems."
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Profile Photo / Avatar URL</label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Location & Timezone</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="San Francisco, CA (PST)"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Availability Status</label>
                <select
                  value={form.availability.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      availability: { ...form.availability, status: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="open_to_work">Available for New Roles &amp; Full-Time</option>
                  <option value="contract">Open for High-Impact Contracts &amp; Freelance</option>
                  <option value="advisory">Available for Technical Advisory</option>
                  <option value="employed">Employed (Open to networking)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Custom Status Pill Label</label>
                <input
                  type="text"
                  value={form.availability.label}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      availability: { ...form.availability, label: e.target.value },
                    })
                  }
                  placeholder="Open for Staff &amp; Principal roles"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400 uppercase">Professional Biography</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Detail your engineering philosophy, scale achieved, distributed protocols mastered, and leadership experience..."
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/50 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECH MASTERY */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Categorized Skill Mastery</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Configure your proficiency bars displayed on the 3D mastery matrix.
                </p>
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/[0.04] text-xs font-mono text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-3">
              {form.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/10 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const updated = [...form.skills];
                      updated[idx].name = e.target.value;
                      setForm({ ...form, skills: updated });
                    }}
                    placeholder="Skill name (e.g. Distributed Consensus)"
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                  />

                  <select
                    value={skill.category || "Core"}
                    onChange={(e) => {
                      const updated = [...form.skills];
                      updated[idx].category = e.target.value;
                      setForm({ ...form, skills: updated });
                    }}
                    className="w-full sm:w-40 px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                    <option value="AI & Data">AI &amp; Data</option>
                    <option value="Languages">Languages</option>
                    <option value="Core">Core</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...form.skills];
                        updated[idx].level = Number(e.target.value);
                        setForm({ ...form, skills: updated });
                      }}
                      className="w-28 accent-cyan-400"
                    />
                    <span className="w-10 text-xs font-mono text-cyan-400 font-bold text-right">
                      {skill.level}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="p-2 text-neutral-500 hover:text-rose-400 self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <label className="text-xs font-mono text-neutral-400 uppercase">
                Technology Ecosystem (Comma-Separated Tags)
              </label>
              <input
                type="text"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="Next.js, TypeScript, Go, Kubernetes, Kafka, PyTorch, GraphQL, ClickHouse, Docker"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHOWCASE PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <span>Personal Project Case Studies</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Showcase projects engineered by you with verified metrics and code repositories.
                </p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/[0.04] text-xs font-mono text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {form.customProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 space-y-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].title = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Your Role</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].role = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="Lead Architect / Creator"
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase">Description / Architecture Summary</label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...form.customProjects];
                        updated[idx].description = e.target.value;
                        setForm({ ...form, customProjects: updated });
                      }}
                      className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Key Verified Outcomes / Metrics (Comma separated)</label>
                      <input
                        type="text"
                        value={proj.metrics}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].metrics = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="Reduced latency by 45%, 100k DAU scaled"
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].technologies = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="Next.js, TypeScript, Kafka, Go"
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Live Application URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].liveUrl = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={proj.githubUrl}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].githubUrl = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase">Screenshot / Image URL</label>
                      <input
                        type="text"
                        value={proj.imageUrl}
                        onChange={(e) => {
                          const updated = [...form.customProjects];
                          updated[idx].imageUrl = e.target.value;
                          setForm({ ...form, customProjects: updated });
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAREER & CREDENTIALS */}
      {activeTab === "career" && (
        <div className="space-y-8">
          {/* Experience */}
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Professional Work Experience</span>
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/[0.04] text-xs font-mono text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {form.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...form.experience];
                        updated[idx].role = e.target.value;
                        setForm({ ...form, experience: updated });
                      }}
                      placeholder="Role (e.g. Senior Software Architect)"
                      className="px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...form.experience];
                        updated[idx].company = e.target.value;
                        setForm({ ...form, experience: updated });
                      }}
                      placeholder="Company / Client"
                      className="px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = [...form.experience];
                          updated[idx].period = e.target.value;
                          setForm({ ...form, experience: updated });
                        }}
                        placeholder="2022 — Present"
                        className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...form.experience];
                      updated[idx].description = e.target.value;
                      setForm({ ...form, experience: updated });
                    }}
                    placeholder="Key impact bullets, technologies used, architectures delivered..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education */}
            <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono uppercase">Academic Education</h4>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  + Add Degree
                </button>
              </div>

              <div className="space-y-3">
                {form.education.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/10 bg-neutral-900/50 space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...form.education];
                          updated[idx].degree = e.target.value;
                          setForm({ ...form, education: updated });
                        }}
                        placeholder="Degree"
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="p-1 text-neutral-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...form.education];
                          updated[idx].institution = e.target.value;
                          setForm({ ...form, education: updated });
                        }}
                        placeholder="Institution"
                        className="px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const updated = [...form.education];
                          updated[idx].year = e.target.value;
                          setForm({ ...form, education: updated });
                        }}
                        placeholder="Graduation Year"
                        className="px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono uppercase">Verified Certifications</h4>
                <button
                  type="button"
                  onClick={addCertification}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  + Add Cert
                </button>
              </div>

              <div className="space-y-3">
                {form.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/10 bg-neutral-900/50 space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...form.certifications];
                          updated[idx].name = e.target.value;
                          setForm({ ...form, certifications: updated });
                        }}
                        placeholder="Certification Name"
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeCertification(idx)}
                        className="p-1 text-neutral-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const updated = [...form.certifications];
                          updated[idx].issuer = e.target.value;
                          setForm({ ...form, certifications: updated });
                        }}
                        placeholder="Issuer (AWS, CNCF)"
                        className="px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const updated = [...form.certifications];
                          updated[idx].year = e.target.value;
                          setForm({ ...form, certifications: updated });
                        }}
                        placeholder="Year"
                        className="px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT CHANNELS */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Personalized Direct Contact &amp; Channels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Personal Contact Email</label>
                <input
                  type="email"
                  value={form.contactInfo.personalEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactInfo: { ...form.contactInfo, personalEmail: e.target.value },
                    })
                  }
                  placeholder="alex.rivera.eng@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Calendly / Cal.com Meeting Link</label>
                <input
                  type="text"
                  value={form.contactInfo.calendlyUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactInfo: { ...form.contactInfo, calendlyUrl: e.target.value },
                    })
                  }
                  placeholder="https://calendly.com/your-handle/30min"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">WhatsApp Number</label>
                <input
                  type="text"
                  value={form.contactInfo.whatsapp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactInfo: { ...form.contactInfo, whatsapp: e.target.value },
                    })
                  }
                  placeholder="+14155550199"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Telegram Handle</label>
                <input
                  type="text"
                  value={form.contactInfo.telegram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactInfo: { ...form.contactInfo, telegram: e.target.value },
                    })
                  }
                  placeholder="@alexrivera"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">Discord Handle</label>
                <input
                  type="text"
                  value={form.contactInfo.discord}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactInfo: { ...form.contactInfo, discord: e.target.value },
                    })
                  }
                  placeholder="alex_eng"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-mono text-neutral-400 uppercase pb-4">Social &amp; Developer Profiles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={form.socialLinks.github}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={form.socialLinks.linkedin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">Twitter / X Profile URL</label>
                  <input
                    type="text"
                    value={form.socialLinks.twitter}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="https://x.com/..."
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">Personal Website / Blog</label>
                  <input
                    type="text"
                    value={form.socialLinks.website}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, website: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: 3D THEME & AESTHETICS */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <div className="p-7 rounded-3xl border border-white/10 bg-neutral-950 space-y-6">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>3D Visual Preset &amp; SEO</span>
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-mono text-neutral-400 uppercase">3D Theme Color Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "obsidian", label: "Obsidian Dark", desc: "Sleek graphite & neon accents", border: "border-neutral-700" },
                  { id: "sapphire", label: "Cyber Sapphire", desc: "Deep ocean & cyan illumination", border: "border-sky-500/40" },
                  { id: "emerald", label: "Emerald Terminal", desc: "High-tech matrix green glow", border: "border-emerald-500/40" },
                  { id: "cyber", label: "Cyberpunk Violet", desc: "Purple & magenta spatial orbs", border: "border-purple-500/40" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        themeConfig: { ...form.themeConfig, preset: preset.id as any },
                      })
                    }
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      form.themeConfig.preset === preset.id
                        ? `bg-white/10 text-white font-bold ${preset.border} ring-2 ring-white/20`
                        : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-white">{preset.label}</div>
                    <div className="text-[11px] text-neutral-400 mt-1 font-light">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-mono text-neutral-400 uppercase">Custom SEO Meta Information</h4>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">
                  Page Title (Appears in browser tab &amp; Google)
                </label>
                <input
                  type="text"
                  value={form.seo.customTitle}
                  onChange={(e) =>
                    setForm({ ...form, seo: { ...form.seo, customTitle: e.target.value } })
                  }
                  placeholder={`${form.name || "Alex Rivera"} — Principal Distributed Systems Architect`}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 uppercase">
                  Meta Description (Appears in search snippets &amp; link previews)
                </label>
                <textarea
                  rows={3}
                  value={form.seo.customDescription}
                  onChange={(e) =>
                    setForm({ ...form, seo: { ...form.seo, customDescription: e.target.value } })
                  }
                  placeholder="Senior software architect specializing in distributed databases, microservices, and AI inference systems."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar with Save */}
      <div className="sticky bottom-6 p-4 rounded-2xl bg-neutral-950/90 border border-white/15 backdrop-blur-xl flex items-center justify-between shadow-2xl z-30">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status: Public &amp; Active at /p/{form.slug || "..."}</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Synchronizing..." : "Save Portfolio Changes"}</span>
        </button>
      </div>
    </div>
  );
}
