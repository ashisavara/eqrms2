"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConversationalFormSheetProps } from "@/lib/conversational-forms/types";
import { ConversationalForm } from "./ConversationalForm";

export function ConversationalFormSheet({
  formConfig,
  mode,
  recordId,
  onComplete,
  onCancel,
  trigger,
  open: controlledOpen,
  onOpenChange
}: ConversationalFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleComplete = () => {
    setIsOpen(false);
    onComplete?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <>
      {/* Trigger element */}
      {trigger && (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      )}

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          className="w-full sm:max-w-2xl overflow-y-auto"
          side="right"
        >
          <SheetHeader>
            <SheetTitle>{formConfig.title}</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            <ConversationalForm
              formConfig={formConfig}
              mode={mode}
              recordId={recordId}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

