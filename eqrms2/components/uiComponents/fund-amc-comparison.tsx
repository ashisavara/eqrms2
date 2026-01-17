import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { FundAmcComparisonTables, FundAmcComparisonTablesUpgrade } from './fund-amc-comparison-tables';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

interface FundAmcComparisonProps {
  fundIds: number[]; // Array of fund IDs, max 10
  children?: ReactNode; // Optional markdown content to display before tables
}

export async function FundAmcComparison({ fundIds, children }: FundAmcComparisonProps) {
  // Validate and limit fundIds
  const validFundIds = fundIds.filter(id => !isNaN(id) && id > 0).slice(0, 10);

  if (validFundIds.length === 0) {
    return <div className="text-center p-4">No valid fund IDs provided</div>;
  }

  // Fetch fund data
  const funds = await supabaseListRead<RmsFundAmc>({
    table: "view_rms_funds_amc",
    columns: "*",
    filters: [
      (query) => query.in('fund_id', validFundIds)
    ]
  });

  if (!funds || funds.length === 0) {
    return <div className="text-center p-4">No funds found</div>;
  }

  // Check user permissions
  const userRoles = await getUserRoles();
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');

  // Render children first (if provided), then appropriate version based on permissions
  const comparisonTables = hasDetailedAccess 
    ? <FundAmcComparisonTables data={funds} />
    : <FundAmcComparisonTablesUpgrade data={funds} />;

 
  return (
    <div>
      {children && (<> {children}</>)}
      {comparisonTables}
    </div>
  );
}
