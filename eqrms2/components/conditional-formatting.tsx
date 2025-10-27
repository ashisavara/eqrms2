import React from 'react';
import { StarIcon } from "lucide-react";

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
      return "bg-red-700 text-red-100";
    case 2:
      return "bg-red-100 text-red-800";
    case 3:
      return "bg-orange-100 text-orange-800";
    case 4:
      return "bg-green-100 text-green-900";
    case 5:
      return "bg-green-800 text-white";
    case 6:
      return ""; // using as an alternate default
    default:
      return "";
  }
}

export function RatingDisplay({ rating }: { rating: number | null }) {
  // Handle null/undefined rating
  const displayRating = rating ?? '';
  
  return (
    <div className={`flex flex-row gap-1 items-center justify-center px-1 py-1 rounded font-medium text-center ${getRatingStyles(rating as number)}`}>
      {displayRating} 
    </div>
  );
}

export function RatingDisplayWithStar({ rating }: { rating: number | null }) {
  // Handle null/undefined rating
  const displayRating = rating ?? '';
  
  return (
    <div className={`flex flex-row gap-1 items-center justify-center px-1 py-1 rounded font-medium text-center ${getRatingStyles(rating as number)}`}>
      {displayRating} <StarIcon className="w-4 h-4" />
    </div>
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

export function CrmImportanceRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      '4) Urgent': 5,
      '3) High': 4,
      '2) Medium': 3,
      '1) Low': 2,
      '1) Reassign': 2,
      '0) Nil': 1,
      '0) Avoid': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <span className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </span>
  );
}

export function CrmWealthRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      '4) Ultra-HNI': 5,
      '3) HNI': 4,
      '2) Affluent': 3,
      '1) Wealth': 2,
      '0) Retail': 1,
      '0) Unknown': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <span className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </span>
  );
}

export function CrmProgressionRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      '6) Client': 5,
      '5) Documentation': 4,
      '4) Deal Indicated': 4,
      '3) Inv Consultation': 3,
      '3) Ex-client': 3,
      '2) Initial Discussion': 2,
      '1) Contact Initiated': 2,
      '0) No Contact': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <span className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </span>
  );
}

export function CrmLeadSourceRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      '4) RM Contacts': 5,
      '4) Ashi Contacts': 5,
      '3) Partner Referral': 4,
      '3) Client Referral': 4,
      '2) IME Website': 3,
      '2) IME Academy': 3,
      '1) Digital Ads': 2,
      '0) Database': 1,
      '0) Unknown': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <span className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </span>
  );
}


export function RmsFundFiveYrPerfRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Strong': 5,
      'Good': 4,
      'Average': 3,
      'Weak': 2,
      'Very Weak': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}


export function RmsFundPerfConsistencyRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Highly Consistent': 5,
      'Good Consistency': 4,
      'Average Consistency': 3,
      'Weak Consistency': 2,
      'Very Weak Consistency': 1
    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}

export function RmsFundStrategyDefRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Strongly Defined & Followed': 5,
      'Strongly Defined': 4,
      'Generic Philosophy': 3,
      'Flexible Philosphy': 3,
      'Well Defined': 3,
      'Loosely Defined': 2,

    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}


export function RmsFundFmChurnRiskRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Nil (FM-Founder)': 5,
      'Low (Depth in team)': 4,
      'Low (Large ESOP)': 4,
      'Moderate (AMC-driven)': 3,
      'High (Risk of churn)': 2,
      'V High (FM-dependence)': 1,

    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}


export function RmsAmcMaturityRating({ rating }: { rating: string }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Highly Seasoned (10+ yrs)': 5,
      'Matured (5-10 yrs)': 4,
      'New AMC (3-5 yrs)': 3,
      'Nascent AMC (<3 yrs)': 2

    }; 
    return ratingMap[textRating] || 0;
  };
  const numericRating = getNumericRating(rating); 
  return (
    <div className={`px-1 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
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
    if (num < 0) return 2;
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
 * NUMBER FORMATTING - DEAL LIKELIHOOD
 */
export function DealLikelihoodRating({ rating }: { rating: number }) {
  // Map the number to a 1-5 rating based on the specified ranges
  const getNumericRating = (num: number): number => {
    if (num == 1) return 5;
    if (num == 0.8) return 4;
    if (num == 0.6) return 3;
    if (num == 0.4) return 2;
    if (num == 0.2) return 1;
    return 1; // num <= 0
  };
  const numericRating = getNumericRating(rating);
  return (
    <div className={`px-0 py-0.5 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {rating}
    </div>
  );
}



/**
 * CRM FOLLOW UP
 */
export function CrmFollowupNumberRating({ rating }: { rating: number }) {
  // Map the number to a 1-5 rating based on the specified ranges
  const getNumericRating = (num: number): number => {
    if (num > 25) return 5;
    if (num > 15) return 4;
    if (num > 0) return 6;
    if (num > -10) return 2;
    if (num < -10) return 1;
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


/**
 * Text-based rating container for deal est Closure
 */
export function DealEstClosureRating({ rating, children }: { rating: string; children: React.ReactNode }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Current Month': 5,
      'Next Month': 4,
      'Within 3m': 3,
      'Within 6m': 2,
      'After 6m': 1,
      'Better Markets': 2,
      'Awaiting Funds': 2,
    };
    
    return ratingMap[textRating] || 3;
  };

  const numericRating = getNumericRating(rating);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {children}
    </div>
  );
}


/**
 * Text-based rating container for deal stage
 */
export function DealStageRating({ rating, children }: { rating: string; children: React.ReactNode }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      '7) Won': 5,
      '6) Execution': 5,
      '5) Documentation': 4,
      '4) Confirmed': 3,
      '3) Likely': 2, 
      '2) Indicated': 2,
      '1) Cold': 1,
      '0) Lost': 1,
    };
    
    return ratingMap[textRating] || 3;
  };

  const numericRating = getNumericRating(rating);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {children}
    </div>
  );
}

/**
 * Goal Achievement Rating - maps percentage values to 1-5 rating scale
 * 1: below 25%, 2: below 50%, 3: below 75%, 4: below 100%, 5: 100% and above
 */
export function GoalAchievementRating({ percentage }: { percentage: number }) {
  const getNumericRating = (percent: number): number => {
    if (percent >= 100) return 5;
    if (percent >= 75) return 4;
    if (percent >= 50) return 3;
    if (percent >= 25) return 2;
    return 1; // below 25%
  };

  const numericRating = getNumericRating(percentage);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {percentage?.toFixed(0) || ""}
    </div>
  );
}

/**
 * Years to Goal Rating - maps years to 1-5 rating scale
 * 1: less than 1 year, 2: less than 3 years, 3: less than 5 years, 4: less than 7 years, 5: 7+ years
 */
export function YearsToGoalRating({ years }: { years: number }) {
  const getNumericRating = (yrs: number): number => {
    if (yrs >= 7) return 5;  // Dark green (7+ years)
    if (yrs >= 5) return 4;   // Light green (5-6.9 years)
    if (yrs >= 3) return 3;   // Orange (3-4.9 years)
    if (yrs >= 1) return 2;   // Light red (1-2.9 years)
    return 1; // Dark red (less than 1 year)
  };

  const numericRating = getNumericRating(years);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {years?.toFixed(1) || ""}
    </div>
  );
}


/**
 * Text-based rating container for Ticketing Importance stage
 */
export function ImportanceRating({ rating, children }: { rating: string; children: React.ReactNode }) {
  const getNumericRating = (textRating: string): number => {
    const ratingMap: Record<string, number> = {
      'Urgent': 1,
      'High': 2,
      'Medium': 3,
      'Low': 4,
    };
    
    return ratingMap[textRating] || 3;
  };

  const numericRating = getNumericRating(rating);
  
  return (
    <div className={`px-2 py-1 rounded font-medium text-center ${getRatingStyles(numericRating)}`}>
      {children}
    </div>
  );
}