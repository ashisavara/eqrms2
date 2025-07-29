import { getUserRoles } from './auth/getUserRoles';

/**
 * Comprehensive Permission Groups with Guest User Support
 * Now includes progressive permission levels for public/private content
 */
export const PERMISSION_GROUPS = {
  // Core RMS functionality (leads, companies, deals)
  rms: {
    view_basic: ['guest', 'client', 'rm', 'research', 'admin', 'super_admin'], // Public info
    view_detailed: ['client', 'rm', 'research', 'admin', 'super_admin'],       // Logged in users
    edit: ['rm', 'admin', 'super_admin'], 
    delete: ['admin', 'super_admin'],
    create: ['rm', 'admin', 'super_admin']
  },
  
  // Research reports and analysis
  research: {
    view_basic: ['guest', 'research', 'admin', 'super_admin'],     // Public summaries
    view_detailed: ['research', 'admin', 'super_admin'],          // Full reports
    edit: ['research', 'admin', 'super_admin'],
    delete: ['admin', 'super_admin'],
    create: ['research', 'admin', 'super_admin']
  },
  
  // Fund management and tracking
  funds: {
    view_basic: ['guest', 'client', 'wealth', 'rm', 'research', 'admin', 'super_admin'], // Public fund info
    view_detailed: ['client', 'wealth', 'rm', 'research', 'admin', 'super_admin'],       // Performance data
    edit: ['wealth', 'rm', 'admin', 'super_admin'],
    delete: ['admin', 'super_admin'],
    create: ['wealth', 'admin', 'super_admin']
  },
  
  // Client portal and wealth management  
  client_portal: {
    view_basic: ['guest', 'client', 'wealth', 'admin', 'super_admin'],   // Public info
    view_detailed: ['client', 'wealth', 'admin', 'super_admin'],         // Private client data
    edit: ['wealth', 'admin', 'super_admin'],
    delete: ['admin', 'super_admin'],
    create: ['wealth', 'admin', 'super_admin']
  },
  
  // Analytics, reports, and valuation screens
  analytics: {
    view_basic: ['guest', 'rm', 'research', 'wealth', 'admin', 'super_admin'], // Public charts
    view_detailed: ['rm', 'research', 'wealth', 'admin', 'super_admin'],       // Internal analytics
    edit: ['research', 'admin', 'super_admin'],
    delete: ['admin', 'super_admin'],
    create: ['research', 'admin', 'super_admin']
  },
  
  // System administration and user management (fully protected)
  admin: {
    view: ['admin', 'super_admin'],    // No guest access
    edit: ['admin', 'super_admin'],
    delete: ['super_admin'],
    create: ['admin', 'super_admin']
  },
  
  // System-level operations (fully protected)
  system: {
    view: ['super_admin'],    // No guest access
    edit: ['super_admin'],
    delete: ['super_admin'],
    create: ['super_admin']
  }
};

/**
 * Check if user has permission for a specific action on a business area
 * Now supports guest users (empty roles array)
 */
export function can(userRoles: string[], group: keyof typeof PERMISSION_GROUPS, action: string): boolean {
  const groupPermissions = PERMISSION_GROUPS[group];
  if (!groupPermissions) return false;
  
  const allowedRoles = groupPermissions[action as keyof typeof groupPermissions] || [];
  
  // Handle guest users (empty roles array)
  if (userRoles.length === 0) {
    return allowedRoles.includes('guest');
  }
  
  return userRoles.some(role => allowedRoles.includes(role));
}

/**
 * Enhanced can function that automatically gets roles from context
 * For server components - use can(await getUserRoles(), group, action) instead
 */
export async function canWithAuth(group: keyof typeof PERMISSION_GROUPS, action: string): Promise<boolean> {
  const userRoles = await getUserRoles();
  return can(userRoles, group, action);
}

/**
 * Check if user is authenticated (has any roles)
 */
export async function isAuthenticated(): Promise<boolean> {
  const userRoles = await getUserRoles();
  return userRoles.length > 0;
}

/**
 * Get user authentication status and roles
 */
export async function getUserStatus() {
  const userRoles = await getUserRoles();
  return {
    isAuthenticated: userRoles.length > 0,
    isGuest: userRoles.length === 0,
    roles: userRoles,
    isAdmin: userRoles.includes('admin') || userRoles.includes('super_admin'),
    isSuperAdmin: userRoles.includes('super_admin')
  };
}

/**
 * Type definitions for better TypeScript support
 */
export type PermissionGroup = keyof typeof PERMISSION_GROUPS;
export type PermissionAction = 'view' | 'view_basic' | 'view_detailed' | 'edit' | 'delete' | 'create';

/**
 * Available user roles in the system (including guest)
 */
export const USER_ROLES = {
  GUEST: 'guest',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  RESEARCH: 'research',
  RM: 'rm',
  WEALTH: 'wealth',
  CLIENT: 'client'
} as const;

/**
 * Mapping of application features to permission groups
 * Use this to determine which permission group to check for specific features
 */
export const FEATURE_TO_GROUP = {
  // RMS features
  leads: 'rms',
  companies: 'rms', 
  deals: 'rms',
  crm: 'rms',
  
  // Research features
  research_notes: 'research',
  research_reports: 'research',
  sectors: 'research',
  
  // Fund features
  funds: 'funds',
  amc: 'funds',
  categories: 'funds',
  
  // Client features
  client_dashboard: 'client_portal',
  wealth_management: 'client_portal',
  
  // Analytics features
  val_screen: 'analytics',
  analytics_dashboard: 'analytics',
  change_log: 'analytics',
  
  // Admin features
  user_management: 'admin',
  permissions: 'admin',
  
  // System features
  system_logs: 'system',
  system_config: 'system'
} as const; 