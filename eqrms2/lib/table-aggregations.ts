import { type Table as TanStackTable } from "@tanstack/react-table";

/**
 * Calculate aggregated values for specified columns based on filtered table data
 * This can be used both in table footers and external UI elements like cards
 */
export function calculateAggregations<TData>(
  table: TanStackTable<TData>,
  columnIds: string[]
): Record<string, number> {
  const results: Record<string, number> = {};
  
  columnIds.forEach(columnId => {
    const column = table.getColumn(columnId);
    if (!column) return;
    
    const aggregationFn = column.columnDef.aggregationFn;
    
    if (aggregationFn === 'sum') {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const value = row.getValue(columnId);
        return sum + (Number(value) || 0);
      }, 0);
      results[columnId] = total;
    }
    // Can easily extend to support other aggregation functions like 'count', 'mean', etc.
  });
  
  return results;
}

/**
 * Format aggregated value for display
 */
export function formatAggregatedValue(
  value: number, 
  formatter?: (value: number) => string | React.ReactNode
): string | React.ReactNode {
  if (formatter) {
    return formatter(value);
  }
  return value.toLocaleString();
}