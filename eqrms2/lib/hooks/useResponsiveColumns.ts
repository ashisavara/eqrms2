import { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Custom hook for responsive table columns using conditional isFilterOnly
 * 
 * @param columns - Original column definitions
 * @param primaryColumnId - The column ID that should remain visible on mobile (e.g., 'fund_name', 'ime_name')
 * @param breakpoint - Screen width breakpoint in pixels (default: 768px for md)
 * @returns Responsive columns that hide non-primary columns on mobile via isFilterOnly
 */
export function useResponsiveColumns<TData>(
  columns: ColumnDef<TData>[],
  primaryColumnId: string,
  breakpoint: number = 768
) {
  // ✅ Screen size detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  // ✅ Dynamically modify columns based on screen size
  const responsiveColumns = useMemo(() => {
    return columns.map(column => {
      // Keep the primary column visible on all screen sizes
      const columnId = column.id || (column as any).accessorKey;
      if (columnId === primaryColumnId) {
        return column;
      }

      // For mobile, mark all other columns as filter-only (except already filter-only columns)
      if (isMobile) {
        return {
          ...column,
          meta: {
            ...column.meta,
            isFilterOnly: true
          }
        };
      }

      // For desktop, use original column definitions
      return column;
    });
  }, [columns, primaryColumnId, isMobile]);

  return {
    responsiveColumns,
    isMobile
  };
}

/**
 * Helper function to detect if we're in mobile view within a cell renderer
 * Use this inside column cell functions to determine mobile vs desktop rendering
 * 
 * @param table - The TanStack table instance
 * @returns boolean indicating if only one column is visible (mobile mode)
 */
export function isMobileView(table: any): boolean {
  const visibleColumns = table.getAllColumns().filter((col: any) => !col.columnDef.meta?.isFilterOnly);
  return visibleColumns.length === 1;
}
