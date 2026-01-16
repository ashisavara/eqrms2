// <TopFundAutoPublic filters={[(query) => query.eq('asset_class_name', 'Equity')]} />
// This component displays a table of funds fetched from the public view using custom filters
// filters: Array of filter functions to apply to the query

import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TopFundListPublicTable from "@/app/(public)/blogs/TopFundListPublicTable";

interface TopFundAutoPublicProps {
  filters: ((query: any) => any)[]; // Array of filter functions
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

  // Fetch funds from public view (no RLS, public data) using provided filters
  const funds = await supabaseListRead<RmsFundsScreener>({
    table: 'v_public_rms_fund_top_list_data',
    columns: '*',
    filters: filters
  });

  // If no funds found, show message
  if (!funds || funds.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50">
        <p className="text-gray-600 text-sm">No funds found matching the provided filters</p>
      </div>
    );
  }

  // Render the table with fetched data
  return <TopFundListPublicTable data={funds} />;
}
