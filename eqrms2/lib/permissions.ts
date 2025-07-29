/**
 * Permission Groups - Define what each role can do for each business area
 * Start with 3 basic groups for Phase 1 implementation
 */
export const PERMISSION_GROUPS = {
  rms: {
    view: ['client', 'rm', 'research', 'admin', 'super_admin'],
    edit: ['rm', 'admin', 'super_admin'], 
    delete: ['admin', 'super_admin'],
    create: ['rm', 'admin', 'super_admin']
  },
  research: {
    view: ['research', 'admin', 'super_admin'],
    edit: ['research', 'admin', 'super_admin'],
    delete: ['admin', 'super_admin'],
    create: ['research', 'admin', 'super_admin']
  },
  admin: {
    view: ['admin', 'super_admin'],
    edit: ['admin', 'super_admin'],
    delete: ['super_admin'],
    create: ['admin', 'super_admin']
  }
};

/**
 * Check if user has permission for a specific action on a business area
 * @param userRoles - Array of user roles from JWT
 * @param group - Permission group (rms, research, admin)
 * @param action - Action to check (view, edit, delete, create)
 * @returns boolean - Whether user has permission
 */
export function can(userRoles: string[], group: keyof typeof PERMISSION_GROUPS, action: string): boolean {
  const groupPermissions = PERMISSION_GROUPS[group];
  if (!groupPermissions) return false;
  
  const allowedRoles = groupPermissions[action as keyof typeof groupPermissions] || [];
  return userRoles.some(role => allowedRoles.includes(role));
}

/**
 * Type definitions for better TypeScript support
 */
export type PermissionGroup = keyof typeof PERMISSION_GROUPS;
export type PermissionAction = 'view' | 'edit' | 'delete' | 'create';

/**
 * Available user roles in the system
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  RESEARCH: 'research',
  RM: 'rm',
  CLIENT: 'client'
} as const; 