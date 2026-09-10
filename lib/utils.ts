import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

// ===== Tailwind CSS class merger =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== Date formatting =====
export const formatDateTime = (dateString: Date | string) => {
  const date = new Date(dateString);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
  };

  return {
    dateTime: date.toLocaleString("en-US", dateTimeOptions),
    dateOnly: date.toLocaleString("en-US", dateOptions),
    timeOnly: date.toLocaleString("en-US", timeOptions),
  };
};

// ===== Slug generation =====
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ===== URL query helpers =====
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true },
  );
}

// ===== File helpers =====
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// ===== Error handler =====
export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

// ===== Truncate text =====
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ===== Format number for display (e.g. 1.2K, 3.4M) =====
export function formatCount(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// ===== Safe JSON parse for lean() results =====
export function safeJson<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// ===== Convert Google Drive / external links to direct download URLs =====
export function getResumeDownloadUrl(url?: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Google Drive file link: /file/d/{id}/view...
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveFileMatch[1]}`;
  }

  // Google Drive open link: /open?id={id}
  const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveOpenMatch[1]}`;
  }

  // Google Drive uc link: /uc?...id={id}
  const driveUcMatch = trimmed.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/i);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveUcMatch[1]}`;
  }

  return trimmed;
}

// Validate resume URLs (Google Drive or direct PDF/DOC links)
export function isValidResumeUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  const drivePattern = /drive\.google\.com\/.*\/d\/|drive\.google\.com\/open\?id=|drive\.google\.com\/uc\?.*id=/i;
  const directPattern = /\.(pdf|doc|docx)(\?.*)?$/i;
  return drivePattern.test(trimmed) || directPattern.test(trimmed);
}
