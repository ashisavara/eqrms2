'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { EditPortRecoSchema, EditPortRecoValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function EditPortRecoForm({initialData, id, onSuccess}: {initialData: EditPortRecoValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: EditPortRecoValues = {
        portfolio_reallocation_thoughts: initialData?.portfolio_reallocation_thoughts || ""
    };

    const { control, handleSubmit} = useForm<EditPortRecoValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(EditPortRecoSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('client_group', 'group_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Recommendations updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Recommendations:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Recommendations. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
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
export function EditPortRecoButton({ 
  portRecoData,
  groupId
}: { 
  portRecoData: string | null | undefined;
  groupId: number | null;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!groupId) {
    console.error('Group ID is missing:', portRecoData);
  }

  // Convert string data to EditPortRecoValues format
  const portRecoUpdateData: EditPortRecoValues = {
    portfolio_reallocation_thoughts: portRecoData ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Edit Recommendations 
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Recommendations</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {groupId && (
                <EditPortRecoForm
                  initialData={portRecoUpdateData}
                  id={groupId}
                  onSuccess={() => setShowEditSheet(false)}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}