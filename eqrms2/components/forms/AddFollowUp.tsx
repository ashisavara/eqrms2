'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { FollowUpSchema, FollowUpValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, ToggleGroupInput, SelectInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow, supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { Clock } from "lucide-react";

// Field extraction arrays
const INTERACTION_FIELDS = [
  'interaction_type', 'interaction_channel'
] as const;

const LEAD_FIELDS = [
  'lead_summary', 'followup_date',
  'importance', 'wealth_level', 'lead_progression'
] as const;

// Field extraction functions
function extractInteractionFields(formData: FollowUpValues) {
  const interactionData: any = {};
  
  INTERACTION_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      interactionData[field] = formData[field];
    }
  });
  
  return interactionData;
}

function extractLeadFields(formData: FollowUpValues) {
  const leadData: any = {};
  
  LEAD_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      leadData[field] = formData[field];
    }
  });
  
  return leadData;
}

// Internal form component
function AddFollowUpForm({
  onSuccess, 
  relLeadId,
  initialLeadData
}: {
  onSuccess: () => void,
  relLeadId?: number,
  initialLeadData?: any
}) {
  // Get options from context (all options available in MasterOptionsContext)
  const masterOptions = useMasterOptions();
  const importanceOptions = transformToValueLabel(masterOptions.importance);
  const leadProgressionOptions = transformToValueLabel(masterOptions.leadProgression);
  const wealthLevelOptions = transformToValueLabel(masterOptions.wealthLevel);
  const interactionChannelOptions = transformToValueLabel(masterOptions.interactionChannelTag);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values - empty interaction, pre-populated lead data
  const defaultData: FollowUpValues = {
    // Interaction fields (empty for new follow-up)
    interaction_channel: "WA",
    interaction_type: "Follow up",
    
    // Lead fields (pre-populated from current lead data)
    followup_date: initialLeadData?.followup_date ? new Date(initialLeadData.followup_date) : null,
    importance: initialLeadData?.importance ?? null,
    lead_progression: initialLeadData?.lead_progression ?? null,
    wealth_level: initialLeadData?.wealth_level ?? null,
    lead_summary: initialLeadData?.lead_summary ?? null,
  };

  const { control, handleSubmit } = useForm<FollowUpValues>({
    defaultValues: defaultData,
    resolver: zodResolver(FollowUpSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    // Extract interaction and lead data
    const interactionData = extractInteractionFields(data);
    const leadData = extractLeadFields(data);
    
    try {
      // Step 1: Insert interaction
      const insertData = relLeadId ? { ...interactionData, rel_lead_id: relLeadId } : interactionData;
      // Debug payload for meeting_notes insert
      // eslint-disable-next-line no-console
      console.log('[AddFollowUp] meeting_notes insertData:', insertData);
      await supabaseInsertRow('meeting_notes', insertData);
      
      // Step 2: Update lead (if we have lead data and relLeadId)
      if (relLeadId && Object.keys(leadData).length > 0) {
        try {
          // Convert Date objects to ISO strings for Supabase
          const processedLeadData = {
              ...leadData,
              followup_date: toLocalDateString(leadData.followup_date),
            };
          // Debug payload for leads_tagging update
          // eslint-disable-next-line no-console
          console.log('[AddFollowUp] leads_tagging update:', { lead_id: relLeadId, payload: processedLeadData });
          
          await supabaseUpdateRow('leads_tagging', 'lead_id', relLeadId, processedLeadData);
          
          if (typeof window !== "undefined") {
            toast.success("Follow-up added and lead updated successfully!");
            setTimeout(() => {
              onSuccess?.();
              router.refresh();
            }, 1500);
          }
          
        } catch (leadError) {
          console.error('Lead update failed:', leadError);
          if (typeof window !== "undefined") {
            toast.error("Follow-up was saved successfully, but lead update failed. Please update lead information manually.");
          }
          setIsLoading(false);
        }
      } else {
        // Only follow-up was saved
        if (typeof window !== "undefined") {
          toast.success("Follow-up created successfully!");
          setTimeout(() => {
            onSuccess?.();
            router.refresh();
          }, 1500);
        }
      }
      
    } catch (interactionError) {
      console.error('Error creating Follow-up:', interactionError);
      if (typeof window !== "undefined") {
        toast.error("Failed to create Follow-up. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      {/* Section 1: Follow-up Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Follow-up Details</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <ToggleGroupInput name="interaction_channel" label="Interaction Channel" control={control} options={interactionChannelOptions} itemClassName="ime-choice-chips" />
        </div>
      </div>

      {/* Section 2: Update Lead Details (Optional) */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-bold text-green-600 border-b pb-2">Update Lead Details (Optional)</h3>
        
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
          {isLoading ? 'Creating...' : 'Create Follow-up & Update Lead'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddFollowUpButton({ 
  relLeadId,
  initialLeadData
}: { 
  relLeadId?: number;
  initialLeadData?: any;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <Clock className="w-4 h-4 mr-2" /> Add Follow-up
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Follow-up</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddFollowUpForm
                onSuccess={() => setShowAddSheet(false)}
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
