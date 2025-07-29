import { TableCrm } from "./TableCrm";
import { LeadsTagging } from "@/types/lead-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";


export default async function CrmPage() {

    const [leads] = await Promise.all([
        supabaseListRead<LeadsTagging>({
            table:"leads_tagging", 
            columns:"lead_id, lead_name, days_followup, days_since_last_contact, importance, wealth_level, lead_progression, lead_summary, lead_source, lead_type, primary_rm"
            // No filters - let client handle sorting
        })
    ]);

    return (
        <div>
            <TableCrm data={leads} columnType="core" />
        </div>
    );
}