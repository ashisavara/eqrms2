"use client";

import { createContext, useContext, ReactNode } from 'react';
import { MASTER_OPTIONS, type MasterOptions } from '@/lib/constants';

// Context type - directly expose the master options
type MasterOptionsContextType = MasterOptions;

// Create context with the static data as default
const MasterOptionsContext = createContext<MasterOptionsContextType>(MASTER_OPTIONS);

// Provider component - no loading, just provides static data
export function MasterOptionsProvider({ children }: { children: ReactNode }) {
  return (
    <MasterOptionsContext.Provider value={MASTER_OPTIONS}>
      {children}
    </MasterOptionsContext.Provider>
  );
}

// Hook to use master options
export function useMasterOptions() {
  const context = useContext(MasterOptionsContext);
  return context;
}

// Helper function to transform simple arrays to value/label format when needed
export function transformToValueLabel(options: readonly string[]): Array<{ value: string; label: string }> {
  return options.map(option => ({ value: option, label: option }));
}
