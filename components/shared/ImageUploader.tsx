"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, ImageIcon, FolderOpen } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface UploadedFile {
  url: string;
  name: string;
  mediaId?: string | null;
  size?: number;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  aspect?: "square" | "video" | "portrait" | "auto";
  maxSizeMB?: number;
  hint?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
  folder = "Content",
  aspect = "auto",
  maxSizeMB = 8,
  hint,
  className = "",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<UploadedFile | null>(value ? { url: value, name: "Current" } : null);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const file = res[0];
        const uploaded: UploadedFile = {
          url: file.ufsUrl || (file as any).url,
          name: file.name,
          mediaId: (file as any).serverData?.mediaId ?? null,
          size: file.size,
        };
        setPreview(uploaded);
        onChange(uploaded.url);
        toast.success("Image uploaded successfully.");
      }
      setUploading(false);
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      toast.error(`Upload failed: ${err.message || "Unknown error"}`);
      setUploading(false);
    },
  });

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, WEBP, etc.)");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }

      setUploading(true);
      try {
        await startUpload([file], { folder });
      } catch (e) {
        console.error(e);
        toast.error(`Upload failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        setUploading(false);
      }
    },
    [startUpload, folder, maxSizeMB],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
  };

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "video"
        ? "aspect-video"
        : aspect === "portrait"
          ? "aspect-[3/4]"
          : "aspect-[16/9]";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
            {label}
          </label>
          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
            <FolderOpen className="w-3 h-3" />
            <span>/{folder}</span>
          </div>
        </div>
      )}

      <div
        className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          isDragging
            ? "border-white bg-white/5"
            : "border-white/10 bg-white/[0.01] hover:border-white/20"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          aria-label={label}
        />

        {preview ? (
          <div className={`relative ${aspectClass} group`}>
            <Image
              src={preview.url}
              alt={preview.name || "Preview"}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="relative z-20 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/90 text-white font-mono text-[11px] font-semibold uppercase tracking-wider hover:bg-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
                <div className="flex items-center gap-2 text-white font-mono text-xs">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  Uploading...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`${aspectClass} flex flex-col items-center justify-center p-6 text-center gap-3`}>
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
                <div className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
                  Uploading to /{folder}...
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                  {isDragging ? (
                    <ImageIcon className="w-6 h-6 text-white" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {isDragging ? "Drop image here" : "Click or drag image to upload"}
                  </div>
                  {hint && <div className="text-[11px] text-neutral-500">{hint}</div>}
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider pt-1">
                    PNG • JPG • WEBP • Max {maxSizeMB}MB
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {value && !preview && (
        <div className="text-[11px] text-neutral-500 font-mono break-all">
          Current: {value}
        </div>
      )}
    </div>
  );
}
