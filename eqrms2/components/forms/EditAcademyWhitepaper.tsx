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
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { Pencil } from "lucide-react";

// Internal form component
function EditAcademyWhitepaperForm({ 
  initialData, 
  whitepaperId,
  onSuccess
}: { 
  initialData: AcademyWhitepaperValues; 
  whitepaperId: number;  
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: AcademyWhitepaperValues = {
    whitepaper_name: initialData.whitepaper_name ?? "",
    whitepaper_date: initialData.whitepaper_date ? new Date(initialData.whitepaper_date) : null,
    whitepaper_summary: initialData.whitepaper_summary ?? "",
    whitepaper_url: initialData.whitepaper_url ?? "",
    whitepaper_body: initialData.whitepaper_body ?? ""
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyWhitepaperValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(AcademyWhitepaperSchema),
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

  const onSubmit = async (data: AcademyWhitepaperValues) => {
    setIsLoading(true);
    
    try {
      if (!whitepaperId) {
        throw new Error('whitepaper_id is required for updates');
      }
      
      // Process data for Supabase
      const processedData = {
        whitepaper_name: data.whitepaper_name,
        whitepaper_date: toLocalDateString(data.whitepaper_date),
        whitepaper_summary: data.whitepaper_summary,
        whitepaper_url: data.whitepaper_url,
        whitepaper_body: data.whitepaper_body
      };
      
      await supabaseUpdateRow('academy_whitepapers', 'whitepaper_id', whitepaperId, processedData);
      
      if (typeof window !== "undefined") {
        setIsLoading(false);
        toast.success("Whitepaper updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating whitepaper:', error);
      const errorMessage = getErrorMessage(error);
      
      if (typeof window !== "undefined") {
        toast.error(`Failed to update whitepaper: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 !mt-0">
        <TextInput name="whitepaper_name" label="Whitepaper Name" control={control} placeholder="Enter whitepaper name" />
        <DatePicker name="whitepaper_date" label="Whitepaper Date" control={control} />
      </div>
      
      <TextInput name="whitepaper_summary" label="Summary" control={control} placeholder="Enter whitepaper summary" />
      <TextInput name="whitepaper_url" label="Whitepaper URL" control={control} placeholder="Enter whitepaper URL" />
      
      <ResizableTextArea name="whitepaper_body" label="Whitepaper Body" control={control} />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Whitepaper'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAcademyWhitepaperButton({ 
  whitepaperData,
  whitepaperId
}: { 
  whitepaperData: any;
  whitepaperId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!whitepaperId) {
    console.error('whitepaperId is required but not provided');
  }

  // Convert whitepaper data to AcademyWhitepaperValues format
  const whitepaperUpdateData: AcademyWhitepaperValues = {
    whitepaper_name: whitepaperData.whitepaper_name ?? "",
    whitepaper_date: whitepaperData.whitepaper_date ? new Date(whitepaperData.whitepaper_date) : null,
    whitepaper_summary: whitepaperData.whitepaper_summary ?? "",
    whitepaper_url: whitepaperData.whitepaper_url ?? "",
    whitepaper_body: whitepaperData.whitepaper_body ?? ""
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
              <SheetTitle>Edit Whitepaper</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAcademyWhitepaperForm
                initialData={whitepaperUpdateData}
                whitepaperId={whitepaperId}  
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
