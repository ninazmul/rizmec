"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Eye,
  Mail,
  Phone,
  Clock,
  Building2,
  DollarSign,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Maximize2,
  X,
  Send,
} from "lucide-react";
import { updateContactMessageStatus, deleteContactMessage } from "@/lib/actions/contact.actions";
import { DashboardAccess } from "@/lib/auth/rbac-rules";
import { usePermissions } from "@/lib/hooks/use-permissions";
import toast from "react-hot-toast";

type Props = {
  initialMessages: any[];
  access: DashboardAccess;
};

export default function ContactClient({ initialMessages, access }: Props) {
  const { hasPermission } = usePermissions(access);
  const canUpdate = hasPermission("leads", "update");
  const canDelete = hasPermission("leads", "delete");

  const [messages, setMessages] = useState(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle inline dropdown description
  const toggleExpand = async (msg: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isExpanding = expandedId !== msg._id;
    setExpandedId(isExpanding ? msg._id : null);

    // If opening an unread/new message, mark it as read automatically
    if (isExpanding && canUpdate && (msg.status === "unread" || msg.status === "new")) {
      handleStatusChange(msg._id, "read");
    }
  };

  // Open full modal dialog
  const handleOpenModal = async (msg: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMsg(msg);
    if (canUpdate && (msg.status === "unread" || msg.status === "new")) {
      handleStatusChange(msg._id, "read");
    }
  };

  // Update status
  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateContactMessageStatus(id, newStatus);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
      if (selectedMsg?._id === id) {
        setSelectedMsg((prev: any) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  // Delete message
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDelete) return;
    if (!confirm("Are you sure you want to permanently delete this contact inquiry?")) return;
    const res = await deleteContactMessage(id);
    if (res.success) {
      toast.success("Contact message deleted!");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMsg?._id === id) setSelectedMsg(null);
      if (expandedId === id) setExpandedId(null);
    } else {
      toast.error(res.error || "Failed to delete message");
    }
  };

  // Copy description to clipboard
  const handleCopyText = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Description copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "unread"
        ? msg.status === "unread" || msg.status === "new"
        : msg.status === statusFilter;

    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      msg.name?.toLowerCase().includes(term) ||
      msg.email?.toLowerCase().includes(term) ||
      msg.company?.toLowerCase().includes(term) ||
      msg.service?.toLowerCase().includes(term) ||
      msg.budget?.toLowerCase().includes(term) ||
      msg.subject?.toLowerCase().includes(term) ||
      msg.message?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter(
    (m) => m.status === "unread" || m.status === "new"
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
            // INQUIRY PIPELINE TELEMETRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Contact Messages & Briefs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Architectural requirements, scopes, and enterprise briefs submitted via the public contact portal.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 text-neutral-300 hover:text-white uppercase tracking-wider hover:bg-white/5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>CRM Leads</span>
          </Link>
          <div className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 flex items-center gap-2">
            <span className="text-neutral-400">TOTAL:</span>
            <span className="font-bold text-white">{messages.length}</span>
          </div>
          {unreadCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-2 font-bold animate-pulse">
              <span>UNREAD:</span>
              <span>{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-neutral-950">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, company, scope..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Inquiries" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "read", label: "Read" },
            { id: "replied", label: "Replied" },
            { id: "archived", label: "Archived" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase bg-neutral-900/60 select-none">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-4">Contact / Organization</th>
                <th className="py-3.5 px-4">Service & Budget</th>
                <th className="py-3.5 px-4 min-w-[260px]">Scope / Description Preview</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-500 font-mono">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No contact messages found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg: any) => {
                  const isExpanded = expandedId === msg._id;
                  const isUnread = msg.status === "unread" || msg.status === "new";

                  return (
                    <tbody key={msg._id} className="group border-b border-white/5">
                      <tr
                        onClick={() => toggleExpand(msg)}
                        className={`cursor-pointer transition-colors ${
                          isUnread
                            ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                            : isExpanded
                            ? "bg-white/[0.03]"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* Dropdown Chevron Toggle */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(msg, e)}
                            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                            title={isExpanded ? "Collapse description" : "Click to drop down full description"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Contact & Company */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{msg.name}</span>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                            )}
                          </div>
                          <div className="text-neutral-400 font-mono text-[11px] truncate max-w-[200px]">
                            {msg.email}
                          </div>
                          {msg.company && (
                            <div className="text-neutral-500 font-mono text-[10px] flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{msg.company}</span>
                            </div>
                          )}
                        </td>

                        {/* Service & Budget */}
                        <td className="py-4 px-4">
                          <div className="text-neutral-300 font-medium truncate max-w-[180px]">
                            {msg.service || "Engineering Engagement"}
                          </div>
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/[0.04] border border-white/10 text-neutral-300">
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span>{msg.budget || "Not specified"}</span>
                          </div>
                        </td>

                        {/* Description Preview & Quick Trigger */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5 max-w-md">
                            <p className="text-neutral-300 line-clamp-2 text-xs leading-relaxed">
                              {msg.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => toggleExpand(msg, e)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Hide Scope Dropdown</span>
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    <span>Expand Description Dropdown</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                              <span className="text-neutral-600 font-mono text-[10px]">•</span>
                              <button
                                type="button"
                                onClick={(e) => handleOpenModal(msg, e)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors"
                                title="Open in full modal"
                              >
                                <Maximize2 className="w-3 h-3" />
                                <span>Modal View</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status Select */}
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={msg.status || "new"}
                            onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                            disabled={!canUpdate}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border focus:outline-none transition-colors ${
                              isUnread
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : msg.status === "replied"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : msg.status === "archived"
                                ? "bg-neutral-800 text-neutral-400 border-neutral-700"
                                : "bg-white/5 text-neutral-300 border-white/10"
                            }`}
                          >
                            <option value="new">New / Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>

                        {/* Received Date */}
                        <td className="py-4 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleOpenModal(msg, e)}
                              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                              title="Open Full Description Modal"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={(e) => handleDelete(msg._id, e)}
                                className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Dropdown Expandable Row Showing Full Description */}
                      {isExpanded && (
                        <tr className="bg-neutral-900/60 border-t border-b border-white/10 animate-in fade-in duration-200">
                          <td colSpan={7} className="p-6">
                            <div className="space-y-5 max-w-5xl">
                              {/* Metadata Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                  <span className="text-neutral-500 text-[10px] block uppercase">Direct Email</span>
                                  <a
                                    href={`mailto:${msg.email}?subject=Re:%20Inquiry%20from%20RIZMEC`}
                                    className="text-white hover:text-emerald-400 transition-colors font-medium truncate block"
                                  >
                                    {msg.email}
                                  </a>
                                </div>

                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                  <span className="text-neutral-500 text-[10px] block uppercase">Direct Phone</span>
                                  <span className="text-white block truncate">
                                    {msg.phone || "Not provided"}
                                  </span>
                                </div>

                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                  <span className="text-neutral-500 text-[10px] block uppercase">Budget Tier</span>
                                  <span className="text-emerald-400 font-bold block truncate">
                                    {msg.budget || "Not specified"}
                                  </span>
                                </div>

                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                  <span className="text-neutral-500 text-[10px] block uppercase">Target Window</span>
                                  <span className="text-white block truncate">
                                    {msg.timeline || "Flexible"}
                                  </span>
                                </div>
                              </div>

                              {/* Full Description & Scope Content Box */}
                              <div className="p-5 rounded-xl bg-black border border-white/10 space-y-3">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    Full Project Scope & Technical Objectives
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyText(msg.message, msg._id, e)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-mono transition-colors"
                                    >
                                      {copiedId === msg._id ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Copy Scope</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleOpenModal(msg, e)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-mono transition-colors"
                                    >
                                      <Maximize2 className="w-3 h-3" />
                                      <span>Open Modal</span>
                                    </button>
                                  </div>
                                </div>

                                <p className="text-neutral-200 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed select-text">
                                  {msg.message}
                                </p>
                              </div>

                              {/* Action Footer */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
                                <div className="text-neutral-500 text-[11px]">
                                  Received {new Date(msg.createdAt).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`mailto:${msg.email}?subject=Re:%20Inquiry%20from%20RIZMEC`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all text-xs"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Reply via Email</span>
                                  </a>
                                  {canDelete && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDelete(msg._id, e)}
                                      className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 uppercase tracking-wider transition-all text-xs"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Description Modal Dialog */}
      {selectedMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedMsg(null)}
        >
          <div
            className="bg-neutral-950 border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                  // CONTACT INQUIRY DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedMsg.name}
                </h3>
                {selectedMsg.company && (
                  <p className="text-xs font-mono text-neutral-400 mt-0.5">
                    {selectedMsg.company}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metadata Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                <span className="text-neutral-500 text-[10px] uppercase block">Email</span>
                <a
                  href={`mailto:${selectedMsg.email}`}
                  className="text-white hover:text-emerald-400 transition-colors font-medium truncate block"
                >
                  {selectedMsg.email}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                <span className="text-neutral-500 text-[10px] uppercase block">Phone</span>
                <span className="text-white block truncate">
                  {selectedMsg.phone || "Not provided"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                <span className="text-neutral-500 text-[10px] uppercase block">Budget</span>
                <span className="text-emerald-400 font-bold block truncate">
                  {selectedMsg.budget || "Not specified"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                <span className="text-neutral-500 text-[10px] uppercase block">Timeline</span>
                <span className="text-white block truncate">
                  {selectedMsg.timeline || "Flexible"}
                </span>
              </div>
            </div>

            {/* Service Focus Pill */}
            {selectedMsg.service && (
              <div className="p-3 rounded-xl bg-neutral-900/50 border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 uppercase">Service Focus:</span>
                <span className="text-white font-semibold">{selectedMsg.service}</span>
              </div>
            )}

            {/* Full Message Scope Content Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
                  Full Architectural Requirements & Scope
                </label>
                <button
                  type="button"
                  onClick={(e) => handleCopyText(selectedMsg.message, "modal", e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
                >
                  {copiedId === "modal" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Scope</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 rounded-xl bg-black border border-white/15 max-h-72 overflow-y-auto">
                <p className="text-neutral-200 text-sm whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {selectedMsg.message}
                </p>
              </div>
            </div>

            {/* Timestamp & Status Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 border border-white/10 text-xs font-mono">
              <span className="text-neutral-400">
                Received on {new Date(selectedMsg.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase">Status:</span>
                <select
                  value={selectedMsg.status || "new"}
                  onChange={(e) => handleStatusChange(selectedMsg._id, e.target.value)}
                  disabled={!canUpdate}
                  className="px-2.5 py-1 rounded bg-neutral-900 border border-white/20 text-white text-xs font-mono focus:outline-none"
                >
                  <option value="new">New / Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              {canDelete ? (
                <button
                  type="button"
                  onClick={(e) => handleDelete(selectedMsg._id, e)}
                  className="px-4 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Delete Inquiry
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMsg(null)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-xs font-mono text-neutral-300 hover:text-white uppercase tracking-wider transition-all"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re:%20Inquiry%20from%20${encodeURIComponent(selectedMsg.name)}%20—%20RIZMEC`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
