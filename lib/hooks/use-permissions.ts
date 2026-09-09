"use client";

import {
  CmsModule,
  CmsAction,
} from "@/constants/permissions";
import {
  DashboardAccess,
  hasPermission as checkPermission,
  canAccessModule as checkAccessModule,
} from "@/lib/auth/rbac-rules";

export function usePermissions(access: DashboardAccess) {
  function hasPermission(module: CmsModule, action: CmsAction): boolean {
    return checkPermission(access, module, action);
  }

  function canAccessModule(module: CmsModule): boolean {
    return checkAccessModule(access, module);
  }

  return { hasPermission, canAccessModule };
}
