"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { addFundToComparison } from '@/lib/actions/fundComparisonActions';

interface AddToComparisonProps {
  fundId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5', 
  lg: 'h-6 w-6'
};

export function AddToComparison({ 
  fundId, 
  size = 'sm', 
  className = '' 
}: AddToComparisonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple clicks during loading
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await addFundToComparison(fundId);
      
      if (result.success) {
        toast.success(result.message || "Fund added to comparison", {
          className: "!bg-green-200"
        });
      } else {
        toast.error(result.error || "Failed to add fund to comparison", {
          className: "!bg-red-300"
        });
      }
    } catch (error) {
      console.error('Error adding fund to comparison:', error);
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
        'inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      title="Add to comparison"
      aria-label="Add to comparison"
    >
      <Plus
        className={cn(
          sizeConfig[size],
          'transition-all duration-200 text-green-700 hover:text-green-900',
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  );
}
