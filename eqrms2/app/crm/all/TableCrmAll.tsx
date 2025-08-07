"use client";

import { ServerTablePage, ServerTablePageConfig } from "@/components/server-table";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import {LeadsTagging} from "@/types/lead-detail";
import Link from "next/link";

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
}

export default function LeadsTable({ data, pagination, filterOptions, filterConfig, searchColumns }: LeadsTableProps) {
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

    columns: [
      { key: 'lead_name', header: 'Name ' },
      { key: 'days_followup', header: 'Days Followup ' },
      { key: 'days_since_last_contact', header: 'Days Last Contact ' },
      { key: 'importance', header: 'Importance ' },
      { key: 'wealth_level', header: 'Wealth ' },
      { key: 'lead_progression', header: 'Progression ' },
      { key: 'lead_summary', header: 'Summary ' },
      { key: 'lead_source', header: 'Source ' },
      { key: 'lead_type', header: 'Type ' },
      { key: 'rm_name', header: 'RM ' },
      ],

    emptyMessage: 'no leads found with current filters .. ',sourceTable: 'view_leads_tagcrm ',  
    filterConfig: filterConfig,              
    searchColumns: searchColumns             
  };

  return <ServerTablePage config={config} data={data} pagination={pagination} />;
}