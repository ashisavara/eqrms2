"use client";

import { useState, useEffect } from 'react';
import { useGroupMandate, type Group } from "@/lib/contexts/GroupMandateContext";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SelectInput } from "@/components/forms/FormFields";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Check } from "lucide-react";
import { SearchButton } from '../forms/SearchButton';
import { getCrmLeadDataForCurrentUser } from '@/lib/supabase/serverQueryHelper';

export function ChangeGroupHandler() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<any>(null);
  
  const {
    currentGroup,
    availableGroups,
    isLoadingGroups,
    isAuthenticated,
    setGroup,
    loadAvailableGroups,
  } = useGroupMandate();

  // Form control for group selection
  const { control, watch, setValue } = useForm({
    defaultValues: {
      selectedGroupId: currentGroup?.id?.toString() || "",
    }
  });

  const selectedGroupId = watch("selectedGroupId");

  // Load user roles when component mounts
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        const roles = await getUserRoles();
        setUserRoles(roles);
      } catch (error) {
        console.error('Error loading user roles:', error);
      }
    };
    
    if (isAuthenticated) {
      loadUserRoles();
    }
  }, [isAuthenticated]);

  // Load groups when sheet opens
  useEffect(() => {
    if (isSheetOpen && availableGroups.length === 0) {
      loadAvailableGroups();
    }
  }, [isSheetOpen, availableGroups.length, loadAvailableGroups]);

  // Update form when current group changes
  useEffect(() => {
    setValue("selectedGroupId", currentGroup?.id?.toString() || "");
  }, [currentGroup?.id, setValue]);

  // Handle group selection change from dropdown
  useEffect(() => {
    if (selectedGroupId) {
      const groupId = parseInt(selectedGroupId);
      const group = availableGroups.find(g => g.id === groupId);
      if (group && group.id !== currentGroup?.id) {
        // Selected a different group - update context
        setGroup(group);
        setIsSheetOpen(false);
      }
    }
  }, [selectedGroupId, availableGroups, currentGroup, setGroup]);

  // Get CRM lead_id for affiliate link using current user's UUID
  const [crmLeadId, setCrmLeadId] = useState<any>(null);
  const [isLoadingCrmData, setIsLoadingCrmData] = useState(false);

  useEffect(() => {
    const fetchCrmData = async () => {
      setIsLoadingCrmData(true);
      
      try {
        const result = await getCrmLeadDataForCurrentUser();
        
        if (result.success) {
          setCrmLeadId(result.data);
        } else {
          setCrmLeadId(null);
        }
        
      } catch (error) {
        setCrmLeadId(null);
      } finally {
        setIsLoadingCrmData(false);
      }
    };

    if (isAuthenticated) {
      fetchCrmData();
    }
  }, [isAuthenticated]);

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button onClick={() => setIsSheetOpen(true)} className="w-full text-left text-xs">
        {currentGroup ? currentGroup.name : "Select Group"}
      </button>

      {/* Sheet */}
      {isSheetOpen && (
        <Sheet open={true} onOpenChange={() => setIsSheetOpen(false)}>
          <SheetContent className="w-[400px] sm:w-[540px] p-5">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Choose Group
                </SheetTitle>
              </div>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Current Selection Display */}
              {currentGroup && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {currentGroup.name}
                    </Badge>
                  </div>
                </div>
              )}
               <div>
                 {crmLeadId ? (
                   <p className="text-xs bg-gray-50 p-2 rounded-md">
                     {crmLeadId?.crm_lead_name} Aff Link:<span className="font-semibold"> rms.imecapital.in/?rf={crmLeadId?.lead_id}</span>
                   </p>
                 ) : (
                   <Badge variant="outline">
                     {isLoadingCrmData ? 'Loading...' : 'No CRM data'}
                   </Badge>
                 )}
               </div>

            <div className='text-sm'>
              <SearchButton />
              {can(userRoles, 'crm', 'view_leads') && (<> <a href="/crm" className='blue-hyperlink'> CRM</a> | </>)}
              {can(userRoles, 'rms', 'view_all_funds') && (<> <a href="/funds/all" className='blue-hyperlink'> All Funds</a> | </>)}
              {can(userRoles, 'eqrms', 'view_companies') && (<> <a href="/companies" className='blue-hyperlink'> Val Screen</a> | </>)}
              {can(userRoles, 'internal', 'view') && (<> <a href="/tickets" className='blue-hyperlink'> Tickets</a> | </>)}
              {can(userRoles, 'internal', 'view') && (<> <a href="/internal/documents" className='blue-hyperlink'> Documents</a> | </>)}
              {can(userRoles, 'internal', 'view') && (<> <a href="/ime-view" className='blue-hyperlink'> IME View</a> | </>)}
              {can(userRoles, 'internal', 'link_login_lead') && (<> <a href="/internal/link-login-lead" className='blue-hyperlink'> Link Login to Lead</a> | </>)}
              {can(userRoles, 'internal', 'link_login_lead') && (<> <a href="/internal/public-site" className='blue-hyperlink'> Site Edit</a> | </>)}

            </div>

            {/* Group Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold">Change Group</h4>
              {isLoadingGroups ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading groups...</span>
                </div>
              ) : availableGroups.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No Groups Associated
                </div>
              ) : (
                <SelectInput
                  name="selectedGroupId"
                  label="Group"
                  control={control}
                  options={availableGroups.map(group => ({
                    value: group.id.toString(),
                    label: group.name,
                  }))}
                />
              )}
            </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
