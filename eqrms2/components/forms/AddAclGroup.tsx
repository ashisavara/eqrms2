'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { AclGroupSchema, AclGroupValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { Tag } from "lucide-react";

// Internal form component
function AddAclGroupForm({
  onSuccess, 
  groupId,
  rmOptions
}: {
  onSuccess: () => void; 
  groupId: number;
  rmOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: AclGroupValues = {
  auth_id_role: "",
 };

  const { control, handleSubmit } = useForm<AclGroupValues>({
    defaultValues: defaultData,
    resolver: zodResolver(AclGroupSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        group_id: groupId,
        auth_id_role: data.auth_id_role,
      };
      
      await supabaseInsertRow('acl_group', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("ACL Group added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding ACL Group:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add ACL Group. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add ACL Group</h3>
        
        <ToggleGroupInput 
          name="auth_id_role" 
          label="Select ACL Group" 
          control={control} 
          options={rmOptions}
          valueType="string"
          itemClassName="ime-choice-chips"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add ACL Group'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddAclGroupButton({ 
  groupId,
  rmOptions
}: { 
  groupId: number;
  rmOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full hover:bg-gray-100 rounded text-blue-500 font-bold text-sm"
      >
        Add ACL Group
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add ACL Group</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddAclGroupForm
                onSuccess={() => setShowAddSheet(false)}
                groupId={groupId}
                rmOptions={rmOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
