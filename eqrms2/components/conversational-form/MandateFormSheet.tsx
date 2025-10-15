"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MandateFormSheetProps } from "@/lib/conversational-forms/types";
import { 
  getVisibleQuestions, 
  findFirstUnansweredIndex, 
  getDefaultFormValues,
  parseFormData
} from "@/lib/conversational-forms/utils";
import {
  loadMandateData,
  updateMandateField
} from "@/lib/conversational-forms/mandateActions";
import { ProgressBar } from "./ProgressBar";
import { QuestionRenderer } from "./QuestionRenderer";
import { FormNavigation } from "./FormNavigation";

export function MandateFormSheet({
  formConfig,
  mandateId,
  onComplete,
  trigger,
  open: controlledOpen,
  onOpenChange
}: MandateFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [formKey, setFormKey] = useState(0); // Key to force form re-render
  
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


  // Load existing mandate data when sheet opens
  useEffect(() => {
    if (isOpen && mandateId) {
      const loadExistingData = async () => {
        setIsInitializing(true);
        try {
          const result = await loadMandateData(mandateId);

          if (result.success && result.data) {
            const formValues = parseFormData(result.data, formConfig.questions);
            
            // Reset form with the parsed values and force update
            reset(formValues, { keepDefaultValues: false });
            
            // Force form re-render by updating the key
            setFormKey(prev => prev + 1);
            
            // Find first unanswered question for resuming
            const visibleQuestions = getVisibleQuestions(formConfig.questions, formValues);
            const firstUnansweredIndex = findFirstUnansweredIndex(visibleQuestions, formValues);
            setCurrentQuestionIndex(firstUnansweredIndex);
          } else {
            toast.error(result.error || 'Failed to load mandate data');
          }
        } catch (error) {
          console.error('Error loading mandate:', error);
          toast.error('Failed to load mandate data');
        } finally {
          setIsInitializing(false);
        }
      };

      loadExistingData();
    } else if (!isOpen) {
      // Reset form state when sheet closes
      reset(getDefaultFormValues(formConfig.questions));
      setCurrentQuestionIndex(0);
      setFormKey(0); // Reset form key
    }
  }, [isOpen, mandateId, formConfig, reset]);

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

    setIsLoading(true);

    try {
      const currentValues = getValues();
      const updateData = {
        [currentQuestion.field]: currentValues[currentQuestion.field]
      };

      // Update mandate with current answer
      const result = await updateMandateField(mandateId, updateData);

      if (result.success) {
        toast.success('Progress saved');
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        toast.error(result.error || 'Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
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

      // Update mandate with all final values
      const result = await updateMandateField(mandateId, finalData);

      if (result.success) {
        toast.success('Form submitted successfully!');
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
    setIsOpen(false);
  };

  // Show loading state while initializing
  if (isOpen && isInitializing) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading form...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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
              <div className="mb-6 animate-in fade-in duration-300" key={`${formKey}-${currentQuestion.id}`}>
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

