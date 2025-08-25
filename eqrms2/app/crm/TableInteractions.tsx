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
import { calculateCustomAggregations } from "@/lib/table-aggregations";

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

    // ✅ Calculate aggregations using the enhanced function
    const aggregations = useMemo(() => {
      return calculateCustomAggregations(table, [
        {
          key: 'totalConnects',
          type: 'count'
        },
        {
          key: 'totalMeetings',
          type: 'conditionalCount',
          condition: (row) => {
            const meeting = row.getValue('interaction_type');
            return meeting === 'Meeting';
          }
        },
        {
          key: 'totalInteractions',
          type: 'conditionalCount',
          condition: (row) => {
            const interaction = row.getValue('interaction_type');
            return interaction === 'Interaction';
          }
        },
        {
          key: 'totalFollowUps',
          type: 'conditionalCount',
          condition: (row) => {
            const interaction = row.getValue('interaction_type');
            return interaction === 'Follow up';
          }
        },
      ]);
    }, [table, table.getFilteredRowModel().rows.length]);
    
    const { totalConnects, totalMeetings, totalInteractions, totalFollowUps } = aggregations;
    
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AggregateCard 
            title="Connects" 
            value={totalConnects}
            formatter={(value) => `${value}`}
          />
          <AggregateCard 
            title="Meetings" 
            value={totalMeetings}
            formatter={(value) => `${value}`}
            className="border-green-200"
          />
          <AggregateCard 
            title="Interactions" 
            value={totalInteractions}
            formatter={(value) => `${value}`}
            className="border-blue-200"
          />
          <AggregateCard 
            title="Followups" 
            value={totalFollowUps}
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