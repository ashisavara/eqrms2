"use client"; // ✅ Required if you're using this in a Next.js App Router page

import {
  type Table as TanStackTable, // ✅ TanStack's internal Table type (generic)
  flexRender, // ✅ Helper to render headers and cells dynamically
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// ✅ Filter configuration interface
interface FilterConfig {
  column: string;
  title: string;
  placeholder?: string;
}

// ✅ This is the reusable table component you can call from any page.
//    It receives a TanStack `table` instance and renders a complete <table>.
interface BasicTableProps<TData> {
  table: TanStackTable<TData>; // The `table` instance returned by useReactTable()
  className?: string;          // Optional Tailwind classes
  emptyText?: string;          // Custom message if there are no rows
  showPagination?: boolean;    // Toggle pagination controls
  showSearch?: boolean;        // Toggle search input
  searchPlaceholder?: string;  // Custom search placeholder
  filters?: FilterConfig[];    // Column filters configuration
}

export function ReactTableWrapper<TData>({
  table,
  className = "",
  emptyText = "No results found.",
  showPagination = true,
  showSearch = true,
  searchPlaceholder = "Search all columns...",
  filters = [],
}: BasicTableProps<TData>) {
  // ✅ STEP 1: Generate original options from the FULL dataset (never changes)
  // This ensures users can always multi-select within the same filter
  // Example: Can select both "Auto" AND "Pharma" sectors even after filtering
  const originalOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    if (filters.length > 0) {
      // Use original data before any filtering
      const allRows = table.getCoreRowModel().rows;
      
      filters.forEach(filter => {
        const uniqueValues = new Set<string>();
        allRows.forEach(row => {
          const value = row.getValue(filter.column);
          if (value != null && value !== '') {
            uniqueValues.add(String(value));
          }
        });
        options[filter.column] = Array.from(uniqueValues).sort();
      });
    }
    
    return options;
  }, [table.getCoreRowModel().rows, filters]);

  // ✅ STEP 2: Generate filtered options for ITERATIVE filtering between different filters
  // This shows only options that exist in data filtered by OTHER filters (not the current one)
  // Example: If "Auto" sector selected, Industry dropdown only shows Auto industries
  const getFilteredOptionsForColumn = useMemo(() => {
    return (targetColumn: string) => {
      if (filters.length === 0) return [];

      // Get all current filter states EXCEPT the target column
      const otherFilters = filters.filter(f => f.column !== targetColumn);
      
      // Start with all rows
      let filteredRows = table.getCoreRowModel().rows;
      
      // Apply filters from OTHER columns (not the target column)
      otherFilters.forEach(filter => {
        const filterValue = table.getColumn(filter.column)?.getFilterValue();
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          filteredRows = filteredRows.filter(row => {
            const cellValue = row.getValue(filter.column);
            return filterValue.includes(String(cellValue));
          });
        }
      });

      // Extract unique values for the target column from these filtered rows
      const uniqueValues = new Set<string>();
      filteredRows.forEach(row => {
        const value = row.getValue(targetColumn);
        if (value != null && value !== '') {
          uniqueValues.add(String(value));
        }
      });

      return Array.from(uniqueValues).sort();
    };
  }, [table, filters]);

  // ✅ STEP 3: HYBRID APPROACH - Combine both strategies
  // 
  // PROBLEM SOLVED: 
  // - Users can multi-select within same filter (e.g., "Auto" + "Pharma" sectors)
  // - Users still get iterative filtering between different filters
  // 
  // LOGIC:
  // - For filters WITH active selections: Show ALL original options (enables multi-select)
  // - For filters WITHOUT active selections: Show filtered options (enables iterative filtering)
  //
  // EXAMPLE: User selects "Auto" sector
  // - Sector dropdown: Shows all sectors (Auto, Pharma, Tech...) ← Multi-select enabled
  // - Industry dropdown: Shows only Auto industries ← Iterative filtering enabled
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    filters.forEach(filter => {
      // Get filtered options based on OTHER filters (not this one)
      const filteredOptionsForThisColumn = getFilteredOptionsForColumn(filter.column);
      
      // Get original options for this column
      const originalOptionsForThisColumn = originalOptions[filter.column] || [];
      
      // HYBRID LOGIC:
      // If this column has active selections, show ALL original options
      // (so user can add more selections like "Auto" + "Pharma")
      // If this column has no selections, show filtered options 
      // (so user sees only relevant options based on other filters)
      const currentFilterValue = table.getColumn(filter.column)?.getFilterValue();
      const hasActiveSelections = Array.isArray(currentFilterValue) && currentFilterValue.length > 0;
      
      if (hasActiveSelections) {
        // Show all original options to allow multi-select within this filter
        options[filter.column] = originalOptionsForThisColumn;
      } else {
        // Show filtered options to enable iterative filtering from other filters
        options[filter.column] = filteredOptionsForThisColumn.length > 0 
          ? filteredOptionsForThisColumn 
          : originalOptionsForThisColumn;
      }
    });
    
    return options;
  }, [originalOptions, getFilteredOptionsForColumn, filters, table]);

  // ✅ STEP 4: Handle filter changes
  // When a filter changes, TanStack Table automatically recalculates filtered data
  // Our hybrid filterOptions will then update to reflect the new state:
  // - The changed filter will now show ALL original options (since it has active selections)
  // - Other filters will update their options based on the new filtered data
  const handleFilterChange = (column: string, selectedValues: string[]) => {
    const columnObj = table.getColumn(column);
    if (columnObj) {
      // Set the filter value - TanStack Table handles the rest
      columnObj.setFilterValue(selectedValues.length > 0 ? selectedValues : undefined);
      // Note: filterOptions useMemo will automatically recalculate due to table state change
    }
  };

  // ✅ Get current filter values
  const getCurrentFilterValues = (column: string): string[] => {
    const filterValue = table.getColumn(column)?.getFilterValue();
    return Array.isArray(filterValue) ? filterValue : [];
  };

  return (
    <div className="space-y-4 flex flex-wrap">
      {/* ✅ Search Input */}
      {showSearch && (
        <div className="flex items-center flex-wrap pt-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(String(event.target.value))}
            className="max-w-sm w-180"
          />
        </div>
      )}

      {/* ✅ STEP 5: Render Column Filters with Hybrid Behavior
          User Experience:
          1. Initially: All filters show options from full dataset
          2. Select "Auto" in Sector: 
             - Sector dropdown still shows all sectors (Auto, Pharma, Tech, etc.) for multi-select
             - Industry dropdown updates to show only Auto industries
          3. Add "Pharma" to Sector selection:
             - Sector dropdown still shows all sectors
             - Industry dropdown now shows Auto + Pharma industries combined
          4. Clear Sector selections:
             - Sector dropdown shows all sectors again
             - Industry dropdown shows all industries again
      */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4 py-4">
          {filters.map((filter) => (
            <div key={filter.column} className=" pl-3 min-w-[180px]">
              <MultiSelectFilter
                title={filter.title}
                options={filterOptions[filter.column] || []}
                selectedValues={getCurrentFilterValues(filter.column)}
                onSelectionChange={(values) => handleFilterChange(filter.column, values)}
                placeholder={filter.placeholder || `Filter ${filter.title}...`}
              />
            </div>
          ))}
        </div>
      )}

      <div className={`w-full overflow-auto rounded-md border ${className}`}>
        <table className="min-w-full">
          {/* ✅ Table Header */}
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  // Hide columns marked as filter-only
                  const isFilterOnly = header.column.columnDef.meta?.isFilterOnly;
                  if (isFilterOnly) return null;
                  
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }} // ✅ Add this line
                      className={`px-1 py-2 font-semibold ${
                        header.column.getCanSort() 
                          ? 'cursor-pointer select-none hover:bg-muted/50 transition-colors' 
                          : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {/* ✅ Header content with sort indicators */}
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </span>
                        {/* ✅ Sort indicators */}
                        {header.column.getCanSort() && (
                          <div className="h-3">
                            {header.column.getIsSorted() === 'asc' && (
                              <ChevronUp className="h-3 w-3 text-primary" />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ChevronDown className="h-3 w-3 text-primary" />
                            )}
                            {!header.column.getIsSorted() && (
                              <div className="h-3 w-3 opacity-50">
                                <ChevronUp className="h-2 w-2" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ✅ Table Body */}
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    // Hide cells for filter-only columns
                    const isFilterOnly = cell.column.columnDef.meta?.isFilterOnly;
                    if (isFilterOnly) return null;
                    
                    return (
                      <td 
                        key={cell.id} 
                        style={{ width: cell.column.getSize() }} // ✅ Add this line
                        className="px-2 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              // ✅ Shown if there's no data (after filtering, for example)
              <tr>
                <td
                  colSpan={table.getAllColumns().filter(col => !col.columnDef.meta?.isFilterOnly).length}
                  className="px-4 py-8 text-muted-foreground"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              ⟪
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              ⟨
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              ⟩
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              ⟫
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
