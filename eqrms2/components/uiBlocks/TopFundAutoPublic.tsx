// <TopFundAutoPublic filters={[(query) => query.eq('asset_class_name', 'Equity')]} />
// This component displays a table of funds fetched from the public view using custom filters
// Automatically detects RMS vs public context based on subdomain:
//   - rms.imecapital.in → RMS variant (with favorites, ratings)
//   - imecapital.in → Public variant (read-only)
//   - localhost → RMS variant (for development testing)
// filters: Array of filter functions to apply to the query

import { headers } from "next/headers";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { RmsFundsScreener } from "@/types/funds-detail";
import TopFundListPublicTable from "@/app/(public)/blogs/TopFundListPublicTable";
import TopFundListTable from "@/app/(rms)/recommendations/TopFundListTable";

interface TopFundAutoPublicProps {
  filters: ((query: any) => any)[]; // Array of filter functions
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

export default async function TopFundAutoPublic({ filters }: TopFundAutoPublicProps) {
  // If no filters provided, return empty message
  if (!filters || filters.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50">
        <p className="text-gray-600 text-sm">No filters provided</p>
      </div>
    );
  }



  // Detect context and render appropriate table
  const isRms = await isRmsContext();

    // Fetch funds from public view (no RLS, public data) using provided filters
  if (isRms) {
    const funds = await supabaseListRead<RmsFundsScreener>({
      table: 'view_rms_funds_screener',
      columns: 'fund_name, slug, one_yr, three_yr, five_yr, structure_name, open_for_subscription, cat_long_name, fund_rating',
      filters: [
        (query) => query.eq('open_for_subscription', 'Y'),
        ...filters
      ]
    });
        // If no funds found, show message
        if (!funds || funds.length === 0) {
          return (
            <div className="p-4 border border-gray-300 rounded bg-gray-50">
              <p className="text-gray-600 text-sm">No funds found matching the provided filters</p>
            </div>
          );
        }
    const userRoles = await getUserRoles();
    return <TopFundListTable data={funds} userRoles={userRoles} />;
  }


    const funds = await supabaseListRead<RmsFundsScreener>({
      table: 'v_public_rms_fund_top_list_data',
      columns: 'fund_name, slug, one_yr, three_yr, five_yr, structure_name, cat_long_name',
      filters: [
        (query) => query.eq('open_for_subscription', 'Y'),
        ...filters
      ]
    });
  
    // If no funds found, show message
    if (!funds || funds.length === 0) {
      return (
        <div className="p-4 border border-gray-300 rounded bg-gray-50">
          <p className="text-gray-600 text-sm">No funds found matching the provided filters</p>
        </div>
      );
    }
  
  // Public context: render read-only table
  return <TopFundListPublicTable data={funds} />;
}
