import { z } from "zod";
import { Control } from "react-hook-form";

// Supported question types
export type QuestionType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'date' 
  | 'toggle' 
  | 'boolean';

// Option type for select/radio/toggle questions
export interface QuestionOption {
  value: string;
  label: string;
}

// Individual question configuration
export interface FormQuestion {
  id: string;                                    // Unique question identifier
  type: QuestionType;                            // Question input type
  label: string;                                 // Question text displayed to user
  field: string;                                 // Database column name
  validation: z.ZodTypeAny;                      // Zod validation schema
  options?: QuestionOption[];                    // Options for select/radio/toggle
  placeholder?: string;                          // Placeholder text
  helperText?: string;                           // Additional help text
  showIf?: (values: Record<string, any>) => boolean; // Conditional display logic
  valueType?: 'string' | 'number';               // For toggle groups
}

// Complete form configuration
export interface FormConfig {
  formType: string;                              // Unique form identifier
  table: string;                                 // Supabase table name
  idColumn: string;                              // Primary key column name
  statusColumn?: string;                         // Form status column (default: 'form_status')
  auditColumn?: string;                          // JSONB audit column (default: 'submission_data')
  title: string;                                 // Form title
  description?: string;                          // Form description
  questions: FormQuestion[];                     // Array of questions
}

// Props for ConversationalForm component
export interface ConversationalFormProps {
  formConfig: FormConfig;                        // Form configuration
  mode: 'create' | 'edit';                       // Create new or edit existing
  recordId?: number;                             // Record ID for edit mode
  initialValues?: Record<string, any>;           // Initial/default values for hidden fields
  onComplete?: () => void;                       // Callback after successful submission
  onCancel?: () => void;                         // Callback for cancellation
}

// Props for wrapper components
export interface ConversationalFormSheetProps extends Omit<ConversationalFormProps, 'onCancel'> {
  trigger?: React.ReactNode;                     // Custom trigger element
  open?: boolean;                                // Controlled open state
  onOpenChange?: (open: boolean) => void;        // Open state change handler
}

export interface ConversationalFormPageProps extends ConversationalFormProps {
  showBackButton?: boolean;                      // Show back button
  backButtonText?: string;                       // Custom back button text
}

// Audit data structure for JSONB column
export interface AuditEntry {
  questionId: string;
  questionLabel: string;
  answer: any;
  answeredAt: string;
}

export interface AuditData {
  formType: string;
  formTitle: string;
  startedAt: string;
  submittedAt?: string;
  entries: AuditEntry[];
}

// Server action response types
export interface ServerActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// NEW SIMPLIFIED FORM TYPES
// ============================================

// Mandate form configuration (simplified - always edits investment_mandate)
export interface MandateFormConfig {
  formType: string;                              // Unique form identifier
  title: string;                                 // Form title
  description?: string;                          // Form description
  questions: FormQuestion[];                     // Array of questions
}

// Props for MandateFormSheet component
export interface MandateFormSheetProps {
  formConfig: MandateFormConfig;                 // Form configuration
  mandateId: number;                             // Investment mandate ID
  onComplete?: () => void;                       // Callback after successful submission
  trigger?: React.ReactNode;                     // Custom trigger element
  open?: boolean;                                // Controlled open state
  onOpenChange?: (open: boolean) => void;        // Open state change handler
}

// Simple form configuration (insert-only, no auto-save)
export interface SimpleFormConfig {
  formType: string;                              // Unique form identifier
  table: string;                                 // Target table for insert
  title: string;                                 // Form title
  description?: string;                          // Form description
  questions: FormQuestion[];                     // Array of questions
}

// Props for SimpleFormSheet component
export interface SimpleFormSheetProps {
  formConfig: SimpleFormConfig;                  // Form configuration
  onComplete?: () => void;                       // Callback after successful submission
  trigger?: React.ReactNode;                     // Custom trigger element
  open?: boolean;                                // Controlled open state
  onOpenChange?: (open: boolean) => void;        // Open state change handler
}

