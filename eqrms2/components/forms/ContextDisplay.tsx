"use client";

import React from 'react';
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";
import { Badge } from "@/components/ui/badge";
import { Users, AlertCircle } from "lucide-react";

export function ContextDisplay() {
  const { currentGroup, isLoadingGroups } = useGroupMandate();

  return (
    <div className="flex items-center gap-2 text-xs bg-gray-50 px-3 py-1 rounded-md border">
      <span className="font-medium text-gray-600">Context:</span>
      
      {/* Group Display */}
      {isLoadingGroups ? (
        <Badge variant="outline" className="text-xs">
          <Users className="h-3 w-3 mr-1" />
          Loading...
        </Badge>
      ) : currentGroup ? (
        <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
          <Users className="h-3 w-3 mr-1" />
          {currentGroup.name}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          No Group
        </Badge>
      )}

      {/* Context ID for debugging */}
      <span className="text-gray-400 text-xs">
        (Group ID: {currentGroup?.id || 'null'})
      </span>
    </div>
  );
} 