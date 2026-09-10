"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Trash2, ArrowUpRight, Edit2 } from "lucide-react";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/actions/project.actions";
import { getTeamMembers } from "@/lib/actions/team.actions";
import ImageUploader from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
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
  services: "Cloud Infrastructure, Distributed Systems",
  technologies: "Next.js, Go, Kubernetes, TypeScript",
  thumbnail: "",
  teamMemberIds: [] as string[],
};

export default function WorkCmsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success) {
      setProjects(res.data);
    }
    setLoading(false);
  };

  const fetchTeam = async () => {
    const res = await getTeamMembers();
    if (res.success) {
      setTeamMembers(res.data);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTeam();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...DEFAULT_FORM });
    setIsModalOpen(true);
  };

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
      teamMemberIds: (p.teamMemberIds || []).map((m: any) =>
        typeof m === "object" ? m._id : m
      ),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ ...DEFAULT_FORM });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sArray = form.services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tArray = form.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
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
      services: sArray,
      technologies: tArray,
      thumbnail: form.thumbnail || undefined,
      teamMemberIds: form.teamMemberIds,
    } as any;

    const res = editingId
      ? await updateProject(editingId, payload)
      : await createProject({ ...payload, published: true, featured: true });

    if (res.success) {
      toast.success(editingId ? "Case study updated." : "Case study created.");
      closeModal();
      fetchProjects();
    } else {
      toast.error(res.error || "Failed to save case study.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete case study? This cannot be undone.")) {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success("Case study deleted.");
      } else {
        toast.error(res.error || "Failed to delete case study.");
      }
      fetchProjects();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            PORTFOLIO MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Case Studies & Engineering Showcase
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Case Study</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading case studies...
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400">
                    {p.clientName}
                  </span>
                  <Link
                    href={`/work/${p.slug}`}
                    target="_blank"
                    className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {p.summary}
                </p>
                <div className="flex gap-4 pt-2 border-t border-white/5 font-mono text-xs">
                  {(p.metrics || []).slice(0, 2).map((m: any) => (
                    <div key={m.label}>
                      <div className="font-bold text-white">{m.value}</div>
                      <div className="text-[10px] text-neutral-500">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Assigned Team & Interns */}
                {p.teamMemberIds && p.teamMemberIds.length > 0 && (
                  <div className="pt-2.5 border-t border-white/5 space-y-1.5">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      Assigned Contributors:
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.teamMemberIds.map((m: any) => (
                        <div
                          key={m._id || m.slug}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-neutral-300 font-mono"
                          title={`${m.name} (${m.role || m.title})`}
                        >
                          <img
                            src={m.avatar || "/assets/images/placeholder.webp"}
                            alt={m.name}
                            className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                          />
                          <span>{m.name}</span>
                          {m.role === "intern" && (
                            <span className="text-[9px] text-cyan-400 font-bold ml-0.5">
                              (Intern)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Edit case study"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete case study"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                {editingId ? "Edit Case Study" : "Create Case Study"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) =>
                      setForm({ ...form, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Challenge & Solution
                </label>
                <textarea
                  rows={3}
                  value={form.solution}
                  onChange={(e) =>
                    setForm({ ...form, solution: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Metric 1 (Value & Label)
                  </label>
                  <input
                    type="text"
                    value={form.metric1Val}
                    onChange={(e) =>
                      setForm({ ...form, metric1Val: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white mb-1"
                  />
                  <input
                    type="text"
                    value={form.metric1Label}
                    onChange={(e) =>
                      setForm({ ...form, metric1Label: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Metric 2 (Value & Label)
                  </label>
                  <input
                    type="text"
                    value={form.metric2Val}
                    onChange={(e) =>
                      setForm({ ...form, metric2Val: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white mb-1"
                  />
                  <input
                    type="text"
                    value={form.metric2Label}
                    onChange={(e) =>
                      setForm({ ...form, metric2Label: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <ImageUploader
                label="Case Study Thumbnail"
                value={form.thumbnail}
                onChange={(url) => setForm({ ...form, thumbnail: url })}
                folder="CaseStudies"
                aspect="video"
                hint="16:9 hero image shown on homepage case study cards, work listing, and public case study page."
              />

              {/* Assign Team Members & Interns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-neutral-400 uppercase text-xs">
                    Assigned Team & Contributors (Engineers & Interns)
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {form.teamMemberIds.length} selected
                  </span>
                </div>
                {teamMembers.length === 0 ? (
                  <div className="p-3 rounded-lg border border-white/10 bg-neutral-900 text-xs text-neutral-500 font-mono">
                    No team members found in directory.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2.5 bg-neutral-900 border border-white/10 rounded-xl">
                    {teamMembers.map((m) => {
                      const isSelected = form.teamMemberIds.includes(m._id);
                      const isIntern = m.role === "intern";
                      return (
                        <button
                          key={m._id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              teamMemberIds: isSelected
                                ? prev.teamMemberIds.filter((id) => id !== m._id)
                                : [...prev.teamMemberIds, m._id],
                            }));
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all border ${
                            isSelected
                              ? "bg-white/10 border-cyan-400/50 text-white"
                              : "bg-neutral-950/60 border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
                          }`}
                        >
                          <img
                            src={m.avatar || "/assets/images/placeholder.webp"}
                            alt={m.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10"
                          />
                          <div className="truncate flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate text-white flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isIntern && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] uppercase font-mono">
                                  Intern
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500 truncate">
                              {m.title || "Team Member"}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                              isSelected
                                ? "bg-cyan-500 border-cyan-400 text-black font-bold"
                                : "border-white/20"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-neutral-500 font-light">
                  Assigned members (including interns) will automatically showcase this project on their public portfolio page (<code className="text-neutral-400">/p/[slug]</code>).
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Case Study"
                      : "Save Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
