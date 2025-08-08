'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddCustomTag } from "./AddCustomTag";
import { AddLeadRole } from "./AddLeadRole";
import { AddDigitalAd } from "./AddDigitalAd";

export function AddLeadTags({ 
  leadId,
  customTagOptions,
  leadRoleOptions,
  digitalAdOptions
}: { 
  leadId: number;
  customTagOptions: { value: string; label: string }[];
  leadRoleOptions: { value: string; label: string }[];
  digitalAdOptions: { value: string; label: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Tags
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddCustomTag 
            leadId={leadId} 
            customTagOptions={customTagOptions} 
          />
        </DropdownMenuItem>
        
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddLeadRole 
            leadId={leadId} 
            leadRoleOptions={leadRoleOptions} 
          />
        </DropdownMenuItem>
        
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddDigitalAd 
            leadId={leadId} 
            digitalAdOptions={digitalAdOptions} 
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
