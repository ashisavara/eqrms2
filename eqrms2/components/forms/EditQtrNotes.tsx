'use client'; // Keep this as a client component for form validation

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CompanyQrtNotesSchema, CompanyQrtNotesValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, RadioInput } from "./FormFields";
import { toast, Toaster } from "sonner";

type Props = {
  initialData: CompanyQrtNotesValues;
  qtrOptions: { value: string; label: string }[];
  resultRatingOptions: { value: string; label: string }[];
  onSuccess?: () => void;
};

export function EditQtrNotesForm({ initialData, qtrOptions, resultRatingOptions, onSuccess }: Props) {  
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
      // Add quarterly_notes_id from initialData for the update
      const updateData = {
        ...data,
        quarterly_notes_id: (initialData as any).quarterly_notes_id
      };
      
      if (!updateData.quarterly_notes_id) {
        throw new Error('quarterly_notes_id is required for updates');
      }
      
      const response = await fetch('/api/update-qtr-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Result:', result);
      
      if (typeof window !== "undefined") {
        toast.success("Quarterly notes updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Single column layout - no grid */}
      <SelectInput name="qtr" label="Quarter" control={control} options={qtrOptions} />
      <RadioInput name="result_rating" label="Result Rating" control={control} options={resultRatingOptions} direction="horizontal" />
      
      <TextInput name="positive" label="Positive" control={control} />
      <TextInput name="negative" label="Negative" control={control} />
      <TextInput name="outlook" label="Outlook" control={control} />
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
