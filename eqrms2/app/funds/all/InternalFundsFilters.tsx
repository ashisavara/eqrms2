"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { FilterOption } from "@/lib/supabase/serverSideQueryHelper";
import { useServerTableState } from "@/lib/hooks/useServerTableState";
import { Search, RotateCcw } from "lucide-react";

interface FilterOptions {
  fund_rating: FilterOption[];
  amc_name: FilterOption[];
  structure_name: FilterOption[];
  category_name: FilterOption[];
  estate_duty_exposure: FilterOption[];
  us_investors: FilterOption[];
}

interface InternalFundsFiltersProps {
  filterOptions: FilterOptions;
}

export default function InternalFundsFilters({
  filterOptions
}: InternalFundsFiltersProps) {
  const basePath = '/funds/all';
  
  // Use the server table state hook
  const tableState = useServerTableState({
    filterKeys: ['fund_rating', 'amc_name', 'structure_name', 'category_name', 'estate_duty_exposure', 'us_investors'],
    defaultSort: { column: 'fund_rating', direction: 'desc' },
    defaultPageSize: 50
  });
  
  // Local state for filters before applying them
  const [localFilters, setLocalFilters] = useState(tableState.state.filters);
  const [localSearch, setLocalSearch] = useState(tableState.state.search);
  const [localSort, setLocalSort] = useState(tableState.state.sorting);

  // Apply filters (navigate to new URL)
  const applyFilters = () => {
    // Apply all local state to URL
    tableState.navigate({
      filters: localFilters,
      search: localSearch,
      sorting: localSort
    }, true, basePath);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    setLocalSearch('');
    setLocalSort({ column: 'fund_rating', direction: 'desc' });
    tableState.clearFilters(basePath);
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
  const handleSortChange = (field: 'column' | 'direction', value: string) => {
    const newSort = { ...localSort };
    newSort[field] = value as any;
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
          <Select 
            value={localSort.column} 
            onValueChange={(value) => handleSortChange('column', value)}
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
            value={localSort.direction} 
            onValueChange={(value) => handleSortChange('direction', value)}
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