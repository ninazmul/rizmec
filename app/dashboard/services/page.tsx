"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, Plus, Edit2, Trash2, ArrowUpRight, Check } from "lucide-react";
import { getServices, createService, deleteService } from "@/lib/actions/service.actions";

export default function ServicesCmsPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    iconName: "Cpu",
    technologies: "Next.js, TypeScript, Python, Kubernetes",
    deliverables: "Architecture Spec, Cluster Blueprint, API Documentation",
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = form.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    const delivArray = form.deliverables.split(",").map((d) => d.trim()).filter(Boolean);

    const res = await createService({
      title: form.title,
      tagline: form.tagline,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      iconName: form.iconName,
      technologies: techArray,
      deliverables: delivArray,
      published: true,
    } as any);

    if (res.success) {
      setIsModalOpen(false);
      fetchServices();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete service entity?")) {
      await deleteService(id);
      fetchServices();
    }
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
          onClick={() => setIsModalOpen(true)}
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
                  <span className="font-mono text-xs text-neutral-400">/{s.slug}</span>
                  <Link
                    href={`/services/${s.slug}`}
                    target="_blank"
                    className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs"
                  >
                    <span>Public</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{s.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {s.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {(s.technologies || []).slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">Create Service</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Full Description</label>
                <textarea
                  rows={4}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Deliverables (Comma separated)</label>
                <input
                  type="text"
                  value={form.deliverables}
                  onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
