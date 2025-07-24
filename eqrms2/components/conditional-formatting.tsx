import React from 'react';

/**
 * Conditional formatting component for ratings (1-5 scale)
 * 
 * Color schemes:
 * - 1: Dark red background, light red text
 * - 2: Light red background, dark red text  
 * - 3: Light orange background, dark orange text
 * - 4: Light green background, dark green text
 * - 5: Dark green background, light green text
 */

// Helper function to get rating styles - used by all components that use RatingStyle based conditional formatting
function getRatingStyles(rating: number) {
  switch (rating) {
    case 1:
      return "bg-red-800 text-red-100";
    case 2:
      return "bg-red-100 text-red-800";
    case 3:
      return "bg-orange-100 text-orange-800";
    case 4:
      return "bg-green-100 text-green-800";
    case 5:
      return "bg-green-800 text-green-100";
    case 6:
      return ""; // using as an alternate default
    default:
      return "";
  }
}

export function RatingDisplay({ rating }: { rating: number | null }) {
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(rating as number)}`}> {rating} </div>
  );
}

/**
 * Conditional formatting component for text-based ratings
 * Maps text ratings to numeric equivalents for consistent styling
 */
export function CompQualityRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {'V High': 5,'High': 4,'Medium': 3,'Low': 2,'V Low': 1}; 
    return ratingMap[textRating];
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}

export function CoverageRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {'Focus': 5,'Detail': 4,'Basic': 3,'Brief': 2,'Exclude': 1}; 
    return ratingMap[textRating];
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}


/**
 * Conditional formatting component for numbers, which use the same color System as rating styles
 * Maps text ratings to numeric equivalents for consistent styling
 */
export function NumberRating({ rating }: { rating: number }) {
  // Map the number to a 1-5 rating based on the specified ranges
  const getNumericRating = (num: number): number => {
    if (num > 30) return 5;
    if (num > 20) return 4;
    if (num > 10) return 3;
    if (num > 0) return 2;
    return 1; // num <= 0
  };
  const numericRating = getNumericRating(rating);
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}

/**
 * NUMBER FORMATTING - EARNINGS GROWTH & STOCK PRICES
 */
export function ComGrowthNumberRating({ rating }: { rating: number }) {
  // Map the number to a 1-5 rating based on the specified ranges
  const getNumericRating = (num: number): number => {
    if (num > 25) return 5;
    if (num > 15) return 4;
    if (num < 0) return 1;
    return 6; // num <= 0
  };
  const numericRating = getNumericRating(rating);
  return (
    <div className={`px-0 py-0.5 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}


/**
 * Rating container that applies formatting but displays custom children content
 * Useful when you want the rating-based styling but custom text/icons
 */
export function RatingContainer({ rating, children }: { rating: number; children: React.ReactNode }) {
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(rating)}`}>
      {children}
    </div>
  );
}

/**
 * Text-based rating container for custom content
 */
export function TextRatingContainer({ rating, children }: { rating: string; children: React.ReactNode }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'high': 5,
      'above': 4,
      'medium': 3,
      'below': 2,
      'low': 1,
      'v low': 1,
      'very low': 1,
    };
    
    return ratingMap[textRating.toLowerCase()] || 3;
  };

  const numericRating = getNumericRating(rating);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {children}
    </div>
  );
}
