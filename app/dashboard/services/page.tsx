"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, Plus, Edit2, Trash2, ArrowUpRight } from "lucide-react";
import {
  getServices,
  createService,
  deleteService,
  updateService,
} from "@/lib/actions/service.actions";
import toast from "react-hot-toast";

const ICON_OPTIONS = [
  "Cpu",
  "Server",
  "Globe",
  "Layers",
  "Smartphone",
  "Workflow",
  "Terminal",
  "Code",
  "Boxes",
  "Database",
  "Shield",
  "Zap",
];

const DEFAULT_FEATURES = [
  { title: "", description: "" },
  { title: "", description: "" },
  { title: "", description: "" },
  { title: "", description: "" },
];

const DEFAULT_PROCESS = [
  { step: "01", title: "", description: "" },
  { step: "02", title: "", description: "" },
  { step: "03", title: "", description: "" },
  { step: "04", title: "", description: "" },
];

const DEFAULT_FORM = {
  title: "",
  tagline: "",
  shortDescription: "",
  fullDescription: "",
  iconName: "Cpu",
  technologies: "Next.js, TypeScript, Python, Kubernetes",
  deliverables: "Architecture Spec, Cluster Blueprint, API Documentation",
  order: 0,
  featured: false,
  published: true,
  features: DEFAULT_FEATURES.map((f) => ({ ...f })),
  process: DEFAULT_PROCESS.map((p) => ({ ...p })),
};

export default function ServicesCmsPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<any>({ ...DEFAULT_FORM });

  const fetchServices = async () => {
    setLoading(true);
    const res = await getServices();
    if (res.success) {
      setServices(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      features: DEFAULT_FEATURES.map((f) => ({ ...f })),
      process: DEFAULT_PROCESS.map((p) => ({ ...p })),
    });
    setIsModalOpen(true);
  };

  const padStep = (s: string) => s.padStart(2, "0");

  const openEdit = (s: any) => {
    setEditingId(s._id);
    const srcFeatures = s.features || [];
    const srcProcess = s.process || [];
    const features = DEFAULT_FEATURES.map((_, i) => ({
      title: srcFeatures[i]?.title || "",
      description: srcFeatures[i]?.description || "",
    }));
    const process = DEFAULT_PROCESS.map((def, i) => ({
      step: srcProcess[i]?.step || padStep(String(i + 1)),
      title: srcProcess[i]?.title || "",
      description: srcProcess[i]?.description || "",
    }));
    setForm({
      title: s.title || "",
      tagline: s.tagline || "",
      shortDescription: s.shortDescription || "",
      fullDescription: s.fullDescription || "",
      iconName: s.iconName || "Cpu",
      technologies: (s.technologies || []).join(", "),
      deliverables: (s.deliverables || []).join(", "),
      order: s.order ?? 0,
      featured: !!s.featured,
      published: s.published !== false,
      features,
      process,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      ...DEFAULT_FORM,
      features: DEFAULT_FEATURES.map((f) => ({ ...f })),
      process: DEFAULT_PROCESS.map((p) => ({ ...p })),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const techArray = form.technologies
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const delivArray = form.deliverables
      .split(",")
      .map((d: string) => d.trim())
      .filter(Boolean);
    const features = (form.features || [])
      .filter((f: any) => f.title?.trim())
      .map((f: any) => ({
        title: f.title.trim(),
        description: f.description?.trim() || "",
      }));
    const process = (form.process || [])
      .filter((p: any) => p.title?.trim())
      .map((p: any) => ({
        step: p.step?.trim() || "00",
        title: p.title.trim(),
        description: p.description?.trim() || "",
      }));

    const payload = {
      title: form.title,
      tagline: form.tagline,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      iconName: form.iconName,
      technologies: techArray,
      deliverables: delivArray,
      order: Number(form.order) || 0,
      featured: !!form.featured,
      published: !!form.published,
      features,
      process,
    } as any;

    const res = editingId
      ? await updateService(editingId, payload)
      : await createService(payload);

    if (res.success) {
      toast.success(editingId ? "Service updated." : "Service created.");
      closeModal();
      fetchServices();
    } else {
      toast.error(res.error || "Failed to save service.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete service entity? This cannot be undone.")) {
      await deleteService(id);
      fetchServices();
    }
  };

  const updateFeature = (i: number, field: string, value: string) => {
    const next = [...form.features];
    next[i] = { ...next[i], [field]: value };
    setForm({ ...form, features: next });
  };

  const updateProcess = (i: number, field: string, value: string) => {
    const next = [...form.process];
    next[i] = { ...next[i], [field]: value };
    setForm({ ...form, process: next });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            CONTENT MANAGEMENT SYSTEM
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Dynamic Engineering Services
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Capability</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading services...
          </div>
        ) : (
          services.map((s) => (
            <div
              key={s._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400">
                    /{s.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    {s.featured && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/20">
                        Featured
                      </span>
                    )}
                    {!s.published && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-700/50 text-neutral-400 border border-neutral-600/30">
                        Draft
                      </span>
                    )}
                    <Link
                      href={`/services/${s.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs"
                    >
                      <span>Public</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {s.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {(s.technologies || []).slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Edit service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 my-8 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                {editingId ? "Edit Service" : "Create Service"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono text-neutral-400 uppercase">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono text-neutral-400 uppercase">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) =>
                      setForm({ ...form, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Icon
                  </label>
                  <select
                    value={form.iconName}
                    onChange={(e) =>
                      setForm({ ...form, iconName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  >
                    {ICON_OPTIONS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono text-neutral-400 uppercase">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm({ ...form, shortDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono text-neutral-400 uppercase">
                    Full Description (Architectural Overview)
                  </label>
                  <textarea
                    rows={4}
                    value={form.fullDescription}
                    onChange={(e) =>
                      setForm({ ...form, fullDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-neutral-400 uppercase">
                    Core Technical Capabilities (Features)
                  </label>
                  <span className="font-mono text-[10px] text-neutral-500">
                    Leave title blank to skip a row
                  </span>
                </div>
                <div className="space-y-3">
                  {(form.features || []).map((f: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-white/10 bg-neutral-900/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-neutral-500 w-6 shrink-0">
                          #{i + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Feature title"
                          value={f.title}
                          onChange={(e) =>
                            updateFeature(i, "title", e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Feature description"
                        value={f.description}
                        onChange={(e) =>
                          updateFeature(i, "description", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-neutral-400 uppercase">
                    Engineering Methodology (Process Steps)
                  </label>
                  <span className="font-mono text-[10px] text-neutral-500">
                    Leave title blank to skip a step
                  </span>
                </div>
                <div className="space-y-3">
                  {(form.process || []).map((p: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-white/10 bg-neutral-900/50 space-y-2"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="01"
                            maxLength={3}
                            value={p.step}
                            onChange={(e) =>
                              updateProcess(i, "step", e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-neutral-950 border border-white/10 rounded text-white font-mono text-center"
                          />
                        </div>
                        <div className="col-span-10">
                          <input
                            type="text"
                            placeholder="Step title"
                            value={p.title}
                            onChange={(e) =>
                              updateProcess(i, "title", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-white"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Step description"
                        value={p.description}
                        onChange={(e) =>
                          updateProcess(i, "description", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Technologies (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={(e) =>
                      setForm({ ...form, technologies: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">
                    Deliverables (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.deliverables}
                    onChange={(e) =>
                      setForm({ ...form, deliverables: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-white accent-white"
                  />
                  <span className="font-mono text-neutral-300 uppercase text-[11px]">
                    Featured on Homepage
                  </span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-white accent-white"
                  />
                  <span className="font-mono text-neutral-300 uppercase text-[11px]">
                    Published
                  </span>
                </label>
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
                      ? "Update Service"
                      : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
