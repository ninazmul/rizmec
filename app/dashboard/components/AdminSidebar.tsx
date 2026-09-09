"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users2,
  Building2,
  FolderGit2,
  FileSpreadsheet,
  Receipt,
  Cpu,
  Boxes,
  Users,
  MessageSquareQuote,
  Mail,
  UserCheck,
  ShieldAlert,
  Settings,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardAccess } from "@/lib/auth/rbac-rules";
import { usePermissions } from "@/lib/hooks/use-permissions";
import {
  CMS_MODULES,
  CmsModule,
  MODULE_LABELS,
  MODULE_ROUTES,
} from "@/constants/permissions";
import RizmecLogo from "@/components/shared/RizmecLogo";

const iconMap: Record<
  CmsModule,
  React.ComponentType<{ className?: string }>
> = {
  dashboard: LayoutDashboard,
  leads: Users2,
  clients: Building2,
  projects: FolderGit2,
  quotations: FileSpreadsheet,
  invoices: Receipt,
  services: Cpu,
  products: Boxes,
  team: Users,
  testimonials: MessageSquareQuote,
  mailing: Mail,
  profile: UserCheck,
  "audit-logs": ShieldAlert,
  settings: Settings,
  users: ShieldCheck,
};

export default function AdminSidebar({ access }: { access: DashboardAccess }) {
  const currentPath = usePathname();
  const { canAccessModule } = usePermissions(access);

  return (
    <Sidebar
      className="bg-neutral-950 text-neutral-300 border-r border-white/10 font-sans"
      collapsible="icon"
    >
      <SidebarContent className="bg-neutral-950">
        <SidebarGroup className="space-y-4">
          <SidebarGroupLabel className="h-auto py-3 px-2 border-b border-white/10">
            <Link
              href="/"
              className="flex items-center justify-between w-full group py-1"
            >
              <RizmecLogo variant="white" size="sm" showWordmark={true} />
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            </Link>
          </SidebarGroupLabel>

          {/* User Role Tag */}
          <div className="px-3 py-1.5 mx-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-400 uppercase tracking-wider">ROLE:</span>
            <span className="font-bold text-white uppercase">{access.role}</span>
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              {CMS_MODULES.filter((module) => canAccessModule(module)).map(
                (module) => {
                  const title = MODULE_LABELS[module];
                  const url = MODULE_ROUTES[module];
                  const Icon = iconMap[module];

                  const isActive =
                    url === "/dashboard"
                      ? currentPath === url
                      : currentPath === url ||
                        currentPath.startsWith(`${url}/`);

                  return (
                    <SidebarMenuItem key={module}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={url}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                            isActive
                              ? "bg-white text-black font-bold shadow-md"
                              : "text-neutral-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? "text-black" : "text-neutral-400"
                              }`}
                            />
                          )}
                          <span className="truncate">{title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                },
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-white/10 bg-neutral-950 text-[11px] font-mono text-neutral-400 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span>RIZMEC ENGINE OS</span>
          <span className="text-emerald-400 font-bold">v4.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
