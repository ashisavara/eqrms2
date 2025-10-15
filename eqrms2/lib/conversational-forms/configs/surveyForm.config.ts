import { z } from "zod";
import { SimpleFormConfig } from "../types";

export const surveyFormConfig: SimpleFormConfig = {
  formType: 'user_survey',
  table: 'survey_responses',
  title: 'User Feedback Survey',
  description: 'Help us improve by answering a few questions',
  questions: [
    {
      id: 'q1_name',
      type: 'text',
      label: 'What is your name?',
      field: 'respondent_name',
      validation: z.string().min(2, 'Name must be at least 2 characters'),
      placeholder: 'Enter your full name',
      helperText: 'This helps us personalize your experience'
    },
    {
      id: 'q2_email',
      type: 'email',
      label: 'What is your email address?',
      field: 'email',
      validation: z.string().email('Please enter a valid email'),
      placeholder: 'you@example.com',
      helperText: 'We will never share your email with anyone'
    },
    {
      id: 'q3_satisfaction',
      type: 'radio',
      label: 'How satisfied are you with our service?',
      field: 'satisfaction_level',
      validation: z.string().min(1, 'Please select an option'),
      options: [
        { value: 'very_satisfied', label: 'Very Satisfied' },
        { value: 'satisfied', label: 'Satisfied' },
        { value: 'neutral', label: 'Neutral' },
        { value: 'dissatisfied', label: 'Dissatisfied' },
        { value: 'very_dissatisfied', label: 'Very Dissatisfied' }
      ],
      helperText: 'Your honest feedback helps us improve'
    },
    {
      id: 'q4_would_recommend',
      type: 'boolean',
      label: 'Would you recommend us to a friend?',
      field: 'would_recommend',
      validation: z.boolean(),
      helperText: 'This is an important metric for us'
    },
    {
      id: 'q5_improvement',
      type: 'textarea',
      label: 'What could we improve?',
      field: 'improvement_suggestions',
      validation: z.string().optional(),
      placeholder: 'Share your thoughts...',
      helperText: 'Feel free to be specific - we read every response',
      showIf: (values) => {
        // Only show if not very satisfied
        return values.satisfaction_level !== 'very_satisfied';
      }
    },
    {
      id: 'q6_rating',
      type: 'number',
      label: 'On a scale of 1-10, how likely are you to use our service again?',
      field: 'likelihood_rating',
      validation: z.number().min(1, 'Please enter a number between 1 and 10').max(10, 'Please enter a number between 1 and 10'),
      placeholder: 'Enter a number between 1 and 10',
      helperText: '1 = Not likely at all, 10 = Extremely likely'
    }
  ]
};

