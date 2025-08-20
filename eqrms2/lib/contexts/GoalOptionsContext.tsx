"use client";

import { createContext, useContext, ReactNode } from 'react';

interface GoalOptionsContextType {
  goalOptions: { value: string; label: string }[];
}

const GoalOptionsContext = createContext<GoalOptionsContextType | undefined>(undefined);

export function GoalOptionsProvider({ 
  children, 
  goalOptions 
}: { 
  children: ReactNode;
  goalOptions: { value: string; label: string }[];
}) {
  return (
    <GoalOptionsContext.Provider value={{ goalOptions }}>
      {children}
    </GoalOptionsContext.Provider>
  );
}

export function useGoalOptions() {
  const context = useContext(GoalOptionsContext);
  if (!context) {
    throw new Error('useGoalOptions must be used within GoalOptionsProvider');
  }
  return context;
}
