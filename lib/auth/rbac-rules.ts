import {
  CmsModule,
  CmsAction,
  UserRole,
  ROLE_DEFAULT_PERMISSIONS,
} from "@/constants/permissions";

export interface DashboardAccess {
  userId: string;
  dbUserId: string;
  email: string;
  name: string;
  role: UserRole;
  isSuperAdmin: boolean;
  teamMemberId?: string;
  permissions: { module: string; actions: string[] }[];
  assignedProjectsCount?: number;
}

/**
 * Checks if a given DashboardAccess object has a specific permission.
 * Super Admins always have all permissions.
 */
export function hasPermission(
  access: DashboardAccess,
  module: CmsModule,
  action: CmsAction,
): boolean {
  if (access.isSuperAdmin || access.role === "super_admin") return true;

  // Overview (dashboard) is strictly forbidden for workers and interns
  if (
    module === "dashboard" &&
    (access.role === "worker" || access.role === "intern")
  ) {
    return false;
  }

  // Projects module is inaccessible for workers and interns if no project is assigned
  if (
    module === "projects" &&
    (access.role === "worker" || access.role === "intern") &&
    (access.assignedProjectsCount ?? 0) <= 0
  ) {
    return false;
  }

  // Check custom explicit permissions first
  const customPerm = access.permissions?.find((p) => p.module === module);
  if (customPerm) {
    if (customPerm.actions.includes("all") || customPerm.actions.includes(action)) {
      return true;
    }
  }

  // Fallback to role-based default permissions
  const roleDefaults = ROLE_DEFAULT_PERMISSIONS[access.role] || [];
  const roleModulePerm = roleDefaults.find((p) => p.module === module);
  if (roleModulePerm) {
    if (
      roleModulePerm.actions.includes("all") ||
      roleModulePerm.actions.includes(action)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a user can access a particular CMS module at all (has at least read or all).
 */
export function canAccessModule(
  access: DashboardAccess,
  module: CmsModule,
): boolean {
  // Overview (dashboard) is hidden for workers and interns
  if (
    module === "dashboard" &&
    (access.role === "worker" || access.role === "intern")
  ) {
    return false;
  }

  // Projects is hidden for workers and interns if no projects are assigned to them
  if (
    module === "projects" &&
    (access.role === "worker" || access.role === "intern") &&
    (access.assignedProjectsCount ?? 0) <= 0
  ) {
    return false;
  }

  return (
    hasPermission(access, module, "read") ||
    hasPermission(access, module, "all")
  );
}
