"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Trash2, ArrowUpRight } from "lucide-react";
import {
  getProjects,
  createProject,
  deleteProject,
} from "@/lib/actions/project.actions";
import ImageUploader from "@/components/shared/ImageUploader";

export default function WorkCmsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
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
  });

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success) {
      setProjects(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const sArray = form.services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tArray = form.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await createProject({
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
      published: true,
      featured: true,
    } as any);

    if (res.success) {
      setIsModalOpen(false);
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete case study?")) {
      await deleteProject(id);
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
          onClick={() => setIsModalOpen(true)}
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
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Add Case Study
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
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
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase"
                >
                  Publish Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
