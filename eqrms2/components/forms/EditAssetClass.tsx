'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { assetClassSchema, AssetClassValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditAssetClassForm({initialData, id, onSuccess}: {initialData: AssetClassValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: AssetClassValues = {
        asset_class_summary: initialData?.asset_class_summary || "",
        asset_class_desc: initialData?.asset_class_desc || ""
    };

    const { control, handleSubmit} = useForm<AssetClassValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(assetClassSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('rms_asset_class', 'asset_class_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Asset class updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating asset class:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update asset class. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <ResizableTextArea name="asset_class_summary" label="Asset Class Summary" control={control} />
            <ResizableTextArea name="asset_class_desc" label="Asset Class Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditAssetClassButton({ 
  assetClassData,
  assetClassId
}: { 
  assetClassData: any;
  assetClassId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!assetClassId) {
    console.error('Asset class data is missing asset_class_id:', assetClassData);
  }

  // Convert asset class data to AssetClassValues format
  const assetClassUpdateData: AssetClassValues = {
    asset_class_summary: assetClassData.asset_class_summary ?? "",
    asset_class_desc: assetClassData.asset_class_desc ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Asset Class View |  
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Asset Class Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAssetClassForm
                initialData={assetClassUpdateData}
                id={assetClassId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
