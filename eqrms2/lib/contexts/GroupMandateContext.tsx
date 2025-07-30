"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { loadUserGroups, loadGroupMandates } from "@/lib/actions/groupMandateActions";

// Constants
const STORAGE_KEY = 'ime_group_mandate_selected';
const GROUP_COOKIE = 'ime_group_id';
const MANDATE_COOKIE = 'ime_mandate_id';

// Helper functions for localStorage + cookies
const saveToStorage = (group: Group, mandate: Mandate) => {
  try {
    if (typeof window !== 'undefined') {
      // Save to localStorage (for fast client access)
      const data = { group, mandate, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Save to cookies (for server access)
      const cookieOptions = 'path=/; max-age=31536000; SameSite=Lax'; // 1 year expiry
      document.cookie = `${GROUP_COOKIE}=${group.id}; ${cookieOptions}`;
      document.cookie = `${MANDATE_COOKIE}=${mandate.id}; ${cookieOptions}`;
    }
  } catch (error) {
    console.warn('Failed to save group/mandate to storage:', error);
  }
};

const loadFromStorage = (): { group: Group; mandate: Mandate } | null => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Validate the data structure
        if (data.group?.id && data.group?.name && data.mandate?.id && data.mandate?.name) {
          return { group: data.group, mandate: data.mandate };
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load group/mandate from localStorage:', error);
  }
  return null;
};

const clearStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear cookies by setting them to expire
      document.cookie = `${GROUP_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${MANDATE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  } catch (error) {
    console.warn('Failed to clear group/mandate from storage:', error);
  }
};

// Types
export type Group = {
  id: number;
  name: string;
};

export type Mandate = {
  id: number;
  name: string;
};

export type GroupMandateContextType = {
  // Current selections
  currentGroup: Group | null;
  currentMandate: Mandate | null;
  
  // Available options
  availableGroups: Group[];
  availableMandates: Mandate[];
  
  // Loading states
  isLoadingGroups: boolean;
  isLoadingMandates: boolean;
  
  // Actions
  setCurrentGroup: (group: Group | null) => void;
  setCurrentMandate: (mandate: Mandate | null) => void;
  setGroupAndMandate: (group: Group, mandate: Mandate) => void;
  loadAvailableGroups: () => Promise<void>;
  loadMandatesForGroup: (groupId: number) => Promise<void>;
  
  // Reset functions
  resetContext: () => void;
  clearSelection: () => void;
};

// Create context
const GroupMandateContext = createContext<GroupMandateContextType | undefined>(undefined);

// Hook to use the context
export function useGroupMandate() {
  const context = useContext(GroupMandateContext);
  if (context === undefined) {
    throw new Error('useGroupMandate must be used within a GroupMandateProvider');
  }
  return context;
}

// Provider component
export function GroupMandateProvider({ children }: { children: ReactNode }) {
  // State
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentMandate, setCurrentMandate] = useState<Mandate | null>(null);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [availableMandates, setAvailableMandates] = useState<Mandate[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMandates, setIsLoadingMandates] = useState(false);

  // Restore saved selection from localStorage on mount
  useEffect(() => {
    const savedSelection = loadFromStorage();
    if (savedSelection) {
      setCurrentGroup(savedSelection.group);
      setCurrentMandate(savedSelection.mandate);
      console.log('Restored saved selection:', savedSelection);
    }
  }, []);

  // Actions - memoized to prevent infinite re-renders
  const setGroupAndMandate = useCallback((group: Group, mandate: Mandate) => {
    setCurrentGroup(group);
    setCurrentMandate(mandate);
    
    // Save to localStorage for persistence
    saveToStorage(group, mandate);
    
    // Toast success message and reload page
    toast.success(`Group: ${group.name} | Mandate: ${mandate.name} set successfully!`);
    
    // Reload page to refresh all data
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Small delay to show toast
  }, []);

  // Real Supabase data loading - RLS handles access control
  const loadAvailableGroups = useCallback(async (): Promise<void> => {
    setIsLoadingGroups(true);
    try {
      const groups = await loadUserGroups();
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error("Error loading groups. Please try again.");
      setAvailableGroups([]); // Set empty array on error
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  const loadMandatesForGroup = useCallback(async (groupId: number): Promise<void> => {
    setIsLoadingMandates(true);
    try {
      const mandates = await loadGroupMandates(groupId);
      setAvailableMandates(mandates);
    } catch (error) {
      console.error('Error loading mandates for group:', groupId, error);
      toast.error("Error loading mandates. Please try again.");
      setAvailableMandates([]); // Set empty array on error
    } finally {
      setIsLoadingMandates(false);
    }
  }, []);

  const handleSetCurrentGroup = useCallback((group: Group | null) => {
    setCurrentGroup(group);
    // Clear mandate when group changes
    setCurrentMandate(null);
    setAvailableMandates([]);
    
    // Load mandates for new group
    if (group) {
      loadMandatesForGroup(group.id);
    }
  }, [loadMandatesForGroup]);

  const clearSelection = useCallback(() => {
    setCurrentGroup(null);
    setCurrentMandate(null);
    
    // Clear localStorage
    clearStorage();
  }, []);

  const resetContext = useCallback(() => {
    setCurrentGroup(null);
    setCurrentMandate(null);
    setAvailableGroups([]);
    setAvailableMandates([]);
    
    // Clear localStorage
    clearStorage();
  }, []);

  const value: GroupMandateContextType = {
    // Current selections
    currentGroup,
    currentMandate,
    
    // Available options
    availableGroups,
    availableMandates,
    
    // Loading states
    isLoadingGroups,
    isLoadingMandates,
    
    // Actions
    setCurrentGroup: handleSetCurrentGroup,
    setCurrentMandate,
    setGroupAndMandate,
    loadAvailableGroups,
    loadMandatesForGroup,
    
    // Reset functions
    resetContext,
    clearSelection,
  };

  return (
    <GroupMandateContext.Provider value={value}>
      {children}
    </GroupMandateContext.Provider>
  );
} 