'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { LinkSipToGoalsSchema, LinkSipToGoalsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useGoalOptions } from "@/lib/contexts/GoalOptionsContext";

// Internal form component
function EditSipGoalsForm({initialData, id, onSuccess}: {initialData: LinkSipToGoalsValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { goalOptions } = useGoalOptions();

    const cleanedData: LinkSipToGoalsValues = {
        goal_id: initialData?.goal_id || 0,
    };

    const { control, handleSubmit} = useForm<LinkSipToGoalsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(LinkSipToGoalsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('inv_sip', 'id', id, data);
            
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
            <ToggleGroupInput name="goal_id" label="Link Goal" control={control} options={goalOptions} valueType="number" itemClassName="ime-choice-chips" />
        
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditSipGoalsButton({ 
  sipData,
  sip_id,
  children
}: { 
  sipData: any;
  sip_id: number;
  children?: React.ReactNode;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!sip_id) {
    console.error('SIP data is missing sip id:', sipData);
  }

  // Convert sip data to LinkSipToGoalsValues format  
  const sipUpdateData: LinkSipToGoalsValues = {
    goal_id: sipData.goal_id ?? 0,
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        {children || 'Link'}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Link SIP Goal</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditSipGoalsForm
                initialData={sipUpdateData}
                id={sip_id}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
