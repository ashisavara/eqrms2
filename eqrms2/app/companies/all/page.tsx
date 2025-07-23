import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { Company } from "@/types/company-detail";
import InternalCompaniesTable from "./InternalCompaniesTable";
import InternalCompaniesFilters from "./InternalCompaniesFilters";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Parse URL parameters into typed objects
function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  // Parse filters
  const filters: Record<string, any> = {};
  const filterKeys = ['sector_name', 'industry', 'coverage'];
  
  filterKeys.forEach(key => {
    const value = params[key];
    if (value) {
      // Keep as strings for all company filters
      filters[key] = Array.isArray(value) ? value : [value];
    }
  });

  // Parse pagination
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 50;

  // Parse sorting
  const sortColumn = (params.sort as string) || 'ime_name';
  const sortOrder = (params.order as string) || 'asc';
  const secondarySortColumn = (params.secondarySort as string) || 'cmp';
  const secondarySortOrder = (params.secondaryOrder as string) || 'desc';

  // Parse search
  const search = (params.search as string) || '';

  return {
    filters,
    pagination: { page, pageSize },
    sorting: [
      { column: sortColumn, direction: sortOrder as 'asc' | 'desc' },
      { column: secondarySortColumn, direction: secondarySortOrder as 'asc' | 'desc' }
    ],
    search
  };
}

export default async function InternalCompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // Define filter configuration for companies
  const companiesFilterConfig = {
    sector_name: { table: 'eq_rms_company_view', valueCol: 'sector_name', labelCol: 'sector_name' },
    industry: { table: 'eq_rms_company_view', valueCol: 'industry', labelCol: 'industry' },
    coverage: { table: 'eq_rms_company_view', valueCol: 'coverage', labelCol: 'coverage' }
  };

  // Fetch filter options and companies data in parallel
  const [
    filterOptions,
    companiesResult
  ] = await Promise.all([
    getMultipleFilterOptions([
      'sector_name',
      'industry',
      'coverage'
    ], companiesFilterConfig),
    serverSideQuery<Company>({
      table: "eq_rms_company_view",
      columns: "company_id,ime_name,sector_name,industry,coverage,cmp,gr_t3,gr_t4,1m_return,3m_return,1yr_return,3yrs_return,5yrs_return",
      filters,
      search,
      searchColumns: ['ime_name', 'sector_name', 'industry'],
      pagination,
      sorting,
      staticFilters: [
        (query) => query.in('coverage', ['Coverage', 'DV', 'BV'])
      ]
    })
  ]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Companies</h1>
          <p className="text-muted-foreground">
            Showing {companiesResult.data.length} of {companiesResult.totalCount} companies
          </p>
        </div>
      </div>

      <InternalCompaniesFilters 
        filterOptions={filterOptions as {
          sector_name: any[];
          industry: any[];
          coverage: any[];
        }}
        currentFilters={filters}
        currentSearch={search}
        currentSort={{
          primary: { column: sorting[0]?.column || 'ime_name', direction: sorting[0]?.direction || 'asc' },
          secondary: { column: sorting[1]?.column || 'cmp', direction: sorting[1]?.direction || 'desc' }
        }}
      />

      <InternalCompaniesTable 
        data={companiesResult.data}
        pagination={{
          currentPage: companiesResult.currentPage,
          totalPages: companiesResult.totalPages,
          hasNextPage: companiesResult.hasNextPage,
          hasPreviousPage: companiesResult.hasPreviousPage,
          pageSize: companiesResult.pageSize,
          totalCount: companiesResult.totalCount
        }}
      />
    </div>
  );
} 