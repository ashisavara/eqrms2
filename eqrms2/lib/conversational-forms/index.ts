// Main exports for conversational forms system
// Import from this file for convenience: import { ConversationalFormSheet, ... } from '@/lib/conversational-forms'

// Types
export type {
  QuestionType,
  QuestionOption,
  FormQuestion,
  FormConfig,
  ConversationalFormProps,
  ConversationalFormSheetProps,
  ConversationalFormPageProps,
  AuditEntry,
  AuditData,
  ServerActionResponse
} from './types';

// Server Actions
export {
  createFormDraft,
  updateFormDraft,
  loadFormData,
  submitForm
} from './actions';

// Utility Functions
export {
  buildAuditData,
  getVisibleQuestions,
  findFirstUnansweredIndex,
  prepareFormData,
  parseFormData,
  getDefaultFormValues,
  isQuestionAnswered,
  calculateCompletionPercentage
} from './utils';

// Components (re-export for convenience)
export { ConversationalForm } from '@/components/conversational-form/ConversationalForm';
export { ConversationalFormSheet } from '@/components/conversational-form/ConversationalFormSheet';
export { ConversationalFormPage } from '@/components/conversational-form/ConversationalFormPage';
export { ProgressBar } from '@/components/conversational-form/ProgressBar';
export { FormNavigation } from '@/components/conversational-form/FormNavigation';
export { QuestionRenderer } from '@/components/conversational-form/QuestionRenderer';

// Example configs
export { surveyFormConfig } from './configs/surveyForm.config';

