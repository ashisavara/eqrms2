'use client'; // Marks this file as a client component, required for react-hook-form

import { useForm, Controller } from "react-hook-form"; // React Hook Form hooks
import { Button } from "@/components/ui/button"; // Shadcn UI button
import { z } from "zod"; // Schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Bridge between react-hook-form and zod
import { TextArea } from "./FormFields"; // Our reusable field components
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// 1️⃣ Define the schema for the form using Zod
const formSchema = z.object({
  snapshot: z.string().optional(),
  positive: z.string().optional(),
  negative: z.string().optional(),
  outlook: z.string().optional(),
  inv_view: z.string().optional(),
});

// 2️⃣ Infer the types from the schema (for TypeScript safety)
type CompanyFormValues = z.infer<typeof formSchema>;

// 3️⃣ Define the props that this form component expects
type Props = {
  companyId: string;
  defaultValues: CompanyFormValues; // Initial values to prefill the form
};

// 4️⃣ The actual form component
export function EditCompanyForm({ companyId, defaultValues }: Props) {
  // Initialize react-hook-form with default values and Zod schema validation
  const { control, handleSubmit } = useForm<CompanyFormValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      await supabaseUpdateRow("eq_rms_valscreen", "rel_company_id", companyId, data);
      alert("Saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving company");
    }
  };

  // 5️⃣ The JSX form layout
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl w-full mx-auto p-4 space-y-4">
      {/* Reusable textarea fields for each form section */}
      <TextArea name="snapshot" label="Snapshot" control={control} />
      <TextArea name="positive" label="Positive" control={control} />
      <TextArea name="negative" label="Negative" control={control} />
      <TextArea name="outlook" label="Outlook" control={control} />
      <TextArea name="inv_view" label="Investment View" control={control} />

      {/* Submit button */}
      <Button type="submit" className="w-full">Save</Button>
    </form>
  );
}
