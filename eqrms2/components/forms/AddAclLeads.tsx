'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { AclLeadSchema, AclLeadValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { Tag } from "lucide-react";

// Internal form component
function AddAclLeadsForm({
  onSuccess, 
  leadId,
  rmOptions
}: {
  onSuccess: () => void; 
  leadId: number;
  rmOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: AclLeadValues = {
  auth_id_role: "",
 };

  const { control, handleSubmit } = useForm<AclLeadValues>({
    defaultValues: defaultData,
    resolver: zodResolver(AclLeadSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        lead_id: leadId,
        auth_id_role: data.auth_id_role,
      };
      
      await supabaseInsertRow('acl_leads', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("ACL Lead added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding ACL Lead:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add ACL Lead. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add ACL Lead</h3>
        
        <ToggleGroupInput 
          name="auth_id_role" 
          label="Select ACL Lead" 
          control={control} 
          options={rmOptions}
          valueType="string"
          itemClassName="ime-choice-chips"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add ACL Lead'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddAclLeadButton({ 
  leadId,
  rmOptions
}: { 
  leadId: number;
  rmOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full hover:bg-gray-100 rounded text-blue-500 font-bold text-sm"
      >
        Add ACL Lead
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add ACL Lead</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddAclLeadsForm
                onSuccess={() => setShowAddSheet(false)}
                leadId={leadId}
                rmOptions={rmOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
