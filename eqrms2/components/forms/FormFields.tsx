
// Controller connects React Hook Form to custom or third-party input components that don’t support direct register() usage.

"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

// Toggle Group field (for choice chips like ratings)
export function ToggleGroupInput({ 
  name, 
  label, 
  control, 
  options,
  className,
  toggleGroupClassName,
  itemClassName
}: { 
  name: string; 
  label: string; 
  control: Control<any>; 
  options: { value: string; label: string }[];
  className?: string;
  toggleGroupClassName?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className || "space-y-2"}>
      <Label className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleGroup
            type="single"
            value={field.value?.toString()}
            onValueChange={(value) => field.onChange(value ? parseInt(value) : 0)}
            className={toggleGroupClassName || "justify-start"}
          >
            {options.map((option) => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value} 
                aria-label={option.label}
                className={itemClassName}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      />
    </div>
  );
}

// Multi-Select Toggle Group field (for multiple choice chips like tags, categories)
export function MultiToggleGroupInput({ 
  name, 
  label, 
  control, 
  options,
  className,
  toggleGroupClassName,
  itemClassName
}: { 
  name: string; 
  label: string; 
  control: Control<any>; 
  options: { value: string; label: string }[];
  className?: string;
  toggleGroupClassName?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className || "space-y-2"}>
      <Label className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleGroup
            type="multiple"
            value={field.value || []}
            onValueChange={(values) => field.onChange(values)}
            className={toggleGroupClassName || "justify-start"}
          >
            {options.map((option) => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value} 
                aria-label={option.label}
                className={itemClassName}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
