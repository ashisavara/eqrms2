import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { LeadsTagging } from "@/types/lead-detail";
import { InteractionDetail } from "@/types/interaction-detail";
import { Deals } from "@/types/deals";
import { formatDate } from "@/lib/utils";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import SimpleTable from "@/components/tables/singleRowTable";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating } from "@/components/conditional-formatting";
import TableInteractions from "../TableInteractions";


export default async function CrmDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [lead, Meetings,Followups, Deals, importanceOptions, leadProgressionOptions, leadSourceOptions, leadTypeOptions, wealthLevelOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, primaryRmOptions] = await Promise.all([
        supabaseSingleRead<LeadsTagging>({
            table: "view_leads_tagcrm",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
            ]
        }),
        supabaseListRead<InteractionDetail>({
            table: "view_crm_meeting_notes",
            columns: "*",  
            filters: [
                (query) => query.eq('rel_lead_id', id)
            ]
        }),
        supabaseListRead<InteractionDetail>({
            table: "view_crm_followup_notes",
            columns: "*",  
            filters: [
                (query) => query.eq('rel_lead_id', id),
            ]
        }),
        supabaseListRead<Deals>({
            table: "view_deals_with_leads",
            columns: "*",  
            filters: [
                (query) => query.eq('rel_lead_id', id)
            ]
        }),
        fetchOptions<string,string>("master","importance","importance"),
        fetchOptions<string,string>("master","lead_progression","lead_progression"),
        fetchOptions<string,string>("master","lead_source","lead_source"),
        fetchOptions<string,string>("master","lead_type","lead_type"),
        fetchOptions<string,string>("master","wealth_level","wealth_level"),
        fetchOptions<string, string>("master","interaction_type", "interaction_type"),
        fetchOptions<string, string>("master","interaction_tag", "interaction_tag"),
        fetchOptions<string, string>("master","interaction_channel_tag","interaction_channel_tag"),
        fetchOptions<string, string>("ime_emp","auth_id", "name"),
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
                        <p className="text-sm"><span className="font-bold">Phone:</span> {lead.country_code} - {lead.phone_number} | <span className="font-bold">Email:</span> {lead.email_1}  {lead.email_2}  {lead.email_3} |  <span className="font-bold">Linkedin:</span>  {lead.linkedin_url}</p>
                        <EditLeadsButton leadData={lead} leadId={lead.lead_id} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} primaryRmOptions={primaryRmOptions} />
                    </div>
                    <div className="text-sm">
                        <p><CrmImportanceRating rating={lead.importance ?? ""} /> | <CrmWealthRating rating={lead.wealth_level ?? ""} /> | <CrmProgressionRating rating={lead.lead_progression ?? ""} /> | <CrmLeadSourceRating rating={lead.lead_source ?? ""} /> | {lead.lead_type} | {lead.rm_name} | </p>
                        <p>Place for Custom Tags</p>
                        <p className="text-sm italic">{lead.lead_summary}</p>
                    </div>
                </div>
            </div> 
            <div className="mt-5">
                <p className="text-sm">{lead.lead_background}</p>
                <h3 className="text-base font-bold">Followups (last 30)</h3>
                <div className="text-sm bg-gray-100 p-2 rounded-md">
                    {Followups.slice(0, 30).map((followup, index) => (
                        <span key={index}>
                            {formatDate(followup.created_at)} ({followup.interaction_channel})
                            {index < Followups.length - 1 && " | "}
                        </span>
                    ))}
                </div>
                <TableInteractions data={Meetings} interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} interactionChannelOptions={interactionChannelOptions} />
                
            </div>
            
        </div>
    );
}