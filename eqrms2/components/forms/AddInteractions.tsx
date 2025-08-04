'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { MeetingNoteSchema, MeetingNoteValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, BooleanToggleInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function AddInteractionForm({
  onSuccess, 
  interactionTypeOptions, 
  interactionTagOptions, 
  interactionChannelOptions,
  relLeadId
}: {
  onSuccess: () => void,
  interactionTypeOptions: { value: string; label: string }[],
  interactionTagOptions: { value: string; label: string }[],
  interactionChannelOptions: { value: string; label: string }[],
  relLeadId?: number
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default empty values for new interaction
  const defaultData: MeetingNoteValues = {
    interaction_channel: "",
    interaction_tag: "",
    interaction_type: "",
    meeting_name: "",
    meeting_notes: "",
    meeting_summary: "",
    show_to_client: false,
  };

  const { control, handleSubmit } = useForm<MeetingNoteValues>({
    defaultValues: defaultData,
    resolver: zodResolver(MeetingNoteSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // Add relLeadId to the data if provided
      const insertData = relLeadId ? { ...data, rel_lead_id: relLeadId } : data;
      
      await supabaseInsertRow('meeting_notes', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Interaction created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating Interaction:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to create Interaction. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="grid grid-cols-3 gap-4">
        <TextInput name="meeting_name" label="Meeting Name" control={control} /> 
        <ToggleGroupInput name="interaction_type" label="Interaction Type" control={control} options={interactionTypeOptions} />      
        <BooleanToggleInput name="show_to_client" label="Show to Client" control={control} />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <SelectInput name="interaction_tag" label="Interaction Tag" control={control} options={interactionTagOptions} />
        <SelectInput name="interaction_channel" label="Interaction Channel" control={control} options={interactionChannelOptions} />
      </div>
      
      <TextInput name="meeting_summary" label="Meeting Summary" control={control} />
      
      <ResizableTextArea name="meeting_notes" label="Meeting Notes" control={control} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Interaction'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddInteractionButton({ 
  interactionTypeOptions, 
  interactionTagOptions, 
  interactionChannelOptions,
  relLeadId
}: { 
  interactionTypeOptions: { value: string; label: string }[];
  interactionTagOptions: { value: string; label: string }[];
  interactionChannelOptions: { value: string; label: string }[];
  relLeadId?: number;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-red-600 hover:bg-red-200 hover:underline cursor-pointer inline-flex items-center"
      >
        |_M_
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Interaction</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddInteractionForm
                onSuccess={() => setShowAddSheet(false)}
                interactionTypeOptions={interactionTypeOptions}
                interactionTagOptions={interactionTagOptions}
                interactionChannelOptions={interactionChannelOptions}
                relLeadId={relLeadId}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
