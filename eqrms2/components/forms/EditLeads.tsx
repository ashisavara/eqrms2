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
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { Pencil } from "lucide-react";

// Internal form component
function EditLeadsForm({ 
  initialData, 
  id,  // lead_id
  onSuccess
}: { 
  initialData: LeadsTaggingValues; 
  id: number;  
  onSuccess?: () => void;
}) {
  // Get options from context (static options)
  const masterOptions = useMasterOptions();
  const importanceOptions = transformToValueLabel(masterOptions.importance);
  const leadProgressionOptions = transformToValueLabel(masterOptions.leadProgression);
  const wealthLevelOptions = transformToValueLabel(masterOptions.wealthLevel);
  // primaryRm is already in value-label format, no transformation needed
  const primaryRmOptions = masterOptions.primaryRm.map(item => ({ value: item.value, label: item.label }));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: LeadsTaggingValues = {
    lead_name: initialData.lead_name ?? "",
    last_contact_date: initialData.last_contact_date ? new Date(initialData.last_contact_date) : null,
    followup_date: initialData.followup_date ? new Date(initialData.followup_date) : null,
    importance: initialData.importance ?? "",
    lead_progression: initialData.lead_progression ?? "",
    lead_source: initialData.lead_source ?? "",
    lead_type: initialData.lead_type ?? "",
    wealth_level: initialData.wealth_level ?? "",
    first_name: initialData.first_name ?? "",
    last_name: initialData.last_name ?? "",
    linkedin_url: initialData.linkedin_url ?? "",
    phone_validated: initialData.phone_validated ?? false,
    email_validated: initialData.email_validated ?? false,
    phone_e164: initialData.phone_e164 ?? "",
    email_1: initialData.email_1 ?? "",
    email_2: initialData.email_2 ?? "",
    email_3: initialData.email_3 ?? "",
    lead_summary: initialData.lead_summary ?? "",
    lead_background: initialData.lead_background ?? "",
    primary_rm_uuid: initialData.primary_rm_uuid ?? "",
    subs_email: initialData.subs_email ?? false,
    subs_whatsapp: initialData.subs_whatsapp ?? false,
    subs_imecapital: initialData.subs_imecapital ?? false,
    subs_imepms: initialData.subs_imepms ?? false,
    referral_partner: initialData.referral_partner ?? null,
  };

  const { control, handleSubmit, formState: { errors } } = useForm<LeadsTaggingValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(LeadsTaggingSchema),
  });

  // Helper function to extract error message from Supabase errors
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Check if it's a Supabase error with a message
      const supabaseError = error as any;
      if (supabaseError.message) {
        // Supabase errors often have detailed messages
        return supabaseError.message;
      }
      // Generic Error object
      return error.message;
    }
    // Fallback for unknown error types
    return 'An unexpected error occurred. Please try again.';
  };

  // Helper function to format validation errors for display
  const getValidationErrorMessage = (errors: Record<string, any>): string => {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length === 0) {
      return 'Please fix the form errors before submitting.';
    }
    
    // Get the first error message
    const firstError = errorEntries[0];
    const fieldName = firstError[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const errorMessage = firstError[1]?.message || 'Invalid value';
    
    // If there are multiple errors, mention the count
    if (errorEntries.length > 1) {
      return `${fieldName}: ${errorMessage} (and ${errorEntries.length - 1} other error${errorEntries.length > 2 ? 's' : ''})`;
    }
    
    return `${fieldName}: ${errorMessage}`;
  };

  // Handle validation errors
  const onError = (errors: Record<string, any>) => {
    console.error('Form validation errors:', errors);
    const errorMessage = getValidationErrorMessage(errors);
    
    if (typeof window !== "undefined") {
      toast.error(`Validation failed: ${errorMessage}`);
    }
    
    // Scroll to first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
    }
  };

  const onSubmit = async (data: LeadsTaggingValues) => {
    setIsLoading(true);
    
    try {
      if (!id) {
        throw new Error('lead_id is required for updates');
      }
      
      // Convert Date objects to date strings for Supabase and filter out non-existent columns
      const processedData = {
        lead_name: data.lead_name,
        last_contact_date: toLocalDateString(data.last_contact_date),
        followup_date: toLocalDateString(data.followup_date),
        importance: data.importance,
        lead_progression: data.lead_progression,
        lead_source: data.lead_source,
        lead_type: data.lead_type,
        wealth_level: data.wealth_level,
        first_name: data.first_name,
        last_name: data.last_name,
        linkedin_url: data.linkedin_url,
        phone_e164: data.phone_e164,
        email_1: data.email_1,
        email_2: data.email_2,
        email_3: data.email_3,
        lead_summary: data.lead_summary,
        lead_background: data.lead_background,
        primary_rm_uuid: data.primary_rm_uuid || null, // Convert empty string to null for UUID field
        phone_validated: data.phone_validated,
        email_validated: data.email_validated,
        subs_email: data.subs_email,
        subs_whatsapp: data.subs_whatsapp,
        subs_imecapital: data.subs_imecapital,
        subs_imepms: data.subs_imepms,
        referral_partner: data.referral_partner || null,
      };
      
      await supabaseUpdateRow('leads_tagging', 'lead_id', id, processedData);
      
      if (typeof window !== "undefined") {
        setIsLoading(false);
        toast.success("Lead updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      const errorMessage = getErrorMessage(error);
      
      if (typeof window !== "undefined") {
        toast.error(`Failed to update lead: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full px-4 pt-4 pb-2 space-y-3">
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

          <ToggleGroupInput
            name="wealth_level"
            label="Wealth"
            control={control}
            options={wealthLevelOptions}
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
        <TextInput name="phone_e164" label="Phone Number" control={control} placeholder="+919xxxx (with country code) " />
        <TextInput name="linkedin_url" label="LinkedIn URL" control={control} placeholder="LinkedIn profile URL" />
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <BooleanToggleInput name="email_validated" label="Email Validated" control={control} />
        <TextInput name="email_1" label="Primary Email" control={control} type="email" placeholder="Enter primary email" />
        <TextInput name="email_2" label="Secondary Email" control={control} type="email" placeholder="Enter secondary email" />
        <TextInput name="email_3" label="Tertiary Email" control={control} type="email" placeholder="Enter tertiary email" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <BooleanToggleInput name="subs_email" label="Subs Email" control={control} />
        <BooleanToggleInput name="subs_whatsapp" label="Subs WhatsApp" control={control} />
        <BooleanToggleInput name="subs_imecapital" label="Subs IME Capital" control={control} />
        <BooleanToggleInput name="subs_imepms" label="Subs IME PMS" control={control} />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Lead'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditLeadsButton({ 
  leadData,
  leadId
}: { 
  leadData: any;
  leadId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!leadId) {
    console.error('leadId is required but not provided');
  }

  // Convert lead data to LeadsTaggingValues format
  const leadUpdateData: LeadsTaggingValues = {
    lead_name: leadData.lead_name ?? "",
    last_contact_date: leadData.last_contact_date ? new Date(leadData.last_contact_date) : null,
    followup_date: leadData.followup_date ? new Date(leadData.followup_date) : null,
    importance: leadData.importance ?? "",
    lead_progression: leadData.lead_progression ?? "",
    lead_source: leadData.lead_source ?? "",
    lead_type: leadData.lead_type ?? "",
    wealth_level: leadData.wealth_level ?? "",
    first_name: leadData.first_name ?? "",
    last_name: leadData.last_name ?? "",
    linkedin_url: leadData.linkedin_url ?? "",
    phone_validated: leadData.phone_validated ?? false,
    email_validated: leadData.email_validated ?? false,
    phone_e164: leadData.phone_e164 ?? "",
    email_1: leadData.email_1 ?? "",
    email_2: leadData.email_2 ?? "",
    email_3: leadData.email_3 ?? "",
    lead_summary: leadData.lead_summary ?? "",
    lead_background: leadData.lead_background ?? "",
    primary_rm_uuid: leadData.primary_rm_uuid ?? "",
    subs_email: leadData.subs_email ?? false,
    subs_whatsapp: leadData.subs_whatsapp ?? false,
    subs_imecapital: leadData.subs_imecapital ?? false,
    subs_imepms: leadData.subs_imepms ?? false,
    referral_partner: leadData.referral_partner ?? null,
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <Pencil className="w-4 h-4 mr-2" />
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
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
