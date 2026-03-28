"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { createColumns } from "./columns-investments";
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
import TableInvChange from "./TableInvChange";
import { PieChart } from "@/components/charts/InvestmentPieCharts";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { AddHeldAwayButton } from "@/components/forms/AddHeldAway";
import { CirclePlusIcon, UserRoundPlusIcon } from "lucide-react";
import { can } from '@/lib/permissions';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditPortRecoButton } from "@/components/forms/EditPortRecommendation";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { RmsFundsScreener } from "@/types/funds-detail";
import { AddGroupInvestorButton } from "@/components/forms/AddGroupInvestor";
import { FavCategory, FavStructure, FavAssetClass } from "@/types/favourite-detail";
import { Category } from "@/types/category-detail";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import Link from "next/link";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import { FundAmcComparison } from "@/components/uiComponents/fund-amc-comparison";

interface TableInvestmentsProps {
  data: Investments[];
  sipData?: SipDetail[];
  stpData?: StpDetails[];
  investorOptions: { value: string; label: string }[];
  userRoles: string;
  portfolioReallocationThoughts?: string;
  targetAllocations?: {
    target_equity_pct: number | null;
    target_debt_pct: number | null;
    target_hybrid_pct: number | null;
    target_real_estate_pct: number | null;
    target_alternatives_pct: number | null;
    target_global_equity_pct: number | null;
    target_global_debt_pct: number | null;
    target_global_alternatives_pct: number | null;
  };
  groupId: number | null;
  favFunds?: RmsFundsScreener[];
  favStructure?: FavStructure[];
  favAssetClass?: FavAssetClass[];
  favCategory?: FavCategory[];
  catPerformance?: Category[];
}

export default function TableInvestments({ data, sipData = [], stpData = [], investorOptions, userRoles, portfolioReallocationThoughts, targetAllocations, groupId, favFunds = [], favStructure = [], favAssetClass = [], favCategory = [], catPerformance = [] }: TableInvestmentsProps) {
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(createColumns(userRoles), 'fund_name');
  
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
    
    // ✅ Get filtered data from the table to pass to child components
    const filteredData = useMemo(() => {
      const filteredRows = table.getFilteredRowModel().rows;
      return filteredRows.map(row => row.original);
    }, [table.getFilteredRowModel().rows]);
    
    // Filter data to only show investments with changes (for TableInvChange)
    const changedInvestments = useMemo(() => 
      filteredData.filter(item => item.amt_change != null && item.amt_change !== 0), 
      [filteredData]
    );

    const snapshotRows = useMemo(() => [
      { label: "Total Purchase", value: `Rs. ${(aggregations.pur_amt || 0).toFixed(1)} lakh`, valueClassName: "" },
      { label: "Current Value", value: `Rs. ${(aggregations.cur_amt || 0).toFixed(1)} lakh`, valueClassName: "" },
      {
        label: "Total Gain/Loss",
        value: `Rs. ${(aggregations.gain_loss || 0).toFixed(1)} lakh`,
        valueClassName: (aggregations.gain_loss || 0) > 0 ? "text-green-700" : (aggregations.gain_loss || 0) < 0 ? "text-red-700" : "",
      },
      { label: "Total SIP", value: sipTotal.toFixed(1), valueClassName: "" },
      { label: "Total STP", value: stpTotal.toFixed(1), valueClassName: "" },
    ], [aggregations.gain_loss, aggregations.cur_amt, aggregations.pur_amt, sipTotal, stpTotal]);

    const allocationComparisonRows = useMemo(() => {
      const targetByAssetClass: { name: string; target: number }[] = [
        { name: "Equity", target: targetAllocations?.target_equity_pct ?? 0 },
        { name: "Debt", target: targetAllocations?.target_debt_pct ?? 0 },
        { name: "Hybrid", target: targetAllocations?.target_hybrid_pct ?? 0 },
        { name: "Real Estate", target: targetAllocations?.target_real_estate_pct ?? 0 },
        { name: "Alternatives", target: targetAllocations?.target_alternatives_pct ?? 0 },
        { name: "Global - Equity", target: targetAllocations?.target_global_equity_pct ?? 0 },
        { name: "Global - Debt", target: targetAllocations?.target_global_debt_pct ?? 0 },
        { name: "Global - Alt", target: targetAllocations?.target_global_alternatives_pct ?? 0 },
      ];

      const totalCurrent = filteredData.reduce((sum, row) => sum + (row.cur_amt || 0), 0);
      const actualByAssetClass = filteredData.reduce<Record<string, number>>((acc, row) => {
        const key = row.asset_class_name || "";
        if (!key) return acc;
        acc[key] = (acc[key] || 0) + (row.cur_amt || 0);
        return acc;
      }, {});

      return targetByAssetClass
        .map((row) => {
          const currentAmt = actualByAssetClass[row.name] || 0;
          const actual = totalCurrent > 0 ? Math.round((currentAmt / totalCurrent) * 100) : 0;
          const target = Math.round(row.target);
          const deviation = actual - target;
          return { ...row, target, actual, deviation };
        })
        .filter((row) => row.target > 0 || row.actual > 0);
    }, [filteredData, targetAllocations]);
    
    return (
      <div className="space-y-4">
        <RmsPageTitle 
                title="Investments" 
                caption="View your investments, with handy filtering, sorting & access to IME ratings." 
            />
        {/* ✅ Top-level filters */}
        <div className="px-4 py-2">
        <div className="flex flex-wrap gap-4 mb-4">
          {filters.map((filter) => (
            <div key={filter.column} className="min-w-[150px]">
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
        <Tabs defaultValue="allocations" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="allocations">Allocation</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="reallocations">Reallocation</TabsTrigger>
          </TabsList>
          <TabsContent value="allocations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mt-6">
            <div className="rounded-lg border">
              <div className="px-4 py-1 border-b bg-gray-200">
                <h3 className="font-semibold text-center">Portfolio Snapshot</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {snapshotRows.map((row) => (
                      <tr key={row.label} className="border-t">
                        <td className="p-2">{row.label}</td>
                        <td className={`p-2 text-right font-medium ${row.valueClassName}`}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border">
              <div className="px-4 py-1 border-b bg-gray-200">
                <h3 className="font-semibold text-center">Target vs Actual Allocation</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left p-2 font-medium">Asset Class</th>
                      <th className="text-right p-2 font-medium">Target %</th>
                      <th className="text-right p-2 font-medium">Actual %</th>
                      <th className="text-right p-2 font-medium">Deviation %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocationComparisonRows.length > 0 ? (
                      allocationComparisonRows.map((row) => (
                        <tr key={row.name} className="border-t">
                          <td className="p-2">{row.name}</td>
                          <td className="p-2 text-right">{row.target}%</td>
                          <td className="p-2 text-right">{row.actual}%</td>
                          <td className={`p-2 text-right font-medium ${row.deviation > 0 ? "text-green-700" : row.deviation < 0 ? "text-red-700" : "text-muted-foreground"}`}>
                            {row.deviation > 0 ? `+${row.deviation}%` : `${row.deviation}%`}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-muted-foreground">
                          No target or actual allocation data available for current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="px-4 py-2 text-xs text-muted-foreground">Actual values are based on current filters.</p>
            </div>
          </div>

            <div className="mt-6 w-full max-w-6xl mx-auto px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PieChart 
                table={table} 
                aggCol="asset_class_name" 
                valCol="cur_amt" 
                title="Asset Class"
              />
              <PieChart 
                table={table} 
                aggCol="cat_name" 
                valCol="cur_amt" 
                title="Category"
              />
              <PieChart 
                table={table} 
                aggCol="structure_name" 
                valCol="cur_amt" 
                title="Structure"
                maxItems={8}
              />
              <PieChart 
                table={table} 
                aggCol="fund_rating" 
                valCol="cur_amt" 
                title="Rating"
              />
              <PieChart 
                table={table} 
                aggCol="investor_name" 
                valCol="cur_amt" 
                title="Investor"
              />
              <PieChart 
                table={table} 
                aggCol="advisor_name" 
                valCol="cur_amt" 
                title="Advisor"
              />
            </div>
            </div>

          </TabsContent>
          
          <TabsContent value="investments">
          
          {can(userRoles, 'investments', 'add_edit_held_away') && (
            <div className="flex">
              <AddHeldAwayButton investorOptions={investorOptions}><CirclePlusIcon className="w-6 h-6 m-4" /></AddHeldAwayButton>
              <AddGroupInvestorButton><UserRoundPlusIcon className="w-6 h-6" /></AddGroupInvestorButton>
            </div>
          )}
            <ReactTableWrapper 
              table={table} 
              className="text-xs text-center" 
              filters={[]} 
              showSearch={true}
              emptyText="No investments found. You can upload your existing investments to the portal to view IME's Ratings on the same. Connect with your dedicated Private Banker or reach out to us using the WhatsApp button below to get started."
              aggregations={['pur_amt', 'cur_amt', 'gain_loss']}
              aggregationFormat={{
                formatter: (value) => value.toFixed(1)
              }}
            />
            <p className="helper-text"><span className="font-bold">Note:</span> All values in Rs. lakhs | Abs Ret & CAGR (absolute returns & annualised returns) are in % |<span className="font-bold"> Last Updates:</span> Daily (MF, IME PMS, Kristal), Monthly (PMS & AIF: 28-Feb), Held-Away (when last given by investor). 
              <br/>1yr, 3yr, 5yr returns (%) are the funds reported annualised returns, that are not impacted by the timing of your entry/exit and therefore better for comparisons.
               </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              </div>
              { sipData.length > 0 && (
                <div>
                  <h3 className="mt-6">SIP Details</h3>
                  <TableSystematic data={sipData} />
                </div>
              )}
              
              { stpData.length > 0 && (
                <div>
                <h3 className="mt-6">STP Details</h3>
                <TableStp data={stpData} />
                </div>
              )}
          
          
          </TabsContent>
          <TabsContent value="reallocations">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <AggregateCard 
                title="Total Change" 
                value={filteredData.reduce((sum, row) => sum + (row.amt_change || 0), 0)}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total Current Value" 
                value={filteredData.reduce((sum, row) => sum + (row.cur_amt || 0), 0)}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total New Value" 
                value={filteredData.reduce((sum, row) => sum + (row.new_amt || 0), 0)}
                formatter={(value) => `${value.toFixed(1)}`}
              />
            </div>
            
            {/* Side-by-side comparison charts wrapped in toggle */}
            <ToggleVisibility toggleText="Allocation Impact">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChart 
                    table={table} 
                    aggCol="asset_class_name" 
                    valCol="cur_amt" 
                    title="Current - Asset Class"
                  />
                  <PieChart 
                    table={table} 
                    aggCol="asset_class_name" 
                    valCol="new_amt" 
                    title="New - Asset Class"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChart 
                    table={table} 
                    aggCol="cat_name" 
                    valCol="cur_amt" 
                    title="Current - Category"
                  />
                  <PieChart 
                    table={table} 
                    aggCol="cat_name" 
                    valCol="new_amt" 
                    title="New - Category"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChart 
                    table={table} 
                    aggCol="structure_name" 
                    valCol="cur_amt" 
                    title="Current - Structure"
                  />
                  <PieChart 
                    table={table} 
                    aggCol="structure_name" 
                    valCol="new_amt" 
                    title="New - Structure"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChart 
                    table={table} 
                    aggCol="fund_rating" 
                    valCol="cur_amt" 
                    title="Current - Rating"
                  />
                  <PieChart 
                    table={table} 
                    aggCol="fund_rating" 
                    valCol="new_amt" 
                    title="New - Rating"
                  />
                </div>
              </div>
            </ToggleVisibility>
            <EditPortRecoButton portRecoData={portfolioReallocationThoughts} groupId={groupId} />
            {portfolioReallocationThoughts && (
              <div className="border-box text-sm !py-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{portfolioReallocationThoughts}</ReactMarkdown>
              </div>
            )}
            <p className="helper-text"><span className="font-bold">Note: </span> You can sort on the Change Amt column by clicking on it, to see the key changes being recommended</p>
            <TableInvChange data={changedInvestments} userRoles={userRoles} />
          </TabsContent>
        </Tabs>
      </div>
      </div>
    );
    }