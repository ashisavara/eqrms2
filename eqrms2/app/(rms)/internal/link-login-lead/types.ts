// Types specific to login-lead linking functionality

export interface LoginProfile {
  uuid: string;
  phone_number: string;
  lead_name?: string | null;
  created_at: string;
  lead_id?: number | null;
  rm_name?: string | null;
  affiliate_lead_id?: number | null;
}

export interface LoginProfileWithoutRoles {
  uuid: string;
  phone_number: string;
  lead_name?: string | null;
  lead_id?: number | null;
  rm_name?: string | null;
  created_at: string;
  user_roles: any[]; // Empty array when no roles
}

export interface UserRole {
  role_id: number;
  role_name: string;
}

export interface LoginProfileWithRoles {
  uuid: string;
  phone_number: string;
  lead_name?: string | null;
  user_roles: UserRole[]; // Array of role objects
  lead_id?: number | null;
  crm_lead_name?: string | null;
  group_id?: number | null;
  group_name?: string | null;
  rm_name?: string | null;
  mandate_id?: number | null;
  mandate_name?: string | null;
}

export interface SearchLoginProfilesRequest {
  searchTerm: string;
  searchType: 'phone' | 'name';
  limit?: number;
}

export interface SearchLeadResult {
  lead_id: number;
  lead_name: string;
  phone_e164: string;
  primary_rm_uuid?: string | null;
  rm_name?: string | null;
  name_score?: number;
  phone_exact?: boolean;
  match_reason?: string | null;
}

export interface UpdateLeadNameFormData {
  lead_name: string;
}

export interface LinkLoginToLeadRequest {
  login_uuid: string; // API still expects login_uuid parameter name
  lead_id: number;
}

export interface SearchLeadsRequest {
  phone: string;
  name: string;
  limit?: number;
}
