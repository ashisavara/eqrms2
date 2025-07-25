'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fundsUpdateSchema, FundsUpdateValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditFundsForm({ 
  initialData, 
  fund_id,  // Add explicit fund_id prop
  onSuccess,
  openSubsOptions,
  strategyTagOptions
}: { 
  initialData: FundsUpdateValues; 
  fund_id: number;  // Add type for fund_id
  onSuccess?: () => void;
  openSubsOptions: { value: string; label: string }[];
  strategyTagOptions: { value: string; label: string }[];
}) {  
  // Convert null values to empty strings for form inputs
  const cleanedData: FundsUpdateValues = {
    fund_rating: initialData.fund_rating ?? 0,
    fund_performance_rating: initialData.fund_performance_rating ?? 0,
    fund_strategy_rating: initialData.fund_strategy_rating ?? 0,
    open_for_subscription: initialData.open_for_subscription ?? "",
    recommendation_tag: initialData.recommendation_tag ?? "",
    strategy_tag: initialData.strategy_tag ?? "",
    strategy_name: initialData.strategy_name ?? "",
    investment_view: initialData.investment_view ?? "",
    strategy_view: initialData.strategy_view ?? "",
    additional_performance_view: initialData.additional_performance_view ?? "",
    oth_salient_points: initialData.oth_salient_points ?? "",
  };

  const { control, handleSubmit } = useForm<FundsUpdateValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(fundsUpdateSchema),
  });

  const onSubmit = async (data: FundsUpdateValues) => {
    try {
      if (!fund_id) {
        throw new Error('fund_id is required for updates');
      }
      
      await supabaseUpdateRow('rms_funds', 'fund_id', fund_id, data);
      
      if (typeof window !== "undefined") {
        toast.success("Fund updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating fund");
      }
    }
  };

  const ratingOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Rating Fields with Toggle Groups */}
      <ToggleGroupInput name="fund_rating" label="Fund Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips" />
      <ToggleGroupInput name="fund_performance_rating" label="Performance Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      <ToggleGroupInput name="fund_strategy_rating" label="Strategy Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      
      <ToggleGroupInput 
        name="open_for_subscription" 
        label="Open for Subscription" 
        control={control} 
        options={openSubsOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="!rounded-full border border-gray-300 px-4 py-2 min-w-fit whitespace-nowrap hover:bg-gray-100 hover:border-gray-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 data-[state=on]:hover:bg-blue-700 transition-all duration-200"
      />
      <TextInput name="recommendation_tag" label="Recommendation Tag" control={control} />
      <ToggleGroupInput 
        name="strategy_tag" 
        label="Strategy Tag" 
        control={control} 
        options={strategyTagOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      <TextInput name="strategy_name" label="Strategy Name" control={control} />
      
      <div>
        <h4 className="font-bold mt-5 border-t-2 border-b-2 border-gray-300">Investment Views</h4>
        <ResizableTextArea name="investment_view" label="Investment View" control={control} />
        <ResizableTextArea name="strategy_view" label="Strategy View" control={control} />
        <ResizableTextArea name="additional_performance_view" label="Additional Performance View" control={control} />
        <ResizableTextArea name="oth_salient_points" label="Other Salient Points" control={control} />
      </div>
      
      <Button type="submit" className="w-full">Update Fund</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditFundsButton({ 
  fundData,
  openSubsOptions,
  strategyTagOptions
}: { 
  fundData: any;
  openSubsOptions: { value: string; label: string }[];
  strategyTagOptions: { value: string; label: string }[];
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Get fund_id from fundData
  const fund_id = fundData.fund_id;
  if (!fund_id) {
    console.error('Fund data is missing fund_id:', fundData);
  }

  // Convert fund data to FundsUpdateValues format
  const fundUpdateData: FundsUpdateValues = {
    fund_rating: fundData.fund_rating ?? 0,
    fund_performance_rating: fundData.fund_performance_rating ?? 0,
    fund_strategy_rating: fundData.fund_strategy_rating ?? 0,
    open_for_subscription: fundData.open_for_subscription ?? "",
    recommendation_tag: fundData.recommendation_tag ?? "",
    strategy_tag: fundData.strategy_tag ?? "",
    strategy_name: fundData.strategy_name ?? "",
    investment_view: fundData.investment_view ?? "",
    strategy_view: fundData.strategy_view ?? "",
    additional_performance_view: fundData.additional_performance_view ?? "",
    oth_salient_points: fundData.oth_salient_points ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
         Fund View |  
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Fund Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditFundsForm
                initialData={fundUpdateData}
                fund_id={fund_id}  // Pass fund_id explicitly
                onSuccess={() => setShowEditSheet(false)}
                openSubsOptions={openSubsOptions}
                strategyTagOptions={strategyTagOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
