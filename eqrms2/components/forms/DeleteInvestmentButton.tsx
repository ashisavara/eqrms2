'use client';

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabaseDeleteRow } from "@/lib/supabase/serverQueryHelper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteInvestmentButtonProps {
  investmentId: number;
  advisorName: string;
}

export function DeleteInvestmentButton({ investmentId, advisorName }: DeleteInvestmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Don't render for IME Capital advisor
  if (advisorName === "IME Capital") {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this investment? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await supabaseDeleteRow('investments', 'investment_id', investmentId);
      
      toast.success("Investment deleted successfully!");
      router.refresh(); // Refresh the page to update the table
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error("Failed to delete investment. Please try again.");
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
    >
      <Trash2 className="h-2 w-2" />
    </Button>
  );
}
