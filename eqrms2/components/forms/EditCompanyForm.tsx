'use client'; // Marks this file as a client component, required for react-hook-form

import { useForm, Controller } from "react-hook-form"; // React Hook Form hooks
import { Button } from "@/components/ui/button"; // Shadcn UI button
import { companySnapshotFormSchema, CompanySnapshotFormValues } from "@/types/forms";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { zodResolver } from "@hookform/resolvers/zod"; // Bridge between react-hook-form and zod
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields"; // Our reusable field components
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { ImageUpload } from "./ImageUpload";
// 3️⃣ Define the props that this form component expects
type Props = {
  companyId: string;
  defaultValues: CompanySnapshotFormValues; // Initial values to prefill the form
};

// 4️⃣ The actual form component
export function EditCompanyForm({ companyId, defaultValues }: Props) {
  // Get options from context (all options available in MasterOptionsContext)
  const masterOptions = useMasterOptions();
  const coverageOptions = transformToValueLabel(masterOptions.coverageTags);
  const qualityOptions = transformToValueLabel(masterOptions.companyQualityTags);
  // Initialize react-hook-form with default values and Zod schema validation
  const { control, handleSubmit, formState: { errors } } = useForm<CompanySnapshotFormValues>({
    defaultValues,
    resolver: zodResolver(companySnapshotFormSchema),
  });  

  const stockScoreOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  const onSubmit = async (data: CompanySnapshotFormValues) => {
    try {
      await supabaseUpdateRow('eq_rms_company', 'company_id', companyId, data);
      
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
      <div className="grid grid-cols-3 gap-4 bg-gray-100 pl-4 pr-4 pt-2 pb-2 rounded-lg">
        <ToggleGroupInput name="stock_score" label="Stock Score" control={control} options={stockScoreOptions} valueType="number" itemClassName="ime-choice-chips" />
           <SelectInput name="coverage" label="Coverage" control={control} options={coverageOptions} />
           <SelectInput name="quality" label="Quality" control={control} options={qualityOptions}/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <TextInput name="positive_snapshot" label="Positive Snapshot" control={control}/>
        <TextInput name="negative_snapshot" label="Negative Snapshot" control={control} />
        <TextInput name="watch_for" label="Watch For" control={control} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><span className="text-sm font-semibold">Img Uploader <br/><ImageUpload /></span></div>
        <TextInput name="financials" label="Financials" control={control} />
      </div>
      <ResizableTextArea name="inv_view" label="Investment View" control={control} />
      <ResizableTextArea name="business_mix" label="Business Mix" control={control} />
      <ResizableTextArea name="catalysts" label="Catalysts" control={control} />
      <ResizableTextArea name="positive" label="Positive" control={control} />
      <ResizableTextArea name="negative" label="Negative" control={control} />
      <ResizableTextArea name="outlook" label="Outlook" control={control} />
      <ResizableTextArea name="snapshot" label="Company Notes" control={control} />
      <ResizableTextArea name="hidden" label="Questions to Answer" control={control} />
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
