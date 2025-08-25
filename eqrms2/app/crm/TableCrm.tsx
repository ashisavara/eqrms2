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
  customTagOptions = [],
  leadRoleOptions = [],
  digitalAdOptions = [],
  leadSourceOptions = [],
  leadTypeOptions = [],
  primaryRmOptions = [],
  referralPartnerOptions = [],
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
  customTagOptions?: { value: string; label: string }[];
  leadRoleOptions?: { value: string; label: string }[];
  digitalAdOptions?: { value: string; label: string }[];
  leadSourceOptions?: { value: string; label: string }[];
  leadTypeOptions?: { value: string; label: string }[];
  primaryRmOptions?: { value: string; label: string }[];
  referralPartnerOptions?: { value: string; label: string }[];
}) {

  const columns = createColumns(importanceOptions, leadProgressionOptions, wealthLevelOptions, dealEstClosureOptions, dealStageOptions, dealSegmentOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, customTagOptions, leadRoleOptions, digitalAdOptions, leadSourceOptions, leadTypeOptions, primaryRmOptions, referralPartnerOptions);
  
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
          return value.includes(cellValue);
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

    // ✅ Calculate aggregations for cards (count-based for CRM) - using filtered data
    const filteredRows = table.getFilteredRowModel().rows;
    const totalLeads = filteredRows.length;
    const hotLeads = filteredRows.filter(row => row.getValue('importance') === 'High').length;
    const overdueFollowups = filteredRows.filter(row => (Number(row.getValue('days_followup')) || 0) < 0).length;
    
    return (
      <div className="space-y-4">
        <div className="pageHeadingBox"><h1>CRM - Lead Management</h1></div>
        
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
            title="Total Leads" 
            value={totalLeads}
            formatter={(value) => `${value}`}
          />
          <AggregateCard 
            title="High Priority Leads" 
            value={hotLeads}
            formatter={(value) => `${value}`}
            className="border-orange-200"
          />
          <AggregateCard 
            title="Overdue Follow-ups" 
            value={overdueFollowups}
            formatter={(value) => `${value}`}
            className={overdueFollowups > 0 ? "border-red-200" : "border-green-200"}
          />
        </div>

        {/* ✅ Pie Charts in Toggle Visibility */}
        <ToggleVisibility toggleText="Show Lead Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <CountPieChart 
              table={table} 
              aggCol="importance" 
              title="Lead Priority"
              countLabel="leads"
            />
            <CountPieChart 
              table={table} 
              aggCol="lead_progression" 
              title="Lead Stage"
              countLabel="leads"
            />
            <CountPieChart 
              table={table} 
              aggCol="wealth_level" 
              title="Wealth Level"
              countLabel="leads"
            />
            <CountPieChart 
              table={table} 
              aggCol="lead_source" 
              title="Lead Source"
              countLabel="leads"
            />
            <CountPieChart 
              table={table} 
              aggCol="lead_type" 
              title="Lead Type"
              countLabel="leads"
            />
            <CountPieChart 
              table={table} 
              aggCol="rm_name" 
              title="Relationship Manager"
              maxItems={8}
              countLabel="leads"
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