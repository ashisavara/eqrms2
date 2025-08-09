'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { LeadRoleSchema, LeadRoleValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { User } from "lucide-react";

// Internal form component
function AddLeadRoleForm({
  onSuccess, 
  leadId,
  leadRoleOptions
}: {
  onSuccess: () => void; 
  leadId: number;
  leadRoleOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: LeadRoleValues = {
    lead_role_id: 0,
  };

  const { control, handleSubmit } = useForm<LeadRoleValues>({
    defaultValues: defaultData,
    resolver: zodResolver(LeadRoleSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        lead_id: leadId,
        lead_role_id: data.lead_role_id, // Assuming this is the ID from the select
      };
      
      await supabaseInsertRow('rel_lead_leadrole', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Lead role added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding lead role:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add lead role. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add Lead Role</h3>
        
        <ToggleGroupInput 
          name="lead_role_id" 
          label="Select Lead Role" 
          control={control} 
          options={leadRoleOptions}
          valueType="number"
          itemClassName="ime-choice-chips"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Lead Role'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddLeadRole({ 
  leadId,
  leadRoleOptions
}: { 
  leadId: number;
  leadRoleOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <User className="w-4 h-4 mr-2" />
        Add Lead Role
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add Lead Role</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddLeadRoleForm
                onSuccess={() => setShowAddSheet(false)}
                leadId={leadId}
                leadRoleOptions={leadRoleOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
