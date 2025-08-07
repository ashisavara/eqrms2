import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import FundsTableClient from "./FundsTableClient";

// ================================================================
// 🎯 SERVER-SIDE TABLE TEMPLATE WITH ITERATIVE FILTERING
// ================================================================
// This is a complete example of building a large table (>1000 records)
// with server-side filtering, sorting, and pagination using our new system.
// 
// 🔄 NEW FEATURE: ITERATIVE FILTERING
// This template includes dynamic filter options that update based on applied
// filters. Users only see filter options that will return results.
// 
// Copy this directory and modify the configuration objects below to create
// new large tables with iterative filtering in ~20 minutes!
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
  const filterKeys = ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'];
  
  // Parse filters from URL parameters
  const filters: Record<string, any> = {};
  filterKeys.forEach(key => {
    const value = params[key];
    if (value) {
      if (key.includes('rating') || key.includes('_id')) {
        // Convert numeric fields to numbers .. can add other keys that need to be treated as numbers here
        filters[key] = Array.isArray(value) ? value.map(Number) : [Number(value)];
      } else {
        // Keep string fields as strings
        filters[key] = Array.isArray(value) ? value : [value];
      }
    }
  });

  // PAGINATION: Parse page and pageSize from URL
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 50;

  // SORTING: Parse sort column and direction from URL
  const sortColumn = (params.sort as string) || 'fund_rating';  // 📝 Change default sort column here
  const sortOrder = (params.order as string) || 'desc';         // 📝 Change default sort direction here

  // SEARCH: Parse global search query from URL
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
  //  STEP 2: Parse incoming URL parameters
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // STEP 3: Configure filter data sources
  // This tells the system where to fetch filter options from
  const filterConfig = {
    // Special handling: fund_rating uses hardcoded 1-5 values (handled automatically)
    fund_rating: { table: '', valueCol: '', labelCol: '' },
    
    // Standard filters: fetch options from dedicated master tables
    amc_name: { table: 'rms_amc', valueCol: 'amc_name', labelCol: 'amc_name' },
    structure_name: { table: 'rms_structure', valueCol: 'structure_name', labelCol: 'structure_name' },
    category_name: { table: 'rms_category', valueCol: 'cat_name', labelCol: 'cat_name' },
    
    // Y/N filters: fetch unique values from the main view itself
    estate_duty_exposure: { table: 'view_rms_funds_screener', valueCol: 'estate_duty_exposure', labelCol: 'estate_duty_exposure' },
    us_investors: { table: 'view_rms_funds_screener', valueCol: 'us_investors', labelCol: 'us_investors' }
  };

  // STEP 4: Fetch data and filter options in parallel (for performance)
  const [filterOptions, tableData] = await Promise.all([
    // Fetch all filter dropdown options
    getMultipleFilterOptions(['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'], filterConfig),
    
    // Fetch the actual table data with server-side filtering/sorting/pagination
    serverSideQuery<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription,estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters,
      search,
      searchColumns: ['fund_name', 'amc_name', 'category_name', 'structure_name'], // Which columns to search in
      pagination,
      sorting,
      staticFilters: [] // Add any always-applied filters here (e.g., status='active')
    })
  ]);

  // STEP 5: Render using client component!
  // The client component handles all the render functions and UI configuration
  // while the server component handles data fetching and URL parsing
  return (
    <FundsTableClient
      data={tableData.data}
      pagination={{
        currentPage: tableData.currentPage,
        totalPages: tableData.totalPages,
        hasNextPage: tableData.hasNextPage,
        hasPreviousPage: tableData.hasPreviousPage,
        pageSize: tableData.pageSize,
        totalCount: tableData.totalCount
      }}
      filterOptions={filterOptions as {
        fund_rating: any[];
        amc_name: any[];
        structure_name: any[];
        category_name: any[];
        estate_duty_exposure: any[];
        us_investors: any[];
      }}
      filterConfig={filterConfig}
      searchColumns={['fund_name', 'amc_name', 'category_name', 'structure_name']}
    />
  );
}

// ================================================================
// 🎓 TEMPLATE USAGE GUIDE
// ================================================================
// 
// To create a new large table:
// 
// 1. 📁 Copy this directory to your new route:
//    cp -r app/funds/all-new app/my-new-table
// 
// 2. 🔧 Update the SERVER COMPONENT (page.tsx):
//    - Import your data type instead of RmsFundsScreener
//    - Change filterKeys in parseSearchParams()  
//    - Update filterConfig object with your table/column names
//    - Modify serverSideQuery table, columns, searchColumns
//    - Update the import to your new client component
// 
// 3. 🎨 Update the CLIENT COMPONENT (YourTableClient.tsx):
//    - Update basePath to your route
//    - Configure your specific columns with render functions
//    - Update filter configurations and sort options
//    - Modify page title and description
// 
// 4. 🎯 Test your new table:
//    - Filters should work immediately  
//    - Pagination should work automatically
//    - Sorting should work on any column you defined
//    - URLs should be shareable and bookmarkable
// 
// 5. 🚀 Deploy and enjoy your new server-side table!
// 
// ⚠️ IMPORTANT: The split into server/client components solves the Next.js App Router 
//    limitation where render functions can't be passed from server to client components.
// 
// ⏱️ Total time to create a new table: ~20 minutes
// ================================================================ 