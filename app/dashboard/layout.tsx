export const dynamic = "force-dynamic";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireDashboardAccess } from "@/lib/auth/rbac";
import AdminSidebar from "./components/AdminSidebar";
import { cookies } from "next/headers";
import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const access = await requireDashboardAccess("/sign-in");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar access={access} />
      <main className="flex-1 h-screen bg-[#09090b] text-white flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-neutral-400 hover:text-white" />
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest hidden sm:inline">
              RIZMEC PLATFORM // {access.role.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>Public Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-none">
                  {access.name}
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-1">
                  {access.email}
                </div>
              </div>
              <Show when="signed-in">
                <UserButton afterSwitchSessionUrl="/" />
              </Show>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 tech-grid">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
