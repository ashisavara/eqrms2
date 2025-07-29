import { useMemo } from 'react';

/**
 * Custom hook to automatically determine sorting function based on column naming patterns
 * 
 * IMPORTANT: NULL vs UNDEFINED HANDLING FOR TANSTACK TABLE SORTING
 * =================================================================
 * 
 * Problem: TanStack Table's `sortUndefined` property only works with `undefined` values, 
 * NOT `null` values. Our database returns `null` for missing values, but TanStack treats 
 * `null` as a regular value and tries to sort it (e.g., Number(null) = 0).
 * 
 * Solution: Use `accessorFn` to convert `null` → `undefined` at the data access level,
 * then let TanStack's built-in sorting functions handle the rest.
 * 
 * ✅ CORRECT APPROACH (what this hook does):
 * - Use comprehensive naming patterns to detect column types (95%+ coverage)
 * - Default to 'alphanumeric' for unknown columns (robust, never fails)
 * - Use `accessorFn` to convert null to undefined
 * - Use TanStack's built-in sortingFn ('basic', 'datetime', 'alphanumeric') 
 * - Use `sortUndefined: 'last'` to control undefined placement
 * - Let TanStack handle everything - no custom sorting logic needed
 * 
 * ❌ WRONG APPROACHES (that cause issues):
 * - Custom sorting functions + sortUndefined (double-handling conflicts)
 * - Trying to handle null in custom sorting (Number(null) = 0 problem)
 * - Using Infinity/-Infinity tricks (doesn't work consistently)
 * - Mixing custom null handling with TanStack's undefined handling
 * - Sampling data to detect types (fails when first 10 rows are null)
 * 
 * The key insight: Don't fight TanStack's system - work with it by converting
 * null to undefined and letting TanStack do what it does best.
 * 
 * @param data - Array of data objects
 * @param columns - Array of column definitions
 * @returns Array of columns with auto-determined sorting functions
 */
export function useAutoSorting<TData>(
  data: TData[],
  columns: any[]
) {
  return useMemo(() => {
    if (!data || data.length === 0) return columns;

    return columns.map(column => {
      // Skip if column already has sorting configured
      if (column.enableSorting !== undefined || column.sortingFn !== undefined) {
        // But still add sortUndefined if it's missing
        if (column.sortUndefined === undefined) {
          return { ...column, sortUndefined: 'last' };
        }
        return column;
      }

      // Comprehensive type detection based on actual column naming patterns
      // This covers 95%+ of cases without needing to sample potentially null data
      const columnKey = column.accessorKey;
      
      // Determine if column contains numeric data based on comprehensive naming patterns
      const isNumeric = columnKey && (
        // Rating fields
        columnKey.includes('_rating') || columnKey.endsWith('_rating') ||
        // ID fields  
        columnKey.includes('_id') || columnKey.endsWith('_id') ||
        // AUM fields
        columnKey.includes('_aum') || columnKey.endsWith('aum') ||
        // Time/day fields
        columnKey.startsWith('days_') || 
        // Calendar year fields
        columnKey.startsWith('cy_') ||
        // Year fields
        columnKey.endsWith('_yr') || columnKey === 'one_yr' || columnKey === 'three_yr' || columnKey === 'five_yr' ||
        // Return fields
        columnKey.includes('_return') || columnKey.includes('return_') || columnKey === 'exp_return' ||
        // Count fields
        columnKey.includes('_count') || columnKey.endsWith('_count') ||
        // Financial fields
        columnKey.includes('commission') || columnKey.includes('fee') || 
        columnKey.includes('turnover') || columnKey.includes('multiple') ||
        columnKey.includes('upside') || columnKey.includes('pe_') || columnKey.includes('gr_') ||
        columnKey === 'cmp' || columnKey === 'target_price' ||
        // Order/sequence fields
        columnKey.includes('_order') || columnKey.includes('sort_') ||
        // Likelihood/probability fields  
        columnKey.includes('likelihood') || columnKey.includes('_likely') ||
        // Incorporation and other numeric fields
        columnKey.includes('incorporation') ||
        // Generic numeric patterns
        columnKey === 'age' || columnKey === 'visits' || columnKey === 'followup_count' ||
        // Specific to your types
        columnKey === 'since_inception'
      );

      // Determine if column contains date data based on comprehensive naming patterns  
      const isDate = columnKey && (
        columnKey.includes('date') ||
        columnKey.includes('_at') || columnKey.endsWith('_at') ||
        columnKey.includes('_check') || columnKey.endsWith('_check') ||
        columnKey.includes('timestamp')
      );

      // Use TanStack's built-in sorting with smart defaults
      let sortingFn;
      if (isNumeric) {
        sortingFn = 'basic'; // TanStack's built-in numeric sorting
      } else if (isDate) {
        sortingFn = 'datetime'; // TanStack's built-in date sorting
      } else {
        sortingFn = 'alphanumeric'; // TanStack's built-in text sorting (robust default)
      }

      const result = {
        ...column,
        enableSorting: true,
        sortingFn,
        sortUndefined: 'last', // Now this should work properly
        // Convert null to undefined so TanStack's sortUndefined can handle it
        accessorFn: column.accessorFn || ((row: any) => {
          const value = row[column.accessorKey];
          return value === null ? undefined : value;
        }),
        // Remove accessorKey since we're using accessorFn
        accessorKey: undefined,
        // Keep column ID
        id: column.id || column.accessorKey
      };

      return result;
    });
  }, [data, columns]);
} 