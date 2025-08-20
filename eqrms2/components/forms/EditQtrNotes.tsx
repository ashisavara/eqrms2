'use client'; // Keep this as a client component for form validation

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompanyQrtNotesSchema, CompanyQrtNotesValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, RadioInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

type Props = {
  initialData: CompanyQrtNotesValues;
  qtrOptions: { value: string; label: string }[];
  resultRatingOptions: { value: string; label: string }[];
  onSuccess?: () => void;
};

export function EditQtrNotesForm({ initialData, qtrOptions, resultRatingOptions, onSuccess }: Props) {
  const router = useRouter();
  // Convert null values to empty strings for form inputs
  const cleanedData: CompanyQrtNotesValues = {
    qtr: initialData.qtr ?? "",
    company_id: initialData.company_id,
    result_rating: initialData.result_rating ?? "",
    positive: initialData.positive ?? "",
    negative: initialData.negative ?? "",
    outlook: initialData.outlook ?? "",
    summary: initialData.summary ?? "",
    positive_notes: initialData.positive_notes ?? "",
    negative_notes: initialData.negative_notes ?? "",
    neutral_notes: initialData.neutral_notes ?? "",
    outlook_notes: initialData.outlook_notes ?? "",
  };

  const { control, handleSubmit } = useForm<CompanyQrtNotesValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(CompanyQrtNotesSchema),
  });

  const onSubmit = async (data: CompanyQrtNotesValues) => {
    try {
      // Get quarterly_notes_id from initialData for the update
      const quarterlyNotesId = (initialData as any).quarterly_notes_id;
      
      if (!quarterlyNotesId) {
        throw new Error('quarterly_notes_id is required for updates');
      }
      
      await supabaseUpdateRow('eq_rms_qrtly_notes', 'quarterly_notes_id', quarterlyNotesId, data);
      
      if (typeof window !== "undefined") {
        toast.success("Quarterly notes updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating quarterly notes");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-1">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Single column layout - no grid */}
      <div className="grid grid-cols-2 gap-4">
        <SelectInput name="qtr" label="Quarter" control={control} options={qtrOptions} />
        <RadioInput name="result_rating" label="Result Rating" control={control} options={resultRatingOptions} direction="horizontal" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <TextInput name="positive" label="Positive" control={control} />
        <TextInput name="negative" label="Negative" control={control} />
        <TextInput name="outlook" label="Outlook" control={control} />
      </div>
      <TextInput name="summary" label="Summary" control={control} />
      
      <div>
        <h4 className="font-bold mt-5 border-t-2 border-b-2 border-gray-300">Only for DVs plus</h4>
        <ResizableTextArea name="positive_notes" label="Positive Notes" control={control} />
        <ResizableTextArea name="negative_notes" label="Negative Notes" control={control} />
        <ResizableTextArea name="neutral_notes" label="Neutral Notes" control={control} />
        <ResizableTextArea name="outlook_notes" label="Outlook Notes" control={control} />
      </div>
      
      <Button type="submit" className="w-full">Update Notes</Button>
    </form>
  );
}
