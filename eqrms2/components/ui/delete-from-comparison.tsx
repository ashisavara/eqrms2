"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { deleteFundFromComparison } from '@/lib/actions/fundComparisonActions';

interface DeleteFromComparisonProps {
  fundId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5', 
  lg: 'h-6 w-6'
};

export function DeleteFromComparison({ 
  fundId, 
  size = 'sm', 
  className = '' 
}: DeleteFromComparisonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple clicks during loading
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await deleteFundFromComparison(fundId);
      
      if (result.success) {
        toast.success(result.message || "Fund removed from comparison", {
          className: "!bg-green-200"
        });
        // Refresh the page to update the data without full reload
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove fund from comparison", {
          className: "!bg-red-300"
        });
      }
    } catch (error) {
      console.error('Error removing fund from comparison:', error);
      toast.error("An unexpected error occurred", {
        className: "!bg-red-300"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      title="Remove from comparison"
      aria-label="Remove from comparison"
    >
      <Minus
        className={cn(
          sizeConfig[size],
          'transition-all duration-200 text-red-700 hover:text-red-900',
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  );
}
