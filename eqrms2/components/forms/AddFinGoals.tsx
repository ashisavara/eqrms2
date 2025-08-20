'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { FinGoalsSchema, FinGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, DatePicker, TextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";


// Internal form component
function AddFinGoalsForm({onSuccess}: {onSuccess?: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { currentGroup } = useGroupMandate();

    // Default empty values for new goal
    const defaultData: FinGoalsValues = {
        goal_name: "",
        goal_description: "",
        goal_date: new Date(),
        exp_returns: 0,
        inflation_rate: 0,
        fv_goals: 0
    };

    const { control, handleSubmit} = useForm<FinGoalsValues>({
        defaultValues: defaultData,
        resolver: zodResolver(FinGoalsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        if (!currentGroup) {
            toast.error("Please select a group first");
            return;
        }

        setIsLoading(true);
        try {
            // Include group_id in the data
            const goalData = {
                ...data,
                group_id: currentGroup.id
            };
            
            await supabaseInsertRow('fin_goals', goalData);
            
            if (typeof window !== "undefined") {
                toast.success("Goal created successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating goal:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create goal. Please try again.");
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
                    {isLoading ? 'Creating...' : 'Create Goal'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function AddFinGoalsButton({ 
  children
}: { 
  children?: React.ReactNode;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="text-green-500 hover:text-green-700 underline cursor-pointer"
      >
        {children || '+ Add Goal'}
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Financial Goal</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddFinGoalsForm
                onSuccess={() => setShowAddSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
