"use client";

import { Control } from "react-hook-form";
import { FormQuestion } from "@/lib/conversational-forms/types";
import {
  TextInput,
  NumberInput,
  ResizableTextArea,
  SelectInput,
  RadioInput,
  DatePicker,
  ToggleGroupInput,
  BooleanToggleInput
} from "@/components/forms/FormFields";

interface QuestionRendererProps {
  question: FormQuestion;
  control: Control<any>;
}

export function QuestionRenderer({ question, control }: QuestionRendererProps) {
  // Map question type to appropriate form component
  switch (question.type) {
    case 'text':
      return (
        <TextInput
          name={question.field}
          label={question.label}
          control={control}
          placeholder={question.placeholder}
          type="text"
        />
      );

    case 'email':
      return (
        <TextInput
          name={question.field}
          label={question.label}
          control={control}
          placeholder={question.placeholder}
          type="email"
        />
      );

    case 'number':
      return (
        <NumberInput
          name={question.field}
          label={question.label}
          control={control}
          placeholder={question.placeholder}
        />
      );

    case 'textarea':
      return (
        <ResizableTextArea
          name={question.field}
          label={question.label}
          control={control}
        />
      );

    case 'select':
      return (
        <SelectInput
          name={question.field}
          label={question.label}
          control={control}
          options={question.options || []}
          valueType={question.valueType}
        />
      );

    case 'radio':
      return (
        <RadioInput
          name={question.field}
          label={question.label}
          control={control}
          options={question.options || []}
          direction="vertical"
        />
      );

    case 'date':
      return (
        <DatePicker
          name={question.field}
          label={question.label}
          control={control}
          placeholder={question.placeholder || "Pick a date"}
        />
      );

    case 'toggle':
      return (
        <ToggleGroupInput
          name={question.field}
          label={question.label}
          control={control}
          options={question.options || []}
          valueType={question.valueType}
        />
      );

    case 'boolean':
      return (
        <BooleanToggleInput
          name={question.field}
          label={question.label}
          control={control}
        />
      );

    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {question.type}
        </div>
      );
  }
}

