'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { z } from "zod";

// Schema for group name update
const GroupNameUpdateSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
});

type GroupNameUpdateValues = z.infer<typeof GroupNameUpdateSchema>;

// Internal form component for group name update
function UpdateGroupNameForm({
  initialData,
  groupId,
  onSuccess
}: {
  initialData: GroupNameUpdateValues;
  groupId: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit } = useForm<GroupNameUpdateValues>({
    defaultValues: initialData,
    resolver: zodResolver(GroupNameUpdateSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await supabaseUpdateRow('client_group', 'group_id', groupId, data);
      
      if (typeof window !== "undefined") {
        toast.success("Group name updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating group name:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to update group name. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Update Group Name</h3>
        
        <TextInput 
          name="group_name" 
          label="Group Name" 
          control={control} 
          placeholder="Enter group name"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function UpdateGroupNameButton({ 
  groupName,
  groupId
}: { 
  groupName: string;
  groupId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!groupId) {
    console.error('Group ID is missing');
    return null;
  }

  const groupUpdateData: GroupNameUpdateValues = {
    group_name: groupName ?? ""
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
        Update Group Name
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Update Group Name</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <UpdateGroupNameForm
                initialData={groupUpdateData}
                groupId={groupId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

