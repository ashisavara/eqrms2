"use client";

import React from 'react';
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";
import { Badge } from "@/components/ui/badge";
import { Users, Target, AlertCircle } from "lucide-react";

export function ContextDisplay() {
  const { currentGroup, currentMandate, isLoadingGroups, isLoadingMandates } = useGroupMandate();

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

      {/* Mandate Display */}
      {isLoadingMandates ? (
        <Badge variant="outline" className="text-xs">
          <Target className="h-3 w-3 mr-1" />
          Loading...
        </Badge>
      ) : currentMandate ? (
        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
          <Target className="h-3 w-3 mr-1" />
          {currentMandate.name}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          No Mandate
        </Badge>
      )}

      {/* Context IDs for debugging */}
      <span className="text-gray-400 text-xs">
        (G:{currentGroup?.id || 'null'} | M:{currentMandate?.id || 'null'})
      </span>
    </div>
  );
} 