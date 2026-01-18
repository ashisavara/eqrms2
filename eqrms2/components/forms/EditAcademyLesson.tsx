'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyLessonSchema, AcademyLessonValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, NumberInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { Pencil } from "lucide-react";

// Internal form component
function EditAcademyLessonForm({ 
  initialData, 
  lessonId,
  onSuccess
}: { 
  initialData: AcademyLessonValues; 
  lessonId: number;  
  onSuccess?: () => void;
}) {
  // Get options from context (static options)
  const masterOptions = useMasterOptions();
  const difficultyOptions = transformToValueLabel(masterOptions.lessonDifficulty);
  const courseOptions = transformToValueLabel(masterOptions.course);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert null values to empty strings/defaults for form inputs
  const cleanedData: AcademyLessonValues = {
    lesson_name: initialData.lesson_name ?? "",
    summary: initialData.summary ?? "",
    youtube_url: initialData.youtube_url ?? "",
    lesson_body: initialData.lesson_body ?? "",
    difficulty: initialData.difficulty ?? "",
    course: initialData.course ?? "",
    sort_order: initialData.sort_order ?? 0,
    time: initialData.time ?? 0
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyLessonValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(AcademyLessonSchema),
  });

  // Helper function to extract error message from Supabase errors
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Check if it's a Supabase error with a message
      const supabaseError = error as any;
      if (supabaseError.message) {
        // Supabase errors often have detailed messages
        return supabaseError.message;
      }
      // Generic Error object
      return error.message;
    }
    // Fallback for unknown error types
    return 'An unexpected error occurred. Please try again.';
  };

  // Helper function to format validation errors for display
  const getValidationErrorMessage = (errors: Record<string, any>): string => {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length === 0) {
      return 'Please fix the form errors before submitting.';
    }
    
    // Get the first error message
    const firstError = errorEntries[0];
    const fieldName = firstError[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const errorMessage = firstError[1]?.message || 'Invalid value';
    
    // If there are multiple errors, mention the count
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

  const onSubmit = async (data: AcademyLessonValues) => {
    setIsLoading(true);
    
    try {
      if (!lessonId) {
        throw new Error('lesson_id is required for updates');
      }
      
      // Process data for Supabase
      const processedData = {
        lesson_name: data.lesson_name,
        summary: data.summary,
        youtube_url: data.youtube_url,
        lesson_body: data.lesson_body,
        difficulty: data.difficulty,
        course: data.course,
        sort_order: data.sort_order || 0,
        time: data.time || 0
      };
      
      await supabaseUpdateRow('academy_lessons', 'lesson_id', lessonId, processedData);
      
      if (typeof window !== "undefined") {
        setIsLoading(false);
        toast.success("Academy lesson updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating academy lesson:', error);
      const errorMessage = getErrorMessage(error);
      
      if (typeof window !== "undefined") {
        toast.error(`Failed to update academy lesson: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full px-4 pt-4 pb-2 space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 !mt-0">
        <TextInput name="lesson_name" label="Lesson Name" control={control} placeholder="Enter lesson name" />
        <TextInput name="youtube_url" label="YouTube URL" control={control} placeholder="Enter YouTube URL" />
      </div>
      
      <TextInput name="summary" label="Summary" control={control} placeholder="Enter lesson summary" />
      
      <div className="bg-gray-100 p-4">
        <div className="grid grid-cols-4 gap-4">
          <SelectInput name="difficulty" label="Difficulty" control={control} options={difficultyOptions} />
          <SelectInput name="course" label="Course" control={control} options={courseOptions} />
          <NumberInput name="sort_order" label="Sort Order" control={control} placeholder="0" min={0} />
          <NumberInput name="time" label="Time (minutes)" control={control} placeholder="0" min={0} />
        </div>
      </div>
      
      <ResizableTextArea name="lesson_body" label="Lesson Body" control={control} />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Lesson'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAcademyLessonButton({ 
  lessonData,
  lessonId
}: { 
  lessonData: any;
  lessonId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!lessonId) {
    console.error('lessonId is required but not provided');
  }

  // Convert lesson data to AcademyLessonValues format
  const lessonUpdateData: AcademyLessonValues = {
    lesson_name: lessonData.lesson_name ?? "",
    summary: lessonData.summary ?? "",
    youtube_url: lessonData.youtube_url ?? "",
    lesson_body: lessonData.lesson_body ?? "",
    difficulty: lessonData.difficulty ?? "",
    course: lessonData.course ?? "",
    sort_order: lessonData.sort_order ?? 0,
    time: lessonData.time ?? 0
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
              <SheetTitle>Edit Academy Lesson</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAcademyLessonForm
                initialData={lessonUpdateData}
                lessonId={lessonId}  
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
