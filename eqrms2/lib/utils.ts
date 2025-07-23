import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Formats a date/timestamp into "DD-MMM-YYYY" format (e.g., "25-Dec-2024")
 * 
 * @param value - Date object, string timestamp, number timestamp, or null/undefined
 * @returns Formatted date string or empty string if invalid/null
 * 
 * @example
 * formatDate(new Date()) // "25-Dec-2024"
 * formatDate("2024-12-25") // "25-Dec-2024"
 * formatDate(1703462400000) // "25-Dec-2023"
 * formatDate(null) // ""
 */
export function formatDate(value: Date | string | number | null | undefined): string {
  if (!value) return '';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.warn('Invalid date format:', value);
    return '';
  }
}
