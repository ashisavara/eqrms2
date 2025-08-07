import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { LeadsTagging } from "@/types/lead-detail";
import LeadsTable from "./TableCrmAll";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  // 🔍 FILTERS: Define which URL parameters should be treated as filters
  const filterKeys = [
    'importance',
    'lead_progression',
    'lead_source',
    'lead_type',
    'wealth_level',
    'rm_name',
    ];
  
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
  const sortColumn = (params.sort as string) || 'days_followup ';  // Change default sort column here
  const sortOrder = (params.order as string) || 'asc '; // SEARCH: Parse global search query from URL
  const search = (params.search as string) || '';

  return {
    filters,
    pagination: { page, pageSize },
    sorting: [{ column: sortColumn, direction: sortOrder as 'asc' | 'desc' }],
    search
  };
}



export default async function AllCrmPage({ searchParams }: PageProps) {
  //  STEP 2: Parse incoming URL parameters
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  // STEP 3: Configure filter data sources
  // This tells the system where to fetch filter options from
  // IMP NUMBER COLUMNS MAY NEED SEPERATE TREATMENT .. SEE FUND_RATING IN FUNDS ALL
  const filterConfig = {
        importance: { table: 'view_leads_tagcrm', valueCol: 'importance', labelCol: 'importance' },
        lead_progression: { table: 'view_leads_tagcrm', valueCol: 'lead_progression', labelCol: 'lead_progression' },
        lead_source: { table: 'view_leads_tagcrm', valueCol: 'lead_source', labelCol: 'lead_source' },
        lead_type: { table: 'view_leads_tagcrm', valueCol: 'lead_type', labelCol: 'lead_type' },
        wealth_level: { table: 'view_leads_tagcrm', valueCol: 'wealth_level', labelCol: 'wealth_level' },
        rm_name: { table: 'view_leads_tagcrm', valueCol: 'rm_name', labelCol: 'rm_name' },
    };

    // STEP 4: Fetch data and filter options in parallel (for performance)
  const [filterOptions, tableData] = await Promise.all([
    // Fetch all filter dropdown options
    getMultipleFilterOptions([
        'importance',
        'lead_progression',
        'lead_source',
        'lead_type',
        'wealth_level',
        'rm_name',
    ], filterConfig),
    // Fetch the actual table data with server-side filtering/sorting/pagination
    serverSideQuery<LeadsTagging>({
      table: "view_leads_tagcrm",
      columns: "lead_name,days_followup,days_since_last_contact,importance,wealth_level,lead_progression,lead_summary,lead_source,lead_type,rm_name",
      filters,
      search,
        searchColumns: ['lead_name', 'lead_summary'], // Which columns to search in
        pagination,
        sorting,
        staticFilters: [] // Add any always-applied filters here (e.g., status='active')
        })
    ]);

    return (
    <LeadsTable     
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
        importance: any[]; 
        lead_progression: any[]; 
        lead_source: any[]; 
        lead_type: any[]; 
        wealth_level: any[]; 
        rm_name: any[]; }}
      filterConfig={filterConfig}
      searchColumns={[
        'lead_name',
        'lead_summary',
        ]}
    />
  );
}