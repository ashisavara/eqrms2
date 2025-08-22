'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { HeldAwayAssetsSchema, HeldAwayAssetsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, NumberInput, ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function EditHeldAwayAssetsForm({initialData, id, onSuccess}: {initialData: HeldAwayAssetsValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: HeldAwayAssetsValues = {
        fund_name: initialData?.fund_name || "",
        asset_class_id: initialData?.asset_class_id || 0,
        category_id: initialData?.category_id || 0,
        structure_id: initialData?.structure_id || 0,
        advisor_name: initialData?.advisor_name || "",
        pur_amt: initialData?.pur_amt || 0,
        cur_amt: initialData?.cur_amt || 0,
        rms_fund_id: initialData?.rms_fund_id || null
    };

    const { control, handleSubmit} = useForm<HeldAwayAssetsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(HeldAwayAssetsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('investments', 'investment_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Held Away Assets updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Held Away Assets:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Held Away Assets. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TextInput name="fund_name" label="Fund Name" control={control} />
            <TextInput name="advisor_name" label="Advisor Name" control={control} />
            <NumberInput name="pur_amt" label="Purchase Amount" control={control} />
            <NumberInput name="cur_amt" label="Current Amount" control={control} />
            </div>
            <NumberInput name="rms_fund_id" label="RMS Fund ID" control={control} />
            <TextInput name="asset_class_id" label="Asset Class ID" control={control} />
            <TextInput name="category_id" label="Category ID" control={control} />
            <TextInput name="structure_id" label="Structure ID" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditHeldAwayAssetsButton({ 
  investmentData,
  investmentId
}: { 
  investmentData: any;
  investmentId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!investmentId) {
    console.error('Investments data is missing investment_id:', investmentData);
  }

  // Convert category data to HeldAwayAssetsValues format
  const heldAwayAssetData: HeldAwayAssetsValues = {
    fund_name: investmentData.fund_name ?? "",
    asset_class_id: investmentData.asset_class_id ?? 0,
    category_id: investmentData.category_id ?? 0,
    structure_id: investmentData.structure_id ?? 0,
    advisor_name: investmentData.advisor_name ?? "",
    pur_amt: investmentData.pur_amt ?? 0,
    cur_amt: investmentData.cur_amt ?? 0,
    rms_fund_id: investmentData.rms_fund_id ?? null
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
              <SheetTitle>Update Held Away Assets</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditHeldAwayAssetsForm
                initialData={heldAwayAssetData}
                id={investmentId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}