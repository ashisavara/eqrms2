"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SelectInput } from "./FormFields";
import { useForm } from "react-hook-form";
import { useGroupMandate, type Group, type Mandate } from "@/lib/contexts/GroupMandateContext";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Loader2 } from "lucide-react";

export function ChangeGroup() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {
    currentGroup,
    currentMandate,
    availableGroups,
    availableMandates,
    isLoadingGroups,
    isLoadingMandates,
    setCurrentGroup,
    setGroupAndMandate,
    loadAvailableGroups,
  } = useGroupMandate();

  // Form control for group selection
  const { control, watch, setValue } = useForm({
    defaultValues: {
      selectedGroupId: currentGroup?.id?.toString() || "",
    }
  });

  const selectedGroupId = watch("selectedGroupId");

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

  // Handle group selection change
  useEffect(() => {
    if (selectedGroupId) {
      const groupId = parseInt(selectedGroupId);
      const group = availableGroups.find(g => g.id === groupId);
      if (group && group.id !== currentGroup?.id) {
        setCurrentGroup(group);
      }
    } else if (currentGroup !== null) {
      setCurrentGroup(null);
    }
  }, [selectedGroupId, availableGroups]); // Removed currentGroup and setCurrentGroup from deps

  // Handle mandate selection
  const handleMandateClick = (mandate: Mandate) => {
    if (currentGroup) {
      setGroupAndMandate(currentGroup, mandate);
      setIsSheetOpen(false);
    }
  };

  // Prepare options for dropdown
  const groupOptions = availableGroups.map(group => ({
    value: group.id.toString(),
    label: group.name,
  }));

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-sm">
          <Users className="h-4 w-4 mr-2" />
          {currentGroup && currentMandate 
            ? `${currentGroup.name} | ${currentMandate.name}`
            : "Select Group & Mandate"
          }
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Change Group & Investment Mandate
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Current Selection Display */}
          {currentGroup && currentMandate && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Current Selection:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {currentGroup.name}
                </Badge>
                <Badge variant="secondary">
                  <Target className="h-3 w-3 mr-1" />
                  {currentMandate.name}
                </Badge>
              </div>
            </div>
          )}

          {/* Group Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">1. Select Group</h3>
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

          {/* Mandate Selection */}
          {currentGroup && (
            <div className="space-y-3">
              <h3 className="font-semibold">2. Select Investment Mandate</h3>
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

          {/* Instructions */}
          {!currentGroup && availableGroups.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                👆 Please select a group first to see available investment mandates.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 