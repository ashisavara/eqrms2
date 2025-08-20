'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { EditMandateSchema, EditMandateValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, ResizableTextArea, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";

// Internal form component
function EditMandateForm({initialData, id, onSuccess}: {initialData: EditMandateValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const masterOptions = useMasterOptions();

    const cleanedData: EditMandateValues = {
        mandate_name: initialData?.mandate_name || "",
        inv_plan: initialData?.inv_plan || "",
        other_mandate_details: initialData?.other_mandate_details || "",
        one_line_objective: initialData?.one_line_objective || "",
        portfolio_reallocation_thoughts: initialData?.portfolio_reallocation_thoughts || "",
        rp_override: initialData?.rp_override || ""
    };

    const { control, handleSubmit} = useForm<EditMandateValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(EditMandateSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('investment_mandate', 'im_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Mandate updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Mandate:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Mandate. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="mandate_name" label="Mandate Name" control={control} />
                <SelectInput
                  name="rp_override"
                  label="Risk Profile"
                  control={control}
                  options={transformToValueLabel(masterOptions.riskProfile)}
                />
            </div>
            <TextInput name="one_line_objective" label="One Line Objective" control={control} />
            <ResizableTextArea name="inv_plan" label="Investment Plan" control={control} />
            <ResizableTextArea name="other_mandate_details" label="Other Mandate Details" control={control} />
            
            <ResizableTextArea name="portfolio_reallocation_thoughts" label="Portfolio Reallocation Thoughts" control={control} />
            

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditMandateButton({ 
  mandateData,
  mandateId
}: { 
  mandateData: any;
  mandateId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!mandateId) {
    console.error('Mandate data is missing mandate_id:', mandateData);
  }

  // Convert category data to EditMandateValues format
  const mandateUpdateData: EditMandateValues = {
    mandate_name: mandateData.mandate_name ?? "",
    inv_plan: mandateData.inv_plan ?? "",
    other_mandate_details: mandateData.other_mandate_details ?? "",
    one_line_objective: mandateData.one_line_objective ?? "",
    portfolio_reallocation_thoughts: mandateData.portfolio_reallocation_thoughts ?? "",
    rp_override: mandateData.rp_override ?? ""
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Edit Mandate  
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Asset Class Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditMandateForm
                initialData={mandateUpdateData}
                id={mandateId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}