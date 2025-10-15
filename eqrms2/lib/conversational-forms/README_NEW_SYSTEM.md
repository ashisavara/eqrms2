# Conversational Forms - New Simplified System

## Overview

The conversational form system has been redesigned into two purpose-built components for better maintainability and simplicity:

1. **MandateFormSheet** - For mandate-linked forms with auto-save
2. **SimpleFormSheet** - For insert-only forms without auto-save

## Why Two Systems?

After analyzing actual use cases, we found that:

- **Mandate-linked forms** (Risk Profiler, Knowledge Courses, etc.) are always 1-to-1 with investment_mandate and need auto-save
- **Insert-only forms** (Surveys, Feedback, etc.) don't need auto-save or draft tracking

The old unified system was trying to handle both cases, leading to unnecessary complexity.

## System Comparison

### Old System (Deprecated)
- **350 lines** of complex state management
- Handles create→edit mode switching mid-flow
- Tracks changing recordId during form progression
- 4 server actions (createFormDraft, updateFormDraft, loadFormData, submitForm)
- Draft/submitted status tracking

### New System

#### MandateFormSheet (Mandate-Linked Forms)
- **~200 lines** - 40% less code
- Always edits investment_mandate table
- mandateId known upfront, never changes
- 2 simple server actions (loadMandateData, updateMandateField)
- No draft/submitted tracking needed
- Auto-save on each answer

#### SimpleFormSheet (Insert-Only Forms)
- **~140 lines** - 60% less code
- All form data in memory (React state)
- 1 server action (insertFormData)
- No database writes until final submit
- Perfect for anonymous users

---

## 1. MandateFormSheet

### Use Case
Edit investment_mandate columns with auto-save. Used for:
- Risk Profiler
- Knowledge course assessments
- Any 1-to-1 mandate-linked forms

### Quick Start

**Step 1: Add columns to investment_mandate**

```sql
-- Run SQL_MIGRATE_RISK_TO_MANDATE.sql
ALTER TABLE investment_mandate
  ADD COLUMN field1 TEXT,
  ADD COLUMN field2 INTEGER;
```

**Step 2: Create form config**

```typescript
// lib/conversational-forms/configs/myForm.config.ts
import { z } from "zod";
import { MandateFormConfig } from "@/lib/conversational-forms/types";

export const myFormConfig: MandateFormConfig = {
  formType: 'my_form',
  title: 'My Form Title',
  description: 'Optional description',
  questions: [
    {
      id: 'q1',
      type: 'text',
      label: 'What is your answer?',
      field: 'field1',  // Must match investment_mandate column
      validation: z.string().min(2),
      placeholder: 'Enter answer'
    },
    {
      id: 'q2',
      type: 'number',
      label: 'How many?',
      field: 'field2',
      validation: z.number().min(1),
    }
  ]
};
```

**Step 3: Use in your component**

```tsx
import { MandateFormSheet } from "@/components/conversational-form/MandateFormSheet";
import { myFormConfig } from "@/lib/conversational-forms/configs/myForm.config";

export function MyComponent({ mandateId }: { mandateId: number }) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        Open Form
      </Button>
      
      <MandateFormSheet
        formConfig={myFormConfig}
        mandateId={mandateId}
        open={showForm}
        onOpenChange={setShowForm}
        onComplete={() => {
          console.log('Form completed!');
        }}
      />
    </>
  );
}
```

### Features

✅ Auto-loads existing mandate data  
✅ Auto-saves on each answer  
✅ Resumes from first unanswered question  
✅ Progress bar  
✅ Forward/backward navigation  
✅ Validation before proceeding  
✅ Conditional question logic (showIf)  

### Props

```typescript
interface MandateFormSheetProps {
  formConfig: MandateFormConfig;    // Form configuration
  mandateId: number;                // Investment mandate ID
  onComplete?: () => void;          // Callback when form is submitted
  trigger?: React.ReactNode;        // Optional custom trigger
  open?: boolean;                   // Controlled open state
  onOpenChange?: (open: boolean) => void;  // State change handler
}
```

---

## 2. SimpleFormSheet

### Use Case
Collect form data and insert at end. No auto-save. Used for:
- Anonymous user surveys
- Feedback forms
- Simple data collection
- One-time submissions

### Quick Start

**Step 1: Create target table**

```sql
CREATE TABLE my_submissions (
  submission_id SERIAL PRIMARY KEY,
  field1 TEXT,
  field2 INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Step 2: Create form config**

```typescript
// lib/conversational-forms/configs/mySimpleForm.config.ts
import { z } from "zod";
import { SimpleFormConfig } from "@/lib/conversational-forms/types";

export const mySimpleFormConfig: SimpleFormConfig = {
  formType: 'my_simple_form',
  table: 'my_submissions',  // Target table
  title: 'Quick Survey',
  description: 'This will only take a minute',
  questions: [
    {
      id: 'q1',
      type: 'text',
      label: 'Your name?',
      field: 'field1',
      validation: z.string().min(2),
    },
    {
      id: 'q2',
      type: 'number',
      label: 'Your rating?',
      field: 'field2',
      validation: z.number().min(1).max(10),
    }
  ]
};
```

**Step 3: Use in your component**

```tsx
import { SimpleFormSheet } from "@/components/conversational-form/SimpleFormSheet";
import { mySimpleFormConfig } from "@/lib/conversational-forms/configs/mySimpleForm.config";

export function SurveyPage() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        Take Survey
      </Button>
      
      <SimpleFormSheet
        formConfig={mySimpleFormConfig}
        open={showForm}
        onOpenChange={setShowForm}
        onComplete={() => {
          console.log('Survey submitted!');
        }}
      />
    </>
  );
}
```

### Features

✅ In-memory form state (no DB until end)  
✅ Progress bar  
✅ Forward/backward navigation  
✅ Validation before proceeding  
✅ Conditional question logic (showIf)  
✅ Single INSERT on final submit  
✅ Form resets after submission  

### Props

```typescript
interface SimpleFormSheetProps {
  formConfig: SimpleFormConfig;      // Form configuration
  onComplete?: () => void;           // Callback when form is submitted
  trigger?: React.ReactNode;         // Optional custom trigger
  open?: boolean;                    // Controlled open state
  onOpenChange?: (open: boolean) => void;  // State change handler
}
```

---

## Question Types

Both systems support the same question types:

### Text Input
```typescript
{
  id: 'q1',
  type: 'text',
  label: 'What is your name?',
  field: 'name',
  validation: z.string().min(2),
  placeholder: 'Enter name'
}
```

### Email Input
```typescript
{
  id: 'q2',
  type: 'email',
  label: 'Email address?',
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
  label: 'Your age?',
  field: 'age',
  validation: z.number().min(1).max(120),
  placeholder: '25'
}
```

### Textarea
```typescript
{
  id: 'q4',
  type: 'textarea',
  label: 'Comments?',
  field: 'comments',
  validation: z.string().min(10),
  placeholder: 'Share your thoughts...'
}
```

### Select (Dropdown)
```typescript
{
  id: 'q5',
  type: 'select',
  label: 'Choose one',
  field: 'choice',
  validation: z.string().min(1),
  options: [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
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
  label: 'Select date',
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
  label: 'Agree?',
  field: 'agrees',
  validation: z.boolean()
}
```

---

## Conditional Logic

Show/hide questions based on previous answers:

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

---

## Migration Guide

### Migrating from Old ConversationalFormSheet

**If it was a mandate-linked form:**
```typescript
// Before
<ConversationalFormSheet
  formConfig={oldConfig}
  mode="edit"
  recordId={mandateId}
  onComplete={handleComplete}
/>

// After
<MandateFormSheet
  formConfig={newConfig}  // Update config to MandateFormConfig
  mandateId={mandateId}
  onComplete={handleComplete}
/>
```

**If it was an insert-only form:**
```typescript
// Before
<ConversationalFormSheet
  formConfig={oldConfig}
  mode="create"
  onComplete={handleComplete}
/>

// After
<SimpleFormSheet
  formConfig={newConfig}  // Update config to SimpleFormConfig
  onComplete={handleComplete}
/>
```

---

## Examples

### Example 1: Risk Profiler (Mandate-Linked)

See: `app/mandate/RiskProfilerButton.tsx`  
Config: `lib/conversational-forms/configs/riskProfiler.config.ts`  

### Example 2: Survey (Insert-Only)

See: `app/survey/page.tsx`  
Config: `lib/conversational-forms/configs/surveyForm.config.ts`  

---

## File Structure

```
lib/conversational-forms/
  ├── mandateActions.ts          # NEW - 2 actions for mandate forms
  ├── simpleActions.ts           # NEW - 1 action for simple forms
  ├── types.ts                   # Updated with new types
  ├── utils.ts                   # Shared utilities (unchanged)
  ├── actions.ts                 # DEPRECATED
  └── configs/
      ├── riskProfiler.config.ts # Updated to use MandateFormConfig
      └── surveyForm.config.ts   # Updated to use SimpleFormConfig

components/conversational-form/
  ├── MandateFormSheet.tsx       # NEW - ~200 lines
  ├── SimpleFormSheet.tsx        # NEW - ~140 lines
  ├── ConversationalForm.tsx     # DEPRECATED
  ├── ConversationalFormSheet.tsx  # DEPRECATED
  ├── ConversationalFormPage.tsx   # DEPRECATED
  ├── ProgressBar.tsx            # Shared (unchanged)
  ├── FormNavigation.tsx         # Shared (unchanged)
  └── QuestionRenderer.tsx       # Shared (unchanged)
```

---

## Benefits

### Code Simplification
- MandateFormSheet: 43% less code than old system
- SimpleFormSheet: 60% less code than old system
- 2-3 actions vs 4 actions
- No unused code paths

### Developer Experience
- Clear choice: mandate or insert?
- Less configuration needed
- Simpler mental model
- Easier to debug

### Maintainability
- Single responsibility per component
- No complex state transitions
- Easier to test
- Easier to extend

---

## FAQ

**Q: Can I still use the old ConversationalFormSheet?**  
A: Yes, it's marked as deprecated but still works. Migrate when convenient.

**Q: What if I need auto-save for non-mandate forms?**  
A: Create a dedicated table with 1-to-1 relationship and use MandateFormSheet pattern with custom actions.

**Q: Can I add custom actions/hooks?**  
A: Yes, both components are open for extension. Fork and customize as needed.

**Q: What about form analytics?**  
A: Add your own tracking in the onComplete callback or in server actions.

---

## Next Steps

1. Run SQL migration: `SQL_MIGRATE_RISK_TO_MANDATE.sql`
2. Try the Risk Profiler on mandate page
3. Try the Survey example at `/survey`
4. Build your own forms using the patterns above

For questions, see the working examples or review the component source code.

