'use client'; // Keep this as a client component for form validation

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CompanyQrtNotesSchema, CompanyQrtNotesValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, RadioInput } from "./FormFields";
import { toast, Toaster } from "sonner";

type Props = {
  company_id: number;
  qtrOptions: { value: string; label: string }[];
  resultRatingOptions: { value: string; label: string }[];
};

export function QtrNotesForm({ company_id, qtrOptions, resultRatingOptions }: Props) {
  const { control, handleSubmit } = useForm<CompanyQrtNotesValues>({
    defaultValues: {
      company_id, // Set company_id from the prop
      qtr: "",
      result_rating: "",
      positive: "",
      negative: "",
      outlook: "",
      summary: "",
      positive_notes: "",
      negative_notes: "",
      neutral_notes: "",
      outlook_notes: "",
    },
    resolver: zodResolver(CompanyQrtNotesSchema),
  });

  const onSubmit = async (data: CompanyQrtNotesValues) => {
    try {
      const response = await fetch('/api/add-qtr-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Result:', result);
      // Since we often deal with server components, it's a good practice to guard the toast call
      // with typeof window !== "undefined" to ensure it only runs on the client.
      if (typeof window !== "undefined") {
        toast.success("Quarterly notes added successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving quarterly notes');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl w-full mx-auto p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      <h3 className="text-2xl font-bold text-center">Add Quarterly Notes</h3>
      <div className="grid grid-cols-3">
        <div className="grid-cols-1">
          <SelectInput name="qtr" label="Quarter" control={control} options={qtrOptions} />
        </div>
        <div className="grid-cols-2 pl-5">
          <RadioInput name="result_rating" label="Result Rating" control={control} options={resultRatingOptions} direction="horizontal" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <TextInput name="positive" label="Positive" control={control} />
        <TextInput name="negative" label="Negative" control={control} />
        <TextInput name="outlook" label="Outlook" control={control} />
      </div>
      <div>
        <h4 className="font-bold mt-5 border-t-2 border-b-2 border-gray-300">Only for DVs plus</h4>
        <TextInput name="summary" label="Summary" control={control} />
        <ResizableTextArea name="positive_notes" label="Positive Notes" control={control} />
        <ResizableTextArea name="negative_notes" label="Negative Notes" control={control} />
        <ResizableTextArea name="neutral_notes" label="Neutral Notes" control={control} />
        <ResizableTextArea name="outlook_notes" label="Outlook Notes" control={control} />
      </div>
      <Button type="submit" className="w-full">Add Notes</Button>
    </form>
  );
}
