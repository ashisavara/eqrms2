"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SelectInput } from "./FormFields";
import { useForm } from "react-hook-form";
import { useGroupMandate, type Group, type Mandate } from "@/lib/contexts/GroupMandateContext";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Loader2, LogOut } from "lucide-react";
import { logoutFromChangeGroupAction } from '@/app/auth/otp-login/otpServerActions';
import { SearchButton } from "@/components/forms/SearchButton";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';


export function ChangeGroup() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activelySelectedGroup, setActivelySelectedGroup] = useState<Group | null>(null);
  const [userRoles, setUserRoles] = useState<any>(null);
  const {
    currentGroup,
    currentMandate,
    availableGroups,
    availableMandates,
    isLoadingGroups,
    isLoadingMandates,
    isAuthenticated,
    setCurrentGroup,
    setGroupAndMandate,
    loadAvailableGroups,
    loadMandatesForGroup,
  } = useGroupMandate();

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

  // Form control for group selection
  const { control, watch, setValue } = useForm({
    defaultValues: {
      selectedGroupId: currentGroup?.id?.toString() || "",
    }
  });

  const selectedGroupId = watch("selectedGroupId");

  // Load groups when sheet opens (only for internal users)
  useEffect(() => {
    if (isSheetOpen && availableGroups.length === 0 && can(userRoles, 'internal', 'view')) {
      loadAvailableGroups();
    }
  }, [isSheetOpen, availableGroups.length, loadAvailableGroups, userRoles]);

  // Load mandates for external users when sheet opens
  useEffect(() => {
    if (isSheetOpen && !can(userRoles, 'internal', 'view') && currentGroup && availableMandates.length === 0) {
      // Load mandates for external user's default group
      loadMandatesForGroup(currentGroup.id);
    }
  }, [isSheetOpen, userRoles, currentGroup, availableMandates.length]);

  // Update form when current group changes
  useEffect(() => {
    setValue("selectedGroupId", currentGroup?.id?.toString() || "");
  }, [currentGroup?.id, setValue]);

  // Handle group selection change
  useEffect(() => {
    if (selectedGroupId) {
      const groupId = parseInt(selectedGroupId);
      const group = availableGroups.find(g => g.id === groupId);
      if (group && group.id !== currentGroup?.id) {
        setCurrentGroup(group);
        setActivelySelectedGroup(group); // Track actively selected group
      }
    } else if (currentGroup !== null) {
      setCurrentGroup(null);
      setActivelySelectedGroup(null); // Clear actively selected group
    }
  }, [selectedGroupId, availableGroups]); // Removed currentGroup and setCurrentGroup from deps

  // Handle mandate selection
  const handleMandateClick = (mandate: Mandate) => {
    if (currentGroup) {
      setGroupAndMandate(currentGroup, mandate);
      setIsSheetOpen(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutFromChangeGroupAction();
      
      if (result.error) {
        console.error('Logout error:', result.error);
        // Still redirect even if server logout fails
      }
      
      // Redirect to OTP login page after logout
      window.location.href = '/auth/otp-login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/auth/otp-login';
    }
  };

  // Prepare options for dropdown
  const groupOptions = availableGroups.map(group => ({
    value: group.id.toString(),
    label: group.name,
  }));

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // For external users with only 1 mandate, don't show the component
  if (!can(userRoles, 'internal', 'view') && availableMandates.length <= 1) {
    return null;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-sm">
          <Users className="h-4 w-4 mr-2" />
          {currentGroup && currentMandate 
            ? `${currentMandate.name}`
            : "Select Mandate"
          }
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] p-5">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Choose Mandate
            </SheetTitle>
            
          </div>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            </div>
            <div>{ userRoles }</div>
            {can(userRoles, 'internal', 'view') && (
            <div className='text-sm'>
              <SearchButton />
              {can(userRoles, 'crm', 'view_leads') && (<> <a href="/crm" className='blue-hyperlink'> CRM</a> | </>)}
              {can(userRoles, 'rms', 'view_all_funds') && (<> <a href="/funds/all" className='blue-hyperlink'> All Funds</a> | </>)}
              {can(userRoles, 'eqrms', 'view_companies') && (<> <a href="/companies" className='blue-hyperlink'> Val Screen</a> | </>)}
              {can(userRoles, 'rms', 'view_changelog') && (<> <a href="/funds/changelog" className='blue-hyperlink'> ChangeLog</a> | </>)}
            </div>)}

          {/* Current Selection Display */}
          {currentGroup && currentMandate && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {currentGroup.name} - {currentMandate.name}
                </Badge>
              </div>
            </div>
          )}

          {/* Internal Users: Group Selection + Conditional Mandate Selection */}
          {can(userRoles, 'internal', 'view') && (
            <>
              {/* Group Selection */}
              <div className="space-y-3">
                <h4 className="font-semibold">Change Mandate</h4>
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
                    options={groupOptions}
                  />
                )}
              </div>

              {/* Mandate Selection - Only show after group is actively selected from dropdown */}
              {activelySelectedGroup && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Available Mandates for {activelySelectedGroup.name}</h4>
                  {isLoadingMandates ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading mandates...</span>
                    </div>
                  ) : availableMandates.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No mandates available for this group
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableMandates.map((mandate) => (
                        <Button
                          key={mandate.id}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleMandateClick(mandate)}
                        >
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>{mandate.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Instructions for Internal Users */}
              {!activelySelectedGroup && availableGroups.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    👆 Please select a group from the dropdown above to see available investment mandates.
                  </p>
                </div>
              )}
            </>
          )}

          {/* External Users: Direct Mandate Selection */}
          {!can(userRoles, 'internal', 'view') && (
            <div className="space-y-3">
              <h4 className="font-semibold">Available Mandates</h4>
              {isLoadingMandates ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading mandates...</span>
                </div>
              ) : availableMandates.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No mandates available
                </div>
              ) : (
                <div className="space-y-2">
                  {availableMandates.map((mandate) => (
                    <Button
                      key={mandate.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleMandateClick(mandate)}
                    >
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>{mandate.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 