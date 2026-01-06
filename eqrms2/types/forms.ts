import { X } from "lucide-react";
import { z } from "zod";

// -----------------------
// COMPANY SNAPSHOT FORM 
// -----------------------

// Defining the zodSchema for companySnapshot
export const companySnapshotFormSchema = z.object({
  snapshot: z.string().nullable(),
  positive: z.string().nullable(),
  negative: z.string().nullable(),
  outlook: z.string().nullable(),
  inv_view: z.string().nullable(),
  positive_snapshot: z.string().nullable(),
  negative_snapshot: z.string().nullable(),
  watch_for: z.string().nullable(),
  business_mix: z.string().nullable(),
  catalysts: z.string().nullable(),
  hidden: z.string().nullable(),
  coverage: z.string().nullable(),
  quality: z.string().nullable(),
  stock_score: z.coerce.number().nullable(),
});

// TypeScript type inferred from the schema. It defines the shape of actual data
export type CompanySnapshotFormValues = z.infer<typeof companySnapshotFormSchema>;

// -----------------------
// COMPANY QUARTERLY NOTES
// -----------------------

// Defining the zodSchema for companyQrtNotes
export const CompanyQrtNotesSchema = z.object({
  qtr: z.string(), // Adjust if qtr is a different type
  company_id: z.coerce.number(),
  result_rating: z.string(), // Adjust if result_rating is a different type
  positive:z.string().nullable(),
  negative:z.string().nullable(),
  outlook:z.string().nullable(),
  summary:z.string().nullable(),
  positive_notes: z.string().nullable(), // Assuming notes can be null
  negative_notes: z.string().nullable(),
  neutral_notes: z.string().nullable(),
  outlook_notes: z.string().nullable(),  
});

// TypeScript type inferred from the schema. It defines the shape of actual data
export type CompanyQrtNotesValues = z.infer<typeof CompanyQrtNotesSchema>;

// -----------------------
// FUNDS FORM 
// -----------------------

// Defining the zodSchema for funds update
export const fundsUpdateSchema = z.object({
  open_for_subscription: z.string().nullable(),
  recommendation_tag: z.string().nullable(),
  strategy_tag: z.string().nullable(),
  strategy_name: z.string().nullable(),
  investment_view: z.string().nullable(),
  strategy_view: z.string().nullable(),
  additional_performance_view: z.string().nullable(),
  oth_salient_points: z.string().nullable(),
  fund_body: z.string().nullable(),
});

export type FundsUpdateValues = z.infer<typeof fundsUpdateSchema>;

// -----------------------
// AMC FORM 
// -----------------------

// Defining the zodSchema for amc update
export const amcUpdateSchema = z.object({
  amc_pedigree: z.string().nullable(),
  team_pedigree: z.string().nullable(),
  inv_team_risk: z.string().nullable(),
  amc_maturity: z.string().nullable(),
  inv_phil_name: z.string().nullable(),
  inv_philosophy_followed: z.string().nullable(),
  core_amc_team: z.string().nullable(),
  amc_view: z.string().nullable(),
  amc_pedigree_desc: z.string().nullable(),
  team_pedigree_desc: z.string().nullable(),
  inv_phil_desc: z.string().nullable(),
  salient_points: z.string().nullable(),
  amc_body: z.string().nullable(),
});

export type AmcUpdateValues = z.infer<typeof amcUpdateSchema>;

// -----------------------
// AMC DUE DILIGENCE FORM 
// -----------------------

export const amcDueDiligenceSchema = z.object({
  amc_incorporation_dd: z.coerce.number().nullable(),
  pms_license_number_dd: z.string().nullable(),
  shareholding_structure_dd: z.string().nullable(),
  team_changes_amc: z.string().nullable(),
  other_biz_dd: z.string().nullable(),
  legal_dd: z.string().nullable(),
  fund_managers_mkt_mat: z.string().nullable(),
  inv_team_amc: z.string().nullable(),
  ops_team_amc: z.string().nullable(),
  inv_committee_amc: z.string().nullable(),
  ownership_alignment_amc: z.string().nullable(),
  inv_philosophy_mkt_mat: z.string().nullable(),
  portfolio_construction_mkt_mat: z.string().nullable(),
  risk_management_mkt_mat: z.string().nullable(),
  cash_management_mkt_mat: z.string().nullable(),
  derivatives_mkt_mat: z.coerce.boolean().nullable(),
  inv_process_mkt_mat: z.string().nullable(),
  strategy_adherance_amc: z.string().nullable(),
  active_schemes_mkt_mat: z.string().nullable(),
  nav_chart_amc: z.string().nullable(),
  cy_returns_amc: z.coerce.number().nullable(),
  rolling_returns_mkt_mat: z.coerce.number().nullable(),
  drawdown_history_amc: z.string().nullable(),
  portfolio_composition_mkt_mat: z.string().nullable(),
  qty_mktcap_composition_amc: z.string().nullable(),
  portfolio_turnover_amc: z.coerce.number().nullable(),
  section_allocation_amc: z.string().nullable(),
  historic_calls_amc: z.string().nullable(),
  black_swan_events_amc: z.string().nullable(),
  firm_aum_sebi: z.coerce.number().nullable(),
  strategy_aum_clients_sebi: z.coerce.number().nullable(),
  capacity_contraints_amc: z.string().nullable(),
  fee_mkt_mat: z.coerce.number().nullable(),
  commission_mkt_mat: z.coerce.number().nullable(),
  inv_comm_amc: z.string().nullable(),
  disclosure_doc_mkt_mat: z.string().nullable(),
  webinars_amc: z.string().nullable(),
  custory_broker_mkt_mat: z.string().nullable(),
  mailing_list_amc: z.coerce.boolean().nullable(),
  disclosure_doc_last_check: z.coerce.date().nullable(),
  mkt_mat_last_check: z.coerce.date().nullable(),
  amc_diligence_last_check: z.coerce.date().nullable(),
  mkt_material_link: z.string().nullable()
});

// Add the type export for use in TypeScript
export type AmcDueDiligenceValues = z.infer<typeof amcDueDiligenceSchema>;


// -----------------------
// ASSET CLASS FORM 
// -----------------------

export const assetClassSchema = z.object({
  asset_class_summary: z.string().nullable(),
  asset_class_desc: z.string().nullable()
});

export type AssetClassValues = z.infer<typeof assetClassSchema>;

// -----------------------
// CATEGORY FORM 
// -----------------------

export const categorySchema = z.object({
  cat_summary: z.string().nullable(),
  cat_description: z.string().nullable()
});

export type CategoryValues = z.infer<typeof categorySchema>;

// -----------------------
// CHANGELOG FORM 
// -----------------------

export const changelogSchema = z.object({
  change_desc: z.string().nullable(),
  team_discussed: z.coerce.boolean().nullable()
});

export type ChangelogValues = z.infer<typeof changelogSchema>;

// -----------------------
// SECTOR FORM 
// -----------------------

export const sectorSchema = z.object({
  sector_name: z.string().nullable(),
  sector_slug: z.string().nullable(),
  sector_stance: z.string().nullable(),
  mkt_momentum: z.string().nullable(),
  investment_view: z.string().nullable(),
  sector_positive_snapshot: z.string().nullable(),
  sector_negative_snapshot: z.string().nullable(),
  sector_watch_for_snapshot: z.string().nullable(),
  portfolio_thoughts: z.string().nullable(),
  red_team: z.string().nullable(),
});

export type SectorValues = z.infer<typeof sectorSchema>;



// -----------------------
// LEAD FORM 
// -----------------------

export const LeadsTaggingSchema = z.object({
  lead_name: z.string().min(1, "Lead name is required"),
  last_contact_date: z.coerce.date().nullable(),
  followup_date: z.coerce.date().nullable(),
  importance: z.string().min(1, "Importance is required"),
  lead_progression: z.string().min(1, "Lead progression is required"),
  lead_source: z.string().min(1, "Lead source is required"),
  lead_type: z.string().min(1, "Lead type is required"),
  wealth_level: z.string().min(1, "Wealth level is required"),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  phone_validated: z.coerce.boolean().nullable(),
  email_validated: z.coerce.boolean().nullable(),
  phone_e164: z.string().nullable(),
  email_1: z.string().nullable(),
  email_2: z.string().nullable(),
  email_3: z.string().nullable(),
  lead_summary: z.string().min(1, "Lead summary is required"),
  lead_background: z.string().nullable(),
  primary_rm_uuid: z.string().nullable(),
  service_rm_uuid: z.string().nullable(),
  subs_email: z.coerce.boolean().nullable(),
  subs_whatsapp: z.coerce.boolean().nullable(),
  subs_imecapital: z.coerce.boolean().nullable(),
  subs_imepms: z.coerce.boolean().nullable(),
  referral_partner: z.string().nullable(),
});

export type LeadsTaggingValues = z.infer<typeof LeadsTaggingSchema>;

// -----------------------
// LEAD TAG FORM 
// -----------------------

export const LeadsTagShortSchema = z.object({
  last_contact_date: z.coerce.date().nullable(),
  followup_date: z.coerce.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  wealth_level: z.string().nullable(),
  lead_summary: z.string().nullable(),
});

export type LeadsTagShortValues = z.infer<typeof LeadsTagShortSchema>;

// -----------------------
// MEETING NOTE FORM 
// -----------------------

export const MeetingNoteSchema = z.object({

  // meeting notes fields
  interaction_channel: z.string(),
  interaction_tag: z.string(),
  interaction_type: z.string().trim().min(1, 'Required'),
  meeting_name: z.string().trim().min(1, 'Required'),
  meeting_notes: z.string(),
  meeting_summary: z.string(),
  show_to_client: z.coerce.boolean(),

  //lead fields
  followup_date: z.coerce.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  wealth_level: z.string().nullable(),
  lead_summary: z.string().nullable(),
});

export type MeetingNoteValues = z.infer<typeof MeetingNoteSchema>;


// -----------------------
// FOLLOW-UP FORM 
// -----------------------

export const FollowUpSchema = z.object({

  // meeting notes fields
  interaction_channel: z.string(),
  interaction_type: z.string().trim().min(1, 'Required'),

  //lead fields
  followup_date: z.coerce.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  wealth_level: z.string().nullable(),
  lead_summary: z.string().nullable(),
});

export type FollowUpValues = z.infer<typeof FollowUpSchema>;


// -----------------------
// DEAL FORM 
// -----------------------
export const DealsSchema = z.object({
  //deal fields
  rel_lead_id: z.coerce.number().nullable(),
  deal_name: z.string().nullable(),
  est_closure: z.string().nullable(),
  deal_likelihood: z.coerce.number().nullable(),
  deal_stage: z.string().nullable(),
  deal_segment: z.string().nullable(),
  total_deal_aum: z.coerce.number().nullable(),
  deal_summary: z.string().nullable(),

  //lead fields
  followup_date: z.coerce.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  wealth_level: z.string().nullable(),
  lead_summary: z.string().nullable(),
});

export type DealsValues = z.infer<typeof DealsSchema>;


// ----------------------
// CUSTOM TAG FORM 
// -----------------------
export const CustomTagSchema = z.object({
  custom_tag_id: z.coerce.number(),
});

export type CustomTagValues = z.infer<typeof CustomTagSchema>;

// ----------------------
// LEAD ROLE FORM 
// -----------------------
export const LeadRoleSchema = z.object({
  lead_role_id: z.coerce.number(),
});

export type LeadRoleValues = z.infer<typeof LeadRoleSchema>;

// ----------------------
// DIGITAL AD FORM 
// -----------------------
export const DigitalAdSchema = z.object({
  digital_id: z.coerce.number(),
});

export type DigitalAdValues = z.infer<typeof DigitalAdSchema>;

// ----------------------
// DIGITAL AD FORM 
// -----------------------
export const ClientGroupSchema = z.object({
  group_name: z.string(),
});

export type ClientGroupValues = z.infer<typeof ClientGroupSchema>;


// ----------------------
// ACL LEAD FORM
// -----------------------
export const AclLeadSchema = z.object({
  auth_id_role: z.string()
});

export type AclLeadValues = z.infer<typeof AclLeadSchema>;

// ----------------------
// ACL GROUP FORM
// -----------------------
export const AclGroupSchema = z.object({
  auth_id_role: z.string()
});

export type AclGroupValues = z.infer<typeof AclGroupSchema>;

// ----------------------
// FIN GOALS FORM
// -----------------------
export const FinGoalsSchema = z.object({
  goal_name: z.string(),
  goal_description: z.string(),
  goal_date: z.coerce.date(),
  exp_returns: z.coerce.number(),
  inflation_rate: z.coerce.number(),
  fv_goals: z.coerce.number(),
 });

 export type FinGoalsValues = z.infer<typeof FinGoalsSchema>;


// -------------------
// LINK INV TO GOALS 
// -------------------
export const LinkInvToGoalsSchema = z.object({
  goal_id: z.coerce.number().nullable(),
});

export type LinkInvToGoalsValues = z.infer<typeof LinkInvToGoalsSchema>;

// -------------------
// LINK SIP TO GOALS
// -------------------
export const LinkSipToGoalsSchema = z.object({
  goal_id: z.coerce.number().nullable(),
});

export type LinkSipToGoalsValues = z.infer<typeof LinkSipToGoalsSchema>;


// -------------------
// EDIT MANDATE
// -------------------
export const EditMandateSchema = z.object({
  mandate_name: z.string(),
  inv_plan: z.string(),
  other_mandate_details: z.string(),
  one_line_objective: z.string(),
  rp_override: z.string(),
  last_review_date: z.coerce.date().nullable(),
  investments_background: z.string().nullable(),
  investments_purpose: z.string().nullable(),
  investment_recommendations: z.string().nullable(),
  background_done: z.coerce.boolean().nullable(),
  risk_profile_done: z.coerce.boolean().nullable(),
  fin_plan_done: z.coerce.boolean().nullable(),
  inv_plan_done: z.coerce.boolean().nullable(),
  shortlisting_done: z.coerce.boolean().nullable(),
});

export type EditMandateValues = z.infer<typeof EditMandateSchema>;

// -------------------
// EDIT PORTFOLIO RECOMMENDATION
// -------------------
export const EditPortRecoSchema = z.object({
  portfolio_reallocation_thoughts: z.string(),
})

export type EditPortRecoValues = z.infer<typeof EditPortRecoSchema>;

// -------------------
// EDIT HELD AWAY ASSETS
// -------------------
export const EditHeldAwayAssetsSchema = z.object({
  fund_name: z.string(),
  asset_class_id: z.coerce.number().nullable(),
  category_id: z.coerce.number().nullable(),
  structure_id: z.coerce.number().nullable(),
  investor_id: z.coerce.number().nullable(),
  advisor_name: z.string().nullable(),
  pur_amt: z.coerce.number().nullable(),
  cur_amt: z.coerce.number(),
  rms_fund_id: z.coerce.number().nullable(),
  source: z.string()
});

export type EditHeldAwayAssetsValues = z.infer<typeof EditHeldAwayAssetsSchema>;

// -------------------
// EDIT INVETMENT NEW AMT
// -------------------
export const EditInvNewAmtSchema = z.object({
  amt_change: z.coerce.number().nullable(),
  recommendation: z.string().nullable(),
});

export type EditInvNewAmtValues = z.infer<typeof EditInvNewAmtSchema>;


// -------------------
// HELD AWAY ASSETS
// -------------------
export const HeldAwayAssetsSchema = z.object({
  fund_name: z.string(),
  asset_class_id: z.coerce.number(),
  category_id: z.coerce.number(),
  structure_id: z.coerce.number(),
  advisor_name: z.string(),
  pur_amt: z.coerce.number(),
  cur_amt: z.coerce.number(),
  rms_fund_id: z.coerce.number().nullable(),
});

export type HeldAwayAssetsValues = z.infer<typeof HeldAwayAssetsSchema>;


// -------------------
// TICKETING
// -------------------
export const TicketsSchema = z.object({
  ticket_name: z.string(),
  ticket_description: z.string().nullable(),
  created_by: z.string(),
  status: z.string(),
  status_desc: z.string(),
  assignee: z.string(),
  importance: z.string(),
  ticket_segment: z.coerce.number(),
  ticket_summary: z.string(),
});

export type TicketsValues = z.infer<typeof TicketsSchema>;


// -------------------
// AC ONBOARDING
// -------------------
export const AcOnboardSchema = z.object({
  onboarding_title: z.string(),
  onboarding_type: z.coerce.number(),
  rel_group_id: z.coerce.number(),
  status_internal: z.string(),
  get_customer_info: z.coerce.boolean(),
  ops_check_info: z.coerce.boolean(),
  forms_filled: z.coerce.boolean(),
  sent_for_sig: z.coerce.boolean(),
  form_recieved: z.coerce.boolean(),
  form_processing: z.coerce.boolean(),
  account_opened: z.coerce.boolean(),
  funding_done: z.coerce.boolean(),
  client_cancellation: z.coerce.boolean()
});

export type AcOnboardValues = z.infer<typeof AcOnboardSchema>;


// -------------------
// GROUP INVESTOR
// -------------------
export const GroupInvestorSchema = z.object({
  investor_name: z.string().min(1, "Investor name is required"),
});

export type GroupInvestorValues = z.infer<typeof GroupInvestorSchema>;

// -------------------
// Blog
// -------------------
export const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  featured_image: z.string().nullable(),
  status: z.string().min(1, "Status is required"),
  category: z.string().min(1, "Category is required"),
})

export type BlogValues = z.infer<typeof BlogSchema>;

// -------------------
// Media Interview
// -------------------
export const MediaInterviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publication: z.string().min(1, "Publication is required"),
  publication_date: z.coerce.date().nullable(),
  youtube_url: z.string().nullable(),
  summary: z.string().min(1, "Summary is required"),
  slug: z.string().nullable(),
})

export type MediaInterviewValues = z.infer<typeof MediaInterviewSchema>;

// -------------------
// Investment Query
// -------------------
export const InvestmentQuerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  query_categories: z.string().min(1, "Query Category is required"),
  slug: z.string().nullable(),
})

export type InvestmentQueryValues = z.infer<typeof InvestmentQuerySchema>;

// -------------------
// Edit Group (formerly Edit Mandate)
// -------------------
export const EditGroupSchema = z.object({
  mandate_name: z.string().nullable(),
  inv_plan: z.string().nullable(),
  other_mandate_details: z.string().nullable(),
  one_line_objective: z.string().nullable(),
  rp_override: z.string().nullable(),
  last_review_date: z.coerce.date().nullable(),
  investments_background: z.string().nullable(),
  investments_purpose: z.string().nullable(),
  investment_recommendations: z.string().nullable(),
  background_done: z.boolean().nullable(),
  risk_profile_done: z.boolean().nullable(),
  fin_plan_done: z.boolean().nullable(),
  inv_plan_done: z.boolean().nullable(),
  shortlisting_done: z.boolean().nullable(),
  google_sheet_link: z.string().nullable(),
});

export type EditGroupValues = z.infer<typeof EditGroupSchema>;


// -------------------
// Edit LoginProfile
// -------------------
export const EditLoginProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  client_confirmation: z.coerce.boolean(),
  finacial_pdts_invested_in: z.array(z.string()),
  existing_advisor: z.coerce.boolean(),
  existing_financial_plan: z.coerce.boolean(),
  existing_inv_mandate: z.coerce.boolean(),
  net_worth: z.string().min(1, "Net worth is required"),
  hear_ime_capital: z.string().min(1, "How you heard about IME Capital is required"),
  internal_notes: z.string().nullable().optional(),
});

export type EditLoginProfileValues = z.infer<typeof EditLoginProfileSchema>;

// Type for the update payload sent to Supabase
// Includes form values + calculated hidden fields
export type EditLoginProfileUpdatePayload = EditLoginProfileValues & {
  user_role_name_id: number;
  expires_on: string | null;
  inv_desk_notes: string | null;
  lead_name: string;
};


