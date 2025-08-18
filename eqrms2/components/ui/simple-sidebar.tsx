"use client";

import React, { createContext, useContext, useState } from 'react';
import { PanelLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { isOpen } = useSidebar();
  
  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 md:w-16'
      } ${!isOpen ? 'overflow-hidden' : ''}`}
    >
      <div className="h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function SidebarTrigger() {
  const { toggle } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="h-8 w-8"
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {children}
    </div>
  );
}

interface SidebarHeaderProps {
  children: React.ReactNode;
}

export function SidebarHeader({ children }: SidebarHeaderProps) {
  const { isOpen } = useSidebar();
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
        {children}
      </div>
    </div>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
}

export function SidebarFooter({ children }: SidebarFooterProps) {
  return (
    <div className="p-2 border-t border-gray-200 mt-auto">
      {children}
    </div>
  );
}

interface SidebarMenuProps {
  children: React.ReactNode;
}

export function SidebarMenu({ children }: SidebarMenuProps) {
  return (
    <nav className="space-y-1">
      {children}
    </nav>
  );
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export function SidebarMenuItem({ children, href, icon }: SidebarMenuItemProps) {
  const { isOpen } = useSidebar();
  
  if (href) {
    return (
      <a
        href={href}
        className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors ${
          isOpen ? 'justify-start gap-3' : 'justify-center'
        }`}
      >
        {icon && (
          <span className="flex-shrink-0">
            {React.cloneElement(icon as React.ReactElement<any>, { 
              className: "w-4 h-4" 
            })}
          </span>
        )}
        <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {children}
        </span>
      </a>
    );
  }
  
  return (
    <div className={`flex items-center px-3 py-2 ${isOpen ? 'justify-start gap-3' : 'justify-center'}`}>
      {icon && (
        <span className="flex-shrink-0">
          {React.cloneElement(icon as React.ReactElement<any>, { 
            className: "w-4 h-4" 
          })}
        </span>
      )}
      <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {children}
      </span>
    </div>
  );
}

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {children}
    </div>
  );
}
