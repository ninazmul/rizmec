"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/actions/team.actions";
import ImageUploader from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  name: "",
  title: "",
  tagline: "",
  bio: "",
  email: "",
  role: "engineering",
  location: "San Francisco, CA",
  skills: "Distributed Systems, Next.js, Go",
  technologies: "Next.js, TypeScript, Kubernetes",
  avatar: "",
};

export default function TeamManagementPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await getTeamMembers();
    if (res.success) {
      setMembers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreate = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (tm: any) => {
    setForm({
      name: tm.name || "",
      title: tm.title || "",
      tagline: tm.tagline || "",
      bio: tm.bio || "",
      email: tm.email || "",
      role: tm.role || "engineering",
      location: tm.location || "San Francisco, CA",
      skills: Array.isArray(tm.skills)
        ? tm.skills
            .map((s: any) => (typeof s === "string" ? s : s.name))
            .join(", ")
        : tm.skills || "",
      technologies: Array.isArray(tm.technologies)
        ? tm.technologies.join(", ")
        : tm.technologies || "",
      avatar: tm.avatar || "",
    });
    setEditingId(tm._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const skillsArray = form.skills
        .split(",")
        .filter(Boolean)
        .map((s) => ({
          name: s.trim(),
          level: 90,
          category: "Core",
        }));
      const techArray = form.technologies
        .split(",")
        .filter(Boolean)
        .map((t) => t.trim());

      const payload: any = {
        name: form.name,
        title: form.title,
        tagline: form.tagline,
        bio: form.bio,
        email: form.email,
        role: form.role as any,
        location: form.location,
        skills: skillsArray,
        technologies: techArray,
        avatar: form.avatar || undefined,
      };

      let res;

      if (editingId) {
        res = await updateTeamMember(editingId, payload);
        if (res.success) {
          toast.success("Team member updated successfully");
          closeModal();
          fetchMembers();
        } else {
          toast.error(res.error || "Failed to update team member");
        }
      } else {
        res = await createTeamMember({
          ...payload,
          published: true,
        } as any);
        if (res.success) {
          toast.success("Team member created successfully");
          closeModal();
          fetchMembers();
        } else {
          toast.error(res.error || "Failed to create team member");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this team member? This action cannot be undone.")) {
      await deleteTeamMember(id);
      toast.success("Team member removed");
      fetchMembers();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            HUMAN CAPITAL & DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Engineering Staff & Member Portfolios
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading team roster...
          </div>
        ) : (
          members.map((m) => (
            <div
              key={m._id}
              className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-white">
                    {m.role}
                  </span>
                  <Link
                    href={`/team/${m.slug}`}
                    target="_blank"
                    className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-xs"
                  >
                    <span>Portfolio</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {m.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {m.title}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {m.email}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(m)}
                  className="p-1.5 rounded text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
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
                {editingId ? "Edit Team Member" : "Add Team Member"}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                >
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="leadership">Leadership</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
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
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. Distributed Systems, Next.js, Go"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) =>
                    setForm({ ...form, technologies: e.target.value })
                  }
                  placeholder="e.g. Next.js, TypeScript, Kubernetes"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <ImageUploader
                label="Profile Avatar / Headshot"
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
                folder="Team"
                aspect="square"
                hint="Square portrait photo of the engineer. Used on team directory & public portfolio."
              />
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                      ? "Update Engineer"
                      : "Save Engineer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
