'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { LinkInvToGoalsSchema, LinkInvToGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useGoalOptions } from "@/lib/contexts/GoalOptionsContext";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';

// Internal form component
function EditInvGoalsForm({initialData, id, onSuccess, fundName}: {initialData: LinkInvToGoalsValues | null, id: number, onSuccess: () => void, fundName?: string}) {
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const router = useRouter();
    const { goalOptions } = useGoalOptions();

    useEffect(() => {
        getUserRoles().then(userRoles => {
            setCanEdit(can(userRoles, 'investments', 'add_edit_goal_inv_linking'));
        });
    }, []);

    const cleanedData: LinkInvToGoalsValues = {
        goal_id: initialData?.goal_id || 0,
    };

    const { control, handleSubmit} = useForm<LinkInvToGoalsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(LinkInvToGoalsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('investments', 'investment_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Goal Linked successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error linking Goal:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to link Goal. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            {canEdit ? (
                <div>
                <label className="text-sm font-bold text-gray-700">Fund</label>
                <p className="text-sm text-gray-900 mt-1">{fundName || 'Unknown Fund'}</p>
                <ToggleGroupInput name="goal_id" label="Link Goal" control={control} options={goalOptions} valueType="number" itemClassName="ime-choice-chips" />
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Fund</label>
                        <p className="text-sm text-gray-900 mt-1">{fundName || 'Unknown Fund'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Linked Goal</label>
                        <p className="text-sm text-gray-900 mt-1">
                            {goalOptions.find(option => Number(option.value) === cleanedData.goal_id)?.label || 'No goal selected'}
                        </p>
                    </div>
                </div>
            )}
        
            {canEdit && (
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            )}
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditInvGoalsButton({ 
  investmentsData,
  investment_id,
  children
}: { 
  investmentsData: any;
  investment_id: number;
  children?: React.ReactNode;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!investment_id) {
    console.error('Investments data is missing investment id:', investmentsData);
  }

  // Convert category data to LinkInvToGoalsValues format  
  const invUpdateData: LinkInvToGoalsValues = {
    goal_id: investmentsData.goal_id ?? 0,
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
      >
        {children || 'Link'}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Link Investment to Goal</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditInvGoalsForm
                initialData={invUpdateData}
                id={investment_id}
                onSuccess={() => setShowEditSheet(false)}
                fundName={investmentsData.fund_name}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}