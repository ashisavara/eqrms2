"use client";

import { useState, useMemo } from "react";
import { FinCalculatorDetail } from "@/types/fin-calculator-detail";
import Link from "next/link";

interface FinCalculatorClientProps {
  finCalculator: FinCalculatorDetail[];
}

export default function FinCalculatorClient({ finCalculator }: FinCalculatorClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Get unique categories from financial calculators
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(finCalculator.map(calc => calc.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [finCalculator]);

  // Filter financial calculators based on selected category and search term
  const filteredCalculators = useMemo(() => {
    return finCalculator.filter(calculator => {
      const matchesCategory = selectedCategory === 'all' || calculator.category === selectedCategory;
      const matchesSearch = calculator.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [finCalculator, selectedCategory, searchTerm]);

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Financial Calculators</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Category Dropdown */}
        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search calculator titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredCalculators.length} of {finCalculator.length} calculators
      </div>
      
      {filteredCalculators.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {finCalculator.length === 0 ? 'No financial calculators available' : 'No calculators match your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 center-items">
          {filteredCalculators.map((calculator) => (
            <Link 
              key={calculator.calculator_id} 
              href={`/financial-calculator/${calculator.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-base text-center font-semibold text-blue-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-colors duration-200 line-clamp-3">
                  {calculator.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 text-center line-clamp-4">
                  {truncateText(calculator.summary)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
