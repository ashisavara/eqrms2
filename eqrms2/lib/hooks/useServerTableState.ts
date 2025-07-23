import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface ServerTableState {
  filters: Record<string, any>;
  pagination: {
    page: number;
    pageSize: number;
  };
  sorting: {
    column: string;
    direction: 'asc' | 'desc';
  };
  search: string;
}

export interface ServerTableConfig {
  filterKeys: string[];
  defaultSort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  defaultPageSize?: number;
}

export function useServerTableState(config: ServerTableConfig) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current state from URL
  const parseCurrentState = useCallback((): ServerTableState => {
    const params = Object.fromEntries(searchParams.entries());
    
    // Parse filters
    const filters: Record<string, any> = {};
    config.filterKeys.forEach(key => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        // Convert to numbers if the key suggests it's a rating/numeric field
        if (key.includes('rating') || key.includes('_id')) {
          filters[key] = values.map(v => Number(v)).filter(v => !isNaN(v));
        } else {
          filters[key] = values;
        }
      }
    });

    // Parse pagination
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || config.defaultPageSize || 50;

    // Parse sorting
    const sortColumn = params.sort || config.defaultSort?.column || 'id';
    const sortDirection = (params.order as 'asc' | 'desc') || config.defaultSort?.direction || 'desc';

    // Parse search
    const search = params.search || '';

    return {
      filters,
      pagination: { page, pageSize },
      sorting: { column: sortColumn, direction: sortDirection },
      search
    };
  }, [searchParams, config]);

  // Build URL with new state
  const buildUrl = useCallback((
    newState: Partial<ServerTableState>,
    resetPage = true,
    basePath: string
  ): string => {
    const currentState = parseCurrentState();
    const updatedState = { ...currentState, ...newState };
    
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(updatedState.filters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => params.append(key, value.toString()));
      }
    });

    // Add search
    if (updatedState.search) {
      params.set('search', updatedState.search);
    }

    // Add sorting
    params.set('sort', updatedState.sorting.column);
    params.set('order', updatedState.sorting.direction);

    // Add pagination
    const pageToUse = resetPage ? 1 : updatedState.pagination.page;
    if (pageToUse > 1) {
      params.set('page', pageToUse.toString());
    }
    if (updatedState.pagination.pageSize !== (config.defaultPageSize || 50)) {
      params.set('pageSize', updatedState.pagination.pageSize.toString());
    }

    return `${basePath}?${params.toString()}`;
  }, [parseCurrentState, config]);

  // Navigation helpers
  const navigate = useCallback((newState: Partial<ServerTableState>, resetPage = true, basePath: string) => {
    const url = buildUrl(newState, resetPage, basePath);
    router.push(url);
  }, [router, buildUrl]);

  const updateFilters = useCallback((filters: Record<string, any>, basePath: string) => {
    navigate({ filters }, true, basePath);
  }, [navigate]);

  const updateSearch = useCallback((search: string, basePath: string) => {
    navigate({ search }, true, basePath);
  }, [navigate]);

  const updateSort = useCallback((column: string, direction: 'asc' | 'desc', basePath: string) => {
    navigate({ sorting: { column, direction } }, false, basePath);
  }, [navigate]);

  const updatePagination = useCallback((page: number, basePath: string, pageSize?: number) => {
    const paginationUpdate: any = { pagination: { page, pageSize: pageSize || parseCurrentState().pagination.pageSize } };
    navigate(paginationUpdate, false, basePath);
  }, [navigate, parseCurrentState]);

  const clearFilters = useCallback((basePath: string) => {
    router.push(basePath);
  }, [router]);

  return {
    state: parseCurrentState(),
    buildUrl,
    navigate,
    updateFilters,
    updateSearch,
    updateSort,
    updatePagination,
    clearFilters
  };
} 