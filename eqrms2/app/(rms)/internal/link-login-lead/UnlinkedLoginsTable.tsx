'use client';

import { useState } from 'react';
import { Plus, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { LoginProfile, SearchLeadResult } from './types';
import { SearchResultsSheet } from './SearchResultsSheet';

// Table component for managing unlinked logins

interface UnlinkedLoginsTableProps {
  data: LoginProfile[];
  onRefresh: () => void;
}

interface UpdateNameSheetProps {
  loginProfile: LoginProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit';
}

function UpdateNameSheet({ loginProfile, isOpen, onClose, onSuccess, mode }: UpdateNameSheetProps) {
  const [leadName, setLeadName] = useState(loginProfile.lead_name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/update-login-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_uuid: loginProfile.uuid,
          lead_name: leadName.trim()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update name');
      }

      toast.success(mode === 'add' ? 'Lead name added successfully!' : 'Lead name updated successfully!');
      onSuccess();
      onClose();
      setLeadName('');
    } catch (error) {
      console.error('Error updating lead name:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="!w-400px !max-w-[90vw]">
        <SheetHeader>
          <SheetTitle>{mode === 'add' ? 'Add Lead Name' : 'Edit Lead Name'}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            Phone: <span className="font-medium">{loginProfile.phone_number}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lead Name</label>
              <Input
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Enter lead name from WhatsApp"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !leadName.trim()}>
                {isLoading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Name' : 'Update Name')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function UnlinkedLoginsTable({ data, onRefresh }: UnlinkedLoginsTableProps) {
  const [updateNameSheet, setUpdateNameSheet] = useState<{
    isOpen: boolean;
    loginProfile: LoginProfile | null;
    mode: 'add' | 'edit';
  }>({ isOpen: false, loginProfile: null, mode: 'add' });

  const [searchSheet, setSearchSheet] = useState<{
    isOpen: boolean;
    loginProfile: LoginProfile | null;
    searchResults: SearchLeadResult[];
    isLoading: boolean;
    fallback?: boolean;
    fallbackMessage?: string;
  }>({ isOpen: false, loginProfile: null, searchResults: [], isLoading: false, fallback: false });

  const handleUpdateName = (loginProfile: LoginProfile, mode: 'add' | 'edit') => {
    setUpdateNameSheet({ isOpen: true, loginProfile, mode });
  };

  const handleSearch = async (loginProfile: LoginProfile) => {
    if (!loginProfile.lead_name) {
      toast.error('Please update the lead name first');
      return;
    }

    setSearchSheet(prev => ({ 
      ...prev, 
      isOpen: true, 
      loginProfile, 
      isLoading: true,
      searchResults: []
    }));

    try {
      const searchParams = {
        phone: loginProfile.phone_number,
        name: loginProfile.lead_name,
        limit: 10
      };
      
      const response = await fetch('/api/search-leads-for-linking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search leads');
      }

      const result = await response.json();
      
      setSearchSheet(prev => ({ 
        ...prev, 
        searchResults: result.data || [],
        isLoading: false,
        fallback: result.fallback || false,
        fallbackMessage: result.message || result.error
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to search leads');
      setSearchSheet(prev => ({ ...prev, isLoading: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Unlinked Login Profiles</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">RM Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Affiliate</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No unlinked login profiles found
                </td>
              </tr>
            ) : (
              data.map((loginProfile) => (
                <tr key={loginProfile.uuid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{loginProfile.phone_number}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {loginProfile.lead_name || (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                      <div className="flex items-center gap-1">
                        {!loginProfile.lead_name ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateName(loginProfile, 'add')}
                            className="h-6 w-6 p-0"
                            title="Add lead name"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateName(loginProfile, 'edit')}
                            className="h-6 w-6 p-0"
                            title="Edit lead name"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{loginProfile.user_role_name || ''}</td>
                  <td className="px-4 py-3 text-sm">{loginProfile.rm_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(loginProfile.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">{loginProfile.affiliate_lead_id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      size="sm"
                      onClick={() => handleSearch(loginProfile)}
                      disabled={!loginProfile.lead_name}
                      className="flex items-center gap-1"
                    >
                      <Search className="h-3 w-3" />
                      Search Leads
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Name Sheet */}
      {updateNameSheet.loginProfile && (
        <UpdateNameSheet
          loginProfile={updateNameSheet.loginProfile}
          isOpen={updateNameSheet.isOpen}
          onClose={() => setUpdateNameSheet({ isOpen: false, loginProfile: null, mode: 'add' })}
          onSuccess={onRefresh}
          mode={updateNameSheet.mode}
        />
      )}

      {/* Search Results Sheet */}
      {searchSheet.loginProfile && (
        <SearchResultsSheet
          loginProfile={searchSheet.loginProfile}
          searchResults={searchSheet.searchResults}
          isLoading={searchSheet.isLoading}
          isOpen={searchSheet.isOpen}
          onClose={() => setSearchSheet({ isOpen: false, loginProfile: null, searchResults: [], isLoading: false, fallback: false })}
          onSuccess={onRefresh}
          fallback={searchSheet.fallback}
          fallbackMessage={searchSheet.fallbackMessage}
        />
      )}
    </div>
  );
}
