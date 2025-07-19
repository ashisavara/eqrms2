'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroupInput, TextInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { Search } from "lucide-react";
import Link from "next/link";

interface SearchFormValues {
  entity_type: string;
  search_term: string;
}

interface SearchResult {
  fund_name?: string;
  amc_name?: string;
  ime_name?: string;
  slug?: string;
  company_id?: number;
}

// Internal form component
function SearchForm({ 
  onClose,
}: { 
  onClose: () => void;
}) {  
  const [results, setResults] = useState<SearchResult[]>([]);
  const { control, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: {
      entity_type: "fund",
      search_term: "",
    }
  });

  const onSubmit = async (data: SearchFormValues) => {
    try {
      const apiRoute = `/api/search-${data.entity_type}`;
      const response = await fetch(apiRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search_term: data.search_term }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const searchResults = await response.json();
      setResults(searchResults);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error performing search");
    }
  };

  const entityOptions = [
    { value: "fund", label: "Funds" },
    { value: "amc", label: "AMCs" },
    { value: "company", label: "Companies" }
  ];

  const handleResultClick = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" />
      
      <ToggleGroupInput 
        name="entity_type" 
        label="Search In" 
        control={control} 
        options={entityOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      <TextInput 
        name="search_term" 
        label="Search Term" 
        control={control} 
        placeholder="Enter name to search..."
      />
      
      <Button type="submit" className="w-full">Search</Button>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">Search Results</h3>
          <div className="divide-y">
            {results.map((result, index) => (
              <div key={index} className="py-2">
                {result.fund_name && (
                  <Link 
                    href={`/funds/${result.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={handleResultClick}
                  >
                    {result.fund_name}
                  </Link>
                )}
                {result.amc_name && (
                  <span className="text-gray-700">{result.amc_name}</span>
                )}
                {result.ime_name && (
                  <Link 
                    href={`/companies/${result.company_id}`}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={handleResultClick}
                  >
                    {result.ime_name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function SearchButton() {
  const [showSearchSheet, setShowSearchSheet] = useState(false);

  const handleClose = () => setShowSearchSheet(false);

  return (
    <>
      <Button 
        variant="ghost"
        size="icon"
        onClick={() => setShowSearchSheet(true)}
        className="hover:bg-transparent"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Search Sheet */}
      {showSearchSheet && (
        <Sheet open={true} onOpenChange={handleClose}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Search</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <SearchForm onClose={handleClose} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
