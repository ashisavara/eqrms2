"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { useServerTableState } from "@/lib/hooks/useServerTableState";
import { Search, RotateCcw } from "lucide-react";

// Filter option type (matches serverSideQueryHelper)
export interface FilterOption {
  value: any;
  label: string;
}

// Configuration for each filter
export interface FilterConfig {
  key: string;
  title: string;
  placeholder?: string;
  options: FilterOption[];
}

// Configuration for sort options
export interface SortOption {
  value: string;
  label: string;
}

// Main component props
export interface ServerTableFiltersProps {
  basePath: string;
  filterConfigs: FilterConfig[];
  sortOptions: SortOption[];
  tableStateConfig: {
    filterKeys: string[];
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
    defaultPageSize?: number;
  };
  searchPlaceholder?: string;
  showSearch?: boolean;
  showSort?: boolean;
}

export default function ServerTableFilters({
  basePath,
  filterConfigs,
  sortOptions,
  tableStateConfig,
  searchPlaceholder = "Search...",
  showSearch = true,
  showSort = true
}: ServerTableFiltersProps) {
  // Use the server table state hook
  const tableState = useServerTableState(tableStateConfig);
  
  // Local state for filters before applying them
  const [localFilters, setLocalFilters] = useState(tableState.state.filters);
  const [localSearch, setLocalSearch] = useState(tableState.state.search);
  const [localSort, setLocalSort] = useState(tableState.state.sorting);

  // Apply filters (navigate to new URL)
  const applyFilters = () => {
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
    setLocalSort(tableStateConfig.defaultSort || { column: 'id', direction: 'desc' });
    tableState.clearFilters(basePath);
  };

  // Handle individual filter changes
  const handleFilterChange = (filterKey: string, values: string[]) => {
    const newFilters = { ...localFilters };
    if (values.length === 0) {
      delete newFilters[filterKey];
    } else {
      // Convert to numbers if the key suggests it's a rating/numeric field
      if (filterKey.includes('rating') || filterKey.includes('_id')) {
        newFilters[filterKey] = values.map(Number).filter(n => !isNaN(n));
      } else {
        newFilters[filterKey] = values;
      }
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

  // Get current filter values as strings
  const getCurrentFilterValues = (filterKey: string): string[] => {
    const values = localFilters[filterKey];
    if (!values) return [];
    return Array.isArray(values) ? values.map(v => v.toString()) : [values.toString()];
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
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
      )}

      {/* Filters Row */}
      {filterConfigs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filterConfigs.map((config) => (
            <div key={config.key}>
              <MultiSelectFilter
                title={config.title}
                options={getStringOptions(config.options)}
                selectedValues={getCurrentFilterValues(config.key)}
                onSelectionChange={(values) => handleFilterChange(config.key, values)}
                placeholder={config.placeholder || `Filter ${config.title}...`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Sorting Controls */}
      {showSort && sortOptions.length > 0 && (
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
      )}
    </div>
  );
} 