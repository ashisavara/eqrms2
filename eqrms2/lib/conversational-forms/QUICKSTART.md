# Quick Start Guide - Conversational Forms

Get up and running with conversational forms in 5 minutes!

## Step 1: Run the SQL (Required)

Copy and run the contents of `SQL_SETUP.sql` in your Supabase SQL Editor.

This creates the `survey_responses` table needed for the demo.

## Step 2: Test the Demo

1. Start your dev server:
```bash
npm run dev
```

2. Navigate to:
```
http://localhost:3000/survey
```

3. Click "Start Survey"

4. Answer the questions and watch the auto-save in action!

## Step 3: Check Your Database

Open Supabase and run:
```sql
SELECT * FROM survey_responses;
```

You should see:
- Your answers in individual columns
- `form_status` = 'draft' (while in progress) or 'submitted' (when complete)
- `submission_data` JSONB with full audit trail

## Step 4: Create Your First Form

### Create a simple contact form

**1. Create the table:**
```sql
CREATE TABLE contact_form (
  contact_id SERIAL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  form_status TEXT DEFAULT 'draft' CHECK (form_status IN ('draft', 'submitted')),
  submission_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. Create config file:** `lib/conversational-forms/configs/contactForm.config.ts`
```typescript
import { z } from "zod";
import { FormConfig } from "../types";

export const contactFormConfig: FormConfig = {
  formType: 'contact_form',
  table: 'contact_form',
  idColumn: 'contact_id',
  title: 'Contact Us',
  description: 'We would love to hear from you',
  questions: [
    {
      id: 'q1_name',
      type: 'text',
      label: 'What is your name?',
      field: 'full_name',
      validation: z.string().min(2, 'Name must be at least 2 characters'),
      placeholder: 'John Doe'
    },
    {
      id: 'q2_email',
      type: 'email',
      label: 'What is your email?',
      field: 'email',
      validation: z.string().email('Please enter a valid email'),
      placeholder: 'john@example.com'
    },
    {
      id: 'q3_phone',
      type: 'text',
      label: 'Phone number (optional)',
      field: 'phone',
      validation: z.string().optional(),
      placeholder: '+1 (555) 123-4567'
    },
    {
      id: 'q4_message',
      type: 'textarea',
      label: 'How can we help you?',
      field: 'message',
      validation: z.string().min(10, 'Please provide at least 10 characters'),
      placeholder: 'Tell us about your inquiry...'
    }
  ]
};
```

**3. Use in your app:** `app/contact/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConversationalFormSheet } from "@/components/conversational-form/ConversationalFormSheet";
import { contactFormConfig } from "@/lib/conversational-forms/configs/contactForm.config";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <Button onClick={() => setShowForm(true)}>
        Send a Message
      </Button>

      <ConversationalFormSheet
        formConfig={contactFormConfig}
        mode="create"
        open={showForm}
        onOpenChange={setShowForm}
        onComplete={() => {
          alert('Thank you for contacting us!');
          setShowForm(false);
        }}
      />
    </div>
  );
}
```

**4. Test it!**
- Navigate to `/contact`
- Click the button
- Fill out the form
- Check your database

## Common Use Cases

### Use Case 1: User Onboarding

Create a multi-step onboarding form with conditional questions based on user type.

### Use Case 2: Surveys & Feedback

Collect user feedback with rating scales and conditional follow-up questions.

### Use Case 3: Application Forms

Complex application forms where questions depend on previous answers.

### Use Case 4: Risk Profiling

Financial risk assessment with dynamic question paths.

## Tips

1. **Start simple** - Begin with 3-4 questions to understand the flow
2. **Test incrementally** - Add questions one at a time
3. **Use conditional logic sparingly** - Keep forms intuitive
4. **Provide helper text** - Guide users with helpful hints
5. **Check the database** - Verify data structure matches expectations

## Display Options

### As a Modal/Sheet (Recommended for short forms)
```tsx
<ConversationalFormSheet
  formConfig={yourConfig}
  mode="create"
  onComplete={() => console.log('Done!')}
/>
```

### As a Full Page (Recommended for longer forms)
```tsx
<ConversationalFormPage
  formConfig={yourConfig}
  mode="create"
  onComplete={() => router.push('/thank-you')}
/>
```

## Edit Existing Responses

```tsx
<ConversationalFormSheet
  formConfig={yourConfig}
  mode="edit"
  recordId={123}
  onComplete={() => console.log('Updated!')}
/>
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for architecture details
- Check out the example in `app/survey/page.tsx`
- Explore question types and conditional logic

## Need Help?

1. Check the [README.md](./README.md) troubleshooting section
2. Review the working example: `lib/conversational-forms/configs/surveyForm.config.ts`
3. Verify your Supabase table structure matches your config
4. Check browser console for errors

---

**You're ready to build amazing conversational forms! 🚀**

