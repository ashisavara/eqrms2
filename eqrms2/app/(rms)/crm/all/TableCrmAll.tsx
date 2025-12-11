"use client";

import { ServerTablePage, ServerTablePageConfig } from "@/components/server-table";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating, CrmFollowupNumberRating } from "@/components/conditional-formatting";
import {LeadsTagging} from "@/types/lead-detail";
import Link from "next/link";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import { AddDealButton } from "@/components/forms/AddDeals";
import { AddInteractionButton } from "@/components/forms/AddInteractions";
import { AddFollowUpButton } from "@/components/forms/AddFollowUp";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";

// Table Interface
interface LeadsTableProps {data: LeadsTagging[];
  pagination: { currentPage: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean; pageSize: number; totalCount: number; };
  filterOptions: {
    importance: any[]; 
    lead_progression: any[]; 
    lead_source: any[]; 
    lead_type: any[]; 
    wealth_level: any[]; 
    rm_name: any[]; 
  };
  filterConfig: Record<string, any>;
  searchColumns: string[];
  aggregations?: any; // ✨ NEW: Aggregation data from SQL function
}

export default function LeadsTable({ data, pagination, filterOptions, filterConfig, searchColumns, aggregations }: LeadsTableProps) {
  const config: ServerTablePageConfig<LeadsTagging> = { basePath: '/crm/all',
    
  tableStateConfig: { filterKeys: [
    'importance',
    'lead_progression',
    'lead_source',
    'lead_type',
    'wealth_level',
    'rm_name',], 
    
    defaultSort: { column: 'days_followup', direction:'asc' }, 
    defaultPageSize:100  },
    
    filterConfigs: [
      { key: 'importance', title: 'Importance ', placeholder: 'Importance ', options: filterOptions.importance },
      { key: 'lead_progression', title: 'Progression ', placeholder: 'Progression ', options: filterOptions.lead_progression },
      { key: 'lead_source', title: 'Source ', placeholder: 'Source ', options: filterOptions.lead_source },
      { key: 'lead_type', title: 'Type ', placeholder: 'Type ', options: filterOptions.lead_type },
      { key: 'wealth_level', title: 'Wealth ', placeholder: 'Wealth ', options: filterOptions.wealth_level },
      { key: 'rm_name', title: 'RM ', placeholder: 'RM ', options: filterOptions.rm_name },  
    ],
    
    sortOptions: [
      { value: 'lead_name', label: 'Name ' },
      { value: 'days_followup', label: 'Days Followup ' },
      { value: 'days_since_last_contact', label: 'Days Last Contact ' },
      { value: 'importance', label: 'Importance ' },
      { value: 'wealth_level', label: 'Wealth ' },
      { value: 'lead_progression', label: 'Progression ' },
      { value: 'lead_summary', label: 'Summary ' },
      { value: 'lead_source', label: 'Source ' },
      { value: 'lead_type', label: 'Type ' },
      { value: 'rm_name', label: 'RM ' },
    ],

    searchPlaceholder: 'Search leads ... ',

    searchColumns: ['lead_name', 'lead_summary', 'rm_name', 'lead_source', 'lead_type', 'lead_progression'],

    columns: [
      { 
        key: 'lead_name', 
        header: 'Name', 
        render: (value, row) => (
          <div className="w-[140px] truncate text-left">
            <Link href={`/crm/${row.lead_id}`} className="text-blue-500 hover:text-blue-800 font-bold !text-left hover:underline">{row.lead_name} </Link>
            <ToggleVisibility toggleText="Edit" className="text-xs text-green-700 hover:underline hover:font-bold">
              <EditLeadsButton leadData={row} leadId={row.lead_id} />
              <AddDealButton relLeadId={row.lead_id} initialLeadData={row} />
              <AddInteractionButton relLeadId={row.lead_id} initialLeadData={row} />
              <AddFollowUpButton relLeadId={row.lead_id} initialLeadData={row} />
            </ToggleVisibility>
          </div>
        )
      },
      { 
        key: 'days_followup', 
        header: 'Followup', 
        render: (value) => (
          <div className="w-[60px] text-center">
            <CrmFollowupNumberRating rating={value as number} />
          </div>
        )
      },
      { 
        key: 'days_since_last_contact', 
        header: 'LastCont', 
        render: (value) => (
          <div className="w-[60px] text-center">
            {value}
          </div>
        )
      },
      { 
        key: 'importance', 
        header: 'Importance', 
        render: (value) => (<div className="w-[80px] text-center"><CrmImportanceRating rating={value ?? ""} /></div>)
      },
      { 
        key: 'wealth_level', 
        header: 'Wealth', 
        render: (value) => (<div className="w-[80px] text-center"><CrmWealthRating rating={value ?? ""} /></div>)
      },
      { 
        key: 'lead_progression', 
        header: 'Progression', 
        render: (value) => (<div className="w-[120px] text-center"><CrmProgressionRating rating={value ?? ""} /></div>)
      },
      { 
        key: 'rm_name', 
        header: 'RM', 
        render: (value) => (
          <div className="w-[80px] truncate" title={value}>
            {value}
          </div>
        )
      },
      { 
        key: 'lead_summary', 
        header: 'Summary', 
        render: (value) => (
          <div className="w-[500px] truncate text-left" title={value}>
            {value}
          </div>
        )
      },
      ],

    emptyMessage: 'no leads found with current filters .. ',sourceTable: 'view_leads_tagcrm ',  
    filterConfig: filterConfig,
    tableClassName: "divide-y divide-gray-200", // Adds spacing between rows
    
    // ✨ NEW: Aggregations Configuration (replicates TableCrm.tsx functionality)
    aggregations: {
      enabled: true,
      sqlFunction: 'get_crm_aggregations',
      
      // 🔢 Aggregation Cards (same as TableCrm.tsx)
      cards: [
        { key: 'totalLeads', title: 'Total Leads' },
        { key: 'overdueFollowups', title: 'Overdue Follow-ups', className: 'border-red-200' },
        { key: 'hotLeads', title: 'High Priority Leads', className: 'border-orange-200' },
        { key: 'advancedLeads', title: 'Advanced Leads', className: 'border-blue-200' },
        { key: 'newLeads', title: 'New Leads', className: 'border-green-200' }
      ],
      
      // 📊 Pie Charts (same as TableCrm.tsx)
      pieCharts: [
        { 
          key: 'importanceDistribution', 
          title: 'Lead Priority',
          countLabel: 'leads'
        },
        { 
          key: 'leadProgressionDistribution', 
          title: 'Lead Stage',
          countLabel: 'leads'
        },
        { 
          key: 'wealthLevelDistribution', 
          title: 'Wealth Level',
          countLabel: 'leads'
        },
        { 
          key: 'leadSourceDistribution', 
          title: 'Lead Source',
          countLabel: 'leads'
        }
      ]
    }
  };

  return <ServerTablePage config={config} data={data} pagination={pagination} aggregations={aggregations} />;
}