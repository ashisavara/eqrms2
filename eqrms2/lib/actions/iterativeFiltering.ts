"use server";

import { getIterativeFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import type { ServerSideFilters, FilterConfiguration } from "@/lib/supabase/serverSideQueryHelper";

/**
 * 🔄 SERVER ACTION: Update Filter Options
 * 
 * This server action wraps the getIterativeFilterOptions function
 * so it can be called from client components safely.
 * 
 * Server actions allow client components to call server-side functions
 * without violating Next.js App Router constraints.
 */
export async function updateFilterOptionsAction(
  sourceTable: string,
  filterKeys: string[],
  filterConfig: FilterConfiguration,
  currentFilters: ServerSideFilters = {},
  searchColumns: string[] = [],
  search?: string
) {
  try {
    const result = await getIterativeFilterOptions(
      sourceTable,
      filterKeys,
      filterConfig,
      currentFilters,
      searchColumns,
      search
    );
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Server action error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 