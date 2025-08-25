import ServerTableFilters, { FilterConfig, SortOption } from "./ServerTableFilters";
import ServerTable, { ServerTableColumn, PaginationInfo } from "./ServerTable";
import { AggregateCard } from "@/components/ui/aggregate-card";
import { CountPieChart } from "@/components/charts/CountPieCharts";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";

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
  
  // ✨ NEW: AGGREGATIONS (Optional - enables aggregation cards and pie charts)
  aggregations?: {
    enabled: boolean;
    sqlFunction: string;           // Name of SQL function to call (e.g., 'get_crm_aggregations')
    cards?: Array<{
      key: string;                 // Key in aggregation result (e.g., 'totalLeads')
      title: string;               // Display title (e.g., 'Total Leads')
      formatter?: (value: number) => string; // Optional formatter (e.g., value => `${value} leads`)
      className?: string;          // Optional CSS class (e.g., 'border-orange-200')
    }>;
    pieCharts?: Array<{
      key: string;                 // Key in aggregation result (e.g., 'importanceDistribution')
      title: string;               // Chart title (e.g., 'Lead Priority')
      description?: string;        // Optional chart description
      maxItems?: number;           // Limit number of items shown
      countLabel?: string;         // Label for count (e.g., 'leads', 'deals')
    }>;
  };
}

// Props for the page component
export interface ServerTablePageProps<T = any> {
  config: ServerTablePageConfig<T>;
  data: T[];
  pagination: PaginationInfo;
  className?: string;
  aggregations?: any; // ✨ NEW: Aggregation data from SQL function
}

export default function ServerTablePage<T = any>({
  config,
  data,
  pagination,
  className = "",
  aggregations
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

      {/* ✨ NEW: Aggregation Cards - Only if enabled and data available */}
      {config.aggregations?.enabled && aggregations && config.aggregations.cards && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {config.aggregations.cards.map(card => (
            <AggregateCard
              key={card.key}
              title={card.title}
              value={aggregations[card.key] || 0}
              formatter={card.formatter}
              className={card.className}
            />
          ))}
        </div>
      )}

      {/* ✨ NEW: Pie Charts - Only if enabled and data available */}
      {config.aggregations?.enabled && aggregations && config.aggregations.pieCharts && (
        <ToggleVisibility toggleText="Show Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {config.aggregations.pieCharts.map(chart => {
              const chartData = aggregations[chart.key];
              if (!chartData || !Array.isArray(chartData)) return null;
              
              return (
                <CountPieChart
                  key={chart.key}
                  data={chartData} // Pass the distribution data directly
                  title={chart.title}
                  description={chart.description}
                  maxItems={chart.maxItems}
                  countLabel={chart.countLabel || "items"}
                />
              );
            })}
          </div>
        </ToggleVisibility>
      )}

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