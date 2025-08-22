'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { HeldAwayAssetsSchema, HeldAwayAssetsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, NumberInput, ResizableTextArea, SelectInput, ToggleGroupInput } from "./FormFields";
import { CATEGORY_OPTIONS, STRUCTURE_OPTIONS, getAssetClassIdByCategoryId } from "@/lib/categoryConstants";
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
        cur_amt: initialData?.cur_amt || 0
    };

    // Debug logs
    console.log("🔍 EditHeldAway Debug:");
    console.log("📥 initialData:", initialData);
    console.log("✨ cleanedData:", cleanedData);
    console.log("📊 cleanedData types:", {
        category_id: typeof cleanedData.category_id,
        structure_id: typeof cleanedData.structure_id
    });
    console.log("🎯 Expected values:", {
        category_id: cleanedData.category_id,
        structure_id: cleanedData.structure_id
    });

    const { control, handleSubmit, watch, setValue} = useForm<HeldAwayAssetsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(HeldAwayAssetsSchema)
    });

    // Debug: Watch current form values
    const currentValues = watch();
    console.log("📋 Current form values:", currentValues);

    // Watch for category changes to auto-populate asset_class_id
    const selectedCategoryId = watch("category_id");
    
    useEffect(() => {
        if (selectedCategoryId) {
            const assetClassId = getAssetClassIdByCategoryId(selectedCategoryId);
            if (assetClassId !== null) {
                setValue("asset_class_id", assetClassId);
            }
        }
    }, [selectedCategoryId, setValue]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleGroupInput 
                  name="structure_id" 
                  label="Structure" 
                  control={control} 
                  options={(() => {
                    const structureOptions = STRUCTURE_OPTIONS.map(structure => ({
                      value: String(structure.structure_id),
                      label: structure.structure_name
                    }));
                    console.log("🏗️ Structure Options:", structureOptions);
                    console.log("🏗️ First 3 Structure Options:", structureOptions.slice(0, 3));
                    console.log("🏗️ Looking for structure_id:", cleanedData.structure_id);
                    return structureOptions;
                  })()}
                  valueType="number"
                  toggleGroupClassName="gap-2 flex-wrap"
                  itemClassName="ime-choice-chips"
              />
              
              {/* Category selection with automatic asset class lookup */}
              <SelectInput 
                  name="category_id" 
                  label="Category" 
                  control={control} 
                  options={(() => {
                    const categoryOptions = CATEGORY_OPTIONS.map(cat => ({
                      value: String(cat.category_id),
                      label: cat.cat_long_name
                    }));
                    console.log("📂 Category Options:", categoryOptions);
                    console.log("📂 First 3 Category Options:", categoryOptions.slice(0, 3));
                    console.log("📂 Looking for category_id:", cleanedData.category_id);
                    return categoryOptions;
                  })()}
                  valueType="number"
              />
            </div>
            
            {/* Structure selection using ToggleGroupInput */}
            
            
            {/* Asset class field that gets auto-populated */}
            <NumberInput name="asset_class_id" label="Asset Class ID" control={control} disabled={true} />

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