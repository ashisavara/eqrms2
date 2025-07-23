import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
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

  // Define filter configuration for funds
  const fundsFilterConfig = {
    // fund_rating is handled specially in the helper function with hardcoded values (1-5)
    fund_rating: { table: '', valueCol: '', labelCol: '' }, // Not used - handled specially
    amc_name: { table: 'rms_amc', valueCol: 'amc_name', labelCol: 'amc_name' },
    structure_name: { table: 'rms_structure', valueCol: 'structure_name', labelCol: 'structure_name' },
    category_name: { table: 'rms_category', valueCol: 'cat_name', labelCol: 'cat_name' },
    // For Y/N fields, we'll get distinct values from the view itself
    estate_duty_exposure: { table: 'view_rms_funds_screener', valueCol: 'estate_duty_exposure', labelCol: 'estate_duty_exposure' },
    us_investors: { table: 'view_rms_funds_screener', valueCol: 'us_investors', labelCol: 'us_investors' }
  };

  // Fetch filter options and funds data in parallel
  const [
    filterOptions,
    fundsResult
  ] = await Promise.all([
    getMultipleFilterOptions([
      'fund_rating',
      'amc_name', 
      'structure_name',
      'category_name',
      'estate_duty_exposure',
      'us_investors'
    ], fundsFilterConfig),
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
        filterOptions={filterOptions as {
          fund_rating: any[];
          amc_name: any[];
          structure_name: any[];
          category_name: any[];
          estate_duty_exposure: any[];
          us_investors: any[];
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