"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { createColumns } from "./columns-crm-deals";
import { Deals } from "@/types/deals";
import { LeadsTagging } from "@/types/lead-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { AggregateCard } from "@/components/ui/aggregate-card";
import { CountPieChart } from "@/components/charts/CountPieCharts";
import { PieChart } from "@/components/charts/InvestmentPieCharts";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { useMemo } from "react";

export default function TableDeals({ 
  data, 
  leadsData = []
}: { 
  data: Deals[];
  leadsData?: LeadsTagging[];
}) {

  const columns = createColumns(leadsData);
  
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'deal_name');
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    globalFilterFn: "includesString",
    autoResetPageIndex: false, // ✅ Prevent auto page reset
    filterFns: {
        // Custom filter function for multi-select
        arrIncludesSome: (row, columnId, value) => {
          const cellValue = row.getValue(columnId);
          return value.includes(cellValue);
        },
      },
      initialState: {
        pagination: {
          pageSize: 30, // Set default page size
          pageIndex: 0,
        },
        sorting: [
          { id: "deal_likelihood", desc: true },
          { id: "total_deal_aum", desc: true },
        ],
      },
    });

    const filters = [
      { column: "deal_likelihood", title: "Likelihood", placeholder: "Likelihood" },
      { column: "deal_stage", title: "Stage", placeholder: "Stage" },
      { column: "deal_segment", title: "Segment", placeholder: "Segment" },
      { column: "est_closure", title: "Est. Closure", placeholder: "Est. Closure" },
    ];

    // ✅ Generate filter options for top-level filters
    const originalOptions = useMemo(() => {
      const options: Record<string, string[]> = {};
      
      filters.forEach(filter => {
        const uniqueValues = new Set<string>();
        table.getCoreRowModel().rows.forEach(row => {
          const value = row.getValue(filter.column);
          if (value != null && value !== '') {
            uniqueValues.add(String(value));
          }
        });
        options[filter.column] = Array.from(uniqueValues).sort();
      });
      
      return options;
    }, [table.getCoreRowModel().rows, filters]);

    // ✅ Filter change handler
    const handleFilterChange = (column: string, selectedValues: string[]) => {
      const columnObj = table.getColumn(column);
      if (columnObj) {
        columnObj.setFilterValue(selectedValues.length > 0 ? selectedValues : undefined);
      }
    };

    // ✅ Get current filter values
    const getCurrentFilterValues = (column: string): string[] => {
      const filterValue = table.getColumn(column)?.getFilterValue();
      return Array.isArray(filterValue) ? filterValue : [];
    };

    // ✅ Calculate aggregations for cards (value and count-based for deals) - using filtered data
    const filteredRows = table.getFilteredRowModel().rows;
    const totalDeals = filteredRows.length;
    const totalAUM = filteredRows.reduce((sum, row) => sum + (Number(row.getValue('total_deal_aum')) || 0), 0);
    
    return (
      <div className="space-y-4">
        <div className="pageHeadingBox"><h1>CRM - Deals</h1></div>
        
        {/* ✅ Top-level filters */}
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <div key={filter.column} className="min-w-[180px]">
              <MultiSelectFilter
                title={filter.title}
                options={originalOptions[filter.column] || []}
                selectedValues={getCurrentFilterValues(filter.column)}
                onSelectionChange={(values) => handleFilterChange(filter.column, values)}
                placeholder={filter.placeholder || `Filter ${filter.title}...`}
              />
            </div>
          ))}
        </div>

        {/* ✅ Aggregate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AggregateCard 
            title="Total Deals" 
            value={totalDeals}
            formatter={(value) => `${value}`}
          />
          <AggregateCard 
            title="Total AUM" 
            value={totalAUM}
            formatter={(value) => `${value.toFixed(1)} Cr`}
            className="border-blue-200"
          />
        </div>

        {/* ✅ Pie Charts in Toggle Visibility */}
        <ToggleVisibility toggleText="Show Deal Analysis">
          <div className="space-y-6">
            {/* Count-based charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CountPieChart 
                table={table} 
                aggCol="deal_likelihood" 
                title="Deal Likelihood"
                countLabel="deals"
              />
              <CountPieChart 
                table={table} 
                aggCol="deal_stage" 
                title="Deal Stage"
                countLabel="deals"
              />
              <CountPieChart 
                table={table} 
                aggCol="deal_segment" 
                title="Deal Segment"
                countLabel="deals"
              />
              <CountPieChart 
                table={table} 
                aggCol="est_closure" 
                title="Est. Closure Timeline"
                countLabel="deals"
              />
            
            {/* Value-based charts for AUM */}
              <PieChart 
                table={table} 
                aggCol="deal_likelihood" 
                valCol="total_deal_aum" 
                title="AUM by Likelihood"
              />
              <PieChart 
                table={table} 
                aggCol="deal_stage" 
                valCol="total_deal_aum" 
                title="AUM by Stage"
              />
          </div>
          </div>
        </ToggleVisibility>

        {/* ✅ Table with no filters (handled above) */}
        <ReactTableWrapper 
          table={table} 
          className="text-xs text-center" 
          filters={[]} 
          showSearch={true}
        />
      </div>
    );
    }