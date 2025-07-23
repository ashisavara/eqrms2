import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import ServerTablePage, { ServerTablePageConfig } from "@/components/server-table/ServerTablePage";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import Link from "next/link";

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

  // Parse search
  const search = (params.search as string) || '';

  return {
    filters,
    pagination: { page, pageSize },
    sorting: [
      { column: sortColumn, direction: sortOrder as 'asc' | 'desc' }
    ],
    search
  };
}

export default async function InternalFundsPageRefactored({ searchParams }: PageProps) {
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // Define filter configuration for funds
  const fundsFilterConfig = {
    fund_rating: { table: '', valueCol: '', labelCol: '' }, // Handled specially
    amc_name: { table: 'rms_amc', valueCol: 'amc_name', labelCol: 'amc_name' },
    structure_name: { table: 'rms_structure', valueCol: 'structure_name', labelCol: 'structure_name' },
    category_name: { table: 'rms_category', valueCol: 'cat_name', labelCol: 'cat_name' },
    estate_duty_exposure: { table: 'view_rms_funds_screener', valueCol: 'estate_duty_exposure', labelCol: 'estate_duty_exposure' },
    us_investors: { table: 'view_rms_funds_screener', valueCol: 'us_investors', labelCol: 'us_investors' }
  };

  // Fetch filter options and funds data in parallel
  const [filterOptions, fundsResult] = await Promise.all([
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
      staticFilters: []
    })
  ]);

  // Configure the server table page
  const config: ServerTablePageConfig<RmsFundsScreener> = {
    basePath: '/funds/all',
    title: 'All Funds',
    description: 'Internal funds database with server-side filtering and pagination',
    
    tableStateConfig: {
      filterKeys: ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'],
      defaultSort: { column: 'fund_rating', direction: 'desc' },
      defaultPageSize: 50
    },
    
    filterConfigs: [
      {
        key: 'fund_rating',
        title: 'Fund Rating',
        placeholder: 'Rating...',
        options: filterOptions.fund_rating
      },
      {
        key: 'amc_name',
        title: 'AMC',
        placeholder: 'AMC...',
        options: filterOptions.amc_name
      },
      {
        key: 'structure_name',
        title: 'Structure',
        placeholder: 'Structure...',
        options: filterOptions.structure_name
      },
      {
        key: 'category_name',
        title: 'Category',
        placeholder: 'Category...',
        options: filterOptions.category_name
      },
      {
        key: 'estate_duty_exposure',
        title: 'Estate Duty',
        placeholder: 'Estate Duty...',
        options: filterOptions.estate_duty_exposure
      },
      {
        key: 'us_investors',
        title: 'US Investors',
        placeholder: 'US Investors...',
        options: filterOptions.us_investors
      }
    ],
    
    sortOptions: [
      { value: 'fund_name', label: 'Fund Name' },
      { value: 'fund_rating', label: 'Fund Rating' },
      { value: 'fund_performance_rating', label: 'Performance Rating' },
      { value: 'amc_rating', label: 'AMC Rating' },
      { value: 'one_yr', label: '1 Year Return' },
      { value: 'three_yr', label: '3 Year Return' },
      { value: 'five_yr', label: '5 Year Return' },
      { value: 'since_inception', label: 'Since Inception' }
    ],
    
    searchPlaceholder: 'Search funds, AMCs, categories...',
    
    columns: [
      {
        key: 'fund_name',
        header: 'Fund Name',
        align: 'left',
        render: (value, row) => (
          <Link 
            href={`/funds/${row.slug}`} 
            className="text-blue-600 font-bold hover:underline"
          >
            {value}
          </Link>
        )
      },
      {
        key: 'fund_rating',
        header: 'Fund',
        render: (value) => <RatingDisplay rating={value} />
      },
      {
        key: 'fund_performance_rating',
        header: 'Perf',
        render: (value) => <RatingDisplay rating={value} />
      },
      {
        key: 'amc_rating',
        header: 'AMC',
        render: (value) => <RatingDisplay rating={value} />
      },
      {
        key: 'structure_name',
        header: 'Structure'
      },
      {
        key: 'cat_long_name',
        header: 'Category'
      },
      {
        key: 'estate_duty_exposure',
        header: 'Estate Duty'
      },
      {
        key: 'us_investors',
        header: 'US Investors'
      },
      {
        key: 'one_yr',
        header: '1 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'three_yr',
        header: '3 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'five_yr',
        header: '5 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'since_inception',
        header: 'Since Inception',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      }
    ],
    
    emptyMessage: 'No funds found with the current filters.'
  };

  return (
    <ServerTablePage
      config={config}
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
  );
} 