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
  // ✅ Generate dynamic filter options from current filtered data
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    if (filters.length > 0) {
      const currentRows = table.getFilteredRowModel().rows;
      
      filters.forEach(filter => {
        const uniqueValues = new Set<string>();
        currentRows.forEach(row => {
          const value = row.getValue(filter.column);
          if (value != null && value !== '') {
            uniqueValues.add(String(value));
          }
        });
        options[filter.column] = Array.from(uniqueValues).sort();
      });
    }
    
    return options;
  }, [table.getFilteredRowModel().rows, filters]);

  // ✅ Handle filter changes
  const handleFilterChange = (column: string, selectedValues: string[]) => {
    const columnObj = table.getColumn(column);
    if (columnObj) {
      columnObj.setFilterValue(selectedValues.length > 0 ? selectedValues : undefined);
    }
  };

  // ✅ Get current filter values
  const getCurrentFilterValues = (column: string): string[] => {
    const filterValue = table.getColumn(column)?.getFilterValue();
    return Array.isArray(filterValue) ? filterValue : [];
  };

  return (
    <div className="space-y-4">
      {/* ✅ Search Input */}
      {showSearch && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
      )}

      {/* ✅ Column Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4 py-4">
          {filters.map((filter) => (
            <div key={filter.column} className="min-w-[200px]">
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
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2 font-semibold"
                  >
                    {/* ✅ flexRender allows dynamic JSX/strings/functions */}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
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
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // ✅ Shown if there's no data (after filtering, for example)
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
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
