'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { ClientGroupSchema, ClientGroupValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { User } from "lucide-react";

// Internal form component
function AddClientGroupForm({
  onSuccess, 
  leadId
}: {
  onSuccess: () => void; 
  leadId: number;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: ClientGroupValues = {
    group_name: "",
  };

  const { control, handleSubmit } = useForm<ClientGroupValues>({
    defaultValues: defaultData,
    resolver: zodResolver(ClientGroupSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        rel_lead_id: leadId,
        group_name: data.group_name, // Assuming this is the ID from the select
      };
      
      await supabaseInsertRow('client_group', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Client Group added successfully!");
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

        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add Client Group</h3>

        <TextInput name="group_name" label="Group Name" control={control} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Client Group'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddClientGroup({ 
  leadId
}: { 
  leadId: number;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <User className="w-4 h-4 mr-2" />
        Add Client Group
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add Client Group</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddClientGroupForm
                onSuccess={() => setShowAddSheet(false)}
                leadId={leadId}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
