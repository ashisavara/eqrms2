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
import { AddDealButton } from "./AddDeals";
import { AddInteractionButton } from "./AddInteractions";
import { EditLeadsButton } from "./EditLeads";
import { LeadsTaggingValues } from "@/types/forms";

export function AddLeadTags({ 
  leadId,
  customTagOptions,
  leadRoleOptions,
  digitalAdOptions,
  lead,
  importanceOptions,
  leadProgressionOptions,
  leadSourceOptions,
  leadTypeOptions,
  wealthLevelOptions,
  primaryRmOptions,
  dealEstClosureOptions,
  dealStageOptions,
  dealSegmentOptions,
  interactionTypeOptions,
  interactionTagOptions,
  interactionChannelOptions
}: { 
  leadId: number;
  customTagOptions: { value: string; label: string }[];
  leadRoleOptions: { value: string; label: string }[];
  digitalAdOptions: { value: string; label: string }[];
  lead: LeadsTaggingValues;
  importanceOptions: { value: string; label: string }[];
  leadProgressionOptions: { value: string; label: string }[];
  leadSourceOptions: { value: string; label: string }[];
  leadTypeOptions: { value: string; label: string }[];
  wealthLevelOptions: { value: string; label: string }[];
  primaryRmOptions: { value: string; label: string }[];
  dealEstClosureOptions: { value: string; label: string }[];
  dealStageOptions: { value: string; label: string }[];
  dealSegmentOptions: { value: string; label: string }[];
  interactionTypeOptions: { value: string; label: string }[];
  interactionTagOptions: { value: string; label: string }[];
  interactionChannelOptions: { value: string; label: string }[];
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
          <EditLeadsButton leadData={lead} leadId={leadId} importanceOptions={importanceOptions} 
          leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} 
          leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} primaryRmOptions={primaryRmOptions} />
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddDealButton dealEstClosureOptions={dealEstClosureOptions} dealStageOptions={dealStageOptions} 
          dealSegmentOptions={dealSegmentOptions} relLeadId={leadId} initialLeadData={lead}  
          importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddInteractionButton interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} 
          interactionChannelOptions={interactionChannelOptions} initialLeadData={lead} 
          importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
        </DropdownMenuItem>

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
