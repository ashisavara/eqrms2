'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { DealsSchema, DealsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, ToggleGroupInput, DatePicker} from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow, supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { CircleDollarSign } from "lucide-react";

// Field extraction arrays
const DEAL_FIELDS = [
  'rel_lead_id', 'deal_name', 'est_closure', 'deal_likelihood',
  'deal_stage', 'deal_segment', 'total_deal_aum', 'deal_summary'
] as const;

const LEAD_FIELDS = [
  'lead_summary', 'followup_date',
  'importance', 'wealth_level', 'lead_progression'
] as const;

// Field extraction functions
function extractDealFields(formData: DealsValues) {
  const dealData: any = {};
  
  DEAL_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      dealData[field] = formData[field];
    }
  });
  
  return dealData;
}

function extractLeadFields(formData: DealsValues) {
  const leadData: any = {};
  
  LEAD_FIELDS.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      leadData[field] = formData[field];
    }
  });
  
  return leadData;
}

// Internal form component
function AddDealForm({
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
  const dealEstClosureOptions = transformToValueLabel(masterOptions.dealEstClosure);
  const dealStageOptions = transformToValueLabel(masterOptions.dealStage);
  const dealSegmentOptions = transformToValueLabel(masterOptions.dealSegment);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values - empty deal, pre-populated lead data
  const defaultData: DealsValues = {
    // Deal fields (empty for new deal)
    rel_lead_id: relLeadId || null,
    deal_name: "",
    est_closure: "",
    deal_likelihood: 0,
    deal_stage: "",
    deal_segment: "",
    total_deal_aum: 0,
    deal_summary: "",
    
    // Lead fields (pre-populated from current lead data)
    followup_date: initialLeadData?.followup_date ? new Date(initialLeadData.followup_date) : null,
    importance: initialLeadData?.importance ?? null,
    lead_progression: initialLeadData?.lead_progression ?? null,
    wealth_level: initialLeadData?.wealth_level ?? null,
    lead_summary: initialLeadData?.lead_summary ?? null,
  };

  const { control, handleSubmit } = useForm<DealsValues>({
    defaultValues: defaultData,
    resolver: zodResolver(DealsSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    // Extract deal and lead data
    const dealData = extractDealFields(data);
    const leadData = extractLeadFields(data);
    
    try {
      // Step 1: Insert deal
      await supabaseInsertRow('deals', dealData);
      
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
            toast.success("Deal added and lead updated successfully!");
            setTimeout(() => {
              onSuccess?.();
              router.refresh();
            }, 1500);
          }
          
        } catch (leadError) {
          console.error('Lead update failed:', leadError);
          if (typeof window !== "undefined") {
            toast.error("Deal was saved successfully, but lead update failed. Please update lead information manually.");
          }
          setIsLoading(false);
        }
      } else {
        // Only deal was saved
        if (typeof window !== "undefined") {
          toast.success("Deal created successfully!");
          setTimeout(() => {
            onSuccess?.();
            router.refresh();
          }, 1500);
        }
      }
      
    } catch (dealError) {
      console.error('Error creating Deal:', dealError);
      if (typeof window !== "undefined") {
        toast.error("Failed to create Deal. Please try again.");
      }
      setIsLoading(false);
    }
  });

  const likelihoodOptions = [
    { value: "1", label: "1" },
    { value: "0.8", label: "0.8" },
    { value: "0.6", label: "0.6" },
    { value: "0.4", label: "0.4" },
    { value: "0.2", label: "0.2" },
    { value: "0", label: "0" },
  ];

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      {/* Section 1: Deal Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Deal Details</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <TextInput name="deal_name" label="Deal Name" control={control} />
          <TextInput name="total_deal_aum" label="Deal AUM (Rs.cr)" control={control} />
          <ToggleGroupInput name="deal_likelihood" label="Deal Likelihood" control={control} options={likelihoodOptions} className="ime-choice-chips" />          
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectInput name="est_closure" label="Est. Closure" control={control} options={dealEstClosureOptions} />
          <SelectInput name="deal_stage" label="Deal Stage" control={control} options={dealStageOptions} />
          <SelectInput name="deal_segment" label="Deal Segment" control={control} options={dealSegmentOptions} />
        </div>
        
        <ResizableTextArea name="deal_summary" label="Deal Summary" control={control} />
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
          {isLoading ? 'Creating...' : 'Create Deal & Update Lead'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddDealButton({ 
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
        >   <CircleDollarSign className="w-4 h-4 mr-2" /> Add Deal
        </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Deal</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddDealForm
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
