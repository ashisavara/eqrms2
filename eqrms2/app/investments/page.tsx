import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";

export default async function InvestmentsPage() {
  // Get current group ID from cookies (server-side)
  const groupId = await getCurrentGroupId();
  
  // If no group selected, show message
  if (!groupId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Investments</h1>
        <p className="text-muted-foreground">
          Please select a group using the "Select Group & Mandate" button to view investments.
        </p>
      </div>
    );
  }

  // Fetch investments for the selected group (server-side)
  const investments = await supabaseListRead({
    table: "investments",
    columns: "*",
    filters: [
      (query) => query.eq("group_id", groupId)
    ]
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investments</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Showing investments for Group ID: {groupId}
      </p>
      
      {investments.length === 0 ? (
        <p>No investments found for this group.</p>
      ) : (
        <div>
          <p className="mb-4">Found {investments.length} investments</p>
          {/* Replace this with your actual investment display component */}
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(investments, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}