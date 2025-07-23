"use client";

import { ServerTablePage, ServerTablePageConfig } from "@/components/server-table";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";

// ================================================================
// 🎯 CLIENT COMPONENT FOR SERVER-SIDE TABLE WITH ITERATIVE FILTERING
// ================================================================
// This component handles the table configuration with render functions.
// Render functions can't be passed from Server Components to Client Components,
// so we define them here in the client component.
//
// 🔄 NEW FEATURE: ITERATIVE FILTERING
// This template now includes iterative filtering that automatically updates
// filter options based on applied filters. When users apply filters, the
// other filter dropdowns will only show options that return results.
//
// Example: Select AMC = "HDFC" → Category filter only shows HDFC categories
// ================================================================

interface FundsTableClientProps {
  data: RmsFundsScreener[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    totalCount: number;
  };
  filterOptions: {
    fund_rating: any[];
    amc_name: any[];
    structure_name: any[];
    category_name: any[];
    estate_duty_exposure: any[];
    us_investors: any[];
  };
  // Pass through the filter configuration for iterative filtering
  filterConfig: Record<string, any>;
  searchColumns: string[];
}

export default function FundsTableClient({ data, pagination, filterOptions, filterConfig, searchColumns }: FundsTableClientProps) {
  // 🎨 CLIENT-SIDE CONFIGURATION
  // All the render functions and complex logic that requires client-side execution
  const config: ServerTablePageConfig<RmsFundsScreener> = {
    // 🏠 PAGE IDENTITY
    basePath: '/funds/all-new',
    title: 'All Funds (New Implementation)',
    description: 'Server-side filtered funds table with 3000+ records',
    
    // 🔧 TABLE STATE CONFIGURATION
    tableStateConfig: {
      filterKeys: ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'],
      defaultSort: { column: 'fund_rating', direction: 'desc' },
      defaultPageSize: 50
    },
    
    // 🎛️ FILTER CONFIGURATION
    filterConfigs: [
      {
        key: 'fund_rating',
        title: 'Fund Rating',
        placeholder: 'Rating...',
        options: filterOptions.fund_rating
      },
      {
        key: 'amc_name',
        title: 'AMC',
        placeholder: 'AMC...',
        options: filterOptions.amc_name
      },
      {
        key: 'structure_name',
        title: 'Structure',
        placeholder: 'Structure...',
        options: filterOptions.structure_name
      },
      {
        key: 'category_name',
        title: 'Category',
        placeholder: 'Category...',
        options: filterOptions.category_name
      },
      {
        key: 'estate_duty_exposure',
        title: 'Estate Duty',
        placeholder: 'Estate Duty...',
        options: filterOptions.estate_duty_exposure
      },
      {
        key: 'us_investors',
        title: 'US Investors',
        placeholder: 'US Investors...',
        options: filterOptions.us_investors
      }
    ],
    
    // 🔄 SORT OPTIONS
    sortOptions: [
      { value: 'fund_name', label: 'Fund Name' },
      { value: 'fund_rating', label: 'Fund Rating' },
      { value: 'fund_performance_rating', label: 'Performance Rating' },
      { value: 'amc_rating', label: 'AMC Rating' },
      { value: 'one_yr', label: '1 Year Return' },
      { value: 'three_yr', label: '3 Year Return' },
      { value: 'five_yr', label: '5 Year Return' },
      { value: 'since_inception', label: 'Since Inception' }
    ],
    
    // 🔍 SEARCH CONFIGURATION
    searchPlaceholder: 'Search funds, AMCs, categories...',
    
    // 📊 TABLE COLUMNS WITH RENDER FUNCTIONS (CLIENT-SIDE ONLY)
    // ⚠️ These render functions must be defined in a client component!
    columns: [
      // 🔗 Link Column Example
      {
        key: 'fund_name',
        header: 'Fund Name',
        align: 'left',
        render: (value, row) => (
          <Link 
            href={`/funds/${row.slug}`} 
            className="text-blue-600 font-bold hover:underline"
          >
            {value}
          </Link>
        )
      },
      
      // 🌟 Custom Component Columns
      {
        key: 'fund_rating',
        header: 'Fund',
        render: (value) => <RatingDisplay rating={value} />
      },
      {
        key: 'fund_performance_rating',
        header: 'Perf',
        render: (value) => <RatingDisplay rating={value} />
      },
      {
        key: 'amc_rating',
        header: 'AMC',
        render: (value) => <RatingDisplay rating={value} />
      },
      
      // 📝 Simple Text Columns (no render function needed)
      {
        key: 'structure_name',
        header: 'Structure'
      },
      {
        key: 'cat_long_name',
        header: 'Category'
      },
      {
        key: 'estate_duty_exposure',
        header: 'Estate Duty'
      },
      {
        key: 'us_investors',
        header: 'US Investors'
      },
      
      // 💰 Conditional Rendering Columns (show '-' for null values)
      {
        key: 'one_yr',
        header: '1 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'three_yr',
        header: '3 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'five_yr',
        header: '5 Year',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      },
      {
        key: 'since_inception',
        header: 'Since Inception',
        render: (value) => value !== null ? <ComGrowthNumberRating rating={value} /> : '-'
      }
    ],
    
    // 📄 MISC CONFIGURATION
    emptyMessage: 'No funds found with the current filters.',
    
    // 🔄 ITERATIVE FILTERING CONFIGURATION
    // These enable dynamic filter options that update based on applied filters
    sourceTable: 'view_rms_funds_screener',  // Main data table for filtering
    filterConfig: filterConfig,              // Filter configuration from server
    searchColumns: searchColumns             // Columns to include in search
  };

  // 🎉 RENDER THE COMPLETE TABLE
  return (
    <ServerTablePage
      config={config}
      data={data}
      pagination={pagination}
    />
  );
} 