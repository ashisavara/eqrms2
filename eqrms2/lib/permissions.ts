import { getUserRoles } from './auth/getUserRoles';

/**
 * Comprehensive Permission Groups with Guest User Support
 * Now includes progressive permission levels for public/private content
 */
export const PERMISSION_GROUPS = {
  rms: {
    view_basic: ['admin', 'super_admin', 'research', 'inv_desk', 'rm', 'client', 'lead', 'trial_ended', 'guest'],
    view_detailed: ['admin', 'super_admin', 'research', 'inv_desk', 'rm', 'client', 'lead', 'trial_ended'],
    view_due_diligence: ['admin', 'super_admin', 'research', 'inv_desk', 'rm'],
    view_all_funds: ['admin', 'super_admin', 'research', 'inv_desk', 'rm'],
    view_changelog: ['admin', 'super_admin', 'research', 'inv_desk', 'rm'],
    edit_rms: ['admin', 'super_admin', 'research']
  },

  investments: {
    view_investments: ['admin', 'super_admin', 'inv_desk', 'rm', 'client', 'lead'],
    add_edit_held_away: ['admin', 'super_admin', 'inv_desk', 'rm'],
    add_edit_financial_goals: ['admin', 'super_admin', 'inv_desk', 'rm'],
    add_edit_goal_inv_linking: ['admin', 'super_admin', 'inv_desk', 'rm'],
    add_edit_goal_sip_linking: ['admin', 'super_admin', 'inv_desk', 'rm']
  },

  mandate: {
    view_mandate: ['admin', 'super_admin', 'inv_desk', 'rm', 'client', 'lead'],
    edit_mandate: ['admin', 'super_admin', 'inv_desk', 'rm'],
    favouriting: ['admin', 'super_admin', 'inv_desk', 'rm']
  },

  crm: {
    view_leads: ['admin', 'super_admin', 'inv_desk', 'rm'],
    view_interactions: ['admin', 'super_admin', 'inv_desk', 'rm'],
    view_deals: ['admin', 'super_admin', 'inv_desk', 'rm'],
    edit_leads: ['admin', 'super_admin', 'inv_desk', 'rm'],
    edit_interactions: ['admin', 'super_admin', 'inv_desk', 'rm'],
    edit_deals: ['admin', 'super_admin', 'inv_desk', 'rm']
  },

  group_mandate_selector: {
    change_group: ['admin', 'super_admin', 'inv_desk', 'rm'],
    change_mandate: ['admin', 'super_admin', 'inv_desk', 'rm'],
    add_group: ['admin', 'super_admin', 'inv_desk', 'rm'],
    add_mandate: ['admin', 'super_admin', 'inv_desk', 'rm']
  },

  eqrms: {
    view_companies: ['admin', 'super_admin', 'research'],
    edit_companies: ['admin', 'super_admin', 'research'],
  },

  internal: {
    view: ['admin', 'super_admin', 'research', 'inv_desk', 'rm'],
    link_login_lead: ['admin', 'super_admin', 'inv_desk'],
  }
};


/**
 * Check if user has permission for a specific action on a business area
 * Now supports guest users (empty roles array)
 */
export function can(userRoles: string[] | null, group: keyof typeof PERMISSION_GROUPS, action: string): boolean {
  const groupPermissions = PERMISSION_GROUPS[group];
  if (!groupPermissions) return false;
  
  const allowedRoles = (groupPermissions[action as keyof typeof groupPermissions] as string[]) || [];
  
  // Handle null/undefined userRoles by treating as guest
  const roles = userRoles || ['guest'];
  
  return roles.some(role => allowedRoles.includes(role));
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