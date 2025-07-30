"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGroupMandate } from '@/lib/contexts/GroupMandateContext';
import { EntityType } from '@/types/favourites-detail';

interface FavouriteHeartProps {
  entityType: EntityType;
  entityId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5', 
  lg: 'h-6 w-6'
};

export function FavouriteHeart({ 
  entityType, 
  entityId, 
  size = 'sm', 
  className = '',
  onClick 
}: FavouriteHeartProps) {
  const { favourites, toggleFavourite, isFavourite } = useGroupMandate();
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentlyFavourite = isFavourite(entityType, entityId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
      return;
    }

    // Prevent multiple clicks during loading
    if (isLoading) return;

    setIsLoading(true);
    try {
      await toggleFavourite(entityType, entityId);
    } catch (error) {
      // Error handling is done in the context
      console.error('Error in FavouriteHeart:', error);
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
      title={isCurrentlyFavourite ? 'Remove from favourites' : 'Add to favourites'}
      aria-label={isCurrentlyFavourite ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Heart
        className={cn(
          sizeConfig[size],
          'transition-all duration-200',
          isCurrentlyFavourite
            ? 'fill-green-800 text-green-800' // Filled heart for favourites
            : 'text-green-800 hover:fill-green-200', // Outline heart for non-favourites
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  );
}