"use client";

import { useState } from "react";
import { RiskProfilerForm } from "@/components/conversational-form/RiskProfilerForm";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface RiskProfilerButtonProps {
  groupId: number;
  mandateId: number;
}

export function RiskProfilerButton({ groupId, mandateId }: RiskProfilerButtonProps) {
  const [showRiskProfiler, setShowRiskProfiler] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
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

      <RiskProfilerForm
        mandateId={mandateId}
        open={showRiskProfiler}
        onOpenChange={setShowRiskProfiler}
        onComplete={handleComplete}
      />
    </>
  );
}

