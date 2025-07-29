import { supabaseSingleRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { LeadsTagging } from "@/types/lead-detail";
import { formatDate } from "@/lib/utils";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import SimpleTable from "@/components/tables/singleRowTable";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating } from "@/components/conditional-formatting";

export default async function CrmDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const [lead, importanceOptions, leadProgressionOptions, leadSourceOptions, leadTypeOptions, wealthLevelOptions] = await Promise.all([
        supabaseSingleRead<LeadsTagging>({
            table: "view_leads_tagcrm",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
            ]
        }), 
        fetchOptions<string,string>("master","importance","importance"),
        fetchOptions<string,string>("master","lead_progression","lead_progression"),
        fetchOptions<string,string>("master","lead_source","lead_source"),
        fetchOptions<string,string>("master","lead_type","lead_type"),
        fetchOptions<string,string>("master","wealth_level","wealth_level")
    ]);

    if (!lead) {
        return <div>Lead not found</div>;
    }

    return (
        <div className="p-5">
            <div className="pageHeadingBox">
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="text-left">
                        <h1>{lead.lead_name}</h1>
                        <p className="text-sm">Last Contact Date: {formatDate(lead.last_contact_date)} | Followup Date: {formatDate(lead.followup_date)}</p>
                        <p className="text-sm">Days Followup: {lead.days_followup} | Days Last Contact: {lead.days_since_last_contact}</p>
                        <EditLeadsButton leadData={lead} leadId={lead.lead_id} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} />
                    </div>
                    <div className="text-sm">
                        <p><CrmImportanceRating rating={lead.importance ?? ""} /> | <CrmWealthRating rating={lead.wealth_level ?? ""} /> | <CrmProgressionRating rating={lead.lead_progression ?? ""} /> | <CrmLeadSourceRating rating={lead.lead_source ?? ""} /> | {lead.lead_type} | {lead.primary_rm} | </p>
                        <p>Place for Custom Tags</p>
                        <p className="text-base italic">{lead.lead_summary}</p>
                    </div>
                </div>
            </div> 
            <div className="mt-5">
                <p><span className="font-bold">Contact Details: </span>Phone [{lead.country_code} - {lead.phone_number} | Email: {lead.email_1}  {lead.email_2}  {lead.email_3} | LinkedIn: {lead.linkedin_url}</p>
                <p>{lead.lead_background}</p>
            </div>
        </div>
    );
}