"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  FileSpreadsheet,
  Receipt,
  FolderGit2,
  Users2,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notification.actions";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "lead" | "quote" | "invoice" | "order" | "system";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

function formatTimeAgo(dateInput: string | Date): string {
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getAdminNotifications(15);
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  // Initial fetch and auto-polling every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // When popover opens, re-fetch
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markNotificationAsRead(notif._id).catch(console.error);
    }

    setOpen(false);

    if (notif.link) {
      startTransition(() => {
        router.push(notif.link!);
      });
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeConfig = (type: NotificationItem["type"]) => {
    switch (type) {
      case "quote":
        return {
          icon: FileSpreadsheet,
          color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
          label: "Quote",
        };
      case "invoice":
        return {
          icon: Receipt,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          label: "Invoice",
        };
      case "order":
        return {
          icon: FolderGit2,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          label: "Project",
        };
      case "lead":
        return {
          icon: Users2,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          label: "Lead",
        };
      default:
        return {
          icon: Info,
          color: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
          label: "System",
        };
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/50"
        >
          <Bell className="w-4 h-4 text-neutral-300 hover:text-white transition-colors" />

          {unreadCount > 0 && (
            <>
              {/* Subtle pulsing indicator */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex items-center justify-center rounded-full h-4 min-w-4 px-1 bg-amber-500 text-[10px] font-mono font-bold text-black leading-none shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-[380px] p-0 bg-[#0c0d10] border border-white/10 shadow-2xl rounded-xl overflow-hidden backdrop-blur-xl z-50 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-neutral-200">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={loading}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-amber-400 font-mono transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* List of notifications */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.06] overscroll-contain">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 text-neutral-400">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-medium text-neutral-300">All caught up!</p>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">
                No recent activity notifications.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const { icon: TypeIcon, color, label } = getTypeConfig(notif.type);
              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    notif.isRead
                      ? "hover:bg-white/[0.03] opacity-75 hover:opacity-100"
                      : "bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Left Type Icon */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${color}`}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        {label}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white leading-snug line-clamp-1">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread indicator / Link arrow */}
                  <div className="shrink-0 self-center">
                    {!notif.isRead ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 block shadow-sm shadow-amber-400/50" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live status stream
          </span>
          <span>Admins & Management</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
