"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { FilterOption } from "@/lib/supabase/serverSideQueryHelper";
import { Search, RotateCcw } from "lucide-react";

interface FilterOptions {
  fund_rating: FilterOption[];
  amc_name: FilterOption[];
  structure_name: FilterOption[];
  category_name: FilterOption[];
  estate_duty_exposure: FilterOption[];
  us_investors: FilterOption[];
}

interface CurrentSort {
  primary: { column: string; direction: 'asc' | 'desc' };
  secondary: { column: string; direction: 'asc' | 'desc' };
}

interface InternalFundsFiltersProps {
  filterOptions: FilterOptions;
  currentFilters: Record<string, any>;
  currentSearch: string;
  currentSort: CurrentSort;
}

export default function InternalFundsFilters({
  filterOptions,
  currentFilters,
  currentSearch,
  currentSort
}: InternalFundsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for filters before applying them
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [localSort, setLocalSort] = useState(currentSort);

  // Build URL with current filters and parameters
  const buildUrl = (newFilters?: Record<string, any>, newSearch?: string, newSort?: CurrentSort, resetPage = true) => {
    const params = new URLSearchParams();
    
    // Add filters
    const filtersToUse = newFilters || localFilters;
    Object.entries(filtersToUse).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => params.append(key, v.toString()));
      }
    });

    // Add search
    const searchToUse = newSearch !== undefined ? newSearch : localSearch;
    if (searchToUse) {
      params.set('search', searchToUse);
    }

    // Add sorting
    const sortToUse = newSort || localSort;
    params.set('sort', sortToUse.primary.column);
    params.set('order', sortToUse.primary.direction);
    params.set('secondarySort', sortToUse.secondary.column);
    params.set('secondaryOrder', sortToUse.secondary.direction);

    // Keep pagination unless resetting
    if (!resetPage) {
      const currentPage = searchParams.get('page');
      if (currentPage) params.set('page', currentPage);
    }

    const currentPageSize = searchParams.get('pageSize');
    if (currentPageSize) params.set('pageSize', currentPageSize);

    return `/funds/all?${params.toString()}`;
  };

  // Apply filters (navigate to new URL)
  const applyFilters = () => {
    router.push(buildUrl(localFilters, localSearch, localSort, true));
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    setLocalSearch('');
    router.push('/funds/all');
  };

  // Handle individual filter changes
  const handleFilterChange = (filterKey: string, values: string[]) => {
    const newFilters = { ...localFilters };
    if (values.length === 0) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = filterKey === 'fund_rating' ? values.map(Number) : values;
    }
    setLocalFilters(newFilters);
  };

  // Handle sort changes
  const handleSortChange = (type: 'primary' | 'secondary', field: 'column' | 'direction', value: string) => {
    const newSort = { ...localSort };
    newSort[type][field] = value as any;
    setLocalSort(newSort);
  };

  // Convert filter options to strings for MultiSelectFilter
  const getStringOptions = (options: FilterOption[]) => {
    return options.map(opt => opt.value.toString());
  };

  const getCurrentFilterValues = (filterKey: string): string[] => {
    const values = localFilters[filterKey];
    if (!values) return [];
    return Array.isArray(values) ? values.map(v => v.toString()) : [values.toString()];
  };

  const sortOptions = [
    { value: 'fund_name', label: 'Fund Name' },
    { value: 'fund_rating', label: 'Fund Rating' },
    { value: 'fund_performance_rating', label: 'Performance Rating' },
    { value: 'amc_rating', label: 'AMC Rating' },
    { value: 'one_yr', label: '1 Year Return' },
    { value: 'three_yr', label: '3 Year Return' },
    { value: 'five_yr', label: '5 Year Return' },
    { value: 'since_inception', label: 'Since Inception' }
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search funds, AMCs, categories..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>
        <Button onClick={applyFilters} className="shrink-0">Apply Filters</Button>
        <Button variant="outline" onClick={clearFilters} className="shrink-0">
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <MultiSelectFilter
            title="Fund Rating"
            options={getStringOptions(filterOptions.fund_rating)}
            selectedValues={getCurrentFilterValues('fund_rating')}
            onSelectionChange={(values) => handleFilterChange('fund_rating', values)}
            placeholder="Rating..."
          />
        </div>
        
        <div>
          <MultiSelectFilter
            title="AMC"
            options={getStringOptions(filterOptions.amc_name)}
            selectedValues={getCurrentFilterValues('amc_name')}
            onSelectionChange={(values) => handleFilterChange('amc_name', values)}
            placeholder="AMC..."
          />
        </div>

        <div>
          <MultiSelectFilter
            title="Structure"
            options={getStringOptions(filterOptions.structure_name)}
            selectedValues={getCurrentFilterValues('structure_name')}
            onSelectionChange={(values) => handleFilterChange('structure_name', values)}
            placeholder="Structure..."
          />
        </div>

        <div>
          <MultiSelectFilter
            title="Category"
            options={getStringOptions(filterOptions.category_name)}
            selectedValues={getCurrentFilterValues('category_name')}
            onSelectionChange={(values) => handleFilterChange('category_name', values)}
            placeholder="Category..."
          />
        </div>

        <div>
          <MultiSelectFilter
            title="Estate Duty"
            options={getStringOptions(filterOptions.estate_duty_exposure)}
            selectedValues={getCurrentFilterValues('estate_duty_exposure')}
            onSelectionChange={(values) => handleFilterChange('estate_duty_exposure', values)}
            placeholder="Estate Duty..."
          />
        </div>

        <div>
          <MultiSelectFilter
            title="US Investors"
            options={getStringOptions(filterOptions.us_investors)}
            selectedValues={getCurrentFilterValues('us_investors')}
            onSelectionChange={(values) => handleFilterChange('us_investors', values)}
            placeholder="US Investors..."
          />
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
        <span className="text-sm font-medium">Sort by:</span>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Primary:</span>
          <Select 
            value={localSort.primary.column} 
            onValueChange={(value) => handleSortChange('primary', 'column', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={localSort.primary.direction} 
            onValueChange={(value) => handleSortChange('primary', 'direction', value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Secondary:</span>
          <Select 
            value={localSort.secondary.column} 
            onValueChange={(value) => handleSortChange('secondary', 'column', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={localSort.secondary.direction} 
            onValueChange={(value) => handleSortChange('secondary', 'direction', value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 