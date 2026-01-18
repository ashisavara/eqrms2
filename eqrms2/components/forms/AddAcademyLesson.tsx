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
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";

// Internal form component
function AddAcademyLessonForm({ 
  onSuccess
}: { 
  onSuccess?: () => void;
}) {
  // Get options from context (static options)
  const masterOptions = useMasterOptions();
  const difficultyOptions = transformToValueLabel(masterOptions.lessonDifficulty);
  const courseOptions = transformToValueLabel(masterOptions.course);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default empty values for new lesson
  const defaultData: AcademyLessonValues = {
    lesson_name: "",
    summary: "",
    youtube_url: "",
    lesson_body: "",
    difficulty: "",
    course: "",
    sort_order: 0,
    time: 0
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AcademyLessonValues>({
    defaultValues: defaultData,
    resolver: zodResolver(AcademyLessonSchema),
  });

  const onSubmit = async (data: AcademyLessonValues) => {
    setIsLoading(true);
    try {
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
      
      await supabaseInsertRow('academy_lessons', processedData);
      
      if (typeof window !== "undefined") {
        toast.success("Academy lesson created successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh(); // Refresh server data without resetting client state
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating academy lesson:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to create academy lesson. Please try again or contact support.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-4 pb-2 space-y-3">
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
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Lesson'}
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function AddAcademyLessonButton() {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <span 
        onClick={() => setShowAddSheet(true)}
        className="pl-2 font-bold text-green-600 hover:bg-green-200 hover:underline cursor-pointer inline-flex items-center"
      >
        + Add Lesson
      </span>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Add New Academy Lesson</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <AddAcademyLessonForm
                onSuccess={() => setShowAddSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
