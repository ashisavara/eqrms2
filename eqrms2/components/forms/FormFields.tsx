
// Controller connects React Hook Form to custom or third-party input components that don’t support direct register() usage.

"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = { name: string; label: string; control: Control<any>; placeholder?: string };

// Text input field
export function TextInput({ name, label, control, placeholder }: Props) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
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
