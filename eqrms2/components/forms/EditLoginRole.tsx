'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroupInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { MASTER_OPTIONS } from "@/lib/constants";
import { Pencil } from "lucide-react";

type FormValues = { 
  user_role_name_id: number;
  expires_on?: Date | null;
};

// Internal form component
function EditLoginRoleForm({ 
  uuid, 
  initialRoleId, 
  initialExpiresOn,
  onSuccess 
}: { 
  uuid: string; 
  initialRoleId?: number | null;
  initialExpiresOn?: string | Date | null;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Convert role options to the format expected by ToggleGroupInput
  const roleOptions = MASTER_OPTIONS.userRoles.map(role => ({
    value: role.id.toString(),
    label: role.name
  }));

  // Convert initialExpiresOn string to Date if provided
  const initialExpiresOnDate = useMemo((): Date | null => {
    if (!initialExpiresOn) return null;
    if (initialExpiresOn instanceof Date) return initialExpiresOn;
    const date = new Date(initialExpiresOn);
    return isNaN(date.getTime()) ? null : date;
  }, [initialExpiresOn]);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { 
      user_role_name_id: initialRoleId || 0,
      expires_on: initialExpiresOnDate
    }
  });

  // Reset form when initialRoleId or initialExpiresOn changes (e.g., when sheet opens with new data)
  useEffect(() => {
    reset({
      user_role_name_id: initialRoleId || 0,
      expires_on: initialExpiresOnDate
    });
  }, [initialRoleId, initialExpiresOnDate, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.user_role_name_id || data.user_role_name_id === 0) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = {
        user_role_name_id: data.user_role_name_id
      };
      
      // Only include expires_on if a date is selected
      if (data.expires_on) {
        updateData.expires_on = data.expires_on.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      } else {
        // If expires_on is explicitly set to null, update it to null
        updateData.expires_on = null;
      }
      
      await supabaseUpdateRow(
        'login_profile', 
        'uuid', 
        uuid, 
        updateData
      );
      
      if (typeof window !== "undefined") {
        toast.success("Role updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to update role. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      <div>
        <ToggleGroupInput 
          name="user_role_name_id" 
          label="User Role" 
          control={control} 
          options={roleOptions} 
          valueType="number" 
          itemClassName="ime-choice-chips" 
        />
      </div>

      <div>
        <DatePicker 
          name="expires_on" 
          label="Expires On (Optional)" 
          control={control}
          placeholder="Select expiration date"
          showClearButton={true}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditLoginRoleButton({ 
  uuid,
  initialRoleId,
  initialExpiresOn,
  children
}: { 
  uuid: string;
  initialRoleId?: number | null;
  initialExpiresOn?: string | Date | null;
  children?: React.ReactNode;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!uuid) {
    console.error('EditLoginRoleButton: uuid is required');
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowEditSheet(true)}
        className="h-6 w-6 p-0"
        title="Edit role"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Login Role</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditLoginRoleForm
                key={`${uuid}-${initialRoleId || 0}-${initialExpiresOn || 'null'}`}
                uuid={uuid}
                initialRoleId={initialRoleId}
                initialExpiresOn={initialExpiresOn}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

