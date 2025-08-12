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
import { CustomTagValues, LeadRoleValues, DigitalAdValues } from "@/types/forms";
import { AddLeadTags } from "@/components/forms/AddLeadTags";
import { AddClientGroup } from "@/components/forms/AddGroup";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { AddCustomTag } from "@/components/forms/AddCustomTag";
import { AddLeadRole } from "@/components/forms/AddLeadRole";
import { AddDigitalAd } from "@/components/forms/AddDigitalAd";


export default async function CrmDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [lead, Meetings,Followups, Deals, leadRoles, leadDigitalAds, leadCustomTags, customTagOptions, leadRoleOptions, digitalAdOptions, importanceOptions, leadProgressionOptions, leadSourceOptions, leadTypeOptions, wealthLevelOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, primaryRmOptions, dealEstClosureOptions, dealStageOptions, dealSegmentOptions, referralPartnerOptions] = await Promise.all([
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
        fetchOptions<string,string>("lead_tag_custom_tags","id","custom_tag"),
        fetchOptions<string,string>("lead_roles","lead_role_id","lead_role"),
        fetchOptions<string,string>("lead_tag_digital_ads","id","digital_campaign"),
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
        fetchOptions<string, string>("view_referral_partner","lead_name","lead_name"),
    ]);

    if (!lead) {
        return <div>Lead not found</div>;
    }

    const hasLeadCustomTags = leadCustomTags.length > 0;
    const hasLeadRoles = leadRoles.length > 0;
    const hasLeadDigitalAds = leadDigitalAds.length > 0;
    const hasAnyTags = hasLeadCustomTags || hasLeadRoles || hasLeadDigitalAds;

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
        <div className="p-5">
            <div className="pageHeadingBox">
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="text-left">
                        <div className="flex flex-row gap-2">
                            <h1>{lead.lead_name}</h1>
                            <ToggleVisibility toggleText="Edit">
                                <EditLeadsButton leadData={lead} leadId={lead.lead_id} importanceOptions={importanceOptions} 
                                leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} 
                                leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} primaryRmOptions={primaryRmOptions} 
                                referralPartnerOptions={referralPartnerOptions} />
                                <AddDealButton dealEstClosureOptions={dealEstClosureOptions} dealStageOptions={dealStageOptions} 
                                dealSegmentOptions={dealSegmentOptions} relLeadId={lead.lead_id} initialLeadData={lead}  
                                importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                                <AddInteractionButton relLeadId={lead.lead_id} interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} 
                                interactionChannelOptions={interactionChannelOptions} initialLeadData={lead} 
                                importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                                <AddCustomTag 
                                    leadId={lead.lead_id} 
                                    customTagOptions={customTagOptions} 
                                />
                                <AddLeadRole 
                                leadId={lead.lead_id} 
                                leadRoleOptions={leadRoleOptions} 
                                />
                                <AddDigitalAd 
                                leadId={lead.lead_id} 
                                digitalAdOptions={digitalAdOptions} 
                                />
                            </ToggleVisibility>

                            {/* 
                            <AddLeadTags leadId={lead.lead_id} customTagOptions={customTagOptions} leadRoleOptions={leadRoleOptions} 
                            digitalAdOptions={digitalAdOptions} lead={leadForForm} importanceOptions={importanceOptions} 
                            leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} 
                            leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} 
                            primaryRmOptions={primaryRmOptions} dealEstClosureOptions={dealEstClosureOptions} 
                            dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} 
                            interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} 
                            interactionChannelOptions={interactionChannelOptions} />*/}
                            </div>
                        
                        <p className="text-sm"><span className="font-bold">Last Contact Date:</span> {formatDate(lead.last_contact_date)} <span className="text-blue-500 font-bold">({lead.days_since_last_contact})</span> | <span className="font-bold">Followup Date:</span> {formatDate(lead.followup_date)} <span className="text-blue-500 font-bold">({lead.days_followup})</span> </p>
                        <p className="text-sm">
                        <a href={`https://wa.me/${lead.country_code}${lead.phone_number}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">{lead.country_code}-{lead.phone_number}</a>
                             | {lead.email_1}  {lead.email_2}  {lead.email_3} |  
                            {lead.linkedin_url ? <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:font-bold hover:underline">Linkedin</a> : ""}
                        </p>
                        
                    </div>
                    <div className="text-sm gap-2 flex flex-col">
                        <p><CrmImportanceRating rating={lead.importance ?? ""} /> | <CrmWealthRating rating={lead.wealth_level ?? ""} /> | <CrmProgressionRating rating={lead.lead_progression ?? ""} /> | <CrmLeadSourceRating rating={lead.lead_source ?? ""} /> | {lead.lead_type} | {lead.rm_name} | </p>
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
                        <p>
                            <span className="font-bold">Client Group:</span> {lead.group_name || <AddClientGroup leadId={lead.lead_id}/>} | 
                            <span className="font-bold">Subscribed to:</span> <span className="text-blue-500">{lead.subs_email ? "Email | " : ""} {lead.subs_whatsapp ? "Whatsapp | " : ""} {lead.subs_imecapital ? "IME Capital | " : ""} {lead.subs_imepms ? "IME PMS" : ""}</span>
                            {lead.referral_partner ? <span className="font-bold">Referral Partner: {lead.referral_partner} </span> :""}
                        </p>
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