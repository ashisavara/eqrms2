
  'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { DealsSchema, DealsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, ToggleGroupInput} from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditDealForm({initialData, id, onSuccess, dealEstClosureOptions, dealStageOptions, dealSegmentOptions}: 
    {initialData: DealsValues | null, 
        id: number, 
        onSuccess: () => void, 
        dealEstClosureOptions: { value: string; label: string }[], 
        dealStageOptions: { value: string; label: string }[], 
        dealSegmentOptions: { value: string; label: string }[]})
    {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: DealsValues = {
        rel_lead_id: initialData?.rel_lead_id || 0,
        deal_name: initialData?.deal_name || "",
        est_closure: initialData?.est_closure || "",
        deal_likelihood: initialData?.deal_likelihood || 0,
        deal_stage: initialData?.deal_stage || "",
        deal_segment: initialData?.deal_segment || "",
        total_deal_aum: initialData?.total_deal_aum || 0,
        deal_summary: initialData?.deal_summary || "",
    };

    const { control, handleSubmit} = useForm<DealsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(DealsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('deals', 'deal_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Deal updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh(); // Refresh server data without resetting client state
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Deal:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Deal. Please try again.");
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

            <div className="grid grid-cols-3 gap-4">
                <TextInput name="deal_name" label="Deal Name" control={control} />
                <TextInput name="total_deal_aum" label="Total Deal AUM" control={control} />
                <ToggleGroupInput name="deal_likelihood" label="Deal Likelihood" control={control} options={likelihoodOptions} />          
            </div>

            <div className="grid grid-cols-3 gap-4">
                <SelectInput name="est_closure" label="Est. Closure" control={control} options={dealEstClosureOptions} />
                <SelectInput name="deal_stage" label="Deal Stage" control={control} options={dealStageOptions} />
                <SelectInput name="deal_segment" label="Deal Segment" control={control} options={dealSegmentOptions} />
            </div>
            
            <ResizableTextArea name="deal_summary" label="Deal Summary" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditDealButton({ 
  dealData,
  dealId, 
  dealEstClosureOptions,
  dealStageOptions,
  dealSegmentOptions
}: { 
  dealData: any;
  dealId: number;
  dealEstClosureOptions: { value: string; label: string }[];
  dealStageOptions: { value: string; label: string }[];
  dealSegmentOptions: { value: string; label: string }[];
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!dealId) {
    console.error('Deal Data is missing deal_id:', dealData);
  }

  // Convert category data to DealsValues format
  const dealUpdateData: DealsValues = {
    rel_lead_id: dealData.rel_lead_id ?? "",
    deal_name: dealData.deal_name ?? "",
    est_closure: dealData.est_closure ?? "",
    deal_likelihood: dealData.deal_likelihood ?? "",
    deal_stage: dealData.deal_stage ?? "",
    deal_segment: dealData.deal_segment ?? "",
    total_deal_aum: dealData.total_deal_aum ?? "",
    deal_summary: dealData.deal_summary ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 cursor-pointer text-left font-bold hover:underline"
      >
        {dealData.deal_name}  
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Deal Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditDealForm
                initialData={dealUpdateData}
                id={dealId}
                onSuccess={() => setShowEditSheet(false)}
                dealEstClosureOptions={dealEstClosureOptions}
                dealStageOptions={dealStageOptions}
                dealSegmentOptions={dealSegmentOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}