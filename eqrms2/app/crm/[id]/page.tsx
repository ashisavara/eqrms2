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


export default async function CrmDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [lead, Meetings,Followups, Deals, leadRoles, leadDigitalAds, leadCustomTags, importanceOptions, leadProgressionOptions, leadSourceOptions, leadTypeOptions, wealthLevelOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, primaryRmOptions, dealEstClosureOptions, dealStageOptions, dealSegmentOptions] = await Promise.all([
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
        supabaseListRead<LeadRoleDetail>({
            table: "view_lead_roles",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
            ]
        }),
        supabaseListRead<DigitalAdsDetail>({
            table: "view_lead_digital_ads",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
            ]
        }),
        supabaseListRead<CustomTagDetail>({
            table: "view_lead_custom_tags",
            columns: "*",  
            filters: [
                (query) => query.eq('lead_id', id)
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
        fetchOptions<string, string>("master","deal_est_closure","deal_est_closure"),
        fetchOptions<string, string>("master","deal_stage","deal_stage"),
        fetchOptions<string, string>("master","deal_segment","deal_segment"),
    ]);

    if (!lead) {
        return <div>Lead not found</div>;
    }

    const hasLeadCustomTags = leadCustomTags.length > 0;
    const hasLeadRoles = leadRoles.length > 0;
    const hasLeadDigitalAds = leadDigitalAds.length > 0;
    const hasAnyTags = hasLeadCustomTags || hasLeadRoles || hasLeadDigitalAds;

    return (
        <div className="p-5">
            <div className="pageHeadingBox">
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="text-left">
                        <h1>{lead.lead_name}</h1>
                        <p className="text-sm"><span className="font-bold">Last Contact Date:</span> {formatDate(lead.last_contact_date)} <span className="text-blue-500 font-bold">({lead.days_since_last_contact})</span> | <span className="font-bold">Followup Date:</span> {formatDate(lead.followup_date)} <span className="text-blue-500 font-bold">({lead.days_followup})</span> </p>
                        <p className="text-sm">
                        <a href={`https://wa.me/${lead.country_code}${lead.phone_number}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">{lead.country_code}-{lead.phone_number}</a>
                             | {lead.email_1}  {lead.email_2}  {lead.email_3} |  
                            <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">Linkedin</a>
                            

                        </p>
                        <EditLeadsButton leadData={lead} leadId={lead.lead_id} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} primaryRmOptions={primaryRmOptions} />
                        <AddDealButton dealEstClosureOptions={dealEstClosureOptions} dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} relLeadId={lead.lead_id} initialLeadData={lead}  importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                        <AddInteractionButton interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} interactionChannelOptions={interactionChannelOptions} initialLeadData={lead} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                    </div>
                    <div className="text-sm gap-2 flex flex-col">
                        <p><CrmImportanceRating rating={lead.importance ?? ""} /> | <CrmWealthRating rating={lead.wealth_level ?? ""} /> | <CrmProgressionRating rating={lead.lead_progression ?? ""} /> | <CrmLeadSourceRating rating={lead.lead_source ?? ""} /> | {lead.lead_type} | {lead.rm_name} | </p>
                        <p><span className="font-bold">Client Group:</span> {lead.group_name || "None"} | <span className="font-bold">Subscribed to:</span> <span className="text-blue-500">{lead.subs_email ? "Email | " : ""} {lead.subs_whatsapp ? "Whatsapp | " : ""} {lead.subs_imecapital ? "IME Capital | " : ""} {lead.subs_imepms ? "IME PMS" : ""}</span></p>
                        {hasAnyTags && (
                            <p>
                                <span className="font-bold">Tags:</span>
                                {hasLeadCustomTags && (
                                    <span className="ime-tags">{leadCustomTags.map((tag) => tag.custom_tag).join(", ")}</span>
                                )}
                                {hasLeadRoles && (
                                    <span className="ime-tags">{leadRoles.map((role) => role.lead_role).join(", ")}</span>
                                )}
                                {hasLeadDigitalAds && (
                                    <span className="ime-tags">{leadDigitalAds.map((ad) => `${ad.digital_channel} - ${ad.digital_campaign}`).join(", ")}</span>
                                )}
                            </p>
                        )}
                        <p className="text-sm italic">{lead.lead_summary}</p>
                    </div>
                </div>
            </div> 
            <div className="mt-5">
                <p className="text-sm">{lead.lead_background}</p>
                <span className="font-bold">Ongoing Deals:</span>
                <div className="text-sm bg-green-100 p-2 rounded-md mb-4">
                    {Deals.length > 0 ? (
                        <div className="mt-1">
                            {Deals.map((deal, index) => (
                                <div key={index}>
                                    <EditDealButton 
                                        dealData={deal} 
                                        dealId={deal.deal_id} 
                                        dealEstClosureOptions={dealEstClosureOptions} 
                                        dealStageOptions={dealStageOptions} 
                                        dealSegmentOptions={dealSegmentOptions}
                                        relLeadId={lead.lead_id}
                                        initialLeadData={lead}
                                        importanceOptions={importanceOptions}
                                        leadProgressionOptions={leadProgressionOptions}
                                        wealthLevelOptions={wealthLevelOptions}
                                    /> | {deal.total_deal_aum} | {deal.deal_likelihood} | {deal.est_closure} | {deal.deal_stage} | {deal.deal_segment}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span> None</span>
                    )}
                </div>
                <h3 className="text-base font-bold">Followups (last 30)</h3>
                <div className="text-sm bg-gray-100 p-2 rounded-md">
                    {Followups.slice(0, 30).map((followup, index) => (
                        <span key={index}>
                            <EditInteractionButton
                                meetingId={followup.meeting_id}
                                interactionData={followup}
                                interactionTypeOptions={interactionTypeOptions}
                                interactionTagOptions={interactionTagOptions}
                                interactionChannelOptions={interactionChannelOptions}
                                relLeadId={lead.lead_id}
                                initialLeadData={lead}
                                importanceOptions={importanceOptions}
                                leadProgressionOptions={leadProgressionOptions}
                                wealthLevelOptions={wealthLevelOptions}
                            >
                                {formatDate(followup.created_at)}
                            </EditInteractionButton> ({followup.interaction_channel})
                            {index < Followups.length - 1 && " | "}
                        </span>
                    ))}
                </div>
                <TableInteractions data={Meetings} interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} interactionChannelOptions={interactionChannelOptions} leadsData={[lead]} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                
            </div>
            
        </div>
    );
}