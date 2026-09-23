"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Send,
  X,
  Paperclip,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  Trash2,
  Users,
  Eye,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export interface RecipientInfo {
  _id: string;
  company: string;
  contactPerson: string;
  email: string;
}

interface ClientEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientInfo[];
  sendToAll?: boolean;
  statusFilter?: string;
  onSuccess?: () => void;
}

export default function ClientEmailModal({
  isOpen,
  onClose,
  recipients: initialRecipients,
  sendToAll = false,
  statusFilter = "",
  onSuccess,
}: ClientEmailModalProps) {
  const [recipients, setRecipients] = useState<RecipientInfo[]>(initialRecipients);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(
    "Hello {{contactPerson}},\n\nWe are pleased to reach out regarding our ongoing partnership with {{company}}.\n\nPlease find the attached documents and materials for your review.\n\nBest regards,\nRIZMEC Engineering Team"
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setRecipients(initialRecipients);
  }, [initialRecipients]);

  if (!isOpen) return null;

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const maxTotalSize = 25 * 1024 * 1024; // 25MB
  const sizePercentage = Math.min(100, Math.round((totalSize / maxTotalSize) * 100));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added: File[] = [];
    const maxPerFile = 10 * 1024 * 1024;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.size > maxPerFile) {
        toast.error(`"${file.name}" exceeds 10MB limit.`);
        continue;
      }
      if (totalSize + file.size > maxTotalSize) {
        toast.error("Total attachments limit of 25MB reached.");
        break;
      }
      // Check duplicate by name + size
      if (!files.some((f) => f.name === file.name && f.size === file.size)) {
        added.push(file);
      }
    }

    if (added.length > 0) {
      setFiles((prev) => [...prev, ...added]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1 && !sendToAll) {
      toast.error("At least one recipient is required.");
      return;
    }
    setRecipients((prev) => prev.filter((r) => r._id !== id));
  };

  const insertVariable = (variable: string) => {
    if (!messageInputRef.current) {
      setMessage((prev) => prev + " " + variable);
      return;
    }
    const textarea = messageInputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextMessage =
      message.substring(0, start) + variable + message.substring(end);
    setMessage(nextMessage);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 10);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4 text-sky-400" />;
    }
    if (file.type.includes("pdf")) {
      return <FileText className="w-4 h-4 text-rose-400" />;
    }
    if (file.type.includes("sheet") || file.type.includes("csv") || file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    }
    if (file.type.includes("zip") || file.type.includes("compressed")) {
      return <FileArchive className="w-4 h-4 text-amber-400" />;
    }
    return <File className="w-4 h-4 text-neutral-400" />;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Please enter an email subject.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message body.");
      return;
    }
    if (!sendToAll && recipients.length === 0) {
      toast.error("No recipients selected.");
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("subject", subject.trim());
      formData.append("message", message.trim());
      formData.append("sendToAll", sendToAll ? "true" : "false");
      if (statusFilter) formData.append("statusFilter", statusFilter);

      const clientIds = recipients.map((r) => r._id);
      formData.append("clientIds", JSON.stringify(clientIds));

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/clients/send-email", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      const successNotice = data.mocked
        ? `[Dev Mode] Mock dispatched to ${data.sentCount} recipient(s).`
        : `Successfully sent email to ${data.sentCount} recipient(s)!`;

      if (data.failedCount > 0) {
        toast.error(`Delivered to ${data.sentCount}, but ${data.failedCount} failed.`);
      } else {
        toast.success(successNotice);
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Email send error:", err);
      toast.error(err.message || "Failed to dispatch email.");
    } finally {
      setSending(false);
    }
  };

  // Preview replacement sample using first recipient
  const sampleRecipient = recipients[0] || {
    company: "Acme Corporation",
    contactPerson: "Jane Doe",
    email: "jane@acmecorp.com",
  };

  const previewSubject = subject
    ? subject
        .replace(/\{\{company\}\}/gi, sampleRecipient.company)
        .replace(/\{\{contactPerson\}\}/gi, sampleRecipient.contactPerson)
    : "(No Subject)";

  const previewBody = message
    .replace(/\{\{company\}\}/gi, sampleRecipient.company)
    .replace(/\{\{contactPerson\}\}/gi, sampleRecipient.contactPerson)
    .replace(/\{\{email\}\}/gi, sampleRecipient.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-neutral-950 border border-white/15 rounded-2xl max-w-3xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{sendToAll ? "Broadcast Email to Clients" : "Send Client Email"}</span>
                {sendToAll && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    BULK ALL
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {sendToAll
                  ? `Dispatching to all matching client accounts${statusFilter && statusFilter !== "all" ? ` (${statusFilter})` : ""}`
                  : `Dispatching to ${recipients.length} selected client account${recipients.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={sending}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Recipients Section */}
          <div className="space-y-2 p-3.5 rounded-xl border border-white/10 bg-neutral-900/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-neutral-400 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <span>Recipients ({recipients.length})</span>
              </div>
              {recipients.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllRecipients(!showAllRecipients)}
                  className="text-emerald-400 hover:underline text-[11px]"
                >
                  {showAllRecipients ? "Show Less" : `View All (${recipients.length})`}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto">
              {(showAllRecipients ? recipients : recipients.slice(0, 4)).map((r) => (
                <div
                  key={r._id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800/80 border border-white/10 text-xs font-mono text-neutral-300"
                >
                  <span className="font-semibold text-white truncate max-w-[120px]">{r.company}</span>
                  <span className="text-neutral-500 text-[10px]">({r.contactPerson})</span>
                  {!sendToAll && recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipient(r._id)}
                      className="text-neutral-500 hover:text-rose-400 ml-1"
                      title="Remove from this email"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {!showAllRecipients && recipients.length > 4 && (
                <span className="text-xs text-neutral-500 self-center font-mono">
                  +{recipients.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Subject Field & Variable Helpers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Subject Line *
              </label>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-neutral-500">Insert tag:</span>
                <button
                  type="button"
                  onClick={() => insertVariable("{{company}}")}
                  className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/25 transition-colors"
                >
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable("{{contactPerson}}")}
                  className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/25 transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Strategic Partnership Update - RIZMEC"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors font-sans"
            />
          </div>

          {/* Message Body with Write / Preview Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Message Body *
              </label>
              <div className="flex items-center p-0.5 bg-neutral-900 border border-white/10 rounded-lg text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    activeTab === "write"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    activeTab === "preview"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {activeTab === "write" ? (
              <div className="relative">
                <textarea
                  ref={messageInputRef}
                  required
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Draft your message. Variables like {{contactPerson}} and {{company}} will be automatically personalized for each recipient."
                  className="w-full p-3.5 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors font-sans leading-relaxed resize-y"
                />
                <div className="text-[11px] font-mono text-neutral-500 text-right mt-1">
                  Supports template tags: <span className="text-neutral-400">{"{{company}}"}</span>, <span className="text-neutral-400">{"{{contactPerson}}"}</span>, <span className="text-neutral-400">{"{{email}}"}</span>
                </div>
              </div>
            ) : (
              <div className="border border-white/10 rounded-lg p-5 bg-neutral-900/60 font-sans space-y-4">
                <div className="border-b border-white/10 pb-3 text-xs font-mono text-neutral-400 space-y-1">
                  <div>
                    <span className="text-neutral-500">Preview for:</span>{" "}
                    <strong className="text-white">{sampleRecipient.contactPerson}</strong> ({sampleRecipient.company} - {sampleRecipient.email})
                  </div>
                  <div>
                    <span className="text-neutral-500">Subject:</span>{" "}
                    <span className="text-emerald-400 font-bold">{previewSubject}</span>
                  </div>
                </div>
                <div className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {previewBody}
                </div>
                {files.length > 0 && (
                  <div className="border-t border-white/10 pt-3 text-xs font-mono text-neutral-400">
                    <span className="text-neutral-500">Attached ({files.length}):</span>{" "}
                    {files.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-neutral-400" />
                <span>Attachments (Images or Documents)</span>
              </label>
              <span className={`text-[11px] ${totalSize > maxTotalSize ? "text-rose-400 font-bold" : "text-neutral-400"}`}>
                {formatFileSize(totalSize)} / 25 MB max
              </span>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileChange(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/5 text-white"
                  : "border-white/15 bg-neutral-900/30 hover:border-white/30 text-neutral-400 hover:text-neutral-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                <Paperclip className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono">
                  <span className="text-white font-semibold underline underline-offset-2">Click to browse</span> or drag and drop files
                </p>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Images (PNG, JPG, WebP), PDFs, Office Documents, Spreadsheets (max 10MB/file)
                </p>
              </div>
            </div>

            {/* Attached Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {files.map((file, idx) => {
                    const isImg = file.type.startsWith("image/");
                    return (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-white/10 gap-2 group hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {isImg ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                              />
                            ) : (
                              getFileIcon(file)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white font-medium truncate max-w-[160px] sm:max-w-[180px]">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-mono">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar of payload capacity */}
                <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      totalSize > maxTotalSize ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${sizePercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="text-neutral-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Personalized HTML template with RIZMEC branding</span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || totalSize > maxTotalSize}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {sendToAll
                        ? "Broadcast to All"
                        : `Send Email (${recipients.length})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
