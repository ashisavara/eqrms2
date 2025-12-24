"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { riskProfilerFormConfig } from "@/lib/conversational-forms/configs/riskProfiler.config";
import { 
  getVisibleQuestions, 
  getDefaultFormValues,
  parseFormData
} from "@/lib/conversational-forms/utils";
import {
  RiskProfilerAnswers,
  calculateAllScores,
  isRiskProfilerComplete
} from "@/lib/conversational-forms/riskProfilerCalculations";
import { submitRiskProfiler } from "@/lib/conversational-forms/riskProfilerActions";
import { loadMandateData } from "@/lib/conversational-forms/mandateActions";
import { ProgressBar } from "./ProgressBar";
import { QuestionRenderer } from "./QuestionRenderer";
import { FormNavigation } from "./FormNavigation";
import { RiskProfilerSummary } from "./RiskProfilerSummary";

interface RiskProfilerFormProps {
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function RiskProfilerForm({
  groupId,
  open,
  onOpenChange,
  onComplete
}: RiskProfilerFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [formKey, setFormKey] = useState(0); // Key to force form re-render

  // Create a dynamic Zod schema from all questions
  const formSchema = z.object(
    riskProfilerFormConfig.questions.reduce((acc, question) => {
      acc[question.field] = question.validation;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  // Initialize form with default values
  const defaultValues = getDefaultFormValues(riskProfilerFormConfig.questions);
  
  const { control, trigger: triggerValidation, getValues, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit'
  });

  // Load existing group data when form opens
  useEffect(() => {
    if (open && groupId) {
      const loadExistingData = async () => {
        setIsInitializing(true);
        try {
          const result = await loadMandateData(groupId);

          if (result.success && result.data) {
            const formValues = parseFormData(result.data, riskProfilerFormConfig.questions);
            reset(formValues, { keepDefaultValues: false });
            
            // Force form re-render by updating the key
            setFormKey(prev => prev + 1);
            
            // Ensure submitting state is reset when loading data
            setIsSubmitting(false);
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
    } else if (!open) {
      // Reset form state when sheet closes
      reset(getDefaultFormValues(riskProfilerFormConfig.questions));
      setCurrentQuestionIndex(0);
      setShowSummary(false);
      setFormKey(0); // Reset form key
      setIsSubmitting(false); // Reset submitting state
    }
  }, [open, groupId, reset]);

  // Calculate visible questions based on current form values
  const formValues = getValues();
  const visibleQuestions = getVisibleQuestions(riskProfilerFormConfig.questions, formValues);
  const currentQuestion = visibleQuestions[currentQuestionIndex];

  // Calculate scores for final submission
  const answers = formValues as RiskProfilerAnswers;
  const scores = calculateAllScores(answers);
  const isComplete = isRiskProfilerComplete(answers);

  // Navigation handlers
  const handleNext = async () => {
    if (!currentQuestion) return;

    // Validate current question
    const isValid = await triggerValidation(currentQuestion.field);
    if (!isValid) {
      toast.error('Please answer the question correctly before continuing');
      return;
    }

    // Move to next question or show summary
    if (currentQuestionIndex === visibleQuestions.length - 1) {
      // Last question - show summary
      setShowSummary(true);
      setIsSubmitting(false); // Ensure submitting state is false when showing summary
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
      setIsSubmitting(false); // Reset submitting state when going back from summary
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitForm = async () => {
    if (!isComplete) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitRiskProfiler(groupId, answers, scores);

      if (result.success) {
        toast.success('Risk profile saved successfully!');
        setTimeout(() => {
          setIsSubmitting(false);
          onOpenChange(false);
          onComplete?.();
          // Reset form state
          reset();
          setCurrentQuestionIndex(0);
          setShowSummary(false);
        }, 500);
      } else {
        toast.error(result.error || 'Failed to submit risk profiler');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting risk profiler:', error);
      toast.error('Failed to submit risk profiler');
      setIsSubmitting(false);
    }
  };

  const handleEditAnswers = () => {
    setShowSummary(false);
    setIsSubmitting(false); // Reset submitting state when editing
  };

  const handleCancel = () => {
    // Reset form on cancel
    reset();
    setCurrentQuestionIndex(0);
    setShowSummary(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Show error if no visible questions
  if (open && visibleQuestions.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
          <div className="p-8 text-center text-red-600">
            No questions available for this form.
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  // Show loading state while initializing
  if (open && isInitializing) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-8 w-full sm:max-w-4xl overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>{riskProfilerFormConfig.title}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {showSummary ? (
            /* Summary/Confirmation Screen */
            <RiskProfilerSummary
              scores={scores}
              onConfirm={handleSubmitForm}
              onEdit={handleEditAnswers}
              isSubmitting={isSubmitting}
            />
          ) : (
            /* Question Flow */
            <div className="w-full mx-auto">
              {/* Form description */}
              {riskProfilerFormConfig.description && (
                <p className="text-gray-600 mb-6">{riskProfilerFormConfig.description}</p>
              )}

              {/* Progress bar */}
              <ProgressBar 
                current={currentQuestionIndex} 
                total={visibleQuestions.length} 
              />

              {/* Current question */}
              {currentQuestion && (
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
              )}

              {/* Navigation */}
              <FormNavigation
                isFirstQuestion={isFirstQuestion}
                isLastQuestion={isLastQuestion}
                isLoading={false}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleNext} // Go to summary on last question
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

