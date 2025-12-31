import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { LeadsTagging } from "@/types/lead-detail";
import { InteractionDetail } from "@/types/interaction-detail";
import { Deals } from "@/types/deals";
import { formatDate } from "@/lib/utils";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import { AddDealButton } from "@/components/forms/AddDeals";
import { EditDealButton } from "@/components/forms/EditDeals";
import { AddInteractionButton } from "@/components/forms/AddInteractions";
import { EditInteractionButton } from "@/components/forms/EditInteractions";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating } from "@/components/conditional-formatting";
import TableInteractions from "../TableInteractions";
import { LeadRoleDetail } from "@/types/lead-role-detail";
import { DigitalAdsDetail } from "@/types/digital-ads-detail";
import { CustomTagDetail } from "@/types/custom-tag";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { AddDigitalAd } from "@/components/forms/AddDigitalAd";
import { AddFollowUpButton } from "@/components/forms/AddFollowUp";


export default async function CrmDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [lead, Meetings,Followups, Deals, leadDigitalAds, digitalAdOptions] = await Promise.all([
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
                (query) => query.eq('rel_lead_id', id).order('created_at', { ascending: false })
            ]
        }),
        supabaseListRead<Deals>({
            table: "view_deals_with_leads",
            columns: "*",  
            filters: [
                (query) => query.eq('rel_lead_id', id)
            ]
        }),
        supabaseListRead<DigitalAdsDetail>({
            table: "view_lead_digital_ads",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
            ]
        }),
        fetchOptions<string,string>("lead_tag_digital_ads","id","digital_campaign")
    ]);

    if (!lead) {
        return <div>Lead not found</div>;
    }

    const hasLeadDigitalAds = leadDigitalAds.length > 0;

    // Convert lead data to LeadsTaggingValues format for AddLeadTags component
    const leadForForm = {
        lead_name: lead.lead_name ?? "",
        last_contact_date: lead.last_contact_date ? new Date(lead.last_contact_date) : null,
        followup_date: lead.followup_date ? new Date(lead.followup_date) : null,
        importance: lead.importance ?? "",
        lead_progression: lead.lead_progression ?? "",
        lead_source: lead.lead_source ?? "",
        lead_type: lead.lead_type ?? "",
        wealth_level: lead.wealth_level ?? "",
        first_name: lead.first_name ?? "",
        last_name: lead.last_name ?? "",
        linkedin_url: lead.linkedin_url ?? "",
        phone_validated: lead.phone_validated ?? false,
        email_validated: lead.email_validated ?? false,
        country_code: lead.country_code ?? "",
        phone_number: lead.phone_number ?? "",
        email_1: lead.email_1 ?? "",
        email_2: lead.email_2 ?? "",
        email_3: lead.email_3 ?? "",
        lead_summary: lead.lead_summary ?? "",
        lead_background: lead.lead_background ?? "",
        primary_rm: lead.primary_rm ?? "",
        subs_email: lead.subs_email ?? false,
        subs_whatsapp: lead.subs_whatsapp ?? false,
        subs_imecapital: lead.subs_imecapital ?? false,
        subs_imepms: lead.subs_imepms ?? false,
        referral_partner: lead.referral_partner ?? "",
    };

    
    return (
        <div className="ime-crm-detail-page">
            <div className="pageHeadingBox">
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="text-left">
                        <div className="flex flex-row gap-2">
                            <h1>{lead.lead_name}</h1>
                            <ToggleVisibility toggleText="Edit">
                                <EditLeadsButton leadData={lead} leadId={lead.lead_id} />
                                <AddDealButton relLeadId={lead.lead_id} initialLeadData={lead} />
                                <AddInteractionButton relLeadId={lead.lead_id} initialLeadData={lead} />
                                <AddFollowUpButton relLeadId={lead.lead_id} initialLeadData={lead} />
                                <AddDigitalAd 
                                leadId={lead.lead_id} 
                                digitalAdOptions={digitalAdOptions} 
                                />
                            </ToggleVisibility>
                            </div>
                        
                        <p className="text-sm"><span className="font-bold">Last Contact Date:</span> {formatDate(lead.last_contact_date)} <span className="text-blue-500 font-bold">({lead.days_since_last_contact})</span> | <span className="font-bold">Followup Date:</span> {formatDate(lead.followup_date)} <span className="text-blue-500 font-bold">({lead.days_followup})</span> </p>
                        <p className="text-sm">
                        <a href={`https://wa.me/${lead.phone_e164}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">{lead.phone_e164}</a>
                             | {lead.email_1}  {lead.email_2}  {lead.email_3} |  
                            {lead.linkedin_url ? <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">Linkedin</a> : ""}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Primary RM:</span> {lead.rm_name} | 
                            <span className="font-bold">Secondary RM:</span> {lead.service_rm_name} 
                        </p>
                    </div>
                    <div className="text-sm flex flex-col">
                        <p><CrmImportanceRating rating={lead.importance ?? ""} /> | <CrmWealthRating rating={lead.wealth_level ?? ""} /> | <CrmProgressionRating rating={lead.lead_progression ?? ""} /> | <CrmLeadSourceRating rating={lead.lead_source ?? ""} /> | {lead.lead_type} </p>

                            <div className="flex flex-wrap items-center gap-0 mt-1">
                                <span className="font-bold">Tags:</span>
                                {hasLeadDigitalAds && leadDigitalAds.map((ad, idx) => (
                                    <span key={`digital-${idx}`} className="ime-tags !mx-1">{ad.digital_campaign}</span>
                                ))}
                            </div>

                        <p>
                            <span className="font-bold">Client Group:</span> {lead.group_name} | 
                            <span className="font-bold">Subscribed to:</span> <span className="text-blue-500">{lead.subs_email ? "Email | " : ""} {lead.subs_whatsapp ? "Whatsapp | " : ""} {lead.subs_imecapital ? "IME Capital | " : ""} {lead.subs_imepms ? "IME PMS" : ""}</span>
                            {lead.referral_partner ? <span className="font-bold">Referral Partner: {lead.referral_partner} </span> :""}
                        </p>
                        <p>
                            <span className="font-bold">Login Profile:</span><span> {lead.login_phone_number} | {lead.user_role_name} |  {formatDate(lead.expires_on)} </span> 
                            
                            
                        </p>
                        <p className="text-sm italic">{lead.lead_summary}</p>
                    </div>
                </div>
            </div> 
            <div className="mt-5">
                <p className="text-sm">{lead.lead_background}</p>
                    {Deals.length > 0 ? (
                        <div className="mt-1 text-sm bg-green-100 p-2 rounded-md mb-4">
                            <span className="font-bold">Ongoing Deals:</span>
                            {Deals.map((deal, index) => (
                                <div key={index}>
                                    <EditDealButton 
                                        dealData={deal} 
                                        dealId={deal.deal_id} 
                                        relLeadId={lead.lead_id}
                                        initialLeadData={lead}
                                    /> | {deal.total_deal_aum} | {deal.deal_likelihood} | {deal.est_closure} | {deal.deal_stage} | {deal.deal_segment}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span> None</span>
                    )}
                
                <h3 className="text-base font-bold">Followups (last 30)</h3>
                <div className="text-sm bg-gray-100 p-2 rounded-md">
                    {Followups.slice(0, 30).map((followup, index) => (
                        <span key={index}>
                            <EditInteractionButton
                                meetingId={followup.meeting_id}
                                interactionData={followup}
                                relLeadId={lead.lead_id}
                                initialLeadData={lead}
                            >
                                {formatDate(followup.created_at)}
                            </EditInteractionButton> ({followup.interaction_channel} - {followup.interaction_tag})
                            {index < Followups.length - 1 && " | "}
                        </span>
                    ))}
                </div>
                <h3>Interactions</h3>
                <TableInteractions data={Meetings} leadsData={[lead]} />
                
            </div>
            
        </div>
    );
}