"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface FormNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoBack?: boolean;
}

export function FormNavigation({
  isFirstQuestion,
  isLastQuestion,
  isLoading,
  onPrevious,
  onNext,
  onSubmit,
  canGoBack = true
}: FormNavigationProps) {
  
  return (
    <div className="flex gap-3 mt-8">
      {/* Previous button */}
      {!isFirstQuestion && canGoBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
      )}
      
      {/* Next or Submit button */}
      <Button
        type="button"
        onClick={isLastQuestion ? onSubmit : onNext}
        disabled={isLoading}
        className="flex items-center gap-2 ml-auto"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Saving...
          </>
        ) : isLastQuestion ? (
          <>
            Submit
            <Check className="w-4 h-4" />
          </>
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}

