'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LeadsTaggingSchema, LeadsTaggingValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, DatePicker, BooleanToggleInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function AddLeadForm({ 
  onSuccess,
  importanceOptions,
  leadProgressionOptions,
  leadSourceOptions,
  leadTypeOptions,
  wealthLevelOptions
}: { 
  onSuccess?: () => void;
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  leadSourceOptions: { value: string; label: string }[];
  leadTypeOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default empty values for new lead
  const defaultData: LeadsTaggingValues = {
    lead_name: "",
    last_contact_date: null,
    followup_date: null,
    importance: "",
    lead_progression: "",
    lead_source: "",
    lead_type: "",
    wealth_level: "",
    first_name: "",
    last_name: "",
    linkedin_url: "",
    phone_validated: false,
    email_validated: false,
    country_code: "",
    phone_number: "",
    email_1: "",
    email_2: "",
    email_3: "",
    lead_summary: "",
    lead_background: "",
    primary_rm: ""
  };

  const { control, handleSubmit, formState: { errors } } = useForm<LeadsTaggingValues>({
    defaultValues: defaultData,
    resolver: zodResolver(LeadsTaggingSchema),
  });

  const onSubmit = async (data: LeadsTaggingValues) => {
    setIsLoading(true);
    try {
      // Convert Date objects to ISO strings for Supabase
      const processedData = {
        lead_name: data.lead_name,
        last_contact_date: data.last_contact_date instanceof Date ? data.last_contact_date.toISOString() : data.last_contact_date,
        followup_date: data.followup_date instanceof Date ? data.followup_date.toISOString() : data.followup_date,
        importance: data.importance,
        lead_progression: data.lead_progression,
        lead_source: data.lead_source,
        lead_type: data.lead_type,
        wealth_level: data.wealth_level,
        first_name: data.first_name,
        last_name: data.last_name,
        linkedin_url: data.linkedin_url,
        country_code: data.country_code,
        phone_number: data.phone_number,
        email_1: data.email_1,
        email_2: data.email_2,
        email_3: data.email_3,
        lead_summary: data.lead_summary,
        lead_background: data.lead_background,
        primary_rm: data.primary_rm,
        phone_validated: data.phone_validated,
        email_validated: data.email_validated,
      };
      
      await supabaseInsertRow('leads_tagging', processedData);
      
      if (typeof window !== "undefined") {
        toast.success("Lead created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to create lead. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-3 gap-4 !mt-0">
        <TextInput name="lead_name" label="Lead Name" control={control} placeholder="Enter lead name" />
        <DatePicker name="last_contact_date" label="Last Contact Date" control={control} />
        <DatePicker name="followup_date" label="Follow-up Date" control={control} />
      </div>
      <TextInput name="lead_summary" label="Lead Summary" control={control} />
      
      <div className="bg-gray-100 p-4">
        <ToggleGroupInput name="importance" label="Importance" control={control} options={importanceOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />

        <div className="grid grid-cols-5 gap-4">
          <SelectInput name="wealth_level" label="Wealth" control={control} options={wealthLevelOptions} />
          <SelectInput name="lead_progression" label="Lead Stage" control={control} options={leadProgressionOptions} />
          <SelectInput name="lead_source" label="Lead Source" control={control} options={leadSourceOptions} />
          <SelectInput name="lead_type" label="Lead Type" control={control} options={leadTypeOptions} />
          <TextInput name="primary_rm" label="Primary RM" control={control} placeholder="Relationship Manager" />
        </div>
      </div>
      {/* Categorization Fields with Options */}
      
      <ResizableTextArea name="lead_background" label="Lead Background" control={control} />

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <TextInput name="first_name" label="First Name" control={control} placeholder="Enter first name" />
        <TextInput name="last_name" label="Last Name" control={control} placeholder="Enter last name" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <BooleanToggleInput name="phone_validated" label="Phone Validated" control={control} />
        <TextInput name="country_code" label="Country Code" control={control} placeholder="+1" />
        <TextInput name="phone_number" label="Phone Number" control={control} placeholder="Enter phone number" />
        <TextInput name="linkedin_url" label="LinkedIn URL" control={control} placeholder="LinkedIn profile URL" />
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <BooleanToggleInput name="email_validated" label="Email Validated" control={control} />
        <TextInput name="email_1" label="Primary Email" control={control} type="email" placeholder="Enter primary email" />
        <TextInput name="email_2" label="Secondary Email" control={control} type="email" placeholder="Enter secondary email" />
        <TextInput name="email_3" label="Tertiary Email" control={control} type="email" placeholder="Enter tertiary email" />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Lead'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddLeadButton({ 
  importanceOptions,
  leadProgressionOptions,
  leadSourceOptions,
  leadTypeOptions,
  wealthLevelOptions
}: { 
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  leadSourceOptions: { value: string; label: string }[];
  leadTypeOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-green-600 hover:bg-green-200 hover:underline cursor-pointer inline-flex items-center"
      >
        + Add Lead
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Lead</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddLeadForm
                onSuccess={() => setShowAddSheet(false)}
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
