"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ConversationalFormProps } from "@/lib/conversational-forms/types";
import { 
  getVisibleQuestions, 
  findFirstUnansweredIndex, 
  getDefaultFormValues,
  parseFormData,
  prepareFormData
} from "@/lib/conversational-forms/utils";
import {
  createFormDraft,
  updateFormDraft,
  loadFormData,
  submitForm
} from "@/lib/conversational-forms/actions";
import { ProgressBar } from "./ProgressBar";
import { QuestionRenderer } from "./QuestionRenderer";
import { FormNavigation } from "./FormNavigation";

export function ConversationalForm({
  formConfig,
  mode,
  recordId: initialRecordId,
  onComplete,
  onCancel
}: ConversationalFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordId, setRecordId] = useState<number | undefined>(initialRecordId);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(mode === 'edit');

  // Create a dynamic Zod schema from all questions
  const formSchema = z.object(
    formConfig.questions.reduce((acc, question) => {
      acc[question.field] = question.validation;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  // Initialize form with default values
  const { control, handleSubmit, trigger, getValues, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultFormValues(formConfig.questions),
    mode: 'onSubmit'
  });

  // Load existing data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && recordId) {
      const loadExistingData = async () => {
        setIsInitializing(true);
        try {
          const result = await loadFormData(
            formConfig.table,
            formConfig.idColumn,
            recordId
          );

          if (result.success && result.data) {
            const formValues = parseFormData(result.data, formConfig.questions);
            reset(formValues);
            
            // Find first unanswered question for resuming
            const visibleQuestions = getVisibleQuestions(formConfig.questions, formValues);
            const firstUnansweredIndex = findFirstUnansweredIndex(visibleQuestions, formValues);
            setCurrentQuestionIndex(firstUnansweredIndex);
          } else {
            toast.error(result.error || 'Failed to load form data');
          }
        } catch (error) {
          console.error('Error loading form:', error);
          toast.error('Failed to load form data');
        } finally {
          setIsInitializing(false);
        }
      };

      loadExistingData();
    }
  }, [mode, recordId, formConfig, reset]);

  // Calculate visible questions based on current form values
  const formValues = getValues();
  const visibleQuestions = getVisibleQuestions(formConfig.questions, formValues);
  const currentQuestion = visibleQuestions[currentQuestionIndex];

  // Navigation handlers
  const handleNext = async () => {
    if (!currentQuestion) return;

    // Validate current question
    const isValid = await trigger(currentQuestion.field);
    if (!isValid) {
      toast.error('Please answer the question correctly before continuing');
      return;
    }

    setIsLoading(true);

    try {
      const currentValues = getValues();
      const updateData = prepareFormData(
        currentQuestion,
        currentValues,
        formConfig.statusColumn || 'form_status',
        formConfig.auditColumn || 'submission_data',
        formConfig,
        visibleQuestions
      );

      // Check if we need to create or update
      let currentRecordId = recordId;

      if (mode === 'create' && !currentRecordId) {
        // First answer - create draft
        const result = await createFormDraft(formConfig.table, {
          ...updateData,
          [formConfig.statusColumn || 'form_status']: 'draft'
        });

        if (result.success && result.data) {
          currentRecordId = result.data.id;
          setRecordId(currentRecordId);
          toast.success('Progress saved');
        } else {
          toast.error(result.error || 'Failed to save progress');
          setIsLoading(false);
          return;
        }
      } else if (currentRecordId) {
        // Subsequent answers - update draft
        const result = await updateFormDraft(
          formConfig.table,
          formConfig.idColumn,
          currentRecordId,
          updateData
        );

        if (result.success) {
          toast.success('Progress saved');
        } else {
          toast.error(result.error || 'Failed to save progress');
          setIsLoading(false);
          return;
        }
      } else {
        toast.error('Unable to save progress');
        setIsLoading(false);
        return;
      }

      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
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
    const isValid = await trigger(currentQuestion.field);
    if (!isValid) {
      toast.error('Please answer the question correctly before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const allValues = getValues();
      
      // Prepare final data with all fields
      const finalData: Record<string, any> = {};
      visibleQuestions.forEach(q => {
        finalData[q.field] = allValues[q.field];
      });

      // Build audit data
      const auditData = prepareFormData(
        currentQuestion,
        allValues,
        formConfig.statusColumn || 'form_status',
        formConfig.auditColumn || 'submission_data',
        formConfig,
        visibleQuestions
      )[formConfig.auditColumn || 'submission_data'];

      // If for some reason we don't have a recordId yet (shouldn't happen), create it first
      let currentRecordId = recordId;
      if (!currentRecordId) {
        const createResult = await createFormDraft(formConfig.table, {
          ...finalData,
          [formConfig.statusColumn || 'form_status']: 'draft',
          [formConfig.auditColumn || 'submission_data']: auditData
        });
        
        if (createResult.success && createResult.data) {
          currentRecordId = createResult.data.id;
          setRecordId(currentRecordId);
        } else {
          toast.error(createResult.error || 'Failed to save form');
          setIsLoading(false);
          return;
        }
      }

      const result = await submitForm(
        formConfig.table,
        formConfig.idColumn,
        currentRecordId,
        finalData,
        auditData
      );

      if (result.success) {
        toast.success('Form submitted successfully!');
        setTimeout(() => {
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

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  // Show error if no visible questions
  if (visibleQuestions.length === 0) {
    return (
      <div className="p-8 text-center text-red-600">
        No questions available for this form.
      </div>
    );
  }

  // Show error if current question is not found
  if (!currentQuestion) {
    return (
      <div className="p-8 text-center text-red-600">
        Question not found.
      </div>
    );
  }

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Form header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formConfig.title}
        </h2>
        {formConfig.description && (
          <p className="text-gray-600">{formConfig.description}</p>
        )}
      </div>

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
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

