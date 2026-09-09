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
  return (
    hasPermission(access, module, "read") ||
    hasPermission(access, module, "all")
  );
}
