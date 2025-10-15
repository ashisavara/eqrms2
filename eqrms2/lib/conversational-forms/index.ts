// Main exports for conversational forms system
// Import from this file for convenience: import { MandateFormSheet, SimpleFormSheet, ... } from '@/lib/conversational-forms'

// ============================================
// NEW SIMPLIFIED TYPES
// ============================================
export type {
  MandateFormConfig,
  MandateFormSheetProps,
  SimpleFormConfig,
  SimpleFormSheetProps,
} from './types';

// ============================================
// NEW SIMPLIFIED ACTIONS
// ============================================
// Mandate Actions
export {
  loadMandateData,
  updateMandateField
} from './mandateActions';

// Simple Actions
export {
  insertFormData
} from './simpleActions';

// ============================================
// NEW SIMPLIFIED COMPONENTS
// ============================================
export { MandateFormSheet } from '@/components/conversational-form/MandateFormSheet';
export { SimpleFormSheet } from '@/components/conversational-form/SimpleFormSheet';

// ============================================
// SHARED UTILITIES & TYPES
// ============================================
export type {
  QuestionType,
  QuestionOption,
  FormQuestion,
  AuditEntry,
  AuditData,
  ServerActionResponse
} from './types';

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

// Shared components
export { ProgressBar } from '@/components/conversational-form/ProgressBar';
export { FormNavigation } from '@/components/conversational-form/FormNavigation';
export { QuestionRenderer } from '@/components/conversational-form/QuestionRenderer';

// ============================================
// DEPRECATED (for backward compatibility)
// ============================================
/** @deprecated Use MandateFormConfig or SimpleFormConfig instead */
export type {
  FormConfig,
  ConversationalFormProps,
  ConversationalFormSheetProps,
  ConversationalFormPageProps,
} from './types';

/** @deprecated Use mandateActions or simpleActions instead */
export {
  createFormDraft,
  updateFormDraft,
  loadFormData,
  submitForm
} from './actions';

/** @deprecated Use MandateFormSheet or SimpleFormSheet instead */
export { ConversationalForm } from '@/components/conversational-form/ConversationalForm';
/** @deprecated Use MandateFormSheet or SimpleFormSheet instead */
export { ConversationalFormSheet } from '@/components/conversational-form/ConversationalFormSheet';
/** @deprecated Use MandateFormSheet or SimpleFormSheet instead */
export { ConversationalFormPage } from '@/components/conversational-form/ConversationalFormPage';

// ============================================
// EXAMPLE CONFIGS
// ============================================
export { surveyFormConfig } from './configs/surveyForm.config';
export { riskProfilerFormConfig } from './configs/riskProfiler.config';

