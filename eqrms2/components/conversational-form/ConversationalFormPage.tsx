"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConversationalFormPageProps } from "@/lib/conversational-forms/types";
import { ConversationalForm } from "./ConversationalForm";

export function ConversationalFormPage({
  formConfig,
  mode,
  recordId,
  onComplete,
  onCancel,
  showBackButton = true,
  backButtonText = "Back"
}: ConversationalFormPageProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        {showBackButton && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {backButtonText}
            </Button>
          </div>
        )}

        {/* Form container */}
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          <ConversationalForm
            formConfig={formConfig}
            mode={mode}
            recordId={recordId}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}

