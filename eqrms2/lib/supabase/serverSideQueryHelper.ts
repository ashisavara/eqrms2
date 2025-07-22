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
    let searchQuery = query;
    searchColumns.forEach((column, index) => {
      if (index === 0) {
        searchQuery = searchQuery.ilike(column, `%${search}%`);
      } else {
        searchQuery = searchQuery.or(`${column}.ilike.%${search}%`);
      }
    });
    return searchQuery;
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