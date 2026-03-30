"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabaseDeleteRow } from "@/lib/supabase/serverQueryHelper";

interface DeleteGoalButtonProps {
  goalId: number;
  goalName?: string;
  isRetirementCorpus?: boolean | null;
}

export function DeleteGoalButton({ goalId, goalName, isRetirementCorpus }: DeleteGoalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Keep protected/system-generated goals safe.
  if (isRetirementCorpus) {
    return null;
  }

  const handleDelete = async () => {
    const targetName = goalName?.trim() ? ` "${goalName}"` : "";
    const ok = confirm(`Are you sure you want to delete goal${targetName}? This action cannot be undone.`);
    if (!ok) {
      return;
    }

    setIsLoading(true);
    try {
      await supabaseDeleteRow("fin_goals", "goal_id", goalId);
      toast.success("Goal deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
      className="ml-2 p-2 h-2 w-2 text-red-300 hover:text-red-600 hover:bg-red-100"
      aria-label="Delete goal"
    >
      <Trash2 className="h-2 w-2" />
    </Button>
  );
}
