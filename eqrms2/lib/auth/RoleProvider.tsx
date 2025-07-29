import React from 'react';
import { getUserRoles } from './getUserRoles';

/**
 * Context for sharing user roles across components
 */
const RoleContext = React.createContext<string[]>([]);

/**
 * Server component that provides user roles to all child components
 * Extracts roles once and distributes via React context
 */
export async function RoleProvider({ children }: { children: React.ReactNode }) {
  const userRoles = await getUserRoles();
  
  return (
    <RoleContext.Provider value={userRoles}>
      {children}
    </RoleContext.Provider>
  );
}

/**
 * Hook to access user roles from context
 * Use this in components instead of calling getUserRoles() directly
 */
export function useRoles(): string[] {
  const roles = React.useContext(RoleContext);
  return roles;
}

/**
 * Export the context for advanced usage if needed
 */
export { RoleContext }; 