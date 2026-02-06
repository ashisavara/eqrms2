export type CallsDetail = {
  candidate_number: string;
  candidate_name?: string | null;
  lead_id?: number | null;
  status?: string | null;
  call_start_time?: string | null;
  call_duration?: number | null;
  recording_url?: string | null;
  link?: string | null;
};