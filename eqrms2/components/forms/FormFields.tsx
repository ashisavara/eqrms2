
// Controller connects React Hook Form to custom or third-party input components that don’t support direct register() usage.

"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TextareaAutosize from 'react-textarea-autosize';

type Props = { name: string; label: string; control: Control<any>; placeholder?: string };

// Text input field
export function TextInput({ name, label, control, placeholder }: Props) {
  return (
    <div>
      <Label htmlFor={name} className="font-bold">{label}</Label>
      <Controller name={name} control={control} render={({ field }) => <Input id={name} placeholder={placeholder} {...field} />} />
    </div>
  );
}

// Textarea field
export function TextArea({ name, label, control, placeholder }: Props) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Controller name={name} control={control} render={({ field }) => <Textarea id={name} placeholder={placeholder} className="min-h-[120px] resize-y" {...field} />} />
    </div>
  );
}

// Resizable TextArea component
export function ResizableTextArea({ name, label, control }: { name: string; label: string; control: any }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label text-sm font-bold">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextareaAutosize
            {...field}
            id={name}
            className="form-textarea w-full p-2 border border-gray-300 rounded-md text-sm"
            minRows={2}
            maxRows={15}
          />
        )}
      />
    </div>
  );
}

// Select option field
export function SelectInput({ name, label, control, options }: { name: string; label: string; control: Control<any>; options: { value: string; label: string }[] }) {
  return (
    <div>
      <Label htmlFor={name} className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select id={name} {...field} className="form-select w-full p-2 border border-gray-300 rounded-md text-sm">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}

// Radio button field with flexible layout
export function RadioInput({
  name,
  label,
  control,
  options,
  direction = 'vertical', // Default to vertical
}: {
  name: string;
  label: string;
  control: Control<any>;
  options: { value: string; label: string }[];
  direction?: 'vertical' | 'horizontal'; // New prop for direction
}) {
  return (
    <div>
      <Label className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'}`}>
            {options.map((option) => (
              <label key={option.value} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      />
    </div>
  );
}
