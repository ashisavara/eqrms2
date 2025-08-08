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
});

// TypeScript type inferred from the schema. It defines the shape of actual data
export type CompanySnapshotFormValues = z.infer<typeof companySnapshotFormSchema>;

// -----------------------
// COMPANY QUARTERLY NOTES
// -----------------------

// Defining the zodSchema for companyQrtNotes
export const CompanyQrtNotesSchema = z.object({
  qtr: z.string(), // Adjust if qtr is a different type
  company_id: z.number(),
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
  fund_rating: z.number().nullable(),
  fund_performance_rating: z.number().nullable(),
  fund_strategy_rating: z.number().nullable(),
  open_for_subscription: z.string().nullable(),
  recommendation_tag: z.string().nullable(),
  strategy_tag: z.string().nullable(),
  strategy_name: z.string().nullable(),
  investment_view: z.string().nullable(),
  strategy_view: z.string().nullable(),
  additional_performance_view: z.string().nullable(),
  oth_salient_points: z.string().nullable(),
});

export type FundsUpdateValues = z.infer<typeof fundsUpdateSchema>;

// -----------------------
// AMC FORM 
// -----------------------

// Defining the zodSchema for amc update
export const amcUpdateSchema = z.object({
  amc_rating: z.number().nullable(),
  amc_pedigree_rating: z.number().nullable(),
  amc_team_rating: z.number().nullable(),
  amc_philosophy_rating: z.number().nullable(),
  amc_size_rating: z.number().nullable(),
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
});

export type AmcUpdateValues = z.infer<typeof amcUpdateSchema>;

// -----------------------
// AMC DUE DILIGENCE FORM 
// -----------------------

export const amcDueDiligenceSchema = z.object({
  amc_incorporation_dd: z.number().nullable(),
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
  derivatives_mkt_mat: z.boolean().nullable(),
  inv_process_mkt_mat: z.string().nullable(),
  strategy_adherance_amc: z.string().nullable(),
  active_schemes_mkt_mat: z.string().nullable(),
  nav_chart_amc: z.string().nullable(),
  cy_returns_amc: z.number().nullable(),
  rolling_returns_mkt_mat: z.number().nullable(),
  drawdown_history_amc: z.string().nullable(),
  portfolio_composition_mkt_mat: z.string().nullable(),
  qty_mktcap_composition_amc: z.string().nullable(),
  portfolio_turnover_amc: z.number().nullable(),
  section_allocation_amc: z.string().nullable(),
  historic_calls_amc: z.string().nullable(),
  black_swan_events_amc: z.string().nullable(),
  firm_aum_sebi: z.number().nullable(),
  strategy_aum_clients_sebi: z.number().nullable(),
  capacity_contraints_amc: z.string().nullable(),
  fee_mkt_mat: z.number().nullable(),
  commission_mkt_mat: z.number().nullable(),
  inv_comm_amc: z.string().nullable(),
  disclosure_doc_mkt_mat: z.string().nullable(),
  webinars_amc: z.string().nullable(),
  custory_broker_mkt_mat: z.string().nullable(),
  mailing_list_amc: z.boolean().nullable(),
  disclosure_doc_last_check: z.coerce.date().nullable(),
  mkt_mat_last_check: z.coerce.date().nullable(),
  amc_diligence_last_check: z.coerce.date().nullable()
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
  team_discussed: z.boolean().nullable()
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
  lead_name: z.string().nullable(),
  last_contact_date: z.date().nullable(),
  followup_date: z.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  lead_source: z.string().nullable(),
  lead_type: z.string().nullable(),
  wealth_level: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  phone_validated: z.boolean().nullable(),
  email_validated: z.boolean().nullable(),
  country_code: z.string().nullable(),
  phone_number: z.string().nullable(),
  email_1: z.string().nullable(),
  email_2: z.string().nullable(),
  email_3: z.string().nullable(),
  lead_summary: z.string().nullable(),
  lead_background: z.string().nullable(),
  primary_rm: z.string().nullable(),
  subs_email: z.boolean().nullable(),
  subs_whatsapp: z.boolean().nullable(),
  subs_imecapital: z.boolean().nullable(),
  subs_imepms: z.boolean().nullable(),
});

export type LeadsTaggingValues = z.infer<typeof LeadsTaggingSchema>;

// -----------------------
// LEAD TAG FORM 
// -----------------------

export const LeadsTagShortSchema = z.object({
  last_contact_date: z.date().nullable(),
  followup_date: z.date().nullable(),
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
  interaction_type: z.string(),
  meeting_name: z.string(),
  meeting_notes: z.string(),
  meeting_summary: z.string(),
  show_to_client: z.boolean(),

  //lead fields
  followup_date: z.date().nullable(),
  importance: z.string().nullable(),
  lead_progression: z.string().nullable(),
  wealth_level: z.string().nullable(),
  lead_summary: z.string().nullable(),
});

export type MeetingNoteValues = z.infer<typeof MeetingNoteSchema>;


// -----------------------
// DEAL FORM 
// -----------------------
export const DealsSchema = z.object({
  //deal fields
  rel_lead_id: z.number().nullable(),
  deal_name: z.string().nullable(),
  est_closure: z.string().nullable(),
  deal_likelihood: z.coerce.number().nullable(),
  deal_stage: z.string().nullable(),
  deal_segment: z.string().nullable(),
  total_deal_aum: z.coerce.number().nullable(),
  deal_summary: z.string().nullable(),

  //lead fields
  followup_date: z.date().nullable(),
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


