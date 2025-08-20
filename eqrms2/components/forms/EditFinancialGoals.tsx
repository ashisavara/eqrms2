'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { FinGoalsSchema, FinGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, DatePicker, TextArea, ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function EditFinGoalsForm({initialData, id, onSuccess}: {initialData: FinGoalsValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: FinGoalsValues = {
        goal_name: initialData?.goal_name || "",
        goal_description: initialData?.goal_description || "",
        goal_date: initialData?.goal_date || new Date(),
        exp_returns: initialData?.exp_returns || 0,
        inflation_rate: initialData?.inflation_rate || 0,
        fv_goals: initialData?.fv_goals || 0
    };

    const { control, handleSubmit} = useForm<FinGoalsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(FinGoalsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('fin_goals', 'goal_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("goal updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update goal. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <div className="grid grid-cols-3 gap-4">
                <TextInput name="goal_name" label="Goal Name" control={control} />
                <TextInput name="fv_goals" label="Future Value Goals" control={control} />
                <DatePicker name="goal_date" label="Goal Date" control={control} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextInput name="exp_returns" label="Expected Returns" control={control} />
                <TextInput name="inflation_rate" label="Inflation Rate" control={control} />
            </div>
            <TextArea name="goal_description" label="Goal Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditFinGoalsButton({ 
  goalData,
  goalId
}: { 
  goalData: any;
  goalId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!goalId) {
    console.error('Asset class data is missing asset_class_id:', goalData);
  }

  // Convert goal data to FinGoalsValues format
  const goalUpdateData: FinGoalsValues = {
    goal_name: goalData.goal_name ?? "",
    goal_description: goalData.goal_description ?? "",
    goal_date: goalData.goal_date ?? new Date(),
    exp_returns: goalData.exp_returns ?? 0,
    inflation_rate: goalData.inflation_rate ?? 0,
    fv_goals: goalData.fv_goals ?? 0
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Edit Goal 
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Asset Class Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditFinGoalsForm
                initialData={goalUpdateData}
                id={goalId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
