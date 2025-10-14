# Conversational Forms System

A reusable Typeform-style conversational form system for Next.js with React Hook Form, Zod validation, and Supabase integration.

## Features

- ✅ One question at a time with smooth transitions
- ✅ Auto-save progress to Supabase
- ✅ Resume incomplete forms
- ✅ Conditional logic (show/hide questions based on answers)
- ✅ TypeScript config-driven forms
- ✅ Server actions for security
- ✅ Pre-fill for edit mode
- ✅ JSONB audit trail
- ✅ Mobile responsive
- ✅ Accessible (ARIA labels, keyboard navigation)

## Quick Start

### 1. Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE survey_responses (
  survey_id SERIAL PRIMARY KEY,
  respondent_name TEXT,
  email TEXT,
  satisfaction_level TEXT,
  would_recommend BOOLEAN,
  improvement_suggestions TEXT,
  likelihood_rating INTEGER,
  form_status TEXT DEFAULT 'draft' CHECK (form_status IN ('draft', 'submitted')),
  submission_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_survey_responses_status ON survey_responses(form_status);
CREATE INDEX idx_survey_responses_email ON survey_responses(email);
```

### 2. Create Form Config

Create a new file in `lib/conversational-forms/configs/yourForm.config.ts`:

```typescript
import { z } from "zod";
import { FormConfig } from "../types";

export const yourFormConfig: FormConfig = {
  formType: 'your_form',
  table: 'your_table',
  idColumn: 'id',
  statusColumn: 'form_status',
  auditColumn: 'submission_data',
  title: 'Your Form Title',
  description: 'Your form description',
  questions: [
    {
      id: 'q1',
      type: 'text',
      label: 'What is your name?',
      field: 'name',
      validation: z.string().min(2),
      placeholder: 'Enter your name'
    },
    // Add more questions...
  ]
};
```

### 3. Use in Your App

**As a Sheet/Modal:**

```tsx
import { ConversationalFormSheet } from '@/components/conversational-form/ConversationalFormSheet';
import { yourFormConfig } from '@/lib/conversational-forms/configs/yourForm.config';

export default function YourPage() {
  return (
    <ConversationalFormSheet
      formConfig={yourFormConfig}
      mode="create"
      onComplete={() => console.log('Form completed!')}
    />
  );
}
```

**As a Full Page:**

```tsx
import { ConversationalFormPage } from '@/components/conversational-form/ConversationalFormPage';
import { yourFormConfig } from '@/lib/conversational-forms/configs/yourForm.config';

export default function YourPage() {
  return (
    <ConversationalFormPage
      formConfig={yourFormConfig}
      mode="create"
      onComplete={() => router.push('/thank-you')}
    />
  );
}
```

## Question Types

### Text Input

```typescript
{
  id: 'q1',
  type: 'text',
  label: 'What is your name?',
  field: 'name',
  validation: z.string().min(2),
  placeholder: 'Enter your name'
}
```

### Email Input

```typescript
{
  id: 'q2',
  type: 'email',
  label: 'What is your email?',
  field: 'email',
  validation: z.string().email(),
  placeholder: 'you@example.com'
}
```

### Number Input

```typescript
{
  id: 'q3',
  type: 'number',
  label: 'How old are you?',
  field: 'age',
  validation: z.number().min(1).max(120),
  placeholder: 'Enter your age'
}
```

### Textarea

```typescript
{
  id: 'q4',
  type: 'textarea',
  label: 'Tell us more',
  field: 'description',
  validation: z.string().min(10),
  placeholder: 'Share your thoughts...'
}
```

### Select (Dropdown)

```typescript
{
  id: 'q5',
  type: 'select',
  label: 'Choose an option',
  field: 'choice',
  validation: z.string().min(1),
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]
}
```

### Radio Buttons

```typescript
{
  id: 'q6',
  type: 'radio',
  label: 'Pick one',
  field: 'selection',
  validation: z.string().min(1),
  options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ]
}
```

### Date Picker

```typescript
{
  id: 'q7',
  type: 'date',
  label: 'Select a date',
  field: 'date',
  validation: z.date().nullable(),
  placeholder: 'Pick a date'
}
```

### Toggle Group

```typescript
{
  id: 'q8',
  type: 'toggle',
  label: 'Rate us',
  field: 'rating',
  validation: z.string().min(1),
  options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' }
  ]
}
```

### Boolean (Yes/No)

```typescript
{
  id: 'q9',
  type: 'boolean',
  label: 'Do you agree?',
  field: 'agrees',
  validation: z.boolean()
}
```

## Conditional Logic

Show questions based on previous answers using the `showIf` function:

```typescript
{
  id: 'q5',
  type: 'textarea',
  label: 'What went wrong?',
  field: 'feedback',
  validation: z.string().optional(),
  showIf: (values) => {
    // Only show if satisfaction is low
    return values.satisfaction === 'dissatisfied';
  }
}
```

**Complex conditions:**

```typescript
showIf: (values) => {
  return (
    values.is_customer === true &&
    (values.product === 'pro' || values.product === 'enterprise')
  );
}
```

## Modes

### Create Mode

Creates a new form entry:

```tsx
<ConversationalFormSheet
  formConfig={yourFormConfig}
  mode="create"
  onComplete={() => console.log('Created!')}
/>
```

### Edit Mode

Edit an existing form entry:

```tsx
<ConversationalFormSheet
  formConfig={yourFormConfig}
  mode="edit"
  recordId={123}
  onComplete={() => console.log('Updated!')}
/>
```

## Form Configuration Options

```typescript
export interface FormConfig {
  formType: string;           // Unique identifier
  table: string;              // Supabase table name
  idColumn: string;           // Primary key column
  statusColumn?: string;      // Status column (default: 'form_status')
  auditColumn?: string;       // Audit JSONB column (default: 'submission_data')
  title: string;              // Form title
  description?: string;       // Form description
  questions: FormQuestion[];  // Array of questions
}
```

## Auto-Save Behavior

1. **First answer**: Creates a row in the database with `form_status = 'draft'`
2. **Subsequent answers**: Updates the existing row
3. **Final submission**: Updates `form_status = 'submitted'` and saves complete audit data

## JSONB Audit Trail

Every form submission includes a JSONB audit trail in the `submission_data` column:

```json
{
  "formType": "user_survey",
  "formTitle": "User Feedback Survey",
  "startedAt": "2025-10-14T10:30:00Z",
  "submittedAt": "2025-10-14T10:35:00Z",
  "entries": [
    {
      "questionId": "q1_name",
      "questionLabel": "What is your name?",
      "answer": "John Doe",
      "answeredAt": "2025-10-14T10:30:15Z"
    }
    // ... more entries
  ]
}
```

This preserves the exact questions and answers even if the form configuration changes later.

## Security

All database operations use server actions (marked with `"use server"`). No direct Supabase client access from client components.

**Server actions:**
- `createFormDraft()` - Create initial draft
- `updateFormDraft()` - Update draft
- `loadFormData()` - Load existing data
- `submitForm()` - Mark as submitted

## Helper Functions

Located in `lib/conversational-forms/utils.ts`:

- `getVisibleQuestions()` - Filter questions by conditional logic
- `findFirstUnansweredIndex()` - Find resume point
- `buildAuditData()` - Build JSONB audit object
- `prepareFormData()` - Prepare data for database
- `parseFormData()` - Parse database to form values
- `calculateCompletionPercentage()` - Get completion %

## Resuming Incomplete Forms

To allow users to resume incomplete forms:

```tsx
// Load draft by ID
<ConversationalFormSheet
  formConfig={yourFormConfig}
  mode="edit"
  recordId={draftId}
  onComplete={() => console.log('Completed!')}
/>
```

The form will automatically:
1. Load existing answers
2. Jump to the first unanswered question
3. Allow user to complete the form

## Troubleshooting

### Form not saving

- Check that your Supabase table exists
- Verify column names match `field` values in config
- Check browser console for server action errors

### Questions not showing

- Verify `showIf` logic is correct
- Check that conditional dependencies are answered first
- Review browser console for errors

### Validation errors

- Ensure Zod schemas match expected data types
- Check that required fields have proper validation

## Example: Complete Form

See `lib/conversational-forms/configs/surveyForm.config.ts` and `app/survey/page.tsx` for a complete working example.

## Creating Your First Form

1. Create Supabase table with required columns + `form_status` + `submission_data`
2. Create form config in `lib/conversational-forms/configs/`
3. Import and use `ConversationalFormSheet` or `ConversationalFormPage`
4. Test create mode, edit mode, and conditional logic

## Best Practices

1. **Keep questions focused** - One concept per question
2. **Use appropriate types** - Match UI to data type
3. **Add helper text** - Guide users with helpful hints
4. **Test conditional logic** - Verify all paths work
5. **Mobile-first** - Test on small screens
6. **Clear validation messages** - Help users fix errors
7. **Save audit data** - Preserve historical records

## Future Enhancements

Potential features for future versions:

- Multi-page forms with sections
- File upload question type
- Real-time validation
- Form analytics
- A/B testing support
- Template library

---

For more examples and advanced usage, see the example survey form in the codebase.

