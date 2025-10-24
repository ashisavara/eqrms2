'use client';

import { useState } from 'react';
import { SearchLeads, SearchLeadsResultsTable } from './SearchLeads';

interface LeadSearchResult {
  lead_id: string;
  lead_name: string;
  lead_progression: string;
  lead_source: string;
  phone_e164: string;
  login_name: string;
  rm_name: string;
  name_score: number | null;
  phone_exact: boolean;
}

export function SearchLeadsClient() {
  const [searchResults, setSearchResults] = useState<LeadSearchResult[]>([]);

  const handleResults = (results: LeadSearchResult[]) => {
    setSearchResults(results);
  };

  const handleRefresh = () => {
    // Re-run the last search to refresh results
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Search Leads</h2>
        <p className="text-sm text-gray-600 mb-4">
          Search the leads database by phone number or lead name. This search uses similarity matching 
          and requires inv_desk role permissions.
        </p>
        <SearchLeads onResults={handleResults} />
      </div>
      
      {searchResults.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <SearchLeadsResultsTable results={searchResults} onRefresh={handleRefresh} />
        </div>
      )}
    </div>
  );
}
