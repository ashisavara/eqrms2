'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LeadsTaggingSchema, LeadsTaggingValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, DatePicker, BooleanToggleInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditLeadsForm({ 
  initialData, 
  id,  // lead_id
  onSuccess,
  importanceOptions,
  leadProgressionOptions,
  leadSourceOptions,
  leadTypeOptions,
  wealthLevelOptions
}: { 
  initialData: LeadsTaggingValues; 
  id: number;  
  onSuccess?: () => void;
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  leadSourceOptions: { value: string; label: string }[];
  leadTypeOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
}) {  
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: LeadsTaggingValues = {
    lead_name: initialData.lead_name ?? "",
    last_contact_date: initialData.last_contact_date ?? null,
    followup_date: initialData.followup_date ?? null,
    importance: initialData.importance ?? "",
    lead_progression: initialData.lead_progression ?? "",
    lead_source: initialData.lead_source ?? "",
    lead_type: initialData.lead_type ?? "",
    wealth_level: initialData.wealth_level ?? "",
    first_name: initialData.first_name ?? "",
    last_name: initialData.last_name ?? "",
    linkedin_url: initialData.linkedin_url ?? "",
    phone_valid_date: initialData.phone_valid_date ?? false,
    email_valid_date: initialData.email_valid_date ?? false,
    country_code: initialData.country_code ?? "",
    phone_number: initialData.phone_number ?? "",
    email_1: initialData.email_1 ?? "",
    email_2: initialData.email_2 ?? "",
    email_3: initialData.email_3 ?? "",
    lead_summary: initialData.lead_summary ?? "",
    lead_background: initialData.lead_background ?? "",
    primary_rm: initialData.primary_rm ?? ""
  };

  const { control, handleSubmit } = useForm<LeadsTaggingValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(LeadsTaggingSchema),
  });

  const onSubmit = async (data: LeadsTaggingValues) => {
    try {
      if (!id) {
        throw new Error('lead_id is required for updates');
      }
      
      await supabaseUpdateRow('leads_tagging', 'lead_id', id, data);
      
      if (typeof window !== "undefined") {
        toast.success("Lead updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <TextInput name="lead_name" label="Lead Name" control={control} placeholder="Enter lead name" />
      <TextInput name="first_name" label="First Name" control={control} placeholder="Enter first name" />
      <TextInput name="last_name" label="Last Name" control={control} placeholder="Enter last name" />
      
      {/* Date Fields */}
      <DatePicker name="last_contact_date" label="Last Contact Date" control={control} />
      <DatePicker name="followup_date" label="Follow-up Date" control={control} />
      
      {/* Categorization Fields with Options */}
      <ToggleGroupInput 
        name="importance" 
        label="Importance" 
        control={control} 
        options={importanceOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      <ToggleGroupInput 
        name="lead_progression" 
        label="Lead Stage" 
        control={control} 
        options={leadProgressionOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      <ToggleGroupInput 
        name="lead_source" 
        label="Lead Source" 
        control={control} 
        options={leadSourceOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      <ToggleGroupInput 
        name="lead_type" 
        label="Lead Type" 
        control={control} 
        options={leadTypeOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      <ToggleGroupInput 
        name="wealth_level" 
        label="Wealth Level" 
        control={control} 
        options={wealthLevelOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      {/* Contact Information */}
      <TextInput name="country_code" label="Country Code" control={control} placeholder="+1" />
      <TextInput name="phone_number" label="Phone Number" control={control} placeholder="Enter phone number" />
      <TextInput name="email_1" label="Primary Email" control={control} type="email" placeholder="Enter primary email" />
      <TextInput name="email_2" label="Secondary Email" control={control} type="email" placeholder="Enter secondary email" />
      <TextInput name="email_3" label="Tertiary Email" control={control} type="email" placeholder="Enter tertiary email" />
      <TextInput name="linkedin_url" label="LinkedIn URL" control={control} placeholder="LinkedIn profile URL" />
      
      {/* Validation Flags */}
      <BooleanToggleInput name="phone_valid_date" label="Phone Validated" control={control} />
      <BooleanToggleInput name="email_valid_date" label="Email Validated" control={control} />
      
      {/* Additional Information */}
      <TextInput name="primary_rm" label="Primary RM" control={control} placeholder="Relationship Manager" />
      
      {/* Text Areas for Descriptions */}
      <ResizableTextArea name="lead_summary" label="Lead Summary" control={control} />
      <ResizableTextArea name="lead_background" label="Lead Background" control={control} />
      
      <Button type="submit" className="w-full">Update Lead</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditLeadsButton({ 
  leadData,
  leadId,  
  importanceOptions,
  leadProgressionOptions,
  leadSourceOptions,
  leadTypeOptions,
  wealthLevelOptions
}: { 
  leadData: any;
  leadId: number;  
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  leadSourceOptions: { value: string; label: string }[];
  leadTypeOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!leadId) {
    console.error('leadId is required but not provided');
  }

  // Convert lead data to LeadsTaggingValues format
  const leadUpdateData: LeadsTaggingValues = {
    lead_name: leadData.lead_name ?? "",
    last_contact_date: leadData.last_contact_date ?? null,
    followup_date: leadData.followup_date ?? null,
    importance: leadData.importance ?? "",
    lead_progression: leadData.lead_progression ?? "",
    lead_source: leadData.lead_source ?? "",
    lead_type: leadData.lead_type ?? "",
    wealth_level: leadData.wealth_level ?? "",
    first_name: leadData.first_name ?? "",
    last_name: leadData.last_name ?? "",
    linkedin_url: leadData.linkedin_url ?? "",
    phone_valid_date: leadData.phone_valid_date ?? false,
    email_valid_date: leadData.email_valid_date ?? false,
    country_code: leadData.country_code ?? "",
    phone_number: leadData.phone_number ?? "",
    email_1: leadData.email_1 ?? "",
    email_2: leadData.email_2 ?? "",
    email_3: leadData.email_3 ?? "",
    lead_summary: leadData.lead_summary ?? "",
    lead_background: leadData.lead_background ?? "",
    primary_rm: leadData.primary_rm ?? ""
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
          Edit Lead
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Lead Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditLeadsForm
                initialData={leadUpdateData}
                id={leadId}  
                onSuccess={() => setShowEditSheet(false)}
                importanceOptions={importanceOptions}
                leadProgressionOptions={leadProgressionOptions}
                leadSourceOptions={leadSourceOptions}
                leadTypeOptions={leadTypeOptions}
                wealthLevelOptions={wealthLevelOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
