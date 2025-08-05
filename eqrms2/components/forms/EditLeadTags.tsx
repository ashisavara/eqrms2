'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LeadsTagShortSchema, LeadsTagShortValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, DatePicker, BooleanToggleInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { EditIcon } from "lucide-react";

// Internal form component
function EditLeadTagsForm({ 
  initialData, 
  id,  // lead_id
  onSuccess,
  importanceOptions,
  leadProgressionOptions,
  wealthLevelOptions,
  leadName,
  country_code,
  phone_number
}: { 
  initialData: LeadsTagShortValues; 
  id: number;  
  onSuccess?: () => void;
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
  leadName: string;
  country_code: string;
  phone_number: string;
}) {
  const router = useRouter();
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: LeadsTagShortValues = {
    last_contact_date: initialData.last_contact_date ? new Date(initialData.last_contact_date) : null,
    followup_date: initialData.followup_date ? new Date(initialData.followup_date) : null,
    importance: initialData.importance ?? "",
    lead_progression: initialData.lead_progression ?? "",
    wealth_level: initialData.wealth_level ?? "",
    lead_summary: initialData.lead_summary ?? "",
  };

  const { control, handleSubmit } = useForm<LeadsTagShortValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(LeadsTagShortSchema),
  });

  const onSubmit = async (data: LeadsTagShortValues) => {
    try {
      if (!id) {
        throw new Error('lead_id is required for updates');
      }
      
      // Convert Date objects to ISO strings for Supabase
      const processedData = {
        ...data,
        last_contact_date: data.last_contact_date instanceof Date ? data.last_contact_date.toISOString() : data.last_contact_date,
        followup_date: data.followup_date instanceof Date ? data.followup_date.toISOString() : data.followup_date,
      };
      
      await supabaseUpdateRow('leads_tagging', 'lead_id', id, processedData);
      
      if (typeof window !== "undefined") {
        toast.success("Lead updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating lead");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      <p className="text-sm font-bold text-gray-700">{leadName} | +{country_code}-{phone_number}</p>

      <div className="mb-5">
        <TextInput name="lead_summary" label="Lead Summary" control={control} />
      </div>
      {/* Basic Information */}
      <div className="grid grid-cols-3 gap-4 mt-0">
        <DatePicker name="last_contact_date" label="Last Contact Date" control={control} />
        <DatePicker name="followup_date" label="Follow-up Date" control={control} />
      </div>
      
      
      <div>
          <ToggleGroupInput name="importance" label="Importance" control={control} options={importanceOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips mb-5" />
          <ToggleGroupInput name="wealth_level" label="Wealth" control={control} options={wealthLevelOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips mb-5" />
          <ToggleGroupInput name="lead_progression" label="Lead Stage" control={control} options={leadProgressionOptions}  valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips mb-5"/>
      </div>

      
      
      <Button type="submit" className="w-full">Update Lead</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditLeadTagsButton({ 
  leadData,
  leadId,  
  importanceOptions,
  leadProgressionOptions,
  wealthLevelOptions,
  leadName,
  country_code,
  phone_number
}: { 
  leadData: any;
  leadId: number;  
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
  leadName: string;
  country_code: string;
  phone_number: string;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!leadId) {
    console.error('leadId is required but not provided');
  }

  // Convert lead data to LeadsTaggingValues format
  const leadUpdateData: LeadsTagShortValues = {
    last_contact_date: leadData.last_contact_date ?? null,
    followup_date: leadData.followup_date ?? null,
    importance: leadData.importance ?? "",
    lead_progression: leadData.lead_progression ?? "",
    wealth_level: leadData.wealth_level ?? "",
    lead_summary: leadData.lead_summary ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-gray-500 hover:bg-gray-200 hover:underline font-bold cursor-pointer inline-flex items-center"
        >
          |_T_ 
        </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Lead Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditLeadTagsForm
                initialData={leadUpdateData}
                id={leadId}  
                onSuccess={() => setShowEditSheet(false)}
                importanceOptions={importanceOptions}
                leadProgressionOptions={leadProgressionOptions}
                wealthLevelOptions={wealthLevelOptions}
                leadName={leadName}
                country_code={country_code}
                phone_number={phone_number}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
