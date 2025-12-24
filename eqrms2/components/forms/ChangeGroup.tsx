"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SelectInput } from "./FormFields";
import { useForm } from "react-hook-form";
import { useGroupMandate, type Group } from "@/lib/contexts/GroupMandateContext";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, LogOut, Check } from "lucide-react";
import { logoutFromChangeGroupAction } from '@/app/(rms)/app/otpServerActions';
import { SearchButton } from "@/components/forms/SearchButton";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';

export function ChangeGroup() {
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

  // Update form when current group changes
  useEffect(() => {
    setValue("selectedGroupId", currentGroup?.id?.toString() || "");
  }, [currentGroup?.id, setValue]);

  // Handle group selection
  const handleGroupSelect = (group: Group) => {
    setGroup(group);
    setIsSheetOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutFromChangeGroupAction();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Transform groups for SelectInput
  const groupOptions = availableGroups.map(group => ({
    value: group.id.toString(),
    label: group.name
  }));

  // Check if user is internal
  const isInternalUser = can(userRoles, 'internal', 'view');

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          {currentGroup ? currentGroup.name : "Select Group"}
        </Button>
      </SheetTrigger>
      <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
        <SheetHeader>
          <SheetTitle>Select Group</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Group Display */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-2">Current Group:</div>
            {currentGroup ? (
              <Badge variant="default" className="text-sm bg-blue-100 text-blue-800">
                <Users className="h-4 w-4 mr-2" />
                {currentGroup.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-sm text-gray-500">
                No Group Selected
              </Badge>
            )}
          </div>

          {/* Group Selection - Only for Internal Users */}
          {isInternalUser && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700">Select a Group:</div>
              
              {isLoadingGroups ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading groups...</span>
                </div>
              ) : availableGroups.length > 0 ? (
                <div className="space-y-2">
                  {availableGroups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => handleGroupSelect(group)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        currentGroup?.id === group.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{group.name}</span>
                        </div>
                        {currentGroup?.id === group.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No groups available
                </div>
              )}
            </div>
          )}

          {/* External User Message */}
          {!isInternalUser && (
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              You are viewing: <strong>{currentGroup?.name || 'No Group'}</strong>
            </div>
          )}

          {/* Search Button - Only for Internal Users */}
          {isInternalUser && (
            <div className="pt-4 border-t">
              <SearchButton />
            </div>
          )}

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
