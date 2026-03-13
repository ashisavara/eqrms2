

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
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { CrmHelperText } from "@/components/uiComponents/crm-helper-text";

// Field extraction arrays
const INTERACTION_FIELDS = [
  'meeting_name', 'meeting_notes', 'meeting_summary',
  'interaction_type', 'interaction_tag', 'interaction_channel',
  'show_to_client'
] as const;

const LEAD_FIELDS = [
  'lead_summary', 'followup_date',
  'importance', 'wealth_level'
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
function EditInteractionForm(
    {initialData, id, onSuccess, relLeadId, initialLeadData}: 
    {initialData: MeetingNoteValues | null, id: number, onSuccess: () => void, relLeadId?: number, initialLeadData?: any}) 
    {
    // Get options from context (all options available in MasterOptionsContext)
    const masterOptions = useMasterOptions();
    const interestOptions = transformToValueLabel(masterOptions.interest);
    const importanceOptions = transformToValueLabel(masterOptions.importance);
    const leadProgressionOptions = transformToValueLabel(masterOptions.leadProgression);
    const wealthLevelOptions = transformToValueLabel(masterOptions.wealthLevel);
    const interactionTypeOptions = transformToValueLabel(masterOptions.interactionType);
    const interactionTagOptions = transformToValueLabel(masterOptions.interactionTag);
    const interactionChannelOptions = transformToValueLabel(masterOptions.interactionChannelTag);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: MeetingNoteValues = {
      // Interaction fields (from existing interaction data)
      interaction_channel: initialData?.interaction_channel || "",
      interaction_tag: initialData?.interaction_tag || "",
      interaction_type: initialData?.interaction_type || "",
      meeting_name: initialData?.meeting_name || "",
      meeting_notes: initialData?.meeting_notes || "",
      meeting_summary: initialData?.meeting_summary || "",
      show_to_client: initialData?.show_to_client || false,
      
      // Lead fields (pre-populated from current lead data)
      followup_date: initialLeadData?.followup_date ? new Date(initialLeadData.followup_date) : null,
      interest: initialLeadData?.interest ?? null,
      importance: initialLeadData?.importance ?? null,
      wealth_level: initialLeadData?.wealth_level ?? null,
      lead_summary: initialLeadData?.lead_summary ?? null,
    };

    const { control, handleSubmit} = useForm<MeetingNoteValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(MeetingNoteSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        
        // Extract interaction and lead data
        const interactionData = extractInteractionFields(data);
        const leadData = extractLeadFields(data);
        
        try {
            // Step 1: Update interaction
            await supabaseUpdateRow('meeting_notes', 'meeting_id', id, interactionData);
            
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
                        toast.success("Interaction and lead updated successfully!");
                        setTimeout(() => {
                            onSuccess?.();
                            router.refresh();
                        }, 1500);
                    }
                    
                } catch (leadError) {
                    console.error('Lead update failed:', leadError);
                    if (typeof window !== "undefined") {
                        toast.error("Interaction was updated successfully, but lead update failed. Please update lead information manually.");
                    }
                    setIsLoading(false);
                }
            } else {
                // Only interaction was updated
                if (typeof window !== "undefined") {
                    toast.success("Interaction updated successfully!");
                    setTimeout(() => {
                        onSuccess?.();
                        router.refresh();
                    }, 1500);
                }
            }
            
        } catch (interactionError) {
            console.error('Error updating Interaction:', interactionError);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Interaction. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <CrmHelperText />

            {/* Section 1: Interaction Details */}
            <div className="space-y-4">


                <div className="grid grid-cols-2 gap-4">
                  <TextInput name="meeting_name" label="Meeting Name" control={control} />   
                  <DatePicker name="followup_date" label="Follow-up Date" control={control} />
                </div>
            
              
                <ToggleGroupInput name="interaction_tag" label="Interaction Tag" control={control} options={interactionTagOptions} itemClassName="ime-choice-chips" /> 
                
                <TextInput name="meeting_summary" label="Meeting Summary" control={control} />
                
                <ResizableTextArea name="meeting_notes" label="Meeting Notes" control={control} />
            </div>

            <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Interaction & Update Lead'}
                </Button>


            {/* Section 2: Update Lead Details (Optional) */}
            <div className="space-y-4 mt-6 border-t-2 bg-gray-100 p-4">
                <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Update Lead Details (Optional)</h3>
                
                <div className="mb-5">
                  <TextInput name="lead_summary" label="Lead Summary" control={control} />
                </div>
                
                <div>
                  <ToggleGroupInput name="interest" label="Interest (if can assess)" control={control} options={interestOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />
                  <ToggleGroupInput name="importance" label="Importance/Urgency" control={control} options={importanceOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />
                  <ToggleGroupInput name="wealth_level" label="Wealth" control={control} options={wealthLevelOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />
                </div>
            </div>


          
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditInteractionButton({ 
  interactionData,
  meetingId, 
  relLeadId,
  initialLeadData,
  children
}: { 
  interactionData: any;
  meetingId: number;
  relLeadId?: number;
  initialLeadData?: any;
  children?: React.ReactNode;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!meetingId) {
    console.error('Interaction data is missing meeting_id:', interactionData);
  }

  // Convert interaction data to MeetingNoteValues format
  const interactionUpdateData: MeetingNoteValues = {
    // Interaction fields (from existing interaction data)
    interaction_channel: interactionData.interaction_channel ?? "",
    interaction_tag: interactionData.interaction_tag ?? "",
    interaction_type: interactionData.interaction_type ?? "",
    meeting_name: interactionData.meeting_name ?? "",
    meeting_notes: interactionData.meeting_notes ?? "",
    meeting_summary: interactionData.meeting_summary ?? "",
    show_to_client: interactionData.show_to_client ?? false,
    
    // Lead fields (will be pre-populated in the form)
    followup_date: null,
    interest: null,
    importance: null,
    wealth_level: null,
    lead_summary: null,
  };

  return (
    <>
            <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 hover:underline hover:font-bold cursor-pointer"
      >
        {children || interactionData.interaction_type}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Interaction Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditInteractionForm
                initialData={interactionUpdateData}
                id={meetingId}
                onSuccess={() => setShowEditSheet(false)}
                relLeadId={relLeadId}
                initialLeadData={initialLeadData}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
