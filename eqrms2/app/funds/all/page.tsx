import { serverSideQuery, getFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import InternalFundsTable from "./InternalFundsTable";
import InternalFundsFilters from "./InternalFundsFilters";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Parse URL parameters into typed objects
function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  // Parse filters
  const filters: Record<string, any> = {};
  const filterKeys = ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'];
  
  filterKeys.forEach(key => {
    const value = params[key];
    if (value) {
      if (key === 'fund_rating') {
        // Convert to numbers for rating
        filters[key] = Array.isArray(value) ? value.map(Number) : [Number(value)];
      } else {
        // Keep as strings for other filters
        filters[key] = Array.isArray(value) ? value : [value];
      }
    }
  });

  // Parse pagination
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 50;

  // Parse sorting
  const sortColumn = (params.sort as string) || 'fund_rating';
  const sortOrder = (params.order as string) || 'desc';
  const secondarySortColumn = (params.secondarySort as string) || 'five_yr';
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

export default async function InternalFundsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // Fetch filter options and funds data in parallel
  const [
    fundRatingOptions,
    amcNameOptions,
    structureNameOptions,
    categoryNameOptions,
    estateDutyOptions,
    usInvestorsOptions,
    fundsResult
  ] = await Promise.all([
    getFilterOptions('fund_rating'),
    getFilterOptions('amc_name'),
    getFilterOptions('structure_name'),
    getFilterOptions('category_name'),
    getFilterOptions('estate_duty_exposure'),
    getFilterOptions('us_investors'),
    serverSideQuery<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription,estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters,
      search,
      searchColumns: ['fund_name', 'amc_name', 'category_name', 'structure_name'],
      pagination,
      sorting,
      staticFilters: [] // No static filters - show all funds for internal users
    })
  ]);

  const filterOptions = {
    fund_rating: fundRatingOptions,
    amc_name: amcNameOptions,
    structure_name: structureNameOptions,
    category_name: categoryNameOptions,
    estate_duty_exposure: estateDutyOptions,
    us_investors: usInvestorsOptions
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Funds</h1>
          <p className="text-muted-foreground">
            Showing {fundsResult.data.length} of {fundsResult.totalCount} funds
          </p>
        </div>
      </div>

      <InternalFundsFilters 
        filterOptions={filterOptions}
        currentFilters={filters}
        currentSearch={search}
        currentSort={{
          primary: { column: sorting[0]?.column || 'fund_rating', direction: sorting[0]?.direction || 'desc' },
          secondary: { column: sorting[1]?.column || 'five_yr', direction: sorting[1]?.direction || 'desc' }
        }}
      />

      <InternalFundsTable 
        data={fundsResult.data}
        pagination={{
          currentPage: fundsResult.currentPage,
          totalPages: fundsResult.totalPages,
          hasNextPage: fundsResult.hasNextPage,
          hasPreviousPage: fundsResult.hasPreviousPage,
          pageSize: fundsResult.pageSize,
          totalCount: fundsResult.totalCount
        }}
      />
    </div>
  );
} 