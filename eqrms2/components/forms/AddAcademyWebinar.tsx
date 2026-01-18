'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyWebinarSchema, AcademyWebinarValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";

// Internal form component
function AddAcademyWebinarForm({ 
  onSuccess
}: { 
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default empty values for new webinar
  const defaultData: AcademyWebinarValues = {
    webinar_name: "",
    webinar_date: null,
    webinar_summary: "",
    youtube_url: "",
    webinar_body: ""
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyWebinarValues>({
    defaultValues: defaultData,
    resolver: zodResolver(AcademyWebinarSchema),
  });

  const onSubmit = async (data: AcademyWebinarValues) => {
    setIsLoading(true);
    try {
      // Process data for Supabase
      const processedData = {
        webinar_name: data.webinar_name,
        webinar_date: toLocalDateString(data.webinar_date),
        webinar_summary: data.webinar_summary,
        youtube_url: data.youtube_url,
        webinar_body: data.webinar_body
      };
      
      await supabaseInsertRow('academy_webinar', processedData);
      
      if (typeof window !== "undefined") {
        toast.success("Webinar created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating webinar:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to create webinar. Please try again or contact support.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 !mt-0">
        <TextInput name="webinar_name" label="Webinar Name" control={control} placeholder="Enter webinar name" />
        <DatePicker name="webinar_date" label="Webinar Date" control={control} />
      </div>
      
      <TextInput name="webinar_summary" label="Summary" control={control} placeholder="Enter webinar summary" />
      <TextInput name="youtube_url" label="YouTube URL" control={control} placeholder="Enter YouTube URL" />
      
      <ResizableTextArea name="webinar_body" label="Webinar Body" control={control} />
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Webinar'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddAcademyWebinarButton() {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-green-600 hover:bg-green-200 hover:underline cursor-pointer inline-flex items-center"
      >
        + Add Webinar
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Webinar</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddAcademyWebinarForm
                onSuccess={() => setShowAddSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
