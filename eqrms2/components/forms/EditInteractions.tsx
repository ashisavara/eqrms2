

'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { MeetingNoteSchema, MeetingNoteValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, BooleanToggleInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditInteractionForm({initialData, id, onSuccess}: {initialData: MeetingNoteValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: MeetingNoteValues = {
      interaction_channel: initialData?.interaction_channel || "",
      interaction_tag: initialData?.interaction_tag || "",
      interaction_type: initialData?.interaction_type || "",
      meeting_name: initialData?.meeting_name || "",
      meeting_notes: initialData?.meeting_notes || "",
      meeting_summary: initialData?.meeting_summary || "",
      rel_lead_id: initialData?.rel_lead_id || 0,
      show_to_client: initialData?.show_to_client || false,
    };

    const { control, handleSubmit} = useForm<MeetingNoteValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(MeetingNoteSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('meeting_note', 'meeting_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Interaction updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Interaction:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Interaction. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <TextInput name="meeting_name" label="Meeting Name" control={control} />
            <TextInput name="interaction_type" label="Interaction Type" control={control} />
            <TextInput name="interaction_channel" label="Interaction Channel" control={control} />
            <TextInput name="interaction_tag" label="Interaction Tag" control={control} />
            <TextInput name="meeting_summary" label="Meeting Summary" control={control} />
            <BooleanToggleInput name="show_to_client" label="Show to Client" control={control} />
            <TextInput name="rel_lead_id" label="Related Lead ID" control={control} />
            <ResizableTextArea name="meeting_notes" label="Meeting Notes" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditInteractionButton({ 
  interactionData,
  meetingId
}: { 
  interactionData: any;
  meetingId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!meetingId) {
    console.error('Interaction data is missing meeting_id:', interactionData);
  }

  // Convert category data to MeetingNoteValues format
  const interactionUpdateData: MeetingNoteValues = {
    interaction_channel: interactionData.interaction_channel ?? "",
    interaction_tag: interactionData.interaction_tag ?? "",
    interaction_type: interactionData.interaction_type ?? "",
    meeting_name: interactionData.meeting_name ?? "",
    meeting_notes: interactionData.meeting_notes ?? "",
    meeting_summary: interactionData.meeting_summary ?? "",
    rel_lead_id: interactionData.rel_lead_id ?? "",
    show_to_client: interactionData.show_to_client ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        {interactionData.meeting_name} 
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Asset Class Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditInteractionForm
                initialData={interactionUpdateData}
                id={meetingId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
