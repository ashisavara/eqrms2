"use client";

import { useState } from "react";
import { MandateFormSheet } from "@/components/conversational-form/MandateFormSheet";
import { riskProfilerFormConfig } from "@/lib/conversational-forms/configs/riskProfiler.config";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RiskProfilerButtonProps {
  groupId: number;
  mandateId: number;
}

export function RiskProfilerButton({ groupId, mandateId }: RiskProfilerButtonProps) {
  const [showRiskProfiler, setShowRiskProfiler] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    setShowRiskProfiler(false);
    toast.success("Risk profile saved successfully!");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowRiskProfiler(true)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Edit Risk Profile"
      >
        <Pencil className="w-4 h-4 text-gray-600 hover:text-gray-800" />
      </button>

      <MandateFormSheet
        formConfig={riskProfilerFormConfig}
        mandateId={mandateId}
        open={showRiskProfiler}
        onOpenChange={setShowRiskProfiler}
        onComplete={handleComplete}
      />
    </>
  );
}

