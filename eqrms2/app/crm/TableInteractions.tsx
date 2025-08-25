"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { createColumns } from "./columns-interation";
import { InteractionDetail } from "@/types/interaction-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { LeadsTagging } from "@/types/lead-detail";
import { AggregateCard } from "@/components/ui/aggregate-card";
import { CountPieChart } from "@/components/charts/CountPieCharts";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { useMemo } from "react";

export default function TableInteractions({ 
  data, 
  leadsData = []
}: { 
  data: InteractionDetail[];
  leadsData?: LeadsTagging[];
}) {

  const columns = createColumns(leadsData);
  
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'meeting_name');
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
          { id: "created_at", desc: true },
        ],
      },
    });

    const filters = [
      { column: "interaction_type", title: "Interaction Type", placeholder: "Interaction Type" },
      { column: "interaction_channel", title: "Channel", placeholder: "Channel" },
      { column: "interaction_tag", title: "Tag", placeholder: "Tag" },
      { column: "rm_name", title: "Created By", placeholder: "Created By" },
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

    // ✅ Calculate aggregations for cards (count-based for interactions) - using filtered data
    const filteredRows = table.getFilteredRowModel().rows;
    const totalInteractions = filteredRows.length;
    const answeredInteractions = filteredRows.filter(row => row.getValue('answered') === true).length;
    const thisWeekInteractions = filteredRows.filter(row => {
      const createdAt = new Date(row.getValue('created_at') as string);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }).length;
    
    return (
      <div className="space-y-4">
        <div className="pageHeadingBox"><h1>CRM - Interactions</h1></div>
        
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
            title="Total Interactions" 
            value={totalInteractions}
            formatter={(value) => `${value}`}
          />
          <AggregateCard 
            title="Answered Calls" 
            value={answeredInteractions}
            formatter={(value) => `${value}`}
            className="border-green-200"
          />
          <AggregateCard 
            title="This Week" 
            value={thisWeekInteractions}
            formatter={(value) => `${value}`}
            className="border-blue-200"
          />
        </div>

        {/* ✅ Pie Charts in Toggle Visibility */}
        <ToggleVisibility toggleText="Show Interaction Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <CountPieChart 
              table={table} 
              aggCol="interaction_type" 
              title="Interaction Type"
              countLabel="interactions"
            />
            <CountPieChart 
              table={table} 
              aggCol="interaction_channel" 
              title="Communication Channel"
              countLabel="interactions"
            />
            <CountPieChart 
              table={table} 
              aggCol="interaction_tag" 
              title="Interaction Tags"
              countLabel="interactions"
            />
            <CountPieChart 
              table={table} 
              aggCol="rm_name" 
              title="Created By (RM)"
              countLabel="interactions"
              maxItems={8}
            />
            <CountPieChart 
              table={table} 
              aggCol="answered" 
              title="Call Status"
              countLabel="interactions"
            />
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