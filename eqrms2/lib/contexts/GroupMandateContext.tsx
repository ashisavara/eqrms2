// Main File for dealing with group selection, saving to cookies and local storage
// Uses groupMandateServerActions to check initial auth state, get current user
// Uses groupMandateActions to load user groups
// Uses favouriteActions to load favourite data, toggle favourite
// Uses serverGroupMandate to get current group from cookies

"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { loadUserGroups } from "@/lib/actions/groupMandateActions";
import { loadGroupFavourites, toggleFavouriteServer } from "@/lib/actions/favouriteActions";
import { EntityType, FavouritesData } from "@/types/favourites-detail";
import { checkInitialAuthAction, getCurrentUserAction } from './groupMandateServerActions';
import { getJWTGroupMandate } from "@/lib/auth/getUserRoles";

// Constants
const STORAGE_KEY = 'ime_group_selected';
const GROUP_COOKIE = 'ime_group_id';
const FAVOURITES_STORAGE_PREFIX = 'ime_group_favourites_';

// Helper functions for localStorage + cookies
const saveToStorage = (group: Group) => {
  try {
    if (typeof window !== 'undefined') {
      // Save to localStorage (for fast client access)
      const data = { group, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Save to cookies (for server access)
      const cookieOptions = 'path=/; max-age=31536000; SameSite=Lax'; // 1 year expiry
      document.cookie = `${GROUP_COOKIE}=${group.id}; ${cookieOptions}`;
    }
  } catch (error) {
    console.warn('Failed to save group to storage:', error);
  }
};

const loadFromStorage = (): Group | null => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Validate the data structure
        if (data.group?.id && data.group?.name) {
          return data.group;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load group from localStorage:', error);
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
    }
  } catch (error) {
    console.warn('Failed to clear group from storage:', error);
  }
};

// Helper functions for favourites storage
const getFavouritesStorageKey = (groupId: number | undefined): string => {
  return `${FAVOURITES_STORAGE_PREFIX}${groupId || 'none'}`;
};

const saveToFavouritesStorage = (groupId: number, favourites: FavouritesData) => {
  try {
    if (typeof window !== 'undefined' && groupId) {
      const data = {
        groupId,
        favourites,
        lastSync: new Date().toISOString()
      };
      const storageKey = getFavouritesStorageKey(groupId);
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to save favourites to storage:', error);
  }
};

const loadFromFavouritesStorage = (groupId: number | undefined): FavouritesData => {
  const emptyFavourites: FavouritesData = {
    categories: [],
    funds: [],
    asset_class: [],
    structure: []
  };

  try {
    if (typeof window !== 'undefined' && groupId) {
      const storageKey = getFavouritesStorageKey(groupId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.favourites && data.groupId === groupId) {
          return data.favourites;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load favourites from localStorage:', error);
  }
  return emptyFavourites;
};

const clearFavouritesStorage = (groupId: number | undefined) => {
  try {
    if (typeof window !== 'undefined' && groupId) {
      const storageKey = getFavouritesStorageKey(groupId);
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

export type GroupMandateContextType = {
  // Current selection
  currentGroup: Group | null;
  
  // Available options
  availableGroups: Group[];
  
  // Loading states
  isLoadingGroups: boolean;
  isLoadingFavourites: boolean;
  
  // Favourites
  favourites: FavouritesData;
  
  // Auth state
  isAuthenticated: boolean;
  
  // Actions
  setCurrentGroup: (group: Group | null) => void;
  setGroup: (group: Group) => void;
  setDefaultGroup: () => Promise<{ success: boolean; group?: Group; error?: any }>;
  setDefaultGroupMandate: () => Promise<{ success: boolean; group?: Group; mandate?: Group; error?: any }>; // Legacy alias
  loadAvailableGroups: () => Promise<void>;
  
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
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  
  // Auth state tracking
  const [hasHadUser, setHasHadUser] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(Date.now());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Favourites state
  const [favourites, setFavourites] = useState<FavouritesData>({
    categories: [],
    funds: [],
    asset_class: [],
    structure: []
  });
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false);

  // Initial auth state check - verify authentication AND restore saved group
  useEffect(() => {
    const checkInitialAuth = async () => {
      const { user, isAuthenticated, error } = await checkInitialAuthAction();
      if (isAuthenticated && user) {
        setIsAuthenticated(true);
        setHasHadUser(true);
        setLastAuthCheck(Date.now());
        console.log('🔄 Initial auth: User authenticated, checking for saved group');
        
        // Load saved group from localStorage if none currently set
        if (!currentGroup) {
          const saved = loadFromStorage();
          if (saved) {
            console.log('🔄 Initial auth: Restoring saved group from localStorage:', saved);
            setCurrentGroup(saved);
            
            // Load favourites for the restored group
            const newFavourites = loadFromFavouritesStorage(saved.id);
            setFavourites(newFavourites);
          } else {
            console.log('🔄 Initial auth: No saved group found in localStorage');
          }
        } else {
          console.log('🔄 Initial auth: Group already set, keeping current selection');
        }
      }
      if (error) {
        console.warn('Initial auth check error:', error);
      }
    };
    checkInitialAuth();
  }, []); // Remove dependencies to prevent loops

  // Simple 5-minute interval auth checking
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('🔄 Starting auth check...');
        const { user, error } = await getCurrentUserAction();
        
        if (user && !error) {
          // User is authenticated
          console.log('✅ Auth state: User authenticated');
          setIsAuthenticated(true);
          setHasHadUser(true);
          setLastAuthCheck(Date.now());
          
          // 5-minute auth check: Only verify authentication, don't change group
          console.log('🔄 Auth check: User authenticated, keeping current group selection');
        } else {
          console.log('❌ Auth state: User not authenticated');
          // User is not authenticated
          setIsAuthenticated(false);
          
          if (hasHadUser) {
            // User was previously authenticated, now logged out
            // Check if this is a real logout vs network issue (10-minute timeout)
            const timeSinceLastAuth = Date.now() - lastAuthCheck;
            const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
            
            if (timeSinceLastAuth > TIMEOUT_MS) {
              // Real logout - clear everything
              console.log('🚪 Real logout detected, clearing selections');
              clearStorage();
              setCurrentGroup(null);
              setFavourites({
                categories: [],
                funds: [],
                asset_class: [],
                structure: []
              });
              setHasHadUser(false);
            } else {
              // Network issue - keep selections temporarily
              console.log('🌐 Network issue detected, keeping selections temporarily');
            }
          }
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
      }
    };

    // Initial check
    checkAuthState();
    
    // Set up 5-minute interval
    const interval = setInterval(checkAuthState, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array - no state dependencies that cause loops

  // Tab synchronization - listen for favourites changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(FAVOURITES_STORAGE_PREFIX) && currentGroup) {
        const expectedKey = getFavouritesStorageKey(currentGroup.id);
        if (e.key === expectedKey && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.favourites && data.groupId === currentGroup.id) {
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
  }, [currentGroup?.id]);

  // Set default group from JWT (called from OTP login success)
  const setDefaultGroup = useCallback(async () => {
    try {
      console.log('🔄 Setting default group from JWT...');
      
      // Extract group from JWT using server action
      const { groupInfo } = await getJWTGroupMandate();

      if (groupInfo) {
        setCurrentGroup(groupInfo);
        console.log('✅ Set default group from JWT:', groupInfo);
        
        // Save to localStorage for future use
        saveToStorage(groupInfo);
        
        // Load favourites for the new group from database (async - don't block)
        loadGroupFavourites().then((newFavourites) => {
          setFavourites(newFavourites);
          saveToFavouritesStorage(groupInfo.id, newFavourites);
        }).catch((error) => {
          console.error('Failed to load favourites for default group:', error);
          // Fallback to localStorage if database fetch fails
          const fallbackFavourites = loadFromFavouritesStorage(groupInfo.id);
          setFavourites(fallbackFavourites);
        });
        
        return { success: true, group: groupInfo };
      } else {
        console.log('ℹ️ No group in JWT - keeping as null (normal for new users)');
        return { success: true, group: undefined };
      }
    } catch (error) {
      console.error('❌ Error setting default group from JWT:', error);
      return { success: false, error };
    }
  }, []);

  // Actions - memoized to prevent infinite re-renders
  const setGroup = useCallback((group: Group) => {
    // Clear existing favourites
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear old favourites storage
    if (currentGroup) {
      clearFavouritesStorage(currentGroup.id);
    }
    
    setCurrentGroup(group);
    
    // Save to localStorage for persistence
    saveToStorage(group);
    
    // Load favourites for new group (async - don't block)
    loadGroupFavourites().then((newFavourites) => {
      setFavourites(newFavourites);
      saveToFavouritesStorage(group.id, newFavourites);
    }).catch((error) => {
      console.error('Failed to load favourites for new group:', error);
    });
    
    // Toast success message and reload page
    toast.success(`Group: ${group.name} selected successfully!`);
    
    // Reload page to refresh all data
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Small delay to show toast
  }, [currentGroup]);

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

  // Favourites functions
  const loadFavourites = useCallback(async (): Promise<void> => {
    if (!currentGroup) return;
    
    setIsLoadingFavourites(true);
    try {
      const newFavourites = await loadGroupFavourites();
      setFavourites(newFavourites);
      
      // Save to localStorage
      saveToFavouritesStorage(currentGroup.id, newFavourites);
    } catch (error) {
      console.error('Error loading favourites:', error);
      toast.error("Error loading favourites. Please try again.");
    } finally {
      setIsLoadingFavourites(false);
    }
  }, [currentGroup]);

  const isFavourite = useCallback((entityType: EntityType, entityId: number): boolean => {
    return favourites[entityType]?.includes(entityId) || false;
  }, [favourites]);

  const toggleFavourite = useCallback(async (entityType: EntityType, entityId: number): Promise<void> => {
    if (!currentGroup) {
      toast.error("Please select a group first");
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
        saveToFavouritesStorage(currentGroup.id, newFavourites);
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
  }, [currentGroup, isFavourite]);

  const handleSetCurrentGroup = useCallback((group: Group | null) => {
    setCurrentGroup(group);
  }, []);

  const clearSelection = useCallback(() => {
    // Clear favourites storage for current group
    if (currentGroup) {
      clearFavouritesStorage(currentGroup.id);
    }
    
    setCurrentGroup(null);
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear localStorage
    clearStorage();
  }, [currentGroup]);

  const resetContext = useCallback(() => {
    // Clear favourites storage for current group
    if (currentGroup) {
      clearFavouritesStorage(currentGroup.id);
    }
    
    setCurrentGroup(null);
    setAvailableGroups([]);
    setFavourites({
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    });
    
    // Clear localStorage
    clearStorage();
  }, [currentGroup]);

  const value: GroupMandateContextType = {
    // Current selection
    currentGroup,
    
    // Available options
    availableGroups,
    
    // Loading states
    isLoadingGroups,
    isLoadingFavourites,
    
    // Favourites
    favourites,
    
    // Auth state
    isAuthenticated,
    
    // Actions
    setCurrentGroup: handleSetCurrentGroup,
    setGroup,
    setDefaultGroup,
    setDefaultGroupMandate: setDefaultGroup, // Legacy alias for backward compatibility
    loadAvailableGroups,
    
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
