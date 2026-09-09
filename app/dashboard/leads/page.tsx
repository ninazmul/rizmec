"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  Upload,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { getLeads, createLead, updateLead, deleteLead, importLeadsBatch } from "@/lib/actions/lead.actions";

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Lead Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    serviceInterest: "Applied AI Systems & Autonomous Agents",
    budget: "$100k - $250k",
    priority: "medium",
    status: "new",
    notes: "",
  });

  // Bulk CSV Import Modal
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await getLeads({
      search,
      status: statusFilter,
      limit: 50,
    });
    if (res.success) {
      setLeads(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createLead(newLeadForm as any);
    if (res.success) {
      setIsCreateOpen(false);
      setNewLeadForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        serviceInterest: "Applied AI Systems & Autonomous Agents",
        budget: "$100k - $250k",
        priority: "medium",
        status: "new",
        notes: "",
      });
      fetchLeads();
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLead(leadId, { status: newStatus as any }, `Status updated to ${newStatus}`);
    fetchLeads();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(leadId);
      fetchLeads();
    }
  };

  // CSV parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const parsed: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((col) => col.trim());
        const lead: any = {};
        headers.forEach((h, index) => {
          lead[h] = row[index] || "";
        });
        if (lead.name && lead.email) {
          parsed.push({
            name: lead.name,
            company: lead.company || "",
            email: lead.email,
            phone: lead.phone || "",
            source: "import",
            serviceInterest: lead.service || lead.serviceinterest || "Digital Engineering",
            budget: lead.budget || "Enterprise",
            priority: lead.priority || "medium",
          });
        }
      }
      setImportPreview(parsed);
    };
    reader.readAsText(file);
  };

  const executeBulkImport = async () => {
    if (importPreview.length === 0) return;
    setImporting(true);
    const res = await importLeadsBatch(importPreview);
    setImporting(false);
    setImportResult(res);
    if (res.success) {
      fetchLeads();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            CRM & PIPELINE MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Enterprise Leads & Inquiries
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={() => {
              setIsImportOpen(true);
              setImportResult(null);
              setImportPreview([]);
              setCsvFile(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white uppercase tracking-wider hover:bg-white/5 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-neutral-950">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400 uppercase">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none"
          >
            <option value="all">All Statuses ({total})</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/50">
                <th className="py-3 px-4">Lead Contact</th>
                <th className="py-3 px-4">Company / Org</th>
                <th className="py-3 px-4">Service Interest</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                    Loading CRM telemetry...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                    No leads found matching criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-neutral-400 font-mono text-[11px]">{lead.email}</div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300 font-mono">
                      {lead.company || "N/A"}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      {lead.serviceInterest}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-white">
                      {lead.budget}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border focus:outline-none ${
                          lead.status === "new"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : lead.status === "won"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-white/5 text-neutral-300 border-white/10"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Lead Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white font-mono uppercase">Add Lead to CRM</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Company</label>
                  <input
                    type="text"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Phone</label>
                  <input
                    type="text"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Service Interest</label>
                  <input
                    type="text"
                    value={newLeadForm.serviceInterest}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, serviceInterest: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono uppercase">Budget</label>
                  <input
                    type="text"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-mono uppercase">Initial Notes</label>
                <textarea
                  rows={3}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 font-mono text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white text-black font-mono font-bold uppercase"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  Bulk CSV Lead Import
                </h3>
                <p className="text-xs text-neutral-400">
                  Import thousands of leads with duplicate detection and batch processing.
                </p>
              </div>
              <button
                onClick={() => setIsImportOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {importResult ? (
              <div className="p-6 rounded-xl border border-white/10 bg-neutral-900 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>IMPORT BATCH COMPLETED</span>
                </div>
                <div className="space-y-1 text-neutral-300">
                  <div>Batch ID: {importResult.batchId}</div>
                  <div className="text-emerald-400">Successfully Inserted: {importResult.insertedCount} leads</div>
                  <div className="text-amber-400">Skipped Duplicates: {importResult.skippedCount}</div>
                </div>
                <button
                  onClick={() => setIsImportOpen(false)}
                  className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase"
                >
                  Close & View Pipeline
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center space-y-3">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                  <div className="text-xs font-mono text-neutral-300">
                    Upload a CSV file containing columns: <br />
                    <span className="text-white font-bold">name, email, company, phone, service, budget</span>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="text-xs font-mono text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200"
                  />
                </div>

                {importPreview.length > 0 && (
                  <div className="p-4 rounded-xl border border-white/10 bg-neutral-900 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-neutral-300">
                      <span>Parsed Valid Records:</span>
                      <strong className="text-white">{importPreview.length} leads</strong>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Duplicate email addresses will be skipped automatically during batch execution.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setIsImportOpen(false)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkImport}
                    disabled={importing || importPreview.length === 0}
                    className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-50"
                  >
                    {importing ? "Processing Batch..." : `Execute Import (${importPreview.length})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
