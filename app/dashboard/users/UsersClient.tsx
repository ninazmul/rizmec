"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  UserPlus,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Lock,
  CheckSquare,
  Square,
  AlertTriangle,
  LayoutDashboard,
  Users2,
  Building2,
  FolderGit2,
  FileSpreadsheet,
  Receipt,
  Cpu,
  Boxes,
  MessageSquareQuote,
  Mail,
  UserCheck,
  ShieldAlert,
  Settings,
  Eye,
  Plus,
  Pencil,
  Flame,
  UserCog,
  ChevronDown,
} from "lucide-react";
import { IUser } from "@/lib/database/models/user.model";
import {
  getAllUsers,
  updateUserPermissions,
  createPreRegisteredAdmin,
  deleteUser,
} from "@/lib/actions/rbac.actions";
import {
  CMS_MODULES,
  CmsModule,
  CMS_ACTIONS,
  MODULE_LABELS,
  SUPER_ADMIN_ONLY_MODULES,
  ROLE_DEFAULT_PERMISSIONS,
  UserRole,
} from "@/constants/permissions";
import { toast } from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/shared/Loader";
import {
  DashboardAccess,
  hasPermission as userHasPermission,
} from "@/lib/auth/rbac-rules";

// ─── Constants ───────────────────────────────────────────────────────────────

const SUPER_ADMIN_EMAILS = [
  "rizmecofficial@gmail.com",
  "nazmulsaw@gmail.com",
];

const MODULE_ICON_MAP: Record<CmsModule, React.ComponentType<{ className?: string }>> = {
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

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  read: Eye,
  create: Plus,
  update: Pencil,
  delete: Trash2,
  publish: Flame,
  assign: UserCog,
  export: ChevronDown,
  all: CheckSquare,
};

// Group modules for the permissions dialog
const MODULE_GROUPS: { label: string; modules: CmsModule[] }[] = [
  {
    label: "CRM & Operations",
    modules: ["leads", "clients", "projects", "quotations", "invoices"],
  },
  {
    label: "Content & CMS",
    modules: ["services", "products", "team", "testimonials", "mailing"],
  },
  {
    label: "Personal",
    modules: ["profile"],
  },
  {
    label: "System & Admin",
    modules: ["audit-logs", "settings", "users"],
  },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  admin: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  moderator: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  worker: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  intern: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  inactive: "bg-red-500/15 text-red-300 border-red-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full CRM & content access" },
  { value: "moderator", label: "Moderator", description: "Limited read/edit access" },
  { value: "worker", label: "Worker", description: "Project view & personal profile" },
  { value: "intern", label: "Intern", description: "Team membership, edit portfolio & assigned projects" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hasAllDashboardPermissions(
  permissions: { module: string; actions: string[] }[] = [],
) {
  return CMS_MODULES.filter(
    (module) =>
      module !== "dashboard" && !SUPER_ADMIN_ONLY_MODULES.includes(module),
  ).every((module) => {
    const modulePerms = permissions.find((p) => p.module === module);
    if (!modulePerms) return false;
    return CMS_ACTIONS.every(
      (action) =>
        modulePerms.actions.includes(action) ||
        modulePerms.actions.includes("all"),
    );
  });
}

function isSuperAdminUser(user: Pick<IUser, "email" | "permissions">) {
  return (
    SUPER_ADMIN_EMAILS.some(
      (e) => e.toLowerCase() === user.email.toLowerCase(),
    ) || hasAllDashboardPermissions(user.permissions)
  );
}

function getPermissionCoverage(
  permissions: { module: string; actions: string[] }[] = [],
) {
  const relevantModules = CMS_MODULES.filter((m) => m !== "dashboard");
  const covered = relevantModules.filter((module) => {
    const p = permissions.find((p) => p.module === module);
    return p && p.actions.length > 0;
  });
  return Math.round((covered.length / relevantModules.length) * 100);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CoverageBar({ percent }: { percent: number }) {
  const color =
    percent >= 80
      ? "bg-emerald-400"
      : percent >= 40
      ? "bg-amber-400"
      : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-neutral-500">{percent}%</span>
    </div>
  );
}

function DarkButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "primary";
  size?: "sm" | "md" | "icon";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none";
  const variants = {
    default:
      "bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/25",
    outline:
      "bg-transparent border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 hover:bg-white/5",
    ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
    destructive:
      "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 hover:border-red-400/50",
    primary:
      "bg-white text-black hover:bg-neutral-100 border border-white/20 font-bold",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2",
    icon: "w-8 h-8 p-0",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UsersClient({
  initialUsers,
  access,
}: {
  initialUsers: {
    users: IUser[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    superAdminCount: number;
  };
  access: DashboardAccess;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [usersResult, setUsersResult] = useState(initialUsers);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isLoading, setIsLoading] = useState(false);

  // Permissions dialog
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<UserRole>("worker");
  const [permissions, setPermissions] = useState<{ module: string; actions: string[] }[]>([]);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Admin dialog
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<UserRole>("admin");
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  const canCreate = userHasPermission(access, "users", "create");
  const canUpdate = userHasPermission(access, "users", "update");
  const canDelete = userHasPermission(access, "users", "delete");
  const canMutate = canUpdate || canDelete;

  // ── Actions ────────────────────────────────────────────────────────────────

  const reloadUsers = async (page = usersResult.currentPage, query = search) => {
    setIsLoading(true);
    try {
      const response = await getAllUsers({ page, limit: 20, search: query });
      setUsersResult(response);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) params.set("search", value);
    else params.delete("search");
    router.replace(`${pathname}?${params.toString()}`);
    reloadUsers(1, value);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
    reloadUsers(newPage);
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget._id.toString());
      toast.success("User deleted");
      setDeleteTarget(null);
      reloadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmittingAdmin(true);
    try {
      await createPreRegisteredAdmin({
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
      });
      toast.success("User pre-registered successfully");
      setIsAddAdminOpen(false);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminRole("admin");
      reloadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to pre-register user");
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // ── Permission helpers ─────────────────────────────────────────────────────

  const openPermissionsDialog = (user: IUser) => {
    setEditingUser(user);
    setPermissions(user.permissions || []);
    setEditingUserRole((user as any).role || "worker");
    setIsPermissionsDialogOpen(true);
  };

  const togglePermission = (module: string, action: string) => {
    setPermissions((prev) => {
      const existing = prev.find((p) => p.module === module);
      if (existing) {
        const newActions = existing.actions.includes(action)
          ? existing.actions.filter((a) => a !== action)
          : [...existing.actions, action];
        if (newActions.length === 0) return prev.filter((p) => p.module !== module);
        return prev.map((p) => (p.module === module ? { ...p, actions: newActions } : p));
      }
      return [...prev, { module, actions: [action] }];
    });
  };

  const toggleModuleAll = (module: string) => {
    const existing = permissions.find((p) => p.module === module);
    const allActionsGranted =
      existing && CMS_ACTIONS.every((a) => existing.actions.includes(a));
    if (allActionsGranted) {
      setPermissions((prev) => prev.filter((p) => p.module !== module));
    } else {
      setPermissions((prev) => {
        const filtered = prev.filter((p) => p.module !== module);
        return [...filtered, { module, actions: [...CMS_ACTIONS] }];
      });
    }
  };

  const isSelected = (module: string, action: string) => {
    const perm = permissions.find((p) => p.module === module);
    return perm?.actions.includes(action) || false;
  };

  const isModuleAllSelected = (module: string) => {
    const existing = permissions.find((p) => p.module === module);
    return existing
      ? CMS_ACTIONS.every((a) => existing.actions.includes(a))
      : false;
  };

  const applyRolePreset = (role: UserRole) => {
    setEditingUserRole(role);
    const preset = ROLE_DEFAULT_PERMISSIONS[role] || [];
    setPermissions(preset.map((p) => ({ module: p.module, actions: [...p.actions] })));
  };

  const handleSavePermissions = async () => {
    if (!editingUser) return;
    setIsLoading(true);
    try {
      await updateUserPermissions(
        editingUser._id.toString(),
        permissions,
        editingUserRole,
      );
      toast.success("Permissions and role updated");
      setIsPermissionsDialogOpen(false);
      reloadUsers();
    } catch {
      toast.error("Failed to save permissions");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header Panel ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h1 className="text-lg font-bold text-white font-mono tracking-tight">
              Access Control
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-mono text-neutral-400">
              {usersResult.totalCount} users
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono">
            Manage roles, permissions, and dashboard access for all administrators.
          </p>
        </div>
        {canCreate && (
          <DarkButton
            variant="primary"
            onClick={() => setIsAddAdminOpen(true)}
            className="shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Pre-register Admin
          </DarkButton>
        )}
      </div>

      {/* ── Main Card ── */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-md overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white placeholder-neutral-600 font-mono focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16">
            <Loader label="Loading users..." />
          </div>
        ) : usersResult.users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users className="w-10 h-10 text-neutral-700" />
            <p className="text-sm text-neutral-500 font-mono">No users found.</p>
            {canCreate && (
              <DarkButton variant="outline" size="sm" onClick={() => setIsAddAdminOpen(true)}>
                <UserPlus className="w-3.5 h-3.5" />
                Pre-register Admin
              </DarkButton>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold hidden md:table-cell">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold hidden lg:table-cell">
                    Coverage
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    Status
                  </th>
                  {canMutate && (
                    <th className="text-right px-5 py-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {usersResult.users.map((user) => {
                  const isSuperAdmin = isSuperAdminUser(user);
                  const isLastSuperAdmin =
                    isSuperAdmin && usersResult.superAdminCount <= 1;
                  const coverage = isSuperAdmin
                    ? 100
                    : getPermissionCoverage(user.permissions);
                  const role = (user as any).role || (isSuperAdmin ? "super_admin" : "worker");

                  return (
                    <tr
                      key={user._id.toString()}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User cell */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {user.name}
                              </span>
                              {isSuperAdmin && (
                                <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] uppercase tracking-wider">
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <div className="text-neutral-500 text-[11px] mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role cell */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${
                            ROLE_COLORS[role] || ROLE_COLORS.worker
                          }`}
                        >
                          {role.replace("_", " ")}
                        </span>
                      </td>

                      {/* Coverage cell */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        {isSuperAdmin ? (
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-300 text-[10px]">Full Bypass</span>
                          </div>
                        ) : (
                          <CoverageBar percent={coverage} />
                        )}
                      </td>

                      {/* Status cell */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${
                            STATUS_COLORS[user.status] || STATUS_COLORS.inactive
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Actions cell */}
                      {canMutate && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canUpdate && (
                              <button
                                onClick={() => openPermissionsDialog(user)}
                                disabled={isSuperAdmin}
                                title={
                                  isSuperAdmin
                                    ? "Super Admin has full bypass"
                                    : "Edit Permissions"
                                }
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => setDeleteTarget(user)}
                                disabled={isLastSuperAdmin}
                                title={
                                  isLastSuperAdmin
                                    ? "Cannot delete the last Super Admin"
                                    : "Delete User"
                                }
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {usersResult.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500">
            <span>
              Page {usersResult.currentPage} / {usersResult.totalPages} &nbsp;·&nbsp;{" "}
              {usersResult.totalCount} total
            </span>
            <div className="flex items-center gap-1.5">
              <DarkButton
                variant="outline"
                size="sm"
                disabled={usersResult.currentPage === 1}
                onClick={() => handlePageChange(usersResult.currentPage - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </DarkButton>
              <DarkButton
                variant="outline"
                size="sm"
                disabled={usersResult.currentPage === usersResult.totalPages}
                onClick={() => handlePageChange(usersResult.currentPage + 1)}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </DarkButton>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Permissions Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      {canUpdate && (
        <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto bg-neutral-950 border border-white/15 text-white p-0 gap-0">
            {/* Dialog Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">
                  {editingUser ? getInitials(editingUser.name) : "?"}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white font-mono">
                    {editingUser?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-neutral-500 mt-0.5">
                    {editingUser?.email}
                  </DialogDescription>
                </div>
              </div>

              {/* Role preset bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider shrink-0">
                  Apply preset:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => applyRolePreset(r.value)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        editingUserRole === r.value
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold"
                          : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex gap-1.5">
                  <button
                    onClick={() =>
                      setPermissions(
                        CMS_MODULES.filter((m) => m !== "dashboard").map((module) => ({
                          module,
                          actions: [...CMS_ACTIONS],
                        }))
                      )
                    }
                    className="text-[10px] font-mono text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    All
                  </button>
                  <span className="text-neutral-700">·</span>
                  <button
                    onClick={() => setPermissions([])}
                    className="text-[10px] font-mono text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Module groups */}
            <div className="px-6 py-4 space-y-5">
              {MODULE_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-2.5">
                    {group.label}
                  </div>
                  <div className="space-y-1.5">
                    {group.modules
                      .filter((m) => m !== "dashboard")
                      .map((module) => {
                        const Icon = MODULE_ICON_MAP[module];
                        const moduleAllSelected = isModuleAllSelected(module);
                        const modulePerms = permissions.find((p) => p.module === module);
                        const activeCount = modulePerms?.actions.length || 0;

                        return (
                          <div
                            key={module}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
                          >
                            {/* Module header row */}
                            <div className="flex items-center gap-3 px-4 py-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                              <span className="text-xs text-white font-mono flex-1">
                                {MODULE_LABELS[module]}
                              </span>
                              {activeCount > 0 && !moduleAllSelected && (
                                <span className="text-[10px] text-amber-400 font-mono">
                                  {activeCount}/{CMS_ACTIONS.length}
                                </span>
                              )}
                              {/* Toggle all for this module */}
                              <button
                                onClick={() => toggleModuleAll(module)}
                                title={moduleAllSelected ? "Remove all" : "Grant all"}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                              >
                                {moduleAllSelected ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Square className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {/* Action pills */}
                            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                              {CMS_ACTIONS.map((action) => {
                                const active = isSelected(module, action);
                                const ActionIcon = ACTION_ICONS[action];
                                return (
                                  <button
                                    key={action}
                                    onClick={() => togglePermission(module, action)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all ${
                                      active
                                        ? "bg-white/15 border-white/30 text-white"
                                        : "bg-transparent border-white/[0.08] text-neutral-600 hover:border-white/20 hover:text-neutral-400"
                                    }`}
                                  >
                                    {ActionIcon && (
                                      <ActionIcon className="w-2.5 h-2.5" />
                                    )}
                                    {action}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-2">
              <DarkButton
                variant="outline"
                onClick={() => setIsPermissionsDialogOpen(false)}
              >
                Cancel
              </DarkButton>
              <DarkButton
                variant="primary"
                onClick={handleSavePermissions}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Save Permissions
                  </>
                )}
              </DarkButton>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Delete Confirmation Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm bg-neutral-950 border border-white/15 text-white">
          <DialogHeader>
            <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <DialogTitle className="text-base font-bold font-mono text-white">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-400 mt-1">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{deleteTarget?.name}</span>?
              <br />
              <span className="text-xs text-neutral-500 mt-1 block">{deleteTarget?.email}</span>
              <br />
              <span className="text-xs text-red-400">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-2">
            <DarkButton
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </DarkButton>
            <DarkButton
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete User
                </>
              )}
            </DarkButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          Add Admin Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      {canCreate && (
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogContent className="max-w-md bg-neutral-950 border border-white/15 text-white">
            <form onSubmit={handleAddAdmin}>
              <DialogHeader>
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-base font-bold font-mono text-white">
                  Pre-register Admin
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 mt-1">
                  When they sign in, they&apos;ll automatically receive the permissions below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 font-mono focus:outline-none focus:border-white/25 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. jane@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 font-mono focus:outline-none focus:border-white/25 transition-all"
                  />
                </div>

                {/* Role picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setNewAdminRole(r.value)}
                        className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                          newAdminRole === r.value
                            ? "bg-white/10 border-white/30 text-white"
                            : "bg-white/[0.02] border-white/[0.08] text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                        }`}
                      >
                        <span className="text-xs font-bold font-mono uppercase tracking-wider">
                          {r.label}
                        </span>
                        <span className="text-[10px] mt-0.5 leading-tight">
                          {r.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <DarkButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddAdminOpen(false)}
                >
                  Cancel
                </DarkButton>
                <DarkButton type="submit" variant="primary" disabled={isSubmittingAdmin}>
                  {isSubmittingAdmin ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Pre-register
                    </>
                  )}
                </DarkButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
