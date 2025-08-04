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
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function AddDealForm({
  onSuccess, 
  dealEstClosureOptions, 
  dealStageOptions, 
  dealSegmentOptions,
  relLeadId
}: {
  onSuccess: () => void, 
  dealEstClosureOptions: { value: string; label: string }[], 
  dealStageOptions: { value: string; label: string }[], 
  dealSegmentOptions: { value: string; label: string }[],
  relLeadId?: number
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default empty values for new deal
  const defaultData: DealsValues = {
    rel_lead_id: relLeadId || null,
    deal_name: "",
    est_closure: "",
    deal_likelihood: 0,
    deal_stage: "",
    deal_segment: "",
    total_deal_aum: 0,
    deal_summary: "",
  };

  const { control, handleSubmit } = useForm<DealsValues>({
    defaultValues: defaultData,
    resolver: zodResolver(DealsSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await supabaseInsertRow('deals', data);
      
      if (typeof window !== "undefined") {
        toast.success("Deal created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating Deal:', error);
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
          {isLoading ? 'Creating...' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddDealButton({ 
  dealEstClosureOptions,
  dealStageOptions,
  dealSegmentOptions,
  relLeadId
}: { 
  dealEstClosureOptions: { value: string; label: string }[];
  dealStageOptions: { value: string; label: string }[];
  dealSegmentOptions: { value: string; label: string }[];
  relLeadId?: number;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-green-600 hover:bg-green-200 hover:underline cursor-pointer inline-flex items-center"
        >   |_$_
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
                dealEstClosureOptions={dealEstClosureOptions}
                dealStageOptions={dealStageOptions}
                dealSegmentOptions={dealSegmentOptions}
                relLeadId={relLeadId}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
