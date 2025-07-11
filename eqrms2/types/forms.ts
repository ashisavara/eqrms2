import { z } from "zod";

// Defining the zodSchema for companySnapshot
export const companySnapshotFormSchema = z.object({
  snapshot: z.string().optional(),
  positive: z.string().optional(),
  negative: z.string().optional(),
  outlook: z.string().optional(),
  inv_view: z.string().optional(),
});

// TypeScript type inferred from the schema. It defines the shape of actual data
export type CompanySnapshotFormValues = z.infer<typeof companySnapshotFormSchema>;
