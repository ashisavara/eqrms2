'use client'; // Marks this file as a client component, required for react-hook-form

import { useForm, Controller } from "react-hook-form"; // React Hook Form hooks
import { Button } from "@/components/ui/button"; // Shadcn UI button
import { companySnapshotFormSchema, CompanySnapshotFormValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod"; // Bridge between react-hook-form and zod
import { ResizableTextArea, TextInput } from "./FormFields"; // Our reusable field components

// 3️⃣ Define the props that this form component expects
type Props = {
  companyId: string;
  defaultValues: CompanySnapshotFormValues; // Initial values to prefill the form
};

// 4️⃣ The actual form component
export function EditCompanyForm({ companyId, defaultValues }: Props) {
  // Initialize react-hook-form with default values and Zod schema validation
  const { control, handleSubmit, formState: { errors } } = useForm<CompanySnapshotFormValues>({
    defaultValues,
    resolver: zodResolver(companySnapshotFormSchema),
  });  

  const onSubmit = async (data: CompanySnapshotFormValues) => {
    try {
      const response = await fetch('/api/update-company-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
      }

      // Redirect to the company page if update is successful
      window.location.href = `/companies/${companyId}`;
    } catch (error) {
      console.error('Error:', error);
      alert(`Error saving company: ${error}`);
    }
  };

  // 5️⃣ The JSX form layout
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl w-full mx-auto p-4 space-y-4">
      {/* Reusable textarea fields for each form section */}
      <h3 className="text-2xl font-bold text-center">Edit Company View</h3>
      <div className="grid grid-cols-3 gap-4">
        <TextInput name="positive_snapshot" label="Positive Snapshot" control={control} />
        <TextInput name="negative_snapshot" label="Negative Snapshot" control={control} />
        <TextInput name="watch_for" label="Watch For" control={control} />
      </div>
      
      <ResizableTextArea name="inv_view" label="Investment View" control={control} />
      <ResizableTextArea name="positive" label="Positive" control={control} />
      <ResizableTextArea name="negative" label="Negative" control={control} />
      <ResizableTextArea name="outlook" label="Outlook" control={control} />
      <ResizableTextArea name="snapshot" label="Snapshot" control={control} />
      {/* Submit button */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500">
          {Object.entries(errors).map(([field, error]) => (
            <div key={field}>{field}: {(error as any).message}</div>
          ))}
        </div>
      )}
      <Button type="submit" className="w-full">Save</Button>
    </form>
  );
}
