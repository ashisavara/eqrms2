'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fundsUpdateSchema, FundsUpdateValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";

// Internal form component
function EditFundsForm({ initialData, onSuccess }: { initialData: FundsUpdateValues; onSuccess?: () => void }) {  
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
      // Add funds_id from initialData for the update
      const updateData = {
        ...data,
        funds_id: (initialData as any).funds_id
      };
      
      if (!updateData.funds_id) {
        throw new Error('Funds_id is required for updates');
      }
      
      const response = await fetch('/api/update-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Result:', result);
      
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
      <ToggleGroupInput name="fund_rating" label="Fund Rating" control={control} options={ratingOptions} />
      <ToggleGroupInput name="fund_performance_rating" label="Performance Rating" control={control} options={ratingOptions} />
      <ToggleGroupInput name="fund_strategy_rating" label="Strategy Rating" control={control} options={ratingOptions} />
      
      <TextInput name="open_for_subscription" label="Open for Subscription" control={control} />
      <TextInput name="recommendation_tag" label="Recommendation Tag" control={control} />
      <TextInput name="strategy_tag" label="Strategy Tag" control={control} />
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
export function EditFundsButton({ fundData }: { fundData: any }) {
  const [showEditSheet, setShowEditSheet] = useState(false);

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
        Edit
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
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
