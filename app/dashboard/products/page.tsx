"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Boxes, Plus, Edit2, Trash2, ArrowUpRight, Globe, Image as ImageIcon } from "lucide-react";
import { getProducts, createProduct, deleteProduct, updateProduct } from "@/lib/actions/product.actions";
import ImageUploader from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  title: "",
  tagline: "",
  category: "SaaS Platform",
  summary: "",
  description: "",
  features: "Dynamic Multi-Cloud Routing, Zero-Loss Recovery, Sub-15ms Latency",
  techStack: "Go, Kubernetes, Next.js, Rust",
  status: "active",
  image: "",
  url: "",
};

export default function ProductsCmsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
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
      tagline: p.tagline || "",
      category: p.category || "SaaS Platform",
      summary: p.summary || "",
      description: p.description || "",
      features: (p.features || []).join(", "),
      techStack: (p.techStack || []).join(", "),
      status: p.status || "active",
      image: p.image || (p.screenshots?.[0]?.url) || "",
      url: p.url || p.demoUrl || "",
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

    const featArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const stackArray = form.techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      tagline: form.tagline,
      category: form.category as any,
      summary: form.summary,
      description: form.description,
      features: featArray,
      techStack: stackArray,
      status: form.status as any,
      image: form.image,
      url: form.url,
      demoUrl: form.url,
    } as any;

    const res = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct({ ...payload, published: true });

    if (res.success) {
      toast.success(editingId ? "Product updated." : "Product created.");
      closeModal();
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to save product.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete product platform? This cannot be undone.")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            SOFTWARE AS A SERVICE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Dynamic Products &amp; SaaS Engines
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product Platform</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading products...
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6 overflow-hidden"
            >
              <div className="space-y-3">
                {p.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-white">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-3">
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-xs"
                        title={p.url}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Live</span>
                      </a>
                    )}
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {p.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  title="Edit product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete product"
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
                {editingId ? "Edit Product" : "Create Product"}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="font-mono text-neutral-400 uppercase">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                >
                  <option value="SaaS Platform">SaaS Platform</option>
                  <option value="AI Engine">AI Engine</option>
                  <option value="Developer Tool">Developer Tool</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Enterprise Cloud">Enterprise Cloud</option>
                  <option value="Internal Platform">Internal Platform</option>
                  <option value="Architecture Blueprint">Architecture Blueprint</option>
                  <option value="Engineering Prototype">Engineering Prototype</option>
                </select>
              </div>

              {/* Product Cover Image Upload & Direct Link */}
              <div className="space-y-3 pt-1">
                <ImageUploader
                  label="Product Cover Image / Thumbnail"
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  folder="Products"
                  aspect="video"
                  hint="Cover image or interface screenshot shown on product cards, public detail page, and homepage."
                />
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Or Direct Image URL</span>
                    <span className="normal-case text-neutral-500 font-sans font-light">(optional direct link)</span>
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... or /assets/images/..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-xs placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Product / Live URL */}
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Product URL / Live Website</span>
                  <span className="normal-case text-neutral-500 font-sans font-light">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://app.rizmec.com or https://example.com"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white font-mono text-xs placeholder:text-neutral-600"
                />
                <p className="text-[11px] text-neutral-500 font-light">
                  If provided, a direct live link will appear on the product card and homepage.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Features (Comma separated)</label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Tech Stack (Comma separated)</label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
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
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
