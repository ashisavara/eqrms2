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
import { CirclePlusIcon } from "lucide-react";
import { can } from '@/lib/permissions';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EditPortRecoButton } from "@/components/forms/EditPortRecommendation";
import TableFundScreen from "@/app/funds/TableFundScreen";
import { RmsFundsScreener } from "@/types/funds-detail";

interface TableInvestmentsProps {
  data: Investments[];
  sipData?: SipDetail[];
  stpData?: StpDetails[];
  investorOptions: { value: string; label: string }[];
  userRoles: string[];
  portfolioReallocationThoughts?: string;
  mandateId: number | null;
  favFunds?: RmsFundsScreener[];
}

export default function TableInvestments({ data, sipData = [], stpData = [], investorOptions, userRoles, portfolioReallocationThoughts, mandateId, favFunds = [] }: TableInvestmentsProps) {
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(createColumns(userRoles), 'fund_name');
  
  // Filter data to only show investments with changes (for TableInvChange) ... we have stopped using this since needed access to be able to change amount on fund
  const changedInvestments = useMemo(() => 
    data.filter(item => item.amt_change && item.amt_change !== 0), 
    [data]
  );
  
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
        <div className="pageHeadingBox"><h1>Investments</h1></div>
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
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="shortlist">Shortlisted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="investments">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
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
            <div className="flex">
            <div className="mt-2"><ToggleVisibility toggleText="Show Allocation">
              
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
          </ToggleVisibility>
          </div>
          {can(userRoles, 'investments', 'add_edit_held_away') && (
            <AddHeldAwayButton investorOptions={investorOptions}><CirclePlusIcon className="w-6 h-6 m-4" /></AddHeldAwayButton>
          )}
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
            <p className="helper-text"><span className="font-bold">Note:</span> All values in Rs. lakhs | Abs Ret & CAGR (absolute returns & annualised returns) are in % |<span className="font-bold"> Last Updates:</span> Daily (MF, IME PMS, Kristal), Monthly (PMS & AIF - last updated 31-Aug), Held-Away (when last given by investor). 
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
          <TabsContent value="recommendations">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <AggregateCard 
                title="Total Change" 
                value={data.reduce((sum, row) => sum + (row.amt_change || 0), 0)}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total Current Value" 
                value={data.reduce((sum, row) => sum + (row.cur_amt || 0), 0)}
                formatter={(value) => `${value.toFixed(1)}`}
              />
              <AggregateCard 
                title="Total New Value" 
                value={data.reduce((sum, row) => sum + (row.new_amt || 0), 0)}
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
            <EditPortRecoButton portRecoData={portfolioReallocationThoughts} mandateId={mandateId} />
            {portfolioReallocationThoughts && (
              <div className="bg-gray-100 rounded-md p-4 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{portfolioReallocationThoughts}</ReactMarkdown>
              </div>
            )}
            <p className="helper-text"><span className="font-bold">Note: </span> You can sort on the Change Amt column by clicking on it, to see the key changes being recommended</p>
            <TableInvChange data={data} />
          </TabsContent>
          <TabsContent value="shortlist">
            <TableFundScreen data={favFunds}/>
          </TabsContent>
        </Tabs>
      </div>
    );
    }