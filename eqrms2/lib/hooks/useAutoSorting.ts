import { useMemo } from 'react';

/**
 * Custom hook to automatically determine sorting function based on data type
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

      // Get sample values for this column
      const sampleValues = data
        .slice(0, 10) // Check first 10 rows for efficiency
        .map(row => (row as any)[column.accessorKey])
        .filter(val => val !== null && val !== undefined);

      if (sampleValues.length === 0) {
        return { ...column, enableSorting: false };
      }

      // Determine if column contains numeric data
      const isNumeric = sampleValues.every(val => {
        if (typeof val === 'number') return true;
        if (typeof val === 'string') {
          // Check if string represents a number (including percentages, decimals)
          const numStr = val.replace(/[%,]/g, ''); // Remove % and commas
          return !isNaN(Number(numStr)) && numStr.trim() !== '';
        }
        return false;
      });

      // Determine if column contains date data
      const isDate = sampleValues.every(val => {
        if (val instanceof Date) return true;
        if (typeof val === 'string') {
          const date = new Date(val);
          return !isNaN(date.getTime());
        }
        return false;
      });

      // Use TanStack's built-in sorting with accessorFn that converts null to undefined
      let sortingFn;
      if (isNumeric) {
        sortingFn = 'basic'; // TanStack's built-in numeric sorting
      } else if (isDate) {
        sortingFn = 'datetime'; // TanStack's built-in date sorting
      } else {
        sortingFn = 'alphanumeric'; // TanStack's built-in text sorting
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