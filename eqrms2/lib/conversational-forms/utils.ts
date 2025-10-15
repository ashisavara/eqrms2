import { FormQuestion, FormConfig, AuditData, AuditEntry } from "./types";

/**
 * Build audit data object for JSONB column
 * Contains all questions and answers for historical record
 */
export function buildAuditData(
  formConfig: FormConfig,
  formValues: Record<string, any>,
  visibleQuestions: FormQuestion[]
): AuditData {
  const entries: AuditEntry[] = visibleQuestions.map(question => ({
    questionId: question.id,
    questionLabel: question.label,
    answer: formValues[question.field],
    answeredAt: new Date().toISOString()
  }));

  return {
    formType: formConfig.formType,
    formTitle: formConfig.title,
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    entries
  };
}

/**
 * Filter questions based on conditional logic (showIf functions)
 * Returns only questions that should be visible given current form values
 */
export function getVisibleQuestions(
  questions: FormQuestion[],
  formValues: Record<string, any>
): FormQuestion[] {
  return questions.filter(question => {
    // If no showIf function, question is always visible
    if (!question.showIf) {
      return true;
    }
    
    // Evaluate showIf function with current form values
    try {
      return question.showIf(formValues);
    } catch (error) {
      console.error(`Error evaluating showIf for question ${question.id}:`, error);
      return true; // Show question by default if evaluation fails
    }
  });
}

/**
 * Find the first unanswered question index
 * Used for resuming incomplete forms
 */
export function findFirstUnansweredIndex(
  questions: FormQuestion[],
  formValues: Record<string, any>
): number {
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const value = formValues[question.field];
    
    // Check if question is unanswered
    if (value === null || value === undefined || value === '') {
      return i;
    }
  }
  
  // All questions answered, return last index
  return questions.length - 1;
}

/**
 * Prepare form data for database insert/update
 * Converts form values to appropriate format for Supabase
 */
export function prepareFormData(
  currentQuestion: FormQuestion,
  formValues: Record<string, any>,
  statusColumn: string = 'form_status',
  auditColumn: string = 'submission_data',
  formConfig: FormConfig,
  visibleQuestions: FormQuestion[]
): Record<string, any> {
  const data: Record<string, any> = {
    [currentQuestion.field]: formValues[currentQuestion.field]
  };

  // Add audit data
  data[auditColumn] = buildAuditData(formConfig, formValues, visibleQuestions);

  return data;
}

/**
 * Parse database row to form default values
 * Converts database format to react-hook-form format
 */
export function parseFormData(
  dbData: Record<string, any>,
  questions: FormQuestion[]
): Record<string, any> {
  const formValues: Record<string, any> = {};

  questions.forEach(question => {
    const dbValue = dbData[question.field];
    
    // Handle different types
    if (question.type === 'date' && dbValue) {
      formValues[question.field] = new Date(dbValue);
    } else if (question.type === 'boolean') {
      formValues[question.field] = dbValue ?? false;
    } else if (question.type === 'number') {
      formValues[question.field] = dbValue ?? null;
    } else if (question.type === 'radio' || question.type === 'select' || question.type === 'toggle') {
      // Convert numeric values to strings for radio/select/toggle
      // (database might store as NUMERIC but form expects string enum)
      formValues[question.field] = dbValue !== null && dbValue !== undefined ? String(dbValue) : '';
    } else {
      formValues[question.field] = dbValue ?? '';
    }
  });

  return formValues;
}

/**
 * Get default values for a new form
 * Initialize all fields with appropriate empty values
 */
export function getDefaultFormValues(questions: FormQuestion[]): Record<string, any> {
  const defaultValues: Record<string, any> = {};

  questions.forEach(question => {
    switch (question.type) {
      case 'boolean':
        defaultValues[question.field] = false;
        break;
      case 'number':
        defaultValues[question.field] = null;
        break;
      case 'date':
        defaultValues[question.field] = null;
        break;
      default:
        defaultValues[question.field] = '';
    }
  });

  return defaultValues;
}

/**
 * Check if a question has been answered
 */
export function isQuestionAnswered(
  question: FormQuestion,
  formValues: Record<string, any>
): boolean {
  const value = formValues[question.field];
  
  if (question.type === 'boolean') {
    return value !== null && value !== undefined;
  }
  
  if (question.type === 'number') {
    return value !== null && value !== undefined && value !== '';
  }
  
  return value !== null && value !== undefined && value !== '';
}

/**
 * Calculate form completion percentage
 */
export function calculateCompletionPercentage(
  visibleQuestions: FormQuestion[],
  formValues: Record<string, any>
): number {
  if (visibleQuestions.length === 0) return 0;
  
  const answeredCount = visibleQuestions.filter(q => 
    isQuestionAnswered(q, formValues)
  ).length;
  
  return Math.round((answeredCount / visibleQuestions.length) * 100);
}

