"use client";

import React, { useState } from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-mono font-bold text-[10px] select-all hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
      title="Click to copy code"
    >
      {copied ? "✓ Copied!" : code}
    </button>
  );
}
