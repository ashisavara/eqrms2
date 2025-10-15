"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SimpleFormSheetProps } from "@/lib/conversational-forms/types";
import { 
  getVisibleQuestions, 
  getDefaultFormValues
} from "@/lib/conversational-forms/utils";
import { insertFormData } from "@/lib/conversational-forms/simpleActions";
import { ProgressBar } from "./ProgressBar";
import { QuestionRenderer } from "./QuestionRenderer";
import { FormNavigation } from "./FormNavigation";

export function SimpleFormSheet({
  formConfig,
  onComplete,
  trigger,
  open: controlledOpen,
  onOpenChange
}: SimpleFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Create a dynamic Zod schema from all questions
  const formSchema = z.object(
    formConfig.questions.reduce((acc, question) => {
      acc[question.field] = question.validation;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  // Initialize form with default values
  const defaultValues = getDefaultFormValues(formConfig.questions);
  
  const { control, handleSubmit, trigger: triggerValidation, getValues, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit'
  });

  // Calculate visible questions based on current form values
  const formValues = getValues();
  const visibleQuestions = getVisibleQuestions(formConfig.questions, formValues);
  const currentQuestion = visibleQuestions[currentQuestionIndex];

  // Navigation handlers
  const handleNext = async () => {
    if (!currentQuestion) return;

    // Validate current question
    const isValid = await triggerValidation(currentQuestion.field);
    if (!isValid) {
      toast.error('Please answer the question correctly before continuing');
      return;
    }

    // Just move to next question (no database save)
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitForm = async () => {
    if (!currentQuestion) return;

    // Validate final question
    const isValid = await triggerValidation(currentQuestion.field);
    if (!isValid) {
      toast.error('Please answer the question correctly before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const allValues = getValues();
      
      // Prepare final data with all visible fields
      const finalData: Record<string, any> = {};
      visibleQuestions.forEach(q => {
        finalData[q.field] = allValues[q.field];
      });

      // Insert all data at once
      const result = await insertFormData(formConfig.table, finalData);

      if (result.success) {
        toast.success('Form submitted successfully!');
        // Reset form for next submission
        reset();
        setCurrentQuestionIndex(0);
        setTimeout(() => {
          setIsOpen(false);
          onComplete?.();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to submit form');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form on cancel
    reset();
    setCurrentQuestionIndex(0);
    setIsOpen(false);
  };

  // Show error if no visible questions
  if (isOpen && visibleQuestions.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
          <div className="p-8 text-center text-red-600">
            No questions available for this form.
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Show error if current question is not found
  if (isOpen && !currentQuestion) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
          <div className="p-8 text-center text-red-600">
            Question not found.
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  return (
    <>
      {/* Trigger element */}
      {trigger && (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      )}

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>{formConfig.title}</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="w-full mx-auto">
              {/* Form description */}
              {formConfig.description && (
                <p className="text-gray-600 mb-6">{formConfig.description}</p>
              )}

              {/* Progress bar */}
              <ProgressBar 
                current={currentQuestionIndex} 
                total={visibleQuestions.length} 
              />

              {/* Current question */}
              <div className="mb-6 animate-in fade-in duration-300">
                <QuestionRenderer 
                  question={currentQuestion} 
                  control={control} 
                />
                
                {/* Helper text */}
                {currentQuestion.helperText && (
                  <p className="mt-2 text-sm text-gray-500">
                    {currentQuestion.helperText}
                  </p>
                )}
                
                {/* Error message */}
                {errors[currentQuestion.field] && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors[currentQuestion.field]?.message as string}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <FormNavigation
                isFirstQuestion={isFirstQuestion}
                isLastQuestion={isLastQuestion}
                isLoading={isLoading}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmitForm}
              />

              {/* Cancel button */}
              <button
                type="button"
                onClick={handleCancel}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

