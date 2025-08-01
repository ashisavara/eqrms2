"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { loadUserGroups, loadGroupMandates } from "@/lib/actions/groupMandateActions";
import { loadMandateFavourites, toggleFavouriteServer } from "@/lib/actions/favouriteActions";
import { EntityType, FavouritesData } from "@/types/favourites-detail";

// Constants
const STORAGE_KEY = 'ime_group_mandate_selected';
const GROUP_COOKIE = 'ime_group_id';
const MANDATE_COOKIE = 'ime_mandate_id';
const FAVOURITES_STORAGE_PREFIX = 'ime_mandate_favourites_';

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

// Helper functions for favourites storage
const getFavouritesStorageKey = (mandateId: number | undefined): string => {
  return `${FAVOURITES_STORAGE_PREFIX}${mandateId || 'none'}`;
};

const saveToFavouritesStorage = (mandateId: number, groupId: number, favourites: FavouritesData) => {
  try {
    if (typeof window !== 'undefined' && mandateId) {
      const data = {
        mandateId,
        groupId,
        favourites,
        lastSync: new Date().toISOString()
      };
      const storageKey = getFavouritesStorageKey(mandateId);
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to save favourites to storage:', error);
  }
};

const loadFromFavouritesStorage = (mandateId: number | undefined): FavouritesData => {
  const emptyFavourites: FavouritesData = {
    categories: [],
    funds: [],
    asset_class: [],
    structure: []
  };

  try {
    if (typeof window !== 'undefined' && mandateId) {
      const storageKey = getFavouritesStorageKey(mandateId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.favourites && data.mandateId === mandateId) {
          return data.favourites;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load favourites from localStorage:', error);
  }
  return emptyFavourites;
};

const clearFavouritesStorage = (mandateId: number | undefined) => {
  try {
    if (typeof window !== 'undefined' && mandateId) {
      const storageKey = getFavouritesStorageKey(mandateId);
      localStorage.removeItem(storageKey);
    }
  } catch (error) {
    console.warn('Failed to clear favourites from storage:', error);
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
  isLoadingFavourites: boolean;
  
  // Favourites
  favourites: FavouritesData;
  
  // Actions
  setCurrentGroup: (group: Group | null) => void;
  setCurrentMandate: (mandate: Mandate | null) => void;
  setGroupAndMandate: (group: Group, mandate: Mandate) => void;
  loadAvailableGroups: () => Promise<void>;
  loadMandatesForGroup: (groupId: number) => Promise<void>;
  
  // Favourites actions
  toggleFavourite: (entityType: EntityType, entityId: number) => Promise<void>;
  isFavourite: (entityType: EntityType, entityId: number) => boolean;
  loadFavourites: () => Promise<void>;
  
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
  
  // Favourites state
  const [favourites, setFavourites] = useState<FavouritesData>({
    categories: [],
    funds: [],
    asset_class: [],
    structure: []
  });
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false);

  // Restore saved selection from localStorage on mount
  useEffect(() => {
    const savedSelection = loadFromStorage();
    if (savedSelection) {
      setCurrentGroup(savedSelection.group);
      setCurrentMandate(savedSelection.mandate);
      console.log('Restored saved selection:', savedSelection);
      
      // Load favourites for the restored mandate
      const savedFavourites = loadFromFavouritesStorage(savedSelection.mandate.id);
      setFavourites(savedFavourites);
    }
  }, []);

  // Tab synchronization - listen for favourites changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(FAVOURITES_STORAGE_PREFIX) && currentMandate) {
        const expectedKey = getFavouritesStorageKey(currentMandate.id);
        if (e.key === expectedKey && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.favourites && data.mandateId === currentMandate.id) {
              setFavourites(data.favourites);
              console.log('Synced favourites from another tab');
            }
          } catch (error) {
            console.warn('Failed to sync favourites from another tab:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentMandate?.id]);

  // Actions - memoized to prevent infinite re-renders
  const setGroupAndMandate = useCallback((group: Group, mandate: Mandate) => {
    // Clear existing favourites
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear old favourites storage
    if (currentMandate) {
      clearFavouritesStorage(currentMandate.id);
    }
    
    setCurrentGroup(group);
    setCurrentMandate(mandate);
    
    // Save to localStorage for persistence
    saveToStorage(group, mandate);
    
    // Load favourites for new mandate (async - don't block)
    loadMandateFavourites().then((newFavourites) => {
      setFavourites(newFavourites);
      saveToFavouritesStorage(mandate.id, group.id, newFavourites);
    }).catch((error) => {
      console.error('Failed to load favourites for new mandate:', error);
    });
    
    // Toast success message and reload page
    toast.success(`Group: ${group.name} | Mandate: ${mandate.name} set successfully!`);
    
    // Reload page to refresh all data
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Small delay to show toast
  }, [currentMandate]);

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

  // Favourites functions
  const loadFavourites = useCallback(async (): Promise<void> => {
    if (!currentMandate) return;
    
    setIsLoadingFavourites(true);
    try {
      const newFavourites = await loadMandateFavourites();
      setFavourites(newFavourites);
      
      // Save to localStorage
      if (currentGroup) {
        saveToFavouritesStorage(currentMandate.id, currentGroup.id, newFavourites);
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
      toast.error("Error loading favourites. Please try again.");
    } finally {
      setIsLoadingFavourites(false);
    }
  }, [currentMandate, currentGroup]);

  const isFavourite = useCallback((entityType: EntityType, entityId: number): boolean => {
    return favourites[entityType]?.includes(entityId) || false;
  }, [favourites]);

  const toggleFavourite = useCallback(async (entityType: EntityType, entityId: number): Promise<void> => {
    if (!currentMandate || !currentGroup) {
      toast.error("Please select a group and mandate first");
      return;
    }

    const wasAlreadyFavourite = isFavourite(entityType, entityId);
    
    // Optimistic update - immediately update UI
    const updateLocalFavourites = (shouldAdd: boolean) => {
      setFavourites(prev => {
        const newFavourites = { ...prev };
        if (shouldAdd) {
          // Add to favourites
          newFavourites[entityType] = [...prev[entityType], entityId];
        } else {
          // Remove from favourites
          newFavourites[entityType] = prev[entityType].filter(id => id !== entityId);
        }
        
        // Save to localStorage
        saveToFavouritesStorage(currentMandate.id, currentGroup.id, newFavourites);
        return newFavourites;
      });
    };

    // Apply optimistic update
    updateLocalFavourites(!wasAlreadyFavourite);

    try {
      // Sync to server
      await toggleFavouriteServer(entityType, entityId, wasAlreadyFavourite);
    } catch (error) {
      // Rollback on failure
      updateLocalFavourites(wasAlreadyFavourite);
      console.error(`Error toggling favourite ${entityType}:`, error);
      toast.error("Failed to update favourite");
    }
  }, [currentMandate, currentGroup, isFavourite]);

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
    // Clear favourites storage for current mandate
    if (currentMandate) {
      clearFavouritesStorage(currentMandate.id);
    }
    
    setCurrentGroup(null);
    setCurrentMandate(null);
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear localStorage
    clearStorage();
  }, [currentMandate]);

  const resetContext = useCallback(() => {
    // Clear favourites storage for current mandate
    if (currentMandate) {
      clearFavouritesStorage(currentMandate.id);
    }
    
    setCurrentGroup(null);
    setCurrentMandate(null);
    setAvailableGroups([]);
    setAvailableMandates([]);
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear localStorage
    clearStorage();
  }, [currentMandate]);

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
    isLoadingFavourites,
    
    // Favourites
    favourites,
    
    // Actions
    setCurrentGroup: handleSetCurrentGroup,
    setCurrentMandate,
    setGroupAndMandate,
    loadAvailableGroups,
    loadMandatesForGroup,
    
    // Favourites actions
    toggleFavourite,
    isFavourite,
    loadFavourites,
    
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