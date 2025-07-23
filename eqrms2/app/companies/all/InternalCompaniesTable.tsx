"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/types/company-detail";
import Link from "next/link";
import { ComGrowthNumberRating } from "@/components/conditional-formatting";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalCount: number;
}

interface InternalCompaniesTableProps {
  data: Company[];
  pagination: PaginationInfo;
}

export default function InternalCompaniesTable({ data, pagination }: InternalCompaniesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build URL for pagination
  const buildPaginationUrl = (page: number, newPageSize?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    if (newPageSize) {
      params.set('pageSize', newPageSize.toString());
    }
    return `/companies/all?${params.toString()}`;
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: string) => {
    router.push(buildPaginationUrl(1, parseInt(newPageSize)));
  };

  // Handle page navigation
  const goToPage = (page: number) => {
    router.push(buildPaginationUrl(page));
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-xs text-center">
          <thead className="bg-muted">
            <tr className="border-b">
              <th className="px-1 py-2 font-semibold text-left">Company Name</th>
              <th className="px-1 py-2 font-semibold">Sector</th>
              <th className="px-1 py-2 font-semibold">Industry</th>
              <th className="px-1 py-2 font-semibold">Coverage</th>
              <th className="px-1 py-2 font-semibold">CMP</th>
              <th className="px-1 py-2 font-semibold">FY28 Gr</th>
              <th className="px-1 py-2 font-semibold">FY29 Gr</th>
              <th className="px-1 py-2 font-semibold">1M</th>
              <th className="px-1 py-2 font-semibold">3M</th>
              <th className="px-1 py-2 font-semibold">1Yr</th>
              <th className="px-1 py-2 font-semibold">3Yr</th>
              <th className="px-1 py-2 font-semibold">5Yr</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((company) => (
                <tr key={company.company_id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-1 py-1 text-left">
                    <Link 
                      href={`/companies/${company.company_id}`} 
                      className="text-blue-600 font-bold hover:underline"
                    >
                      {company.ime_name}
                    </Link>
                  </td>
                  <td className="px-1 py-1">{company.sector_name}</td>
                  <td className="px-1 py-1">{company.industry}</td>
                  <td className="px-1 py-1">{company.coverage}</td>
                  <td className="px-1 py-1">{company.cmp}</td>
                  <td className="px-1 py-1">
                    {company.gr_t3 !== null ? <ComGrowthNumberRating rating={Math.round(company.gr_t3)} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company.gr_t4 !== null ? <ComGrowthNumberRating rating={Math.round(company.gr_t4)} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company["1m_return"] !== null ? <ComGrowthNumberRating rating={Math.round(company["1m_return"])} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company["3m_return"] !== null ? <ComGrowthNumberRating rating={Math.round(company["3m_return"])} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company["1yr_return"] !== null ? <ComGrowthNumberRating rating={Math.round(company["1yr_return"])} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company["3yrs_return"] !== null ? <ComGrowthNumberRating rating={Math.round(company["3yrs_return"])} /> : '-'}
                  </td>
                  <td className="px-1 py-1">
                    {company["5yrs_return"] !== null ? <ComGrowthNumberRating rating={Math.round(company["5yrs_return"])} /> : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-muted-foreground text-center">
                  No companies found with the current filters.
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