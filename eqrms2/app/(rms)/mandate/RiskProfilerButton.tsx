"use client";

import { useState } from "react";
import { RiskProfilerForm } from "@/components/conversational-form/RiskProfilerForm";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface RiskProfilerButtonProps {
  groupId: number;
}

export function RiskProfilerButton({ groupId }: RiskProfilerButtonProps) {
  const [showRiskProfiler, setShowRiskProfiler] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    router.refresh();
  };

  return (
    <>
      <span className="blue-hyperlink" onClick={() => setShowRiskProfiler(true)}>
        Risk-Profiler
      </span>

      <RiskProfilerForm
        groupId={groupId}
        open={showRiskProfiler}
        onOpenChange={setShowRiskProfiler}
        onComplete={handleComplete}
      />
    </>
  );
}

