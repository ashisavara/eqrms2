"use client";

import { useState, useMemo } from "react";
import { InvQueryDetail } from "@/types/inv-query-detail";
import Link from "next/link";
import PageTitle from "@/components/uiComponents/page-title";

interface InvQueryClientProps {
  invQuery: InvQueryDetail[];
}

export default function InvQueryClient({ invQuery }: InvQueryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique categories from investment queries
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(invQuery.map(query => query.query_categories).filter(Boolean)));
    return uniqueCategories.sort();
  }, [invQuery]);

  // Filter investment queries based on selected category and search term
  const filteredQueries = useMemo(() => {
    return invQuery.filter(query => {
      const matchesCategory = selectedCategory === 'all' || query.query_categories === selectedCategory;
      const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [invQuery, selectedCategory, searchTerm]);

  return (
    <div>
      <PageTitle title="Investment Queries" />
    <div className="p-5 max-w-7xl mx-auto">
      
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
            placeholder="Search query titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredQueries.length} of {invQuery.length} queries
      </div>
      
      {filteredQueries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {invQuery.length === 0 ? 'No investment queries available' : 'No queries match your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 center-items">
          {filteredQueries.map((query) => (
            <Link 
              key={query.query_id} 
              href={`/investment-query/${query.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Content */}
              <div className="p-4 group-hover:bg-gray-200 ">
            {/* Query Categories Badge */}
            <div className="flex flex-row justify-center ">
                <span className="inline-block bg-blue-800 text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                                {query.query_categories}
                              </span>
                            </div>

                {/* Title */}
                <div className="flex justify-center items-center">
                  <h3 className="text-sm !text-center font-semibold blue-hyperlink">
                    {query.title}
                  </h3>
                </div>

                
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
