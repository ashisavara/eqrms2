"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { columns } from "./columns-investments";
import { Investments } from "@/types/investment-detail";
import { SipDetail } from "@/types/sip-detail";
import { StpDetails } from "@/types/stp-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AggregateCard } from "@/components/ui/aggregate-card";
import { calculateAggregations } from "@/lib/table-aggregations";
import { useMemo } from "react";
import TableSystematic from "./TableSip";
import TableStp from "./TableStp";
import { PieChart } from "@/components/charts/InvestmentPieCharts";

interface TableInvestmentsProps {
  data: Investments[];
  sipData?: SipDetail[];
  stpData?: StpDetails[];
}

export default function TableInvestments({ data, sipData = [], stpData = [] }: TableInvestmentsProps) {

  const autoSortedColumns = useAutoSorting(data, columns);

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
          { id: "cur_amt", desc: true },
        ],
      },
    });

    const filters = [
        { column: "asset_class_name", title: "Asset Class", placeholder: "Asset Class" },
        { column: "cat_name", title: "Category", placeholder: "Category" },
        { column: "structure_name", title: "Structure", placeholder: "Structure" },
        { column: "fund_rating", title: "Rating", placeholder: "Rating" },
        { column: "investor_name", title: "Investor", placeholder: "Investor" },
        { column: "advisor_name", title: "Advisor", placeholder: "Advisor" },
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

    // ✅ Calculate aggregations for cards
    const aggregations = calculateAggregations(table, ['pur_amt', 'cur_amt', 'gain_loss']);
    
    // ✅ Calculate SIP and STP totals manually from raw data
    const sipTotal = sipData.reduce((sum, row) => sum + (Number(row.sip_amount) || 0), 0);
    const stpTotal = stpData.reduce((sum, row) => sum + (Number(row.stp_amt) || 0), 0);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold pt-4">Investments</h3>
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

        {/* ✅ Tabs for table and cards */}
        <Tabs defaultValue="investments" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="investments">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <AggregateCard 
                title="Total Purchase" 
                value={aggregations.pur_amt || 0}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total Value" 
                value={aggregations.cur_amt || 0}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total Gain/Loss" 
                value={aggregations.gain_loss || 0}
                formatter={(value) => `${value.toFixed(1)}`}
                className={aggregations.gain_loss >= 0 ? "border-green-200" : "border-red-200"}
              />
              <AggregateCard 
                title="Total SIP" 
                value={sipTotal}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total STP" 
                value={stpTotal}
                formatter={(value) => `${value.toFixed(1)}`}
              />
            </div>
            <ReactTableWrapper 
              table={table} 
              className="text-xs text-center" 
              filters={[]} 
              showSearch={true}
              aggregations={['pur_amt', 'cur_amt', 'gain_loss']}
              aggregationFormat={{
                formatter: (value) => value.toFixed(1)
              }}
            />
            <h2>SIP Details</h2>
            <TableSystematic data={sipData} />
            <h2>STP Details</h2>
            <TableStp data={stpData} />
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PieChart 
                table={table} 
                aggCol="asset_class_name" 
                valCol="cur_amt" 
                title="Asset Class Distribution"
                description="Current value by asset class"
              />
              <PieChart 
                table={table} 
                aggCol="investor_name" 
                valCol="cur_amt" 
                title="Investor Distribution"
                description="Current value by investor"
              />
              <PieChart 
                table={table} 
                aggCol="cat_name" 
                valCol="cur_amt" 
                title="Category Distribution"
                description="Current value by category (top 8)"
                maxItems={8}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
    }