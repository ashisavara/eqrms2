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
    console.error("Supabase query error:", error);
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

export async function getFilterOptions(
  column: string, 
  sourceTable?: string,
  valueColumn?: string,
  labelColumn?: string
): Promise<FilterOption[]> {
  
  // Mapping of filter columns to their source tables and columns
  const filterMappings: Record<string, { table: string; valueCol: string; labelCol: string }> = {
    fund_rating: { table: 'master', valueCol: 'fund_rating_tag', labelCol: 'fund_rating_tag' },
    amc_name: { table: 'view_rms_funds_screener', valueCol: 'amc_name', labelCol: 'amc_name' },
    structure_name: { table: 'view_rms_funds_screener', valueCol: 'structure_name', labelCol: 'structure_name' },
    category_name: { table: 'view_rms_funds_screener', valueCol: 'category_name', labelCol: 'category_name' },
    estate_duty_exposure: { table: 'master', valueCol: 'estate_duty_exposure_tag', labelCol: 'estate_duty_exposure_tag' },
    us_investors: { table: 'master', valueCol: 'us_investors_tag', labelCol: 'us_investors_tag' }
  };

  // Use provided parameters or look up in mapping
  const mapping = filterMappings[column];
  const table = sourceTable || mapping?.table || 'master';
  const valueCol = valueColumn || mapping?.valueCol || column;
  const labelCol = labelColumn || mapping?.labelCol || column;

  try {
    // For some columns, get distinct values directly from the funds table
    if (['amc_name', 'structure_name', 'category_name'].includes(column)) {
      const { data, error } = await (await createClient())
        .from('view_rms_funds_screener')
        .select(column)
        .not(column, 'is', null)
        .not(column, 'eq', '');
      
      if (error) throw error;
      
      const uniqueValues = [...new Set(data.map((row: Record<string, any>) => row[column]))].sort();
      return uniqueValues.map(value => ({ value, label: value }));
    }

    // For rating, create numeric options
    if (column === 'fund_rating') {
      return [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
      ];
    }

    // For Y/N fields, provide standard options
    if (['estate_duty_exposure', 'us_investors'].includes(column)) {
      return [
        { value: 'Y', label: 'Yes' },
        { value: 'N', label: 'No' }
      ];
    }

    // Fallback to master table lookup
    const data = await supabaseListRead({
      table,
      columns: `${valueCol}, ${labelCol}`,
      filters: [
        (query) => query.neq(valueCol, null),
        (query) => query.neq(labelCol, null)
      ]
    });

    return data.map((item: Record<string, any>) => ({
      value: item[valueCol],
      label: item[labelCol]
    }));

  } catch (error) {
    console.error(`Error fetching filter options for ${column}:`, error);
    return [];
  }
}

// Import the existing helper for backward compatibility
import { supabaseListRead } from "./serverQueryHelper"; 