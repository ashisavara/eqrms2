"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerTableState } from "@/lib/hooks/useServerTableState";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// Column configuration interface
export interface ServerTableColumn<T = any> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

// Pagination info interface
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalCount: number;
}

// Main component props
export interface ServerTableProps<T = any> {
  data: T[];
  columns: ServerTableColumn<T>[];
  pagination: PaginationInfo;
  basePath: string;
  tableStateConfig: {
    filterKeys: string[];
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
    defaultPageSize?: number;
  };
  emptyMessage?: string;
  className?: string;
  showPagination?: boolean;
  pageSizeOptions?: number[];
}

export default function ServerTable<T = any>({
  data,
  columns,
  pagination,
  basePath,
  tableStateConfig,
  emptyMessage = "No results found.",
  className = "",
  showPagination = true,
  pageSizeOptions = [25, 50, 100, 200]
}: ServerTableProps<T>) {
  // Use the server table state hook for pagination
  const tableState = useServerTableState(tableStateConfig);

  // Handle page size change
  const handlePageSizeChange = (newPageSize: string) => {
    tableState.updatePagination(1, basePath, parseInt(newPageSize));
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    tableState.updatePagination(page, basePath);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className={`overflow-auto rounded-md border ${className}`}>
        <table className="min-w-full text-xs text-center">
          <thead className="bg-muted">
            <tr className="border-b">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-1 py-2 font-semibold ${
                    column.align === 'left' ? 'text-left' : 
                    column.align === 'right' ? 'text-right' : 
                    'text-center'
                  } ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  {columns.map((column) => {
                    const value = (row as any)[column.key];
                    return (
                      <td 
                        key={column.key}
                        className={`px-1 py-1 ${
                          column.align === 'left' ? 'text-left' : 
                          column.align === 'right' ? 'text-right' : 
                          'text-center'
                        } ${column.className || ''}`}
                      >
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-muted-foreground text-center">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          {/* Left side - Page size selector and info */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of{" "}
              {pagination.totalCount} results
            </div>
          </div>

          {/* Right side - Navigation buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToPage(1)}
              disabled={!pagination.hasPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToPage(pagination.totalPages)}
              disabled={!pagination.hasNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 