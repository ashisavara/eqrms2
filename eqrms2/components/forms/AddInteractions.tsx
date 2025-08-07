'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { MeetingNoteSchema, MeetingNoteValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, BooleanToggleInput, ToggleGroupInput, SelectInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow, supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";

// Field extraction arrays
const INTERACTION_FIELDS = [
  'meeting_name', 'meeting_notes', 'meeting_summary',
  'interaction_type', 'interaction_tag', 'interaction_channel',
  'show_to_client'
] as const;

const LEAD_FIELDS = [
  'lead_summary', 'followup_date',
  'importance', 'wealth_level', 'lead_progression'
] as const;

// Field extraction functions
function extractInteractionFields(formData: MeetingNoteValues) {
  const interactionData: any = {};
  
  INTERACTION_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      interactionData[field] = formData[field];
    }
  });
  
  return interactionData;
}

function extractLeadFields(formData: MeetingNoteValues) {
  const leadData: any = {};
  
  LEAD_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      leadData[field] = formData[field];
    }
  });
  
  return leadData;
}

// Internal form component
function AddInteractionForm({
  onSuccess, 
  interactionTypeOptions, 
  interactionTagOptions, 
  interactionChannelOptions,
  relLeadId,
  initialLeadData,
  importanceOptions,
  leadProgressionOptions,
  wealthLevelOptions
}: {
  onSuccess: () => void,
  interactionTypeOptions: { value: string; label: string }[],
  interactionTagOptions: { value: string; label: string }[],
  interactionChannelOptions: { value: string; label: string }[],
  relLeadId?: number,
  initialLeadData?: any,
  importanceOptions: { value: string; label: string }[],
  leadProgressionOptions: { value: string; label: string }[],
  wealthLevelOptions: { value: string; label: string }[]
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values - empty interaction, pre-populated lead data
  const defaultData: MeetingNoteValues = {
    // Interaction fields (empty for new interaction)
    interaction_channel: "WA",
    interaction_tag: "",
    interaction_type: "",
    meeting_name: "",
    meeting_notes: "",
    meeting_summary: "",
    show_to_client: false,
    
    // Lead fields (pre-populated from current lead data)
    followup_date: initialLeadData?.followup_date ? new Date(initialLeadData.followup_date) : null,
    importance: initialLeadData?.importance ?? null,
    lead_progression: initialLeadData?.lead_progression ?? null,
    wealth_level: initialLeadData?.wealth_level ?? null,
    lead_summary: initialLeadData?.lead_summary ?? null,
  };

  const { control, handleSubmit } = useForm<MeetingNoteValues>({
    defaultValues: defaultData,
    resolver: zodResolver(MeetingNoteSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    // Extract interaction and lead data
    const interactionData = extractInteractionFields(data);
    const leadData = extractLeadFields(data);
    
    try {
      // Step 1: Insert interaction
      const insertData = relLeadId ? { ...interactionData, rel_lead_id: relLeadId } : interactionData;
      await supabaseInsertRow('meeting_notes', insertData);
      
      // Step 2: Update lead (if we have lead data and relLeadId)
      if (relLeadId && Object.keys(leadData).length > 0) {
        try {
          // Convert Date objects to ISO strings for Supabase
                      const processedLeadData = {
              ...leadData,
              followup_date: toLocalDateString(leadData.followup_date),
            };
          
          await supabaseUpdateRow('leads_tagging', 'lead_id', relLeadId, processedLeadData);
          
          if (typeof window !== "undefined") {
            toast.success("Interaction added and lead updated successfully!");
            setTimeout(() => {
              onSuccess?.();
              router.refresh();
            }, 1500);
          }
          
        } catch (leadError) {
          console.error('Lead update failed:', leadError);
          if (typeof window !== "undefined") {
            toast.error("Interaction was saved successfully, but lead update failed. Please update lead information manually.");
          }
          setIsLoading(false);
        }
      } else {
        // Only interaction was saved
        if (typeof window !== "undefined") {
          toast.success("Interaction created successfully!");
          setTimeout(() => {
            onSuccess?.();
            router.refresh();
          }, 1500);
        }
      }
      
    } catch (interactionError) {
      console.error('Error creating Interaction:', interactionError);
      if (typeof window !== "undefined") {
        toast.error("Failed to create Interaction. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      {/* Section 1: Interaction Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Interaction Details</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <TextInput name="meeting_name" label="Meeting Name" control={control} /> 
          <ToggleGroupInput name="interaction_type" label="Interaction Type" control={control} options={interactionTypeOptions} className="ime-choice-chips" />      
          <BooleanToggleInput name="show_to_client" label="Show to Client" control={control} />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <SelectInput name="interaction_tag" label="Interaction Tag" control={control} options={interactionTagOptions} />
          <SelectInput name="interaction_channel" label="Interaction Channel" control={control} options={interactionChannelOptions} />
        </div>
        
        <TextInput name="meeting_summary" label="Meeting Summary" control={control} />
        
        <ResizableTextArea name="meeting_notes" label="Meeting Notes" control={control} />
      </div>

      {/* Section 2: Update Lead Details (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Update Lead Details (Optional)</h3>
        
        <div className="mb-5">
          <TextInput name="lead_summary" label="Lead Summary" control={control} />
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-0">
          <DatePicker name="followup_date" label="Follow-up Date" control={control} />
          <SelectInput name="importance" label="Importance" control={control} options={importanceOptions} />
          <SelectInput name="wealth_level" label="Wealth" control={control} options={wealthLevelOptions} />
          <SelectInput name="lead_progression" label="Lead Stage" control={control} options={leadProgressionOptions} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Interaction & Update Lead'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddInteractionButton({ 
  interactionTypeOptions, 
  interactionTagOptions, 
  interactionChannelOptions,
  relLeadId,
  initialLeadData,
  importanceOptions,
  leadProgressionOptions,
  wealthLevelOptions
}: { 
  interactionTypeOptions: { value: string; label: string }[];
  interactionTagOptions: { value: string; label: string }[];
  interactionChannelOptions: { value: string; label: string }[];
  relLeadId?: number;
  initialLeadData?: any;
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-red-600 hover:bg-red-200 hover:underline cursor-pointer inline-flex items-center"
      >
        |_M_
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Interaction</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddInteractionForm
                onSuccess={() => setShowAddSheet(false)}
                interactionTypeOptions={interactionTypeOptions}
                interactionTagOptions={interactionTagOptions}
                interactionChannelOptions={interactionChannelOptions}
                relLeadId={relLeadId}
                initialLeadData={initialLeadData}
                importanceOptions={importanceOptions}
                leadProgressionOptions={leadProgressionOptions}
                wealthLevelOptions={wealthLevelOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
