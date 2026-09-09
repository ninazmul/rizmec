"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Star, Edit2 } from "lucide-react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions/testimonial.actions";
import ImageUploader from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  clientName: "",
  company: "",
  position: "",
  content: "",
  avatar: "",
  rating: 5,
};

export default function TestimonialsCmsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchTestimonials = async () => {
    setLoading(true);
    const res = await getTestimonials();
    if (res.success) {
      setTestimonials(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...DEFAULT_FORM });
    setIsModalOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t._id);
    setForm({
      clientName: t.clientName || "",
      company: t.company || "",
      position: t.position || "",
      content: t.content || "",
      avatar: t.avatar || "",
      rating: t.rating || 5,
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

    const payload = {
      clientName: form.clientName,
      company: form.company,
      position: form.position,
      content: form.content,
      avatar: form.avatar,
      rating: form.rating,
    } as any;

    const res = editingId
      ? await updateTestimonial(editingId, payload)
      : await createTestimonial({
          ...payload,
          published: true,
          featured: true,
        });

    if (res.success) {
      toast.success(
        editingId ? "Testimonial updated." : "Testimonial created.",
      );
      closeModal();
      fetchTestimonials();
    } else {
      toast.error(res.error || "Failed to save testimonial.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete client testimonial? This cannot be undone.")) {
      await deleteTestimonial(id);
      fetchTestimonials();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            VALIDATION & SOCIAL PROOF
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Client Testimonials & Executive Quotes
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading testimonials...
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-white">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-white" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 italic leading-relaxed">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.clientName}
                    className="w-9 h-9 rounded-full object-cover grayscale"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {t.clientName}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {t.position}, {t.company}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Edit testimonial"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete testimonial"
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
                {editingId ? "Edit Testimonial" : "Create Testimonial"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Position / Title
                </label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="e.g. Chief Technology Officer"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= form.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-neutral-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-neutral-400 text-[10px]">
                    {form.rating}/5
                  </span>
                </div>
              </div>
              <ImageUploader
                label="Client Avatar"
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
                folder="Testimonials"
                aspect="square"
                hint="Square headshot of the testimonial author. Shown next to quote on homepage."
              />
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
                      ? "Update Testimonial"
                      : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
