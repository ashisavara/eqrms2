// <TopFundListPublic fundIds="123,456,789" />
// This MDX component displays a table of top funds fetched from the public view
// fundIds: Comma-separated list of fund IDs to display

import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TopFundListPublicTable from "@/app/(public)/blogs/TopFundListPublicTable";

interface TopFundListPublicProps {
  fundIds: string; // Comma-separated fund IDs: "1,2,3"
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

  // Render the table with fetched data
  return <TopFundListPublicTable data={funds} />;
}
