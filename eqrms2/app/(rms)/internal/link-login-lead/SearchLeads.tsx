'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

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

interface SearchLeadsProps {
  onResults: (results: LeadSearchResult[]) => void;
}

export function SearchLeads({ onResults }: SearchLeadsProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    // At least one field must be filled
    if (!phoneNumber.trim() && !leadName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/search-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber.trim() || null,
          name: leadName.trim() || null,
          limit: 50
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search leads');
      }

      const result = await response.json();
      onResults(result.data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPhoneNumber('');
    setLeadName('');
    setShowResults(false);
    onResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number..."
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Name
          </label>
          <Input
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            placeholder="Enter lead name..."
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          disabled={isLoading || (!phoneNumber.trim() && !leadName.trim())}
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search Leads'}
        </Button>

        {showResults && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p>Search by phone number, lead name, or both. At least one field is required.</p>
      </div>
    </div>
  );
}

interface SearchResultsTableProps {
  results: LeadSearchResult[];
  onRefresh?: () => void;
}

export function SearchLeadsResultsTable({ results, onRefresh }: SearchResultsTableProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Progression</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Source</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Login Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">RM Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((lead, index) => (
              <tr key={`${lead.lead_id}-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-600">
                  <a
                    href={`/crm/${lead.lead_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {lead.lead_id}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.lead_name || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.lead_progression || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.lead_source || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-mono">
                  {lead.phone_e164 || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.login_name || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.rm_name || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.name_score !== null ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {(lead.name_score * 100).toFixed(1)}%
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {lead.phone_exact ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Exact Match
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
