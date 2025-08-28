"use client";

/**
 * MultiSelectFilter Component
 * 
 * Used in hybrid filtering approach where:
 * - The 'options' prop is dynamically calculated by ReactTableWrapper
 * - Options change based on whether this filter has active selections:
 *   * WITH selections: Shows all original options (enables multi-select)
 *   * WITHOUT selections: Shows filtered options (enables iterative filtering)
 * 
 * This component doesn't need to know about the hybrid logic - it just renders
 * whatever options are passed to it and reports changes back to the parent.
 */

import React, { useState, useMemo, useRef } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MultiSelectFilterProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelectFilter({
  title,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options..."
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Determine if we should show search (more than 7 options)
  const shouldShowSearch = options.length > 7;

  const handleSelectAll = () => {
    // When searching, only select filtered options; otherwise select all
    const optionsToSelect = shouldShowSearch && searchTerm ? filteredOptions : options;
    onSelectionChange([...new Set([...selectedValues, ...optionsToSelect])]);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Clear search when closing dropdown
    if (!open) {
      setSearchTerm("");
    }
  };

  const handleToggleOption = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onSelectionChange(newSelection);
  };

  const handleRemoveSelection = (option: string) => {
    onSelectionChange(selectedValues.filter(item => item !== option));
  };

  return (
    <div className="space-y-2">
      <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">
              {selectedValues.length === 0
                ? placeholder
                : selectedValues.length === 1
                ? selectedValues[0]
                : `${selectedValues.length} selected`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {/* Conditional header: Search input or Title */}
          {shouldShowSearch ? (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    // Prevent arrow keys from changing focus to options
                    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    // Refocus the search input if dropdown is still open
                    if (isOpen) {
                      setTimeout(() => searchInputRef.current?.focus(), 0);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <DropdownMenuLabel>{title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {shouldShowSearch && <DropdownMenuSeparator />}
          <div className="flex justify-between gap-2 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={handleSelectAll}
            >
              {shouldShowSearch && searchTerm 
                ? `Select ${filteredOptions.length}` 
                : "Select All"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={handleClearAll}
            >
              Clear
            </Button>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={() => handleToggleOption(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No options found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Selected Items Display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => (
            <Badge key={value} variant="secondary" className="text-xs">
              {value}
              <button
                className="ml-1 hover:bg-muted rounded-full"
                onClick={() => handleRemoveSelection(value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 