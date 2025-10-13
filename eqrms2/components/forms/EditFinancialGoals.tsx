'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { FinGoalsSchema, FinGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, DatePicker, TextArea, ResizableTextArea } from "./FormFields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';

// Internal form component
function EditFinGoalsForm({initialData, id, onSuccess}: {initialData: FinGoalsValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [currentCost, setCurrentCost] = useState<number>(0);
    const [birthDate, setBirthDate] = useState<string>('');
    const [ageAtGoal, setAgeAtGoal] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        getUserRoles().then(userRoles => {
            setCanEdit(can(userRoles, 'investments', 'add_edit_financial_goals'));
        });
    }, []);

    const cleanedData: FinGoalsValues = {
        goal_name: initialData?.goal_name || "",
        goal_description: initialData?.goal_description || "",
        goal_date: initialData?.goal_date || new Date(),
        exp_returns: initialData?.exp_returns || 0,
        inflation_rate: initialData?.inflation_rate || 0,
        fv_goals: initialData?.fv_goals || 0
    };

    const { control, handleSubmit, watch} = useForm<FinGoalsValues>({
        defaultValues: cleanedData,
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

    // Read-only data display for users without edit permission
    if (!canEdit) {
        return (
            <div className="w-full p-4 space-y-4">
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Goal Name</label>
                        <p className="text-sm text-gray-900 mt-1">{cleanedData.goal_name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Future Value Goals</label>
                        <p className="text-sm text-gray-900 mt-1">{cleanedData.fv_goals}</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Goal Date</label>
                        <p className="text-sm text-gray-900 mt-1">
                            {(() => {
                                try {
                                    const date = cleanedData.goal_date instanceof Date 
                                        ? cleanedData.goal_date 
                                        : new Date(cleanedData.goal_date);
                                    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                                } catch {
                                    return 'Invalid Date';
                                }
                            })()}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Expected Returns</label>
                        <p className="text-sm text-gray-900 mt-1">{cleanedData.exp_returns}</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Inflation Rate</label>
                        <p className="text-sm text-gray-900 mt-1">{cleanedData.inflation_rate}</p>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700">Goal Description</label>
                    <p className="text-sm text-gray-900 mt-1">{cleanedData.goal_description}</p>
                </div>
            </div>
        );
    }

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
        <div>
            <form onSubmit={onSubmit} className="w-full p-4 space-y-2">
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
export function EditFinGoalsButton({ 
  goalData,
  goalId,
  children
}: { 
  goalData: any;
  goalId: number;
  children?: React.ReactNode;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!goalId) {
    console.error('Goal data is missing goal_id:', goalData);
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
        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
      >
        {children || 'Edit Goal'}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Financial Goal Details</SheetTitle>
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
