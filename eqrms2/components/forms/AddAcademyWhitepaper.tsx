'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyWhitepaperSchema, AcademyWhitepaperValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";

// Internal form component
function AddAcademyWhitepaperForm({ 
  onSuccess
}: { 
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default empty values for new whitepaper
  const defaultData: AcademyWhitepaperValues = {
    whitepaper_name: "",
    whitepaper_date: null,
    whitepaper_summary: "",
    whitepaper_url: "",
    whitepaper_body: ""
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyWhitepaperValues>({
    defaultValues: defaultData,
    resolver: zodResolver(AcademyWhitepaperSchema),
  });

  const onSubmit = async (data: AcademyWhitepaperValues) => {
    setIsLoading(true);
    try {
      // Process data for Supabase
      const processedData = {
        whitepaper_name: data.whitepaper_name,
        whitepaper_date: toLocalDateString(data.whitepaper_date),
        whitepaper_summary: data.whitepaper_summary,
        whitepaper_url: data.whitepaper_url,
        whitepaper_body: data.whitepaper_body
      };
      
      await supabaseInsertRow('academy_whitepapers', processedData);
      
      if (typeof window !== "undefined") {
        toast.success("Whitepaper created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating whitepaper:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to create whitepaper. Please try again or contact support.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 !mt-0">
        <TextInput name="whitepaper_name" label="Whitepaper Name" control={control} placeholder="Enter whitepaper name" />
        <DatePicker name="whitepaper_date" label="Whitepaper Date" control={control} />
      </div>
      
      <TextInput name="whitepaper_summary" label="Summary" control={control} placeholder="Enter whitepaper summary" />
      <TextInput name="whitepaper_url" label="Whitepaper URL" control={control} placeholder="Enter whitepaper URL" />
      
      <ResizableTextArea name="whitepaper_body" label="Whitepaper Body" control={control} />
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Whitepaper'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddAcademyWhitepaperButton() {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-green-600 hover:bg-green-200 hover:underline cursor-pointer inline-flex items-center"
      >
        + Add Whitepaper
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Whitepaper</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddAcademyWhitepaperForm
                onSuccess={() => setShowAddSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
