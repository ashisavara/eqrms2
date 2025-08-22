'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { searchRmsFundsWithDetails } from "@/lib/supabase/serverQueryHelper";
import { toast } from "sonner";

interface FundDetails {
  fund_id: number;
  fund_name: string;
  asset_class_id: number;
  category_id: number;
  structure_id: number;
  slug: string;
}

interface FundSearchInputProps {
  onFundSelect: (fund: FundDetails) => void;
  selectedFund?: FundDetails | null;
  onClear?: () => void;
  label?: string;
}

export function FundSearchInput({ 
  onFundSelect, 
  selectedFund, 
  onClear,
  label = "Search RMS Fund"
}: FundSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FundDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchRmsFundsWithDetails(searchTerm);
      
      if (searchResults.length === 0) {
        toast.info("No funds found matching your search");
      }
      
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching funds:', error);
      toast.error("Error searching funds. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundSelect = (fund: FundDetails) => {
    // Validate fund has required fields
    if (!fund.asset_class_id || !fund.category_id || !fund.structure_id) {
      toast.error("This fund is missing required classification data and cannot be used");
      return;
    }

    onFundSelect(fund);
    setShowResults(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setResults([]);
    setShowResults(false);
    setSearchTerm("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fund-search">{label}</Label>
      
      {/* Selected Fund Display */}
      {selectedFund && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
          <div>
            <p className="font-medium text-green-800">{selectedFund.fund_name}</p>
            <p className="text-sm text-green-600">RMS Fund ID: {selectedFund.fund_id}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Input - only show if no fund selected */}
      {!selectedFund && (
        <div className="flex gap-2">
          <Input
            id="fund-search"
            type="text"
            placeholder="Enter fund name to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            size="icon"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && !selectedFund && (
        <div className="border rounded-md bg-white shadow-sm max-h-80 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              Found {results.length} fund{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="divide-y">
            {results.map((fund) => (
              <button
                key={fund.fund_id}
                type="button"
                onClick={() => handleFundSelect(fund)}
                className="w-full p-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                <p className="text-xs text-blue-600 hover:text-blue-800 leading-relaxed">
                  {fund.fund_name}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
