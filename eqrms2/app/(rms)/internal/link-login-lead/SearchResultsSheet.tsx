'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast, Toaster } from 'sonner';
import { LoginProfile, SearchLeadResult } from './types';

interface SearchResultsSheetProps {
  loginProfile: LoginProfile;
  searchResults: SearchLeadResult[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fallback?: boolean;
  fallbackMessage?: string;
}

interface ConfirmLinkProps {
  loginProfile: LoginProfile;
  selectedLead: SearchLeadResult;
  onConfirm: () => void;
  onCancel: () => void;
  isLinking: boolean;
}

function ConfirmLink({ loginProfile, selectedLead, onConfirm, onCancel, isLinking }: ConfirmLinkProps) {
  return (
    <div className="border rounded-lg p-4 bg-red-50 border-red-200">
      <h3 className="font-medium text-red-800 mb-3">Confirm Link</h3>
      <div className="space-y-2 text-sm text-red-700 mb-4">
        <p><strong>Login:</strong> {loginProfile.lead_name} ({loginProfile.phone_number})</p>
        <p><strong>Lead:</strong> {selectedLead.lead_name} ({selectedLead.phone_e164})</p>
        <p className="text-red-600">This action cannot be undone. Are you sure you want to link these?</p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onConfirm} 
          disabled={isLinking}
          className="bg-red-600 hover:bg-red-700"
        >
          {isLinking ? 'Linking...' : 'Yes, Link Them'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isLinking}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function SearchResultsSheet({ 
  loginProfile, 
  searchResults, 
  isLoading, 
  isOpen, 
  onClose, 
  onSuccess,
  fallback = false,
  fallbackMessage
}: SearchResultsSheetProps) {
  const [confirmLink, setConfirmLink] = useState<{
    show: boolean;
    selectedLead: SearchLeadResult | null;
  }>({ show: false, selectedLead: null });
  const [isLinking, setIsLinking] = useState(false);

  const handleLeadClick = (lead: SearchLeadResult) => {
    setConfirmLink({ show: true, selectedLead: lead });
  };

  const handleConfirmLink = async () => {
    if (!confirmLink.selectedLead) return;

    setIsLinking(true);
    try {
      const response = await fetch('/api/link-login-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_uuid: loginProfile.uuid,
          lead_id: confirmLink.selectedLead.lead_id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to link login to lead');
      }

      toast.success('Successfully linked login to lead!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error linking login to lead:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to link login to lead');
    } finally {
      setIsLinking(false);
      setConfirmLink({ show: false, selectedLead: null });
    }
  };

  const handleCancelLink = () => {
    setConfirmLink({ show: false, selectedLead: null });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="!w-[900px] !max-w-[90vw] p-6">
        <Toaster position="top-center" />
        <SheetHeader>
          <SheetTitle>Search Results for {loginProfile.lead_name}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="text-sm text-gray-600">
            <p>Searching for matches with:</p>
            <p><strong>Phone:</strong> {loginProfile.phone_number}</p>
            <p><strong>Name:</strong> {loginProfile.lead_name}</p>
          </div>

          {confirmLink.show && confirmLink.selectedLead && (
            <ConfirmLink
              loginProfile={loginProfile}
              selectedLead={confirmLink.selectedLead}
              onConfirm={handleConfirmLink}
              onCancel={handleCancelLink}
              isLinking={isLinking}
            />
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Searching for matching leads...</p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No matching leads found.</p>
              <p className="text-sm mt-1">Try adjusting the search criteria or create a new lead.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">Found {searchResults.length} potential matches:</h3>
              {fallback && (
                <div className="text-xs text-red-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                  ⚠️ {fallbackMessage || 'Using fallback search for pg_trgm'}
                </div>
              )}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-900">Lead Name</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-900">Phone</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-900">Primary RM</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-900">Match Reason</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-900">Match Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {searchResults.map((lead) => (
                      <tr key={lead.lead_id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleLeadClick(lead)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                            disabled={confirmLink.show}
                          >
                            {lead.lead_name}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {lead.phone_e164}
                            {lead.phone_exact && (
                              <Badge variant="secondary" className="text-xs">
                                Exact
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {lead.rm_name || 'Not assigned'}
                        </td>
                        <td className="px-3 py-2">
                          {lead.match_reason && (
                            <Badge 
                              variant={lead.match_reason.includes('Exact') ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {lead.match_reason}
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {lead.name_score && (
                              <Badge 
                                variant={lead.name_score > 0.7 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {Math.round(lead.name_score * 100)}%
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click on a lead name to link it to this login profile.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
