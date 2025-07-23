"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import { useServerTableState } from "@/lib/hooks/useServerTableState";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalCount: number;
}

interface InternalFundsTableProps {
  data: RmsFundsScreener[];
  pagination: PaginationInfo;
}

export default function InternalFundsTable({ data, pagination }: InternalFundsTableProps) {
  const basePath = '/funds/all';
  
  // Use the server table state hook for pagination
  const tableState = useServerTableState({
    filterKeys: ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'],
    defaultSort: { column: 'fund_rating', direction: 'desc' },
    defaultPageSize: 50
  });

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
      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-xs text-center">
          <thead className="bg-muted">
            <tr className="border-b">
              <th className="px-1 py-2 font-semibold text-left">Fund Name</th>
              <th className="px-1 py-2 font-semibold">Fund</th>
              <th className="px-1 py-2 font-semibold">Perf</th>
              <th className="px-1 py-2 font-semibold">AMC</th>
              <th className="px-1 py-2 font-semibold">Structure</th>
              <th className="px-1 py-2 font-semibold">Category</th>
              <th className="px-1 py-2 font-semibold">Estate Duty</th>
              <th className="px-1 py-2 font-semibold">US Investors</th>
              <th className="px-1 py-2 font-semibold">1 Year</th>
              <th className="px-1 py-2 font-semibold">3 Year</th>
              <th className="px-1 py-2 font-semibold">5 Year</th>
              <th className="px-1 py-2 font-semibold">Since Inception</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((fund) => (
                <tr key={fund.fund_id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-1 py-1 text-left">
                    <Link 
                      href={`/funds/${fund.slug}`} 
                      className="text-blue-600 font-bold hover:underline"
                    >
                      {fund.fund_name}
                    </Link>
                  </td>
                  <td className="px-1 py-1">
                    <RatingDisplay rating={fund.fund_rating} />
                  </td>
                  <td className="px-1 py-1">
                    <RatingDisplay rating={fund.fund_performance_rating} />
                  </td>
                  <td className="px-1 py-1">
                    <RatingDisplay rating={fund.amc_rating} />
                  </td>
                  <td className="px-1 py-1">{fund.structure_name}</td>
                  <td className="px-1 py-1">{fund.cat_long_name}</td>
                  <td className="px-1 py-1">{fund.estate_duty_exposure}</td>
                  <td className="px-1 py-1">{fund.us_investors}</td>
                  <td className="px-1 py-1">
                    {fund.one_yr !== null ? <ComGrowthNumberRating rating={fund.one_yr} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {fund.three_yr !== null ? <ComGrowthNumberRating rating={fund.three_yr} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {fund.five_yr !== null ? <ComGrowthNumberRating rating={fund.five_yr} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {fund.since_inception !== null ? <ComGrowthNumberRating rating={fund.since_inception} /> : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-muted-foreground text-center">
                  No funds found with the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
                {[25, 50, 100, 200].map((pageSize) => (
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
    </div>
  );
} 