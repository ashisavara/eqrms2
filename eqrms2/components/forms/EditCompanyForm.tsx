'use client'; // Marks this file as a client component, required for react-hook-form

import { useForm, Controller } from "react-hook-form"; // React Hook Form hooks
import { Button } from "@/components/ui/button"; // Shadcn UI button
import { companySnapshotFormSchema, CompanySnapshotFormValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod"; // Bridge between react-hook-form and zod
import { TextArea } from "./FormFields"; // Our reusable field components
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// 3️⃣ Define the props that this form component expects
type Props = {
  companyId: string;
  defaultValues: CompanySnapshotFormValues; // Initial values to prefill the form
};

// 4️⃣ The actual form component
export function EditCompanyForm({ companyId, defaultValues }: Props) {
  // Initialize react-hook-form with default values and Zod schema validation
  const { control, handleSubmit } = useForm<CompanySnapshotFormValues>({
    defaultValues,
    resolver: zodResolver(companySnapshotFormSchema),
  });  

  const onSubmit = async (data: CompanySnapshotFormValues) => {
    try {
      const response = await fetch('/api/update-company-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId, data }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message || 'Saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving company');
    }
  };

  // 5️⃣ The JSX form layout
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl w-full mx-auto p-4 space-y-4">
      {/* Reusable textarea fields for each form section */}
      <h3 className="text-2xl font-bold text-center">Edit Company View</h3>
      <TextArea name="inv_view" label="Investment View" control={control} />
      <TextArea name="positive" label="Positive" control={control} />
      <TextArea name="negative" label="Negative" control={control} />
      <TextArea name="outlook" label="Outlook" control={control} />
      <TextArea name="snapshot" label="Snapshot" control={control} />
      {/* Submit button */}
      <Button type="submit" className="w-full">Save</Button>
    </form>
  );
}
