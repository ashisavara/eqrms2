export type OtpLoginDetail = {
  id?: number;
  phone_number: string;
  otp_code: string;
  created_at: string | Date;
  used: boolean;
};
