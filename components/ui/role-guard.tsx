"use client";

import { ReactNode } from "react";
import { AuthUser } from "@/lib/types";
import { hasPermission, hasAnyPermission } from "@/lib/rbac";

interface RoleGuardProps {
  user: AuthUser | null | undefined;
  permission?: string;
  permissions?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGuard({ 
  user, 
  permission, 
  permissions, 
  fallback = null, 
  children 
}: RoleGuardProps) {
  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(user, permission);
  } else if (permissions) {
    hasAccess = hasAnyPermission(user, permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Hook para usar em componentes
export function useRoleGuard(user: AuthUser | null | undefined) {
  return {
    canManageTeam: user ? hasPermission(user, 'manage_team') : false,
    canManageSettings: user ? hasPermission(user, 'manage_settings') : false,
    canViewAllCustomers: user ? hasPermission(user, 'view_all_customers') : false,
    canManageAllCustomers: user ? hasPermission(user, 'manage_all_customers') : false,
    canExportData: user ? hasPermission(user, 'export_data') : false,
    canManageAllOpportunities: user ? hasPermission(user, 'manage_all_opportunities') : false,
  };
}
