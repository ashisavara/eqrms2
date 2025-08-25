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
    } else if (aggregationFn === 'count') {
      results[columnId] = table.getFilteredRowModel().rows.length;
    }
    // Can easily extend to support other aggregation functions like 'mean', 'min', 'max', etc.
  });
  
  return results;
}

// ✅ Enhanced aggregation function for complex calculations
export function calculateCustomAggregations<TData>(
  table: TanStackTable<TData>,
  aggregations: Array<{
    key: string;
    type: 'count' | 'sum' | 'conditionalCount' | 'conditionalSum' | 'custom';
    column?: string;
    condition?: (row: any) => boolean;
    customFn?: (rows: any[]) => number;
  }>
): Record<string, number> {
  const results: Record<string, number> = {};
  
  aggregations.forEach(agg => {
    const rows = table.getFilteredRowModel().rows;
    
    switch (agg.type) {
      case 'count':
        results[agg.key] = rows.length;
        break;
        
      case 'sum':
        if (agg.column) {
          results[agg.key] = rows.reduce((sum, row) => {
            const value = row.getValue(agg.column!);
            return sum + (Number(value) || 0);
          }, 0);
        }
        break;
        
      case 'conditionalCount':
        if (agg.condition) {
          results[agg.key] = rows.reduce((count, row) => {
            return agg.condition!(row) ? count + 1 : count;
          }, 0);
        }
        break;
        
      case 'conditionalSum':
        if (agg.condition && agg.column) {
          results[agg.key] = rows.reduce((sum, row) => {
            if (agg.condition!(row)) {
              const value = row.getValue(agg.column!);
              return sum + (Number(value) || 0);
            }
            return sum;
          }, 0);
        }
        break;
        
      case 'custom':
        if (agg.customFn) {
          results[agg.key] = agg.customFn(rows);
        }
        break;
    }
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