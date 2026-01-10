"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { createColumns } from "./columns-crm-core";
import { LeadsTagging } from "@/types/lead-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { AggregateCard } from "@/components/ui/aggregate-card";
import { CountPieChart } from "@/components/charts/CountPieCharts";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { useMemo } from "react";
import { calculateCustomAggregations } from "@/lib/table-aggregations";

export default function TableCrm({ 
  data, 
  importanceOptions = [], 
  leadProgressionOptions = [], 
  wealthLevelOptions = [],
  dealEstClosureOptions = [],
  dealStageOptions = [],
  dealSegmentOptions = [],
  interactionTypeOptions = [],
  interactionTagOptions = [],
  interactionChannelOptions = [],
  digitalAdOptions = [],
  leadSourceOptions = [],
  leadTypeOptions = [],
  primaryRmOptions = [],
}: { 
  data: LeadsTagging[];
  importanceOptions?: { value: string; label: string }[];
  leadProgressionOptions?: { value: string; label: string }[];
  wealthLevelOptions?: { value: string; label: string }[];  
  dealEstClosureOptions?: { value: string; label: string }[];
  dealStageOptions?: { value: string; label: string }[];
  dealSegmentOptions?: { value: string; label: string }[];
  interactionTypeOptions?: { value: string; label: string }[];
  interactionTagOptions?: { value: string; label: string }[];
  interactionChannelOptions?: { value: string; label: string }[];
  digitalAdOptions?: { value: string; label: string }[];
  leadSourceOptions?: { value: string; label: string }[];
  leadTypeOptions?: { value: string; label: string }[];
  primaryRmOptions?: { value: string; label: string }[];
}) {

  const columns = createColumns(importanceOptions, leadProgressionOptions, wealthLevelOptions, dealEstClosureOptions, dealStageOptions, dealSegmentOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, digitalAdOptions, leadSourceOptions, leadTypeOptions, primaryRmOptions);
  
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'lead_name');
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
          return value.includes(String(cellValue));
        },
      },
      initialState: {
        pagination: {
          pageSize: 30, // Set default page size
          pageIndex: 0,
        },
        sorting: [
          { id: "days_followup", desc: false },
        ],
      },
    });

    const filters = [
        { column: "importance", title: "Importance", placeholder: "Importance" },
        { column: "lead_progression", title: "Lead Stage", placeholder: "Lead Stage" },
        { column: "lead_source", title: "Lead Source", placeholder: "Lead Source" },
        { column: "lead_type", title: "Lead Type", placeholder: "Lead Type" },
        { column: "wealth_level", title: "Wealth Level", placeholder: "Wealth Level" },
        { column: "rm_name", title: "RM", placeholder: "RM" }
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
          key: 'totalLeads',
          type: 'count'
        },
        {
          key: 'hotLeads',
          type: 'conditionalCount',
          condition: (row) => {
            const importance = row.getValue('importance');
            return importance === '3) High' || importance === '4) Urgent';
          }
        },
        {
          key: 'overdueFollowups',
          type: 'conditionalCount',
          condition: (row) => {
            const daysFollowup = Number(row.getValue('days_followup')) || 0;
            return daysFollowup < 0;
          }
        },
        {
          key: 'advancedLeads',
          type: 'conditionalCount',
          condition: (row) => {
            const progress = row.getValue('lead_progression');
            return progress === '5) Documenation' || progress === '4) Deal Indicated' || progress === '3) Inv Consultation';
          }
        },
        {
          key: 'newLeads',
          type: 'conditionalCount',
          condition: (row) => {
            const createdAtValue = row.getValue('created_at');
            if (!createdAtValue) return false;
            const createdAt = new Date(createdAtValue).getTime();
            const now = Date.now();
            const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
            return now - createdAt <= THIRTY_DAYS_MS;
          }
        },
      ]);
    }, [table, table.getFilteredRowModel().rows.length]);
    
    const { totalLeads, hotLeads, overdueFollowups, advancedLeads, newLeads } = aggregations;
    
    return (
      <div className="space-y-4">
        <div className="pageHeadingBox"><h1 className="text-gray-50">CRM - Lead Management</h1></div>
        
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
          <AggregateCard title="Total Leads" value={totalLeads} formatter={(value) => `${value}`} />
          <AggregateCard title="Overdue Follow-ups" value={overdueFollowups} formatter={(value) => `${value}`} className={overdueFollowups > 0 ? "border-red-200" : "border-green-200"}/>
          <AggregateCard title="High Priority Leads" value={hotLeads} formatter={(value) => `${value}`} className="border-orange-200" />
          <AggregateCard title="Advanced Leads" value={advancedLeads} formatter={(value) => `${value}`} className="border-blue-200" />
          <AggregateCard title="New Leads" value={newLeads} formatter={(value) => `${value}`} className="border-green-200" />
        </div>

        {/* ✅ Pie Charts in Toggle Visibility */}
        <ToggleVisibility toggleText="Show Lead Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <CountPieChart table={table} aggCol="importance" title="Lead Priority" countLabel="leads" />
            <CountPieChart table={table} aggCol="lead_progression" title="Lead Stage" countLabel="leads" />
            <CountPieChart table={table} aggCol="wealth_level" title="Wealth Level" countLabel="leads" />
            <CountPieChart table={table} aggCol="lead_source" title="Lead Source" countLabel="leads" />
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