// <TopFundListPublic fundIds="123,456,789" />
// This MDX component displays a table of top funds
// Automatically detects RMS vs public context based on subdomain:
//   - rms.imecapital.in → RMS variant (with favorites, ratings)
//   - imecapital.in → Public variant (read-only)
//   - localhost → RMS variant (for development testing)
// fundIds: Comma-separated list of fund IDs to display

import { headers } from "next/headers";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { RmsFundsScreener } from "@/types/funds-detail";
import TopFundListPublicTable from "@/app/(public)/blogs/TopFundListPublicTable";
import TopFundListTable from "@/app/(rms)/recommendations/TopFundListTable";

interface TopFundListPublicProps {
  fundIds: string; // Comma-separated fund IDs: "1,2,3"
}

// Detect if we're on the RMS subdomain (or localhost for dev)
async function isRmsContext(): Promise<boolean> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  // Localhost - treat as RMS for development testing
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return true;
  }
  
  // Production - check for RMS subdomain
  return host.startsWith("rms.") || host === "rms.imecapital.in";
}

export default async function TopFundListPublic({ fundIds }: TopFundListPublicProps) {
  // Parse comma-separated fund IDs into array of numbers
  const fundIdsArray = fundIds
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id)); // Filter out invalid IDs

  // If no valid fund IDs provided, return empty message
  if (fundIdsArray.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50">
        <p className="text-gray-600 text-sm">No valid fund IDs provided</p>
      </div>
    );
  }

  // Fetch funds from public view (no RLS, public data)
  const funds = await supabaseListRead<RmsFundsScreener>({
    table: 'v_public_rms_fund_top_list_data',
    columns: '*',
    filters: [
      (query) => query.in('fund_id', fundIdsArray)
    ]
  });

  // If no funds found, show message
  if (!funds || funds.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50">
        <p className="text-gray-600 text-sm">No funds found for the provided IDs</p>
      </div>
    );
  }

  // Detect context and render appropriate table
  const isRms = await isRmsContext();
  
  if (isRms) {
    // RMS context: fetch user roles and render with favorites/ratings
    const userRoles = await getUserRoles();
    return <TopFundListTable data={funds} userRoles={userRoles} />;
  }
  
  // Public context: render read-only table
  return <TopFundListPublicTable data={funds} />;
}
