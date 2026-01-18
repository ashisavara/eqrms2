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
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { Pencil } from "lucide-react";

// Internal form component
function EditAcademyWebinarForm({ 
  initialData, 
  webinarId,
  onSuccess
}: { 
  initialData: AcademyWebinarValues; 
  webinarId: number;  
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: AcademyWebinarValues = {
    webinar_name: initialData.webinar_name ?? "",
    webinar_date: initialData.webinar_date ? new Date(initialData.webinar_date) : null,
    webinar_summary: initialData.webinar_summary ?? "",
    youtube_url: initialData.youtube_url ?? "",
    webinar_body: initialData.webinar_body ?? ""
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyWebinarValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(AcademyWebinarSchema),
  });

  // Helper function to extract error message from Supabase errors
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      const supabaseError = error as any;
      if (supabaseError.message) {
        return supabaseError.message;
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  // Helper function to format validation errors for display
  const getValidationErrorMessage = (errors: Record<string, any>): string => {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length === 0) {
      return 'Please fix the form errors before submitting.';
    }
    
    const firstError = errorEntries[0];
    const fieldName = firstError[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const errorMessage = firstError[1]?.message || 'Invalid value';
    
    if (errorEntries.length > 1) {
      return `${fieldName}: ${errorMessage} (and ${errorEntries.length - 1} other error${errorEntries.length > 2 ? 's' : ''})`;
    }
    
    return `${fieldName}: ${errorMessage}`;
  };

  // Handle validation errors
  const onError = (errors: Record<string, any>) => {
    console.error('Form validation errors:', errors);
    const errorMessage = getValidationErrorMessage(errors);
    
    if (typeof window !== "undefined") {
      toast.error(`Validation failed: ${errorMessage}`);
    }
    
    // Scroll to first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
    }
  };

  const onSubmit = async (data: AcademyWebinarValues) => {
    setIsLoading(true);
    
    try {
      if (!webinarId) {
        throw new Error('webinar_id is required for updates');
      }
      
      // Process data for Supabase
      const processedData = {
        webinar_name: data.webinar_name,
        webinar_date: toLocalDateString(data.webinar_date),
        webinar_summary: data.webinar_summary,
        youtube_url: data.youtube_url,
        webinar_body: data.webinar_body
      };
      
      await supabaseUpdateRow('academy_webinar', 'webinar_id', webinarId, processedData);
      
      if (typeof window !== "undefined") {
        setIsLoading(false);
        toast.success("Webinar updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating webinar:', error);
      const errorMessage = getErrorMessage(error);
      
      if (typeof window !== "undefined") {
        toast.error(`Failed to update webinar: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 !mt-0">
        <TextInput name="webinar_name" label="Webinar Name" control={control} placeholder="Enter webinar name" />
        <DatePicker name="webinar_date" label="Webinar Date" control={control} />
      </div>
      
      <TextInput name="webinar_summary" label="Summary" control={control} placeholder="Enter webinar summary" />
      <TextInput name="youtube_url" label="YouTube URL" control={control} placeholder="Enter YouTube URL" />
      
      <ResizableTextArea name="webinar_body" label="Webinar Body" control={control} />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Webinar'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAcademyWebinarButton({ 
  webinarData,
  webinarId
}: { 
  webinarData: any;
  webinarId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!webinarId) {
    console.error('webinarId is required but not provided');
  }

  // Convert webinar data to AcademyWebinarValues format
  const webinarUpdateData: AcademyWebinarValues = {
    webinar_name: webinarData.webinar_name ?? "",
    webinar_date: webinarData.webinar_date ? new Date(webinarData.webinar_date) : null,
    webinar_summary: webinarData.webinar_summary ?? "",
    youtube_url: webinarData.youtube_url ?? "",
    webinar_body: webinarData.webinar_body ?? ""
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="cursor-pointer inline-flex items-center ml-2"
      >
        <Pencil className="w-4 h-4" />
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Webinar</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAcademyWebinarForm
                initialData={webinarUpdateData}
                webinarId={webinarId}  
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
