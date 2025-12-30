'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Plus, Trash2 } from 'lucide-react';
import { LoginProfileWithRoles, SearchLoginProfilesRequest, UserRole } from './types';
import { AddRoleSheet } from './AddRoleSheet';
import { DeleteRoleConfirmation } from './DeleteRoleConfirmation';
import { UpdateGroupNameButton } from '@/components/forms/UpdateGroupName';
import { LinkLoginProfileGroupButton } from '@/components/forms/LinkLoginProfileGroup';

interface SearchLoginProfilesProps {
  onResults: (results: LoginProfileWithRoles[]) => void;
}

export function SearchLoginProfiles({ onResults }: SearchLoginProfilesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'name'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search-login-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          searchType,
          limit: 50
        } as SearchLoginProfilesRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search');
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
    setSearchTerm('');
    setShowResults(false);
    onResults([]);
  };

  const formatRoles = (role: string | null) => {
    if (!role || role === 'no_role') return 'No role';
    return role;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${searchType}...`}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={searchType === 'phone' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('phone')}
          >
            Phone
          </Button>
          <Button
            variant={searchType === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('name')}
          >
            Name
          </Button>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading || !searchTerm.trim()}
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
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
    </div>
  );
}

interface SearchResultsTableProps {
  results: LoginProfileWithRoles[];
  onRefresh?: () => void;
}

export function SearchResultsTable({ results, onRefresh }: SearchResultsTableProps) {
  const [addRoleSheet, setAddRoleSheet] = useState<{ isOpen: boolean; profile: LoginProfileWithRoles | null }>({ isOpen: false, profile: null });
  const [deleteRoleSheet, setDeleteRoleSheet] = useState<{ isOpen: boolean; profile: LoginProfileWithRoles | null; role: UserRole | null }>({ isOpen: false, profile: null, role: null });

  const handleAddRole = (profile: LoginProfileWithRoles) => {
    setAddRoleSheet({ isOpen: true, profile });
  };

  const handleDeleteRole = (profile: LoginProfileWithRoles) => {
    if (!profile.user_roles) return;
    setDeleteRoleSheet({ 
      isOpen: true, 
      profile, 
      role: { role_id: 0, role_name: profile.user_roles } 
    });
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {/* ... headers ... */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">CRM Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">RM Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Group ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Group Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((profile) => (
              <tr key={profile.uuid} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{profile.phone_number}</td>
                <td className="px-4 py-3 text-sm">
                  {profile.lead_name || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddRole(profile)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <div className="flex flex-wrap gap-1">
                      {profile.user_roles && profile.user_roles !== 'no_role' && (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {profile.user_roles}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRole(profile)}
                            className="h-4 w-4 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {(!profile.user_roles || profile.user_roles === 'no_role') && (
                        <span className="text-gray-400 italic text-xs">No role</span>
                      )}
                    </div>
                  </div>
                </td>
                {/* ... other cells ... */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  {profile.lead_id || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {profile.crm_lead_name && profile.lead_id ? (
                    <a
                      href={`/crm/${profile.lead_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {profile.crm_lead_name}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {profile.rm_name || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {profile.group_id || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {profile.group_id && profile.group_name ? (
                    <UpdateGroupNameButton 
                      groupId={profile.group_id} 
                      currentGroupName={profile.group_name}
                    >
                      {profile.group_name}
                    </UpdateGroupNameButton>
                  ) : (
                    <LinkLoginProfileGroupButton uuid={profile.uuid} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Role Sheet */}
      {addRoleSheet.profile && (
        <AddRoleSheet
          profile={{
            uuid: addRoleSheet.profile.uuid,
            phone_number: addRoleSheet.profile.phone_number,
            lead_name: addRoleSheet.profile.lead_name,
            created_at: '', // Not needed for this context
            user_roles: addRoleSheet.profile.user_roles || 'no_role'
          }}
          isOpen={addRoleSheet.isOpen}
          onClose={() => setAddRoleSheet({ isOpen: false, profile: null })}
          onSuccess={() => {
            setAddRoleSheet({ isOpen: false, profile: null });
            onRefresh?.();
          }}
        />
      )}

      {/* Delete Role Confirmation Sheet */}
      {deleteRoleSheet.profile && deleteRoleSheet.role && (
        <DeleteRoleConfirmation
          profileUuid={deleteRoleSheet.profile.uuid}
          role={deleteRoleSheet.role}
          isOpen={deleteRoleSheet.isOpen}
          onClose={() => setDeleteRoleSheet({ isOpen: false, profile: null, role: null })}
          onSuccess={() => {
            setDeleteRoleSheet({ isOpen: false, profile: null, role: null });
            onRefresh?.();
          }}
        />
      )}
    </div>
  );

  function formatRoles(role: string | null) {
    if (!role || role === 'no_role') return 'No role';
    return role;
  }
}
