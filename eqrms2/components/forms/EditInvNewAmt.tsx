'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { EditInvNewAmtSchema, EditInvNewAmtValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function EditInvAmtForm({initialData, id, onSuccess}: {initialData: EditInvNewAmtValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: EditInvNewAmtValues = {
        new_amt: initialData?.new_amt || null,
        recommendation: initialData?.recommendation || null
    };

    const { control, handleSubmit} = useForm<EditInvNewAmtValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(EditInvNewAmtSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('investments', 'investment_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("New Amount updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating New Amount:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update New Amount. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <TextInput name="new_amt" label="New Amount" control={control} type="number" />
            <ResizableTextArea name="recommendation" label="Recommendation" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditInvAmtButton({ 
  investmentData,
  investmentId
}: { 
  investmentData: any;
  investmentId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!investmentId) {
    console.error('Investment data is missing investment_id:', investmentData);
  }

  // Convert category data to EditInvNewAmtValues format
  const investmentUpdateData: EditInvNewAmtValues = {
    new_amt: investmentData.new_amt ?? null,
    recommendation: investmentData.recommendation ?? null
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
              <SheetTitle>Edit Investment Values</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditInvAmtForm
                initialData={investmentUpdateData}
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