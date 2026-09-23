"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  ExternalLink,
  Globe,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  X,
  ChevronDown,
} from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from "@/lib/actions/project.actions";
import { getTeamMembers } from "@/lib/actions/team.actions";
import ImageUploader from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";

// ── Types ──────────────────────────────────────────────────────────────
interface AccessProps {
  role: string;
  isSuperAdmin?: boolean;
}

interface ProjectsClientProps {
  initialProjects: any[];
  access: AccessProps;
}

// ── Defaults ───────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  clientName: "",
  industry: "Enterprise Technology",
  summary: "",
  challenge: "",
  solution: "",
  results: "",
  metric1Label: "Execution Latency",
  metric1Val: "< 15 ms",
  metric2Label: "Throughput Gain",
  metric2Val: "+150%",
  services: "",
  technologies: "",
  thumbnail: "",
  liveUrl: "",
  githubUrl: "",
  completionDate: "",
  featured: false,
  published: true,
  status: "in_progress" as string,
  teamMemberIds: [] as string[],
};

const STATUS_OPTIONS = [
  { value: "planning", label: "Planning", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { value: "in_progress", label: "In Progress", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { value: "review", label: "Review", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { value: "completed", label: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { value: "on_hold", label: "On Hold", color: "text-neutral-400 bg-neutral-500/10 border-neutral-500/30" },
];

function statusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "text-neutral-400 bg-neutral-500/10 border-neutral-500/30";
}

// ── Component ──────────────────────────────────────────────────────────
export default function ProjectsClient({ initialProjects, access }: ProjectsClientProps) {
  const canMutate =
    access.isSuperAdmin ||
    access.role === "super_admin" ||
    access.role === "admin" ||
    access.role === "moderator";

  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (canMutate) {
      getTeamMembers().then((r) => { if (r.success) setTeamMembers(r.data); });
    }
  }, [canMutate]);

  // ── Form helpers ────────────────────────────────────────────────────
  const resetForm = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); };

  const openCreate = () => { resetForm(); setIsModalOpen(true); };

  const openEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      clientName: p.clientName || "",
      industry: p.industry || "Enterprise Technology",
      summary: p.summary || "",
      challenge: p.challenge || "",
      solution: p.solution || "",
      results: p.results || "",
      metric1Label: p.metrics?.[0]?.label || "Execution Latency",
      metric1Val: p.metrics?.[0]?.value || "< 15 ms",
      metric2Label: p.metrics?.[1]?.label || "Throughput Gain",
      metric2Val: p.metrics?.[1]?.value || "+150%",
      services: (p.services || []).join(", "),
      technologies: (p.technologies || []).join(", "),
      thumbnail: p.thumbnail || "",
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      completionDate: p.completionDate || "",
      featured: p.featured || false,
      published: p.published !== false,
      status: p.status || "in_progress",
      teamMemberIds: (p.teamMemberIds || []).map((m: any) =>
        typeof m === "object" ? m._id : m
      ),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      title: form.title,
      clientName: form.clientName,
      industry: form.industry,
      summary: form.summary,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      metrics: [
        { label: form.metric1Label, value: form.metric1Val },
        { label: form.metric2Label, value: form.metric2Val },
      ],
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      thumbnail: form.thumbnail || undefined,
      liveUrl: form.liveUrl || "",
      githubUrl: form.githubUrl || "",
      completionDate: form.completionDate || "",
      featured: form.featured,
      published: form.published,
      status: form.status,
      teamMemberIds: form.teamMemberIds,
    };

    const res = editingId
      ? await updateProject(editingId, payload)
      : await createProject({ ...payload });

    if (res.success) {
      toast.success(editingId ? "Project updated!" : "Project created!");
      closeModal();
      // Refresh list
      const refreshed = await getProjects();
      if (refreshed.success) setProjects(refreshed.data);
    } else {
      toast.error(res.error || "Failed to save project.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await deleteProject(id);
    if (res.success) {
      toast.success("Project deleted.");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } else {
      toast.error(res.error || "Failed to delete.");
    }
  };

  // ── Input class ────────────────────────────────────────────────────
  const inp = "w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs font-mono placeholder:text-neutral-600 focus:border-white/30 focus:outline-none transition-colors";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            INTERNAL OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Project Delivery &amp; Team Assignments
          </h1>
        </div>
        {canMutate && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* ── Project Cards ───────────────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-white/10 bg-neutral-950 space-y-3">
          <FolderGit2 className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-sm font-mono uppercase tracking-wider text-neutral-500">No Active Engagements</p>
          <p className="text-xs text-neutral-600">There are currently no projects to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((p: any) => {
            const sStyle = statusStyle(p.status);
            return (
              <div
                key={p._id}
                className="relative rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden flex flex-col group hover:border-white/20 transition-all"
              >
                {/* Thumbnail */}
                {p.thumbnail && (
                  <div className="relative h-44 overflow-hidden bg-neutral-900">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                    {/* Featured badge */}
                    {p.featured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                        <Star className="w-2.5 h-2.5" />
                        Featured
                      </div>
                    )}
                    {/* Published toggle indicator */}
                    {!p.published && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neutral-800 border border-white/10 text-neutral-400 text-[10px] font-mono uppercase">
                        Draft
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  {/* Top meta row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                        {p.clientName} · {p.industry}
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                        {p.title}
                      </h3>
                    </div>
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${sStyle}`}>
                      {(p.status || "active").replace("_", " ")}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{p.summary}</p>

                  {/* Metrics */}
                  {p.metrics && p.metrics.length > 0 && (
                    <div className="flex gap-4 pt-3 border-t border-white/5">
                      {p.metrics.slice(0, 3).map((m: any, i: number) => (
                        <div key={i}>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 uppercase">
                            <Zap className="w-2.5 h-2.5 text-cyan-500" />
                            {m.label}
                          </div>
                          <div className="text-sm font-black text-white font-mono mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 6).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-neutral-400 border border-white/8">
                          {t}
                        </span>
                      ))}
                      {p.technologies.length > 6 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-600">
                          +{p.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Services */}
                  {p.services && p.services.length > 0 && (
                    <div className="text-[11px] text-neutral-500 font-mono">
                      <span className="text-neutral-600 uppercase tracking-wider">Services: </span>
                      {p.services.join(" · ")}
                    </div>
                  )}

                  {/* Team Members */}
                  {p.teamMemberIds && p.teamMemberIds.length > 0 && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                        Assigned Contributors
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {p.teamMemberIds.map((m: any) => (
                          <div
                            key={m._id || m.slug}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors"
                            title={`${m.name} — ${m.title || m.role || "Team"}`}
                          >
                            <img
                              src={m.avatar || "/assets/images/placeholder.webp"}
                              alt={m.name}
                              className="w-4 h-4 rounded-full object-cover border border-white/10"
                            />
                            <span className="text-[11px] text-neutral-300 font-mono">{m.name}</span>
                            {m.role === "intern" && (
                              <span className="text-[9px] text-cyan-400 font-bold uppercase font-mono">Intern</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer row */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                      {p.completionDate && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {p.completionDate}
                        </span>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          Live App
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/work/${p.slug}`}
                        className="p-1.5 rounded text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                        title="View public page"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      {canMutate && (
                        <>
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {isModalOpen && canMutate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/15 rounded-2xl w-full max-w-2xl my-8 shadow-2xl font-sans text-xs">

            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
              <div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-0.5">
                  Project CMS
                </div>
                <h2 className="text-base font-bold text-white font-mono uppercase">
                  {editingId ? "Edit Project" : "New Project"}
                </h2>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6 max-h-[80vh] overflow-y-auto">

              {/* ── Core Info ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Core Information</h3>

                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Project Title *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Distributed Telemetry Platform" className={inp} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Client Name *</label>
                    <input required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="ACME Corp" className={inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Industry</label>
                    <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Enterprise Technology" className={inp} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Summary *</label>
                  <textarea required rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Brief 1-2 sentence overview..." className={inp} />
                </div>
              </section>

              {/* ── Narrative ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Case Study Narrative</h3>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Challenge</label>
                  <textarea rows={3} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} placeholder="What problem needed solving..." className={inp} />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Engineering Solution</label>
                  <textarea rows={3} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} placeholder="How we solved it architecturally..." className={inp} />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Results</label>
                  <textarea rows={2} value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder="Quantified outcomes and impact..." className={inp} />
                </div>
              </section>

              {/* ── Metrics ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Metric 1</label>
                    <input value={form.metric1Val} onChange={(e) => setForm({ ...form, metric1Val: e.target.value })} placeholder="Value (e.g. &lt; 15ms)" className={`${inp} mb-1.5`} />
                    <input value={form.metric1Label} onChange={(e) => setForm({ ...form, metric1Label: e.target.value })} placeholder="Label (e.g. Latency)" className={inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Metric 2</label>
                    <input value={form.metric2Val} onChange={(e) => setForm({ ...form, metric2Val: e.target.value })} placeholder="Value (e.g. +150%)" className={`${inp} mb-1.5`} />
                    <input value={form.metric2Label} onChange={(e) => setForm({ ...form, metric2Label: e.target.value })} placeholder="Label (e.g. Throughput)" className={inp} />
                  </div>
                </div>
              </section>

              {/* ── Stack & Services ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Tech Stack &amp; Services</h3>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Technologies (comma-separated)</label>
                  <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Next.js, Go, Kubernetes, TypeScript" className={inp} />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Services Delivered (comma-separated)</label>
                  <input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Cloud Infrastructure, AI Engineering" className={inp} />
                </div>
              </section>

              {/* ── Media & Links ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Media &amp; Links</h3>
                <ImageUploader
                  label="Project Thumbnail"
                  value={form.thumbnail}
                  onChange={(url) => setForm({ ...form, thumbnail: url })}
                  folder="CaseStudies"
                  aspect="video"
                  hint="16:9 hero image used on the public project details page."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Live App URL</label>
                    <input type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://app.example.com" className={inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">GitHub Repository</label>
                    <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." className={inp} />
                  </div>
                </div>
              </section>

              {/* ── Delivery Details ── */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Delivery Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-neutral-400 uppercase text-[10px] tracking-widest">Completion Date</label>
                    <input value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} placeholder="e.g. Q3 2025" className={inp} />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-3.5 h-3.5 accent-cyan-400" />
                    <span className="text-neutral-300 text-xs font-mono">Featured Project</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-3.5 h-3.5 accent-emerald-400" />
                    <span className="text-neutral-300 text-xs font-mono">Published</span>
                  </label>
                </div>
              </section>

              {/* ── Team Assignment ── */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Assign Team Members</h3>
                  <span className="text-[10px] font-mono text-cyan-400">{form.teamMemberIds.length} selected</span>
                </div>
                {teamMembers.length === 0 ? (
                  <p className="text-xs text-neutral-600 font-mono">No team members found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2.5 bg-neutral-900 border border-white/10 rounded-xl">
                    {teamMembers.map((m) => {
                      const isSelected = form.teamMemberIds.includes(m._id);
                      return (
                        <button
                          key={m._id}
                          type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            teamMemberIds: isSelected
                              ? prev.teamMemberIds.filter((id) => id !== m._id)
                              : [...prev.teamMemberIds, m._id],
                          }))}
                          className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all border ${isSelected ? "bg-white/10 border-cyan-400/50" : "bg-neutral-950/60 border-white/5 hover:border-white/20"}`}
                        >
                          <img src={m.avatar || "/assets/images/placeholder.webp"} alt={m.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10" />
                          <div className="truncate flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate text-white">{m.name}</div>
                            <div className="text-[10px] font-mono text-neutral-500 truncate">{m.title || m.role}</div>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${isSelected ? "bg-cyan-500 border-cyan-400 text-black font-bold" : "border-white/20"}`}>
                            {isSelected ? "✓" : ""}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-neutral-600">
                  Assigned members automatically showcase this project on their public portfolio at <code className="text-neutral-500">/p/[slug]</code>.
                </p>
              </section>

              {/* ── Footer ── */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-neutral-950 pb-1">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-colors font-mono text-xs uppercase tracking-wider">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                >
                  {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
