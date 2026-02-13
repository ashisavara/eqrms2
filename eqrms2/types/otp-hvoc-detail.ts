export type OtpHvocDetail = {
  id: number;
  phone_number: string;
  otp_code: string;
  expires_at: Date;
  used: boolean;
  ip_address: string;
  device_id: string;
  created_at: Date;
  otp_lead_name: string;
  hvoc: string;
  affiliate_lead_id: number;
  affiliate_ref_meta: string;
  affiliate_lead_name: string;
  lead_name: string;
};