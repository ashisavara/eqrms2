'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { GroupInvestorSchema, GroupInvestorValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { UserPlus } from "lucide-react";

// Internal form component
function AddGroupInvestorForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { currentGroup } = useGroupMandate();

  // Default values
  const defaultData: GroupInvestorValues = {
    investor_name: "",
  };

  const { control, handleSubmit } = useForm<GroupInvestorValues>({
    defaultValues: defaultData,
    resolver: zodResolver(GroupInvestorSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!currentGroup) {
      toast.error("Please select a group first");
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        group_id: currentGroup.id,
        investor_name: data.investor_name,
      };
      
      await supabaseInsertRow('group_investors', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Group Investor added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding group investor:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add group investor. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add Group Investor</h3>

      <TextInput name="investor_name" label="Investor Name" control={control} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Group Investor'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddGroupInvestorButton({ 
  children
}: { 
  children?: React.ReactNode;
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        {children || (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Group Investor
          </>
        )}
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add Group Investor</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddGroupInvestorForm
                onSuccess={() => setShowAddSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

