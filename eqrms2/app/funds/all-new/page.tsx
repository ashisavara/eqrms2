import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import { ServerTablePage, ServerTablePageConfig } from "@/components/server-table";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import Link from "next/link";

// ================================================================
// 🎯 SERVER-SIDE TABLE TEMPLATE
// ================================================================
// This is a complete example of building a large table (>1000 records)
// with server-side filtering, sorting, and pagination using our new system.
// 
// Copy this file and modify the configuration objects below to create
// new large tables in ~20 lines of custom code!
// ================================================================

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * 📋 STEP 1: URL Parameter Parser
 * 
 * This function converts URL search parameters into typed objects
 * that our serverSideQuery function expects.
 * 
 * Copy this function for any new table, just update:
 * - filterKeys array with your table's filter column names
 * - defaultSort column name
 */
function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  // 🔍 FILTERS: Define which URL parameters should be treated as filters
  const filterKeys = [
    'fund_rating',         // Numeric filter (converted to numbers)
    'amc_name',           // String filter
    'structure_name',     // String filter
    'category_name',      // String filter
    'estate_duty_exposure', // String filter (Y/N values)
    'us_investors'        // String filter (Y/N values)
  ];
  
  // Parse filters from URL parameters
  const filters: Record<string, any> = {};
  filterKeys.forEach(key => {
    const value = params[key];
    if (value) {
      if (key.includes('rating') || key.includes('_id')) {
        // Convert numeric fields to numbers
        filters[key] = Array.isArray(value) ? value.map(Number) : [Number(value)];
      } else {
        // Keep string fields as strings
        filters[key] = Array.isArray(value) ? value : [value];
      }
    }
  });

  // 📄 PAGINATION: Parse page and pageSize from URL
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 50;

  // 🔄 SORTING: Parse sort column and direction from URL
  const sortColumn = (params.sort as string) || 'fund_rating';  // 📝 Change default sort column here
  const sortOrder = (params.order as string) || 'desc';         // 📝 Change default sort direction here

  // 🔍 SEARCH: Parse global search query from URL
  const search = (params.search as string) || '';

  return {
    filters,
    pagination: { page, pageSize },
    sorting: [{ column: sortColumn, direction: sortOrder as 'asc' | 'desc' }],
    search
  };
}

/**
 * 🏠 MAIN PAGE COMPONENT
 * 
 * This is where the magic happens! The entire page is just:
 * 1. Parse URL parameters
 * 2. Fetch data and filter options  
 * 3. Configure the table
 * 4. Render ServerTablePage
 */
export default async function AllFundsPage({ searchParams }: PageProps) {
  // 📥 STEP 2: Parse incoming URL parameters
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // 🔧 STEP 3: Configure filter data sources
  // This tells the system where to fetch filter options from
  const filterConfig = {
    // Special handling: fund_rating uses hardcoded 1-5 values (handled automatically)
    fund_rating: { table: '', valueCol: '', labelCol: '' },
    
    // Standard filters: fetch options from dedicated master tables
    amc_name: { 
      table: 'rms_amc', 
      valueCol: 'amc_name', 
      labelCol: 'amc_name' 
    },
    structure_name: { 
      table: 'rms_structure', 
      valueCol: 'structure_name', 
      labelCol: 'structure_name' 
    },
    category_name: { 
      table: 'rms_category', 
      valueCol: 'cat_name',      // 📝 Note: using cat_name not category_name
      labelCol: 'cat_name' 
    },
    
    // Y/N filters: fetch unique values from the main view itself
    estate_duty_exposure: { 
      table: 'view_rms_funds_screener', 
      valueCol: 'estate_duty_exposure', 
      labelCol: 'estate_duty_exposure' 
    },
    us_investors: { 
      table: 'view_rms_funds_screener', 
      valueCol: 'us_investors', 
      labelCol: 'us_investors' 
    }
  };

  // 📊 STEP 4: Fetch data and filter options in parallel (for performance)
  const [filterOptions, tableData] = await Promise.all([
    // Fetch all filter dropdown options
    getMultipleFilterOptions([
      'fund_rating',
      'amc_name',
      'structure_name', 
      'category_name',
      'estate_duty_exposure',
      'us_investors'
    ], filterConfig),
    
    // Fetch the actual table data with server-side filtering/sorting/pagination
    serverSideQuery<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription,estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters,
      search,
      searchColumns: ['fund_name', 'amc_name', 'category_name', 'structure_name'], // 📝 Which columns to search in
      pagination,
      sorting,
      staticFilters: [] // 📝 Add any always-applied filters here (e.g., status='active')
    })
  ]);

  // 🎨 STEP 5: Configure the complete table page
  // This single configuration object defines the entire table behavior!
  const config: ServerTablePageConfig<RmsFundsScreener> = {
    // 🏠 PAGE IDENTITY
    basePath: '/funds/all-new',                    // 📝 Update this for your new table
    title: 'All Funds (New Implementation)',       // 📝 Page title
    description: 'Server-side filtered funds table with 3000+ records', // 📝 Optional subtitle
    
    // 🔧 TABLE STATE CONFIGURATION
    tableStateConfig: {
      filterKeys: ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'], // Must match parseSearchParams
      defaultSort: { column: 'fund_rating', direction: 'desc' }, // 📝 Default sorting
      defaultPageSize: 50 // 📝 Default page size
    },
    
    // 🎛️ FILTER CONFIGURATION
    // Each filter becomes a multi-select dropdown in the UI
    filterConfigs: [
      {
        key: 'fund_rating',           // Must match filterKeys and column name
        title: 'Fund Rating',        // Display label
        placeholder: 'Rating...',    // Dropdown placeholder
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
    
    // 🔄 SORT OPTIONS
    // These appear in the sort dropdown
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
    
    // 🔍 SEARCH CONFIGURATION
    searchPlaceholder: 'Search funds, AMCs, categories...', // 📝 Search input placeholder
    
    // 📊 TABLE COLUMN CONFIGURATION
    // This is where you define what columns to show and how to render them
    columns: [
      // 🔗 Link Column Example
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
      
      // 🌟 Custom Component Columns
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
      
      // 📝 Simple Text Columns
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
      
      // 💰 Conditional Rendering Columns (show '-' for null values)
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
    
    // 📄 MISC CONFIGURATION
    emptyMessage: 'No funds found with the current filters.' // 📝 Message when no results
  };

  // 🎉 STEP 6: Render the complete table page!
  // That's it! Everything else is handled automatically:
  // - URL state management
  // - Filter UI rendering
  // - Table rendering with pagination
  // - Responsive design
  // - Error handling
  return (
    <ServerTablePage
      config={config}
      data={tableData.data}
      pagination={{
        currentPage: tableData.currentPage,
        totalPages: tableData.totalPages,
        hasNextPage: tableData.hasNextPage,
        hasPreviousPage: tableData.hasPreviousPage,
        pageSize: tableData.pageSize,
        totalCount: tableData.totalCount
      }}
    />
  );
}

// ================================================================
// 🎓 TEMPLATE USAGE GUIDE
// ================================================================
// 
// To create a new large table:
// 
// 1. 📁 Copy this entire file to your new route (e.g., companies/all/page.tsx)
// 
// 2. 🔧 Update these key parts:
//    - Import your data type instead of RmsFundsScreener
//    - Change filterKeys in parseSearchParams()  
//    - Update filterConfig object with your table/column names
//    - Modify serverSideQuery table, columns, searchColumns
//    - Update config.basePath to your route
//    - Configure your specific columns in config.columns
// 
// 3. 🎯 Test your new table:
//    - Filters should work immediately  
//    - Pagination should work automatically
//    - Sorting should work on any column you defined
//    - URLs should be shareable and bookmarkable
// 
// 4. 🚀 Deploy and enjoy your new server-side table!
// 
// ⏱️ Total time to create a new table: ~15 minutes
// ================================================================ 