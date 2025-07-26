import ServerTableFilters, { FilterConfig, SortOption } from "./ServerTableFilters";
import ServerTable, { ServerTableColumn, PaginationInfo } from "./ServerTable";

// Complete page configuration interface
export interface ServerTablePageConfig<T = any> {
  // Table identification
  basePath: string;
  
  // Table state configuration
  tableStateConfig: {
    filterKeys: string[];
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
    defaultPageSize?: number;
  };
  
  // Filter configuration
  filterConfigs: FilterConfig[];
  sortOptions: SortOption[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  showSort?: boolean;
  
  // Table configuration
  columns: ServerTableColumn<T>[];
  emptyMessage?: string;
  tableClassName?: string;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  
  // 🔄 ITERATIVE FILTERING (Optional - enables dynamic filter options)
  sourceTable?: string;           // Main data table/view for iterative filtering
  filterConfig?: Record<string, any>; // Filter configuration mapping (same as in page.tsx)
  searchColumns?: string[];       // Columns to include in search filtering
}

// Props for the page component
export interface ServerTablePageProps<T = any> {
  config: ServerTablePageConfig<T>;
  data: T[];
  pagination: PaginationInfo;
  className?: string;
}

export default function ServerTablePage<T = any>({
  config,
  data,
  pagination,
  className = ""
}: ServerTablePageProps<T>) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <ServerTableFilters
        basePath={config.basePath}
        filterConfigs={config.filterConfigs}
        sortOptions={config.sortOptions}
        tableStateConfig={config.tableStateConfig}
        searchPlaceholder={config.searchPlaceholder}
        showSearch={config.showSearch}
        showSort={config.showSort}
        sourceTable={config.sourceTable}
        filterConfig={config.filterConfig}
        searchColumns={config.searchColumns}
      />

      {/* Table */}
      <ServerTable
        data={data}
        columns={config.columns}
        pagination={pagination}
        basePath={config.basePath}
        tableStateConfig={config.tableStateConfig}
        emptyMessage={config.emptyMessage}
        className={config.tableClassName}
        showPagination={config.showPagination}
        pageSizeOptions={config.pageSizeOptions}
      />
    </div>
  );
} 