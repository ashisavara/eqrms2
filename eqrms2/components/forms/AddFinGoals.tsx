'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { FinGoalsSchema, FinGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, DatePicker, TextArea, NumberInput } from "./FormFields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";


// Internal form component
function AddFinGoalsForm({onSuccess}: {onSuccess?: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentCost, setCurrentCost] = useState<number>(0);
    const [birthDate, setBirthDate] = useState<string>('');
    const [ageAtGoal, setAgeAtGoal] = useState<number>(0);
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

    const { control, handleSubmit, watch} = useForm<FinGoalsValues>({
        defaultValues: defaultData,
        resolver: zodResolver(FinGoalsSchema)
    });

    // Watch form values for calculator
    const watchedValues = watch();
    
    // Calculate future value
    const calculateFutureValue = () => {
        if (!currentCost || !watchedValues.goal_date || !watchedValues.inflation_rate) {
            return 0;
        }
        
        const today = new Date();
        const goalDate = new Date(watchedValues.goal_date);
        const yearsToGoal = (goalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        
        if (yearsToGoal <= 0) return currentCost;
        
        const futureValue = currentCost * Math.pow(1 + (watchedValues.inflation_rate / 100), yearsToGoal);
        return Math.round(futureValue);
    };

    const futureValue = calculateFutureValue();

    // Calculate goal date from birth date and age
    const calculateGoalDate = () => {
        if (!birthDate || !ageAtGoal) {
            return '';
        }
        
        const birth = new Date(birthDate);
        const goalDate = new Date(birth);
        goalDate.setFullYear(birth.getFullYear() + ageAtGoal);
        
        return goalDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    };

    const calculatedGoalDate = calculateGoalDate();

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
      <div>
        <form onSubmit={onSubmit} className="w-full p-4 space-y-2">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <div className="grid grid-cols-3 gap-4">
                <TextInput name="goal_name" label="Goal Name" control={control} />
                <TextInput name="fv_goals" label="Future Value Goals" control={control} />
                <DatePicker name="goal_date" label="Goal Date" control={control} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextInput name="exp_returns" label="Expected Return (%)" control={control} />
                <TextInput name="inflation_rate" label="Inflation Rate (%)" control={control} />
            </div>
            <TextArea name="goal_description" label="Goal Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Goal'}
                </Button>
            </div>
        </form>
        <div className="bg-gray-50 m-5 p-4 rounded-lg border">
          <p className="text-sm text-center"><span className="font-semibold">Future Value Goal Calculator: </span>Calculate future value of goal, based on current cost and the goal date & inflation rate entered above.</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="current-cost">Current Cost (Rs. lakh)</Label>
              <Input
                id="current-cost"
                type="number"
                placeholder="Enter current cost"
                value={currentCost || ''}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="future-value">Calculated Future Value</Label>
              <Input
                id="future-value"
                type="number"
                value={futureValue || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 m-5 p-4 rounded-lg border">
          <p className="text-sm text-center"><span className="font-semibold">Goal Date Calculator: </span>Calculate goal date based on birth date and age at goal.</p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <Label htmlFor="birth-date">Birth Date</Label>
              <Input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age-at-goal">Age at Goal</Label>
              <Input
                id="age-at-goal"
                type="number"
                placeholder="Enter age"
                value={ageAtGoal || ''}
                onChange={(e) => setAgeAtGoal(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="calculated-goal-date">Calculated Goal Date</Label>
              <Input
                id="calculated-goal-date"
                type="date"
                value={calculatedGoalDate}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
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
        className="blue-hyperlink mt-2"
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
