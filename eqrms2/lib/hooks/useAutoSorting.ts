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

      // Auto-configure sorting
      let sortingFn = 'text'; // Default
      if (isNumeric) {
        sortingFn = 'basic';
      } else if (isDate) {
        sortingFn = 'datetime';
      }

      return {
        ...column,
        enableSorting: true,
        sortingFn
      };
    });
  }, [data, columns]);
} 