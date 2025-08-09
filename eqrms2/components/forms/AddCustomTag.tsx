'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { CustomTagSchema, CustomTagValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { Tag } from "lucide-react";

// Internal form component
function AddCustomTagForm({
  onSuccess, 
  leadId,
  customTagOptions
}: {
  onSuccess: () => void; 
  leadId: number;
  customTagOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: CustomTagValues = {
  custom_tag_id: 0,
 };

  const { control, handleSubmit } = useForm<CustomTagValues>({
    defaultValues: defaultData,
    resolver: zodResolver(CustomTagSchema)
  });

  // Debug logs for options (client-side; visible in browser console)
  try {
    // Only log a small sample to avoid noise
    // eslint-disable-next-line no-console
    console.log("[AddCustomTag] options sample:", customTagOptions.slice(0, 5));
    // eslint-disable-next-line no-console
    console.log("[AddCustomTag] option value types:", customTagOptions.slice(0, 5).map((o) => typeof o.value));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("[AddCustomTag] options debug failed:", e);
  }

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        lead_id: leadId,
        custom_tag_id: data.custom_tag_id,
      };
      
      await supabaseInsertRow('rel_lead_custom_tag', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Custom tag added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding custom tag:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add custom tag. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add Custom Tag</h3>
        
        <ToggleGroupInput 
          name="custom_tag_id" 
          label="Select Custom Tag" 
          control={control} 
          options={customTagOptions} 
          valueType="number"
          itemClassName="ime-choice-chips"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Custom Tag'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddCustomTag({ 
  leadId,
  customTagOptions
}: { 
  leadId: number;
  customTagOptions: { value: string; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <Tag className="w-4 h-4 mr-2" />
        Add Custom Tag
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add Custom Tag</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddCustomTagForm
                onSuccess={() => setShowAddSheet(false)}
                leadId={leadId}
                customTagOptions={customTagOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
