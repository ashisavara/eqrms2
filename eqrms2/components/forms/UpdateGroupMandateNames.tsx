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

// Schema for mandate name update
const MandateNameUpdateSchema = z.object({
  mandate_name: z.string().min(1, "Mandate name is required"),
});

type MandateNameUpdateValues = z.infer<typeof MandateNameUpdateSchema>;

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

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Group Name'}
        </Button>
      </div>
    </form>
  );
}

// Internal form component for mandate name update
function UpdateMandateNameForm({
  initialData,
  mandateId,
  onSuccess
}: {
  initialData: MandateNameUpdateValues;
  mandateId: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit } = useForm<MandateNameUpdateValues>({
    defaultValues: initialData,
    resolver: zodResolver(MandateNameUpdateSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await supabaseUpdateRow('investment_mandate', 'im_id', mandateId, data);
      
      if (typeof window !== "undefined") {
        toast.success("Mandate name updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating mandate name:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to update mandate name. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Update Mandate Name</h3>
        
        <TextInput 
          name="mandate_name" 
          label="Mandate Name" 
          control={control} 
          placeholder="Enter mandate name"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Mandate Name'}
        </Button>
      </div>
    </form>
  );
}

// Main component for group name update
export function UpdateGroupNameButton({ 
  groupId,
  currentGroupName,
  children
}: { 
  groupId: number;
  currentGroupName: string;
  children: React.ReactNode;
}) {
  const [showUpdateSheet, setShowUpdateSheet] = useState(false);

  const groupUpdateData: GroupNameUpdateValues = {
    group_name: currentGroupName || "",
  };

  return (
    <>
      <span 
        onClick={() => setShowUpdateSheet(true)}
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        {children}
      </span>

      {/* Update Sheet */}
      {showUpdateSheet && (
        <Sheet open={true} onOpenChange={() => setShowUpdateSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Update Group Name</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <UpdateGroupNameForm
                initialData={groupUpdateData}
                groupId={groupId}
                onSuccess={() => setShowUpdateSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

// Main component for mandate name update
export function UpdateMandateNameButton({ 
  mandateId,
  currentMandateName,
  children
}: { 
  mandateId: number;
  currentMandateName: string;
  children: React.ReactNode;
}) {
  const [showUpdateSheet, setShowUpdateSheet] = useState(false);

  const mandateUpdateData: MandateNameUpdateValues = {
    mandate_name: currentMandateName || "",
  };

  return (
    <>
      <span 
        onClick={() => setShowUpdateSheet(true)}
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        {children}
      </span>

      {/* Update Sheet */}
      {showUpdateSheet && (
        <Sheet open={true} onOpenChange={() => setShowUpdateSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Update Mandate Name</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <UpdateMandateNameForm
                initialData={mandateUpdateData}
                mandateId={mandateId}
                onSuccess={() => setShowUpdateSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
