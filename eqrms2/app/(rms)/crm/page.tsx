import TableCrm from "./TableCrm";
import { LeadsTagging } from "@/types/lead-detail";
import { supabaseListRead, fetchOptions, fetchStringOptions } from "@/lib/supabase/serverQueryHelper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableInteractions from "./TableInteractions";
import TableDeals from "./TableDeals";
import { InteractionDetail } from "@/types/interaction-detail";
import { Deals } from "@/types/deals";
import { AddLeadButton } from "@/components/forms/AddLeads";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function CrmPage() {
    const userRoles = await getUserRoles();
  
    // Check permission first
    if (!can(userRoles, 'crm', 'view_leads')) {
      redirect('/uservalidation'); // or wherever you want to send them
    }


    const [leads, interactions, deals, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, dealEstClousureOptions, dealStageOptions, dealSegmentOptions, importanceOptions, leadProgressionOptions, wealthLevelOptions, leadSourceOptions, leadTypeOptions, primaryRmOptions, customTagOptions, leadRoleOptions, digitalAdOptions, referralPartnerOptions] = await Promise.all([
        supabaseListRead<LeadsTagging>({
            table:"view_leads_tagcrm", 
            columns:"*",
            filters: [
                (query) => query.neq('importance', '0) Avoid'),
            ]
            // removing avoid to stay within 1000 row fetch
        }), 
        supabaseListRead<InteractionDetail>({
            table: "view_crm_meeting_notes",
            columns: "*",
            filters: [
                (query) => query.order('created_at', { ascending: false })
            ]
        }),
        supabaseListRead<Deals>({
            table: "view_deals_with_leads",
            columns: "*",
            filters: [
                (query) => query.order('created_at', { ascending: false }),
                (query) => query.not('deal_stage', 'in', '("0) Lost","1) Cold","7)Won")'),
            ]
        }),
        fetchOptions<string, string>("master","interaction_type", "interaction_type"),
        fetchOptions<string, string>("master","interaction_tag", "interaction_tag"),
        fetchOptions<string, string>("master","interaction_channel_tag","interaction_channel_tag"),
        fetchOptions<string, string>("master","deal_est_closure", "deal_est_closure"),
        fetchOptions<string, string>("master","deal_stage", "deal_stage"),
        fetchOptions<string, string>("master","deal_segment", "deal_segment"),
        fetchOptions<string, string>("master","importance", "importance"),
        fetchOptions<string, string>("master","lead_progression", "lead_progression"),
        fetchOptions<string, string>("master","wealth_level", "wealth_level"),
        fetchOptions<string, string>("master","lead_source", "lead_source"),
        fetchOptions<string, string>("master","lead_type", "lead_type"),
        fetchOptions<string, string>("ime_emp","auth_id", "name"),
        fetchStringOptions("lead_tag_custom_tags","id","custom_tag"),
        fetchStringOptions("lead_roles","lead_role_id","lead_role"),
        fetchStringOptions("lead_tag_digital_ads","id","digital_campaign"),
        fetchOptions<string, string>("view_referral_partner","lead_name","lead_name"),
    ]);

    return (
        <div>
            
            <Tabs defaultValue="crm" className="w-full mx-auto mt-6 text-sm">
                <TabsList className="w-full">
                        <TabsTrigger value="crm">CRM</TabsTrigger>
                        <TabsTrigger value="interactions">Interaction</TabsTrigger>
                        <TabsTrigger value="deals">Deals</TabsTrigger>
                        <TabsTrigger value="mis">MIS</TabsTrigger>
                </TabsList>
                    <TabsContent value="crm">
                        <AddLeadButton referralPartnerOptions={referralPartnerOptions} /> 
                        <TableCrm data={leads} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} 
                        wealthLevelOptions={wealthLevelOptions} dealEstClosureOptions={dealEstClousureOptions} 
                        dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} interactionChannelOptions={interactionChannelOptions} 
                        interactionTagOptions={interactionTagOptions} interactionTypeOptions={interactionTypeOptions} customTagOptions={customTagOptions} 
                        leadRoleOptions={leadRoleOptions} digitalAdOptions={digitalAdOptions} leadSourceOptions={leadSourceOptions} 
                        leadTypeOptions={leadTypeOptions} primaryRmOptions={primaryRmOptions} referralPartnerOptions={referralPartnerOptions}/>
                    </TabsContent>
                    <TabsContent value="interactions">
                         <TableInteractions data={interactions} leadsData={leads} />
                    </TabsContent>
                    <TabsContent value="deals">
                        <TableDeals data={deals} leadsData={leads} />
                    </TabsContent>  
                    <TabsContent value="mis">
                    <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                        <iframe
                        src="https://lookerstudio.google.com/embed/reporting/06d20b80-9641-44e2-9984-90931464ef87/page/p_9bighco3cd"
                        title="Looker Studio Report"
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        style={{ border: 0 }}
                        />
                    </div>
                    </TabsContent>
            </Tabs>
            
        </div>
    );
}