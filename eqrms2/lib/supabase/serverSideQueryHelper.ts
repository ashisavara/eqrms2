/**
 * Server-Side Query Helper for Supabase
 * 
 * This module provides utilities for server-side data fetching with advanced filtering,
 * pagination, sorting, and search capabilities. It's designed for large datasets where
 * client-side processing would be inefficient.
 * 
 * MAIN FUNCTIONS:
 * 
 * 1. serverSideQuery() - Main function for fetching data with server-side processing
 *    - Handles filtering, pagination, sorting, and search
 *    - Returns data with pagination metadata
 *    - Efficient for large datasets (1000+ records)
 * 
 * 2. getFilterOptions() - Fetches filter options from reference tables
 *    - Gets distinct values for dropdowns/multi-select filters
 *    - Supports custom table mappings
 * 
 * 3. getMultipleFilterOptions() - Convenience function for multiple filters
 *    - Fetches multiple filter options in parallel
 *    - Returns a record with all filter options
 * 
 * USAGE EXAMPLE:
 * 
 * // 1. Define filter configuration (maps filter keys to database tables)
 * const filterConfig = {
 *   amc_name: { table: 'rms_amc', valueCol: 'amc_name', labelCol: 'amc_name' },
 *   cat_name: { table: 'rms_category', valueCol: 'cat_name', labelCol: 'cat_name' }
 * };
 * 
 * // 2. Get filter options for dropdowns
 * const filterOptions = await getMultipleFilterOptions(['amc_name', 'cat_name'], filterConfig);
 * 
 * // 3. Query data with filters, pagination, sorting
 * const result = await serverSideQuery({
 *   table: "view_rms_funds_screener",
 *   columns: "fund_id,fund_name,amc_name,cat_name",
 *   filters: { amc_name: ['HDFC', 'ICICI'], cat_name: ['Equity'] },
 *   search: "growth",
 *   searchColumns: ['fund_name', 'amc_name'],
 *   pagination: { page: 1, pageSize: 50 },
 *   sorting: [{ column: 'fund_rating', direction: 'desc' }]
 * });
 * 
 * // Result includes: data, totalCount, currentPage, totalPages, etc.
 */

import { createClient } from "./server";

// Types for server-side querying
export interface ServerSideFilters {
  [key: string]: string | string[] | number | number[] | boolean | null;
}

export interface ServerSidePagination {
  page: number;
  pageSize: number;
}

export interface ServerSideSorting {
  column: string;
  direction: 'asc' | 'desc';
}

export interface ServerSideQueryOptions {
  table: string;
  columns?: string;
  filters?: ServerSideFilters;
  search?: string;
  searchColumns?: string[];
  pagination?: ServerSidePagination;
  sorting?: ServerSideSorting[];
  staticFilters?: ((query: any) => any)[];
}

export interface ServerSideQueryResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
}

// Convert filter values to Supabase filter functions
function buildFilters(filters: ServerSideFilters): ((query: any) => any)[] {
  const filterFunctions: ((query: any) => any)[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        filterFunctions.push((query) => query.in(key, value));
      }
    } else if (typeof value === 'string') {
      filterFunctions.push((query) => query.eq(key, value));
    } else if (typeof value === 'number') {
      filterFunctions.push((query) => query.eq(key, value));
    } else if (typeof value === 'boolean') {
      filterFunctions.push((query) => query.eq(key, value));
    }
  });

  return filterFunctions;
}

// Build search filters for text search across multiple columns
function buildSearchFilters(search: string, searchColumns: string[]): ((query: any) => any)[] {
  if (!search || !searchColumns.length) return [];

  // Create OR condition for search across multiple columns
  return [(query: any) => {
    const orConditions = searchColumns.map(column => `${column}.ilike.%${search}%`);
    return query.or(orConditions.join(','));
  }];
}

// Server-side query with pagination, filtering, sorting, and search
export async function serverSideQuery<T = any>({
  table,
  columns = "*",
  filters = {},
  search,
  searchColumns = [],
  pagination,
  sorting = [],
  staticFilters = []
}: ServerSideQueryOptions): Promise<ServerSideQueryResult<T>> {
  const supabase = await createClient();

  // Build dynamic filters
  const dynamicFilters = buildFilters(filters);
  
  // Build search filters
  const searchFilters = search ? buildSearchFilters(search, searchColumns) : [];
  

  
  // Combine all filters
  const allFilters = [...staticFilters, ...dynamicFilters, ...searchFilters];

  // Get total count first (for pagination info)
  let countQuery = supabase.from(table).select('*', { count: 'exact', head: true });
  
  // Apply filters to count query
  allFilters.forEach((filterFn) => {
    countQuery = filterFn(countQuery);
  });

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error("Supabase count error:", countError);
    throw countError;
  }

  const totalCount = count || 0;

  // Build main data query
  let dataQuery = supabase.from(table).select(columns);

  // Apply filters
  allFilters.forEach((filterFn) => {
    dataQuery = filterFn(dataQuery);
  });

  // Apply sorting
  sorting.forEach(({ column, direction }) => {
    dataQuery = dataQuery.order(column, { ascending: direction === 'asc' });
  });

  // Apply pagination
  if (pagination) {
    const { page, pageSize } = pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    dataQuery = dataQuery.range(start, end);
  }

  const { data, error } = await dataQuery;
  if (error) {
    console.error("Data fetch error:", error);
    throw error;
  }

  // Calculate pagination info
  const totalPages = pagination ? Math.ceil(totalCount / pagination.pageSize) : 1;
  const currentPage = pagination?.page || 1;
  const hasNextPage = pagination ? currentPage < totalPages : false;
  const hasPreviousPage = pagination ? currentPage > 1 : false;

  return {
    data: data as T[],
    totalCount,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    pageSize: pagination?.pageSize || totalCount
  };
}

// Helper to get filter options from reference tables
export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface FilterMapping {
  table: string;
  valueCol: string;
  labelCol: string;
}

export interface FilterConfiguration {
  [column: string]: FilterMapping;
}

export async function getFilterOptions(
  column: string, 
  customConfig: FilterConfiguration,
  sourceTable?: string,
  valueColumn?: string,
  labelColumn?: string
): Promise<FilterOption[]> {
  
  // Use the provided config
  const filterMappings = customConfig;

  // Use provided parameters or look up in mapping
  const mapping = filterMappings[column];
  const table = sourceTable || mapping?.table || 'master';
  const valueCol = valueColumn || mapping?.valueCol || column;
  const labelCol = labelColumn || mapping?.labelCol || column;

  try {
    // Special handling for fund_rating - use hardcoded values to avoid DB issues
    if (column === 'fund_rating') {
      return [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
      ];
    }

    // Use the mapping to get the correct table and columns
    const data = await supabaseListRead({
      table,
      columns: `${valueCol}, ${labelCol}`,
      filters: [
        (query) => query.not(valueCol, 'is', null),
        (query) => query.neq(valueCol, ''),
      ]
    });

    // Get unique values and sort them
    const uniqueValues = [...new Set(data.map((item: Record<string, any>) => item[valueCol]))];
    
    return uniqueValues
      .filter(value => value !== null && value !== undefined && value !== '')
      .sort((a, b) => {
        // Handle numeric sorting for numbers, string sorting for text
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        return String(a).localeCompare(String(b));
      })
      .map(value => ({ 
        value, 
        label: value.toString() 
      }));

  } catch (error) {
    console.error(`Error fetching filter options for ${column}:`, error);
    return [];
  }
}

// Convenience function to get multiple filter options at once
export async function getMultipleFilterOptions(
  columns: string[],
  customConfig: FilterConfiguration
): Promise<Record<string, FilterOption[]>> {
  const results = await Promise.all(
    columns.map(async (column) => {
      const options = await getFilterOptions(column, customConfig);
      return { column, options };
    })
  );

  return results.reduce((acc, { column, options }) => {
    acc[column] = options;
    return acc;
  }, {} as Record<string, FilterOption[]>);
}

// Import the existing helper for backward compatibility
import { supabaseListRead } from "./serverQueryHelper";

/**
 * 🔄 ITERATIVE FILTER OPTIONS
 * 
 * This function provides dynamic filter options that update based on currently applied filters.
 * It ensures users only see options that will return results, creating a better UX.
 * 
 * HOW IT WORKS:
 * - For each filter column, apply ALL OTHER filters except that specific column
 * - Get distinct values from the filtered dataset for that column  
 * - Return updated options that will guarantee results
 * 
 * EXAMPLE:
 * User selects: AMC = "HDFC"
 * Result: Category filter now only shows categories that HDFC has funds in
 * 
 * @param sourceTable - The main data table/view to query
 * @param filterKeys - Array of filter column names
 * @param filterConfig - Configuration mapping filter keys to their source tables
 * @param currentFilters - Currently applied filters (from URL state)
 * @param searchColumns - Columns to include in search (optional)
 * @param search - Current search query (optional)
 */
export async function getIterativeFilterOptions(
  sourceTable: string,
  filterKeys: string[],
  filterConfig: FilterConfiguration,
  currentFilters: ServerSideFilters = {},
  searchColumns: string[] = [],
  search?: string
): Promise<Record<string, FilterOption[]>> {
  const supabase = await createClient();
  
  // Prepare results object
  const results: Record<string, FilterOption[]> = {};

  // For each filter key, get options based on OTHER applied filters
  for (const filterKey of filterKeys) {
    try {
      // Special handling for fund_rating - always return all options
      if (filterKey === 'fund_rating') {
        results[filterKey] = [
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' }
        ];
        continue;
      }

      // Create filters for all OTHER columns (exclude current filter key)
      const otherFilters: ServerSideFilters = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (key !== filterKey && value !== null && value !== undefined) {
          // Only include non-empty arrays and non-empty values
          if (Array.isArray(value)) {
            if (value.length > 0) {
              otherFilters[key] = value;
            }
          } else if (value !== '') {
            otherFilters[key] = value;
          }
        }
      });

      // Build query for distinct values in this column
      let query = supabase
        .from(sourceTable)
        .select(filterKey, { count: 'exact' });

      // Apply filters from OTHER columns
      const filterFunctions = buildFilters(otherFilters);
      filterFunctions.forEach((filterFn) => {
        query = filterFn(query);
      });

      // Apply search filters if provided
      if (search && searchColumns.length > 0) {
        const searchFilters = buildSearchFilters(search, searchColumns);
        searchFilters.forEach((searchFn) => {
          query = searchFn(query);
        });
      }

      // Execute query
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching iterative options for ${filterKey}:`, error);
        // Fallback to original filter options
        results[filterKey] = await getFilterOptions(filterKey, filterConfig);
        continue;
      }

      // Extract unique values, filter out nulls/empties, and sort
      const uniqueValues = [
        ...new Set(
          (data || [])
            .map((item: any) => item[filterKey])
            .filter(value => value !== null && value !== undefined && value !== '')
        )
      ];

      // Sort values appropriately
      uniqueValues.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        return String(a).localeCompare(String(b));
      });

      // Convert to FilterOption format
      results[filterKey] = uniqueValues.map(value => ({
        value,
        label: value.toString()
      }));

      // If no results found with current filters, fall back to original options
      // This prevents empty filter dropdowns which would be confusing
      if (results[filterKey].length === 0) {
        results[filterKey] = await getFilterOptions(filterKey, filterConfig);
      }

    } catch (error) {
      console.error(`Error processing iterative filter for ${filterKey}:`, error);
      // Fallback to original filter options
      results[filterKey] = await getFilterOptions(filterKey, filterConfig);
    }
  }

  return results;
} 