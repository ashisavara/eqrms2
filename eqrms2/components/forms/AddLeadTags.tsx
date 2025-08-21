'use client';

// IMPORTANT WE ARE NOT USING THIS COMPONENT ANYMORE, SINCE THE DROPDOWN MENU DOES NOT WORK ALONG WITH A SHEET
// DEFAULT ACTION OF CLOSING DROPDOWN ALSO CLOSES SHEET, IF OVERRIDE THE DEFAULT THE OPEN DROPDOWN MENU INTEFERES WITH FOCUS ON THE SHEET

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
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
  referralPartnerOptions
}: { 
  leadId: number;
  customTagOptions: { value: string; label: string }[];
  leadRoleOptions: { value: string; label: string }[];
  digitalAdOptions: { value: string; label: string }[];
  lead: LeadsTaggingValues;
  referralPartnerOptions: { value: string; label: string }[];
}) {
  // Note: This component no longer needs to get options from context since
  // the child components (EditLeadsButton, AddDealButton, etc.) now get them directly
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 py-0 h-3">
          <Pencil className="!w-3 !h-3 text-blue-700" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">

        <DropdownMenuItem>
          <EditLeadsButton leadData={lead} leadId={leadId} referralPartnerOptions={referralPartnerOptions} />
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddDealButton relLeadId={leadId} initialLeadData={lead} />
        </DropdownMenuItem>
 
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AddInteractionButton relLeadId={leadId} initialLeadData={lead} />
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
