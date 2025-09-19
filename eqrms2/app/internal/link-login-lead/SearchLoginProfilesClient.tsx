'use client';

import { useState } from 'react';
import { SearchLoginProfiles, SearchResultsTable } from './SearchLoginProfiles';
import { LoginProfileWithRoles } from './types';

export function SearchLoginProfilesClient() {
  const [searchResults, setSearchResults] = useState<LoginProfileWithRoles[]>([]);

  const handleResults = (results: LoginProfileWithRoles[]) => {
    setSearchResults(results);
  };

  const handleRefresh = () => {
    // Re-run the last search to refresh results
    // This is a simple approach - in a real app you might want to store the last search params
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Search Login Profiles</h2>
        <SearchLoginProfiles onResults={handleResults} />
      </div>
      
      {searchResults.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <SearchResultsTable results={searchResults} onRefresh={handleRefresh} />
        </div>
      )}
    </div>
  );
}
