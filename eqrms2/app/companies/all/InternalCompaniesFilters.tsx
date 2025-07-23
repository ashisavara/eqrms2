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
  sector_name: FilterOption[];
  industry: FilterOption[];
  coverage: FilterOption[];
}

interface CurrentSort {
  primary: { column: string; direction: 'asc' | 'desc' };
  secondary: { column: string; direction: 'asc' | 'desc' };
}

interface InternalCompaniesFiltersProps {
  filterOptions: FilterOptions;
  currentFilters: Record<string, any>;
  currentSearch: string;
  currentSort: CurrentSort;
}

export default function InternalCompaniesFilters({
  filterOptions,
  currentFilters,
  currentSearch,
  currentSort
}: InternalCompaniesFiltersProps) {
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

    return `/companies/all?${params.toString()}`;
  };

  // Apply filters (navigate to new URL)
  const applyFilters = () => {
    router.push(buildUrl(localFilters, localSearch, localSort, true));
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    setLocalSearch('');
    router.push('/companies/all');
  };

  // Handle individual filter changes
  const handleFilterChange = (filterKey: string, values: string[]) => {
    const newFilters = { ...localFilters };
    if (values.length === 0) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = values;
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
    { value: 'ime_name', label: 'Company Name' },
    { value: 'sector_name', label: 'Sector' },
    { value: 'industry', label: 'Industry' },
    { value: 'cmp', label: 'CMP' },
    { value: 'gr_t3', label: 'FY28 Growth' },
    { value: 'gr_t4', label: 'FY29 Growth' },
    { value: '1m_return', label: '1 Month Return' },
    { value: '3m_return', label: '3 Month Return' },
    { value: '1yr_return', label: '1 Year Return' },
    { value: '3yrs_return', label: '3 Year Return' },
    { value: '5yrs_return', label: '5 Year Return' }
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, sectors, industries..."
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <MultiSelectFilter
            title="Sector"
            options={getStringOptions(filterOptions.sector_name)}
            selectedValues={getCurrentFilterValues('sector_name')}
            onSelectionChange={(values) => handleFilterChange('sector_name', values)}
            placeholder="Sector..."
          />
        </div>
        
        <div>
          <MultiSelectFilter
            title="Industry"
            options={getStringOptions(filterOptions.industry)}
            selectedValues={getCurrentFilterValues('industry')}
            onSelectionChange={(values) => handleFilterChange('industry', values)}
            placeholder="Industry..."
          />
        </div>

        <div>
          <MultiSelectFilter
            title="Coverage"
            options={getStringOptions(filterOptions.coverage)}
            selectedValues={getCurrentFilterValues('coverage')}
            onSelectionChange={(values) => handleFilterChange('coverage', values)}
            placeholder="Coverage..."
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