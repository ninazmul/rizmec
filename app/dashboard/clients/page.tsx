"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Search, Mail, Phone, Globe, Trash2, Edit2 } from "lucide-react";
import { getClients, createClient, deleteClient, updateClient } from "@/lib/actions/client.actions";
import toast from "react-hot-toast";

const DEFAULT_FORM = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  country: "United States",
  website: "",
  status: "active",
  notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const fetchClients = async () => {
    setLoading(true);
    const res = await getClients({ search });
    if (res.success) {
      setClients(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...DEFAULT_FORM });
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c._id);
    setForm({
      company: c.company || "",
      contactPerson: c.contactPerson || "",
      email: c.email || "",
      phone: c.phone || "",
      country: c.country || "United States",
      website: c.website || "",
      status: c.status || "active",
      notes: c.notes || "",
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
    const payload: any = { ...form };

    const res = editingId
      ? await updateClient(editingId, payload)
      : await createClient(payload);

    if (res.success) {
      toast.success(editingId ? "Client updated." : "Client created.");
      closeModal();
      fetchClients();
    } else {
      toast.error(res.error || "Failed to save client.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete client record?")) {
      await deleteClient(id);
      fetchClients();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            CLIENT DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Enterprise Client Accounts
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Client Account</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-white/10 bg-neutral-950">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact person, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            Loading client accounts...
          </div>
        ) : clients.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-neutral-500 font-mono text-xs">
            No client records found.
          </div>
        ) : (
          clients.map((c) => (
          <div
            key={c._id}
            className="p-6 rounded-2xl border border-white/10 bg-neutral-950 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                  c.status === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : c.status === "prospect"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
                }`}>
                  {c.status || "active"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{c.company}</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Contact: {c.contactPerson}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-neutral-400 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.country && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{c.country}</span>
                  </div>
                )}
                {c.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <a
                      href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white underline underline-offset-2"
                    >
                      {c.website}
                    </a>
                  </div>
                )}
              </div>

              {c.notes && (
                <p className="text-xs text-neutral-500 leading-relaxed italic border-t border-white/5 pt-2">
                  "{c.notes}"
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Edit client"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete client"
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
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 my-8 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                {editingId ? "Edit Client Account" : "Add Client Entity"}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Company Name *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Primary Contact Person *</label>
                <input
                  type="text"
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  >
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="acme-corp.com"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                      ? "Update Account"
                      : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
