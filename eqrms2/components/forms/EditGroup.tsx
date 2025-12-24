'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { EditGroupSchema, EditGroupValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, ResizableTextArea, DatePicker, SelectInput, SwitchInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";

// Internal form component
function EditGroupForm({initialData, id, onSuccess}: {initialData: EditGroupValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const masterOptions = useMasterOptions();

    const cleanedData: EditGroupValues = {
        mandate_name: initialData?.mandate_name || "",
        inv_plan: initialData?.inv_plan || "",
        other_mandate_details: initialData?.other_mandate_details || "",
        one_line_objective: initialData?.one_line_objective || "",
        rp_override: initialData?.rp_override || "",
        last_review_date: initialData?.last_review_date || null,
        investments_background: initialData?.investments_background || null,
        investments_purpose: initialData?.investments_purpose || null,
        investment_recommendations: initialData?.investment_recommendations || null,
        background_done: initialData?.background_done ?? null,
        risk_profile_done: initialData?.risk_profile_done ?? null,
        fin_plan_done: initialData?.fin_plan_done ?? null,
        inv_plan_done: initialData?.inv_plan_done ?? null,
        shortlisting_done: initialData?.shortlisting_done ?? null
    };

    const { control, handleSubmit} = useForm<EditGroupValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(EditGroupSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('client_group', 'group_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Group updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Group:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Group. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <SwitchInput name="background_done" label="Background" control={control} />
                <SwitchInput name="risk_profile_done" label="Risk Profile" control={control} />
                <SwitchInput name="fin_plan_done" label="Fin Plan" control={control} />
                <SwitchInput name="inv_plan_done" label="Inv Plan" control={control} />
                <SwitchInput name="shortlisting_done" label="Shortlisting" control={control} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput name="mandate_name" label="Mandate Name" control={control} />
                <SelectInput
                  name="rp_override"
                  label="Risk Profile"
                  control={control}
                  options={transformToValueLabel(masterOptions.riskProfile)}
                />
                <DatePicker name="last_review_date" label="Last Review Date" control={control} />
            </div>
            <TextInput name="one_line_objective" label="One Line Objective" control={control} 
              helperText="What these investments mean for you? The emotional or core purpose of what money well managed does for you?"/>
            <ResizableTextArea 
              name="investments_background" 
              label="Investor Background" 
              control={control}
              helperText="Past experience with investments - types of experience, what worked, what didn't work, problems experienced, etc."
            />
            <ResizableTextArea name="investments_purpose" label="Investments Purpose" control={control}
              helperText="Key goals or objectives that you desire from your investments." />
            <ResizableTextArea name="inv_plan" label="Investment Plan" control={control} 
              helperText="Asset Allocation, Other Mandate Requirements, Funding of Goals, Lumpsum vs Staggered, Dos & Donts etc."/>
            <ResizableTextArea name="investment_recommendations" label="Investment Recommendations" control={control} 
              helperText="Core Investment Recommendations"/>
            <ResizableTextArea name="other_mandate_details" label="To Dos" control={control} 
             helperText="Action Plan & Tasks"/>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditGroupButton({ 
  groupData,
  groupId
}: { 
  groupData: any;
  groupId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!groupId) {
    console.error('Group data is missing group_id:', groupData);
  }

  // Convert group data to EditGroupValues format
  const groupUpdateData: EditGroupValues = {
    mandate_name: groupData.mandate_name ?? "",
    inv_plan: groupData.inv_plan ?? "",
    other_mandate_details: groupData.other_mandate_details ?? "",
    one_line_objective: groupData.one_line_objective ?? "",
    rp_override: groupData.rp_override ?? "",
    last_review_date: groupData.last_review_date ? new Date(groupData.last_review_date) : null,
    investments_background: groupData.investments_background ?? null,
    investments_purpose: groupData.investments_purpose ?? null,
    investment_recommendations: groupData.investment_recommendations ?? null,
    background_done: groupData.background_done ?? null,
    risk_profile_done: groupData.risk_profile_done ?? null,
    fin_plan_done: groupData.fin_plan_done ?? null,
    inv_plan_done: groupData.inv_plan_done ?? null,
    shortlisting_done: groupData.shortlisting_done ?? null
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Edit Group Details
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Group Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditGroupForm
                initialData={groupUpdateData}
                id={groupId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

