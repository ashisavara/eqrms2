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