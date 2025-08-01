
// Controller connects React Hook Form to custom or third-party input components that don’t support direct register() usage.

"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TextareaAutosize from 'react-textarea-autosize';
import { format } from "date-fns"; // Comment out the DatePicker import
import { Calendar } from "@/components/ui/calendar"; // Comment out the DatePicker import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Comment out the DatePicker import
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, Search } from "lucide-react"; // Make sure you have lucide-react installed // Comment out the DatePicker import
import { cn } from "@/lib/utils"; // shadcn utility for combining classNames
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";

// Update the Props type to include optional type and step
type Props = { 
  name: string; 
  label: string; 
  control: Control<any>; 
  placeholder?: string;
  type?: string;
  step?: string;
};

// Update the TextInput component
export function TextInput({ name, label, control, placeholder, type, step }: Props) {
  return (
    <div>
      <Label htmlFor={name} className="font-bold">{label}</Label>
      <Controller 
        name={name} 
        control={control} 
        render={({ field }) => (
          <Input 
            {...field}
            id={name} 
            placeholder={placeholder} 
            type={type}
            step={step}
          />
        )} 
      />
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
  itemClassName,
  valueType = "string"
}: { 
  name: string; 
  label: string; 
  control: Control<any>; 
  options: { value: string; label: string }[];
  className?: string;
  toggleGroupClassName?: string;
  itemClassName?: string;
  valueType?: "string" | "number";
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
            value={field.value?.toString() || ""}
            onValueChange={(value) => {
              if (valueType === "number") {
                field.onChange(value ? parseInt(value) : 0);
              } else {
                field.onChange(value || "");
              }
            }}
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

// Select option field with search functionality for long lists
export function SelectInput({ name, label, control, options }: { name: string; label: string; control: Control<any>; options: { value: string; label: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Determine if we should show search (more than 7 options)
  const shouldShowSearch = options.length > 7;

  const handleDropdownOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Clear search when closing dropdown
    if (!open) {
      setSearchTerm("");
    }
  };

  // If 7 or fewer options, use the original simple select
  if (!shouldShowSearch) {
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

  // For more than 7 options, use enhanced dropdown with search
  return (
    <div>
      <Label className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                <span className="truncate">
                  {field.value 
                    ? options.find(opt => opt.value === field.value)?.label || "Select option..."
                    : "Select option..."}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {/* Search input replaces title for space efficiency */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                    autoFocus
                  />
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        field.onChange(option.value);
                        setIsOpen(false);
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No options found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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


export function DatePicker({ 
  name, 
  label, 
  control,
  placeholder = "Pick a date"
}: { 
  name: string; 
  label: string; 
  control: Control<any>;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), "PPP") : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}

// Boolean Toggle field (for Yes/No choices)
export function BooleanToggleInput({ 
  name, 
  label, 
  control, 
  className,
  toggleGroupClassName,
  itemClassName,
  yesLabel = "Yes",
  noLabel = "No"
}: { 
  name: string; 
  label: string; 
  control: Control<any>; 
  className?: string;
  toggleGroupClassName?: string;
  itemClassName?: string;
  yesLabel?: string;
  noLabel?: string;
}) {
  const booleanOptions = [
    { value: "true", label: yesLabel },
    { value: "false", label: noLabel }
  ];

  return (
    <div className={className || "space-y-2"}>
      <Label className="font-bold">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }: { field: any }) => (
          <ToggleGroup
            type="single"
            value={field.value?.toString() || ""}
            onValueChange={(value: string) => {
              field.onChange(value === "true");
            }}
            className={toggleGroupClassName || "gap-2 flex-wrap justify-start"}
          >
            {booleanOptions.map((option) => (
              <ToggleGroupItem 
                key={option.value} 
                value={option.value} 
                aria-label={option.label}
                className={itemClassName || "!rounded-full border border-gray-300 px-4 py-2 min-w-fit whitespace-nowrap hover:bg-gray-100 hover:border-gray-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600 data-[state=on]:hover:bg-blue-700 transition-all duration-200"}
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

