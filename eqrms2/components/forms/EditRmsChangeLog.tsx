'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { changelogSchema, ChangelogValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, BooleanToggleInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditChangelogForm({initialData, id, onSuccess}: {initialData: ChangelogValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: ChangelogValues = {
        change_desc: initialData?.change_desc || "",
        team_discussed: initialData?.team_discussed ?? false
    };

    const { control, handleSubmit} = useForm<ChangelogValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(changelogSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('rms_change_log', 'id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Changelog updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating changelog:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update changelog. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <ResizableTextArea name="change_desc" label="Change Description" control={control} />
            <BooleanToggleInput name="team_discussed" label="Team Discussed" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditChangelogButton({ 
  changelogData,
  changelogId
}: { 
  changelogData: any;
  changelogId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!changelogId) {
    console.error('Changelog data is missing change_log_id:', changelogData);
  }

  // Convert changelog data to ChangelogValues format
  const changelogUpdateData: ChangelogValues = {
    change_desc: changelogData.change_desc ?? "",
    team_discussed: changelogData.team_discussed ?? false,
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
              <SheetTitle>Edit Changelog Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditChangelogForm
                initialData={changelogUpdateData}
                id={changelogId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
