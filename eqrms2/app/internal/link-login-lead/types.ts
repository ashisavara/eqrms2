// Types specific to login-lead linking functionality

export interface LoginProfile {
  uuid: string;
  phone_number: string;
  lead_name?: string | null;
  created_at: string;
  lead_id?: number | null;
}

export interface SearchLeadResult {
  lead_id: number;
  lead_name: string;
  phone_e164: string;
  primary_rm_uuid?: string | null;
  name_score?: number;
  phone_exact?: boolean;
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
