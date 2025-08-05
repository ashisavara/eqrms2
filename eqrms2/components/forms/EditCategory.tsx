'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { categorySchema, CategoryValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditAssetClassForm({initialData, id, onSuccess}: {initialData: CategoryValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: CategoryValues = {
        cat_summary: initialData?.cat_summary || "",
        cat_description: initialData?.cat_description || ""
    };

    const { control, handleSubmit} = useForm<CategoryValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(categorySchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('rms_category', 'category_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Category updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Category:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Category. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <ResizableTextArea name="cat_summary" label="Category Summary" control={control} />
            <ResizableTextArea name="cat_description" label="Category Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditCatButton({ 
  categoryData,
  categoryId
}: { 
  categoryData: any;
  categoryId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!categoryId) {
    console.error('Asset class data is missing asset_class_id:', categoryData);
  }

  // Convert category data to CategoryValues format
  const categoryUpdateData: CategoryValues = {
    cat_summary: categoryData.cat_summary ?? "",
    cat_description: categoryData.cat_description ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Edit Category  
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
                initialData={categoryUpdateData}
                id={categoryId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
