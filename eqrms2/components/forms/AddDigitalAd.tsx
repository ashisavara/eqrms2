// PLEASE NOTE ,THIS IS NOW A MORE GENERIC TAGGING THAN JUST DIGITAL ADS

'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { DigitalAdSchema, DigitalAdValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { Zap } from "lucide-react";

// Internal form component
function AddDigitalAdForm({
  onSuccess, 
  leadId,
  digitalAdOptions
}: {
  onSuccess: () => void; 
  leadId: number;
  digitalAdOptions: { value: string | number; label: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Default values
  const defaultData: DigitalAdValues = {
    digital_id: 0,
  };

  const { control, handleSubmit } = useForm<DigitalAdValues>({
    defaultValues: defaultData,
    resolver: zodResolver(DigitalAdSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const insertData = {
        lead_id: leadId,
        digital_id: data.digital_id, // Assuming this is the ID from the select
      };
      
      await supabaseInsertRow('rel_lead_digital_ads', insertData);
      
      if (typeof window !== "undefined") {
        toast.success("Tag added successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding Tag:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to add Tag. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-600 border-b pb-2">Add Tags</h3>
        
        <SelectInput 
          name="digital_id" 
          label="Select Digital Channel/Campaign" 
          control={control} 
          options={digitalAdOptions} 
          valueType="number"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Tag'}
        </Button>
      </div>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddDigitalAd({ 
  leadId,
  digitalAdOptions
}: { 
  leadId: number;
  digitalAdOptions: { value: string | number; label: string }[];
}) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="cursor-pointer flex items-center w-full p-2 hover:bg-gray-100 rounded"
      >
        <Zap className="w-4 h-4 mr-2" />
        Add Tags
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add Tags</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddDigitalAdForm
                onSuccess={() => setShowAddSheet(false)}
                leadId={leadId}
                digitalAdOptions={digitalAdOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
