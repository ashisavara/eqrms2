import TableCrm from "./TableCrm";
import { LeadsTagging } from "@/types/lead-detail";
import { supabaseListRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableInteractions from "./TableInteractions";
import TableDeals from "./TableDeals";
import { InteractionDetail } from "@/types/interaction-detail";
import { Deals } from "@/types/deals";
import { AddLeadButton } from "@/components/forms/AddLeads";

export default async function CrmPage() {

    const [leads, interactions, deals, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, dealEstClousureOptions, dealStageOptions, dealSegmentOptions, importanceOptions, leadProgressionOptions, wealthLevelOptions, leadSourceOptions, leadTypeOptions] = await Promise.all([
        supabaseListRead<LeadsTagging>({
            table:"view_leads_tagcrm", 
            columns:"lead_id, lead_name, days_followup, days_since_last_contact, importance, wealth_level, lead_progression, lead_summary, lead_source, lead_type, rm_name, last_contact_date, followup_date, country_code, phone_number",
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
    ]);

    return (
        <div>
            <Tabs defaultValue="crm" className="w-full mx-auto mt-6 text-sm">
                <TabsList className="w-full">
                        <TabsTrigger value="crm">CRM</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="deals">Deals</TabsTrigger>
                </TabsList>
                    <TabsContent value="crm">
                        <AddLeadButton importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} />
                        <TableCrm data={leads} importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} dealEstClosureOptions={dealEstClousureOptions} dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} interactionChannelOptions={interactionChannelOptions} interactionTagOptions={interactionTagOptions} interactionTypeOptions={interactionTypeOptions} />
                    </TabsContent>
                    <TabsContent value="interactions">
                         <TableInteractions data={interactions} interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} interactionChannelOptions={interactionChannelOptions} />
                    </TabsContent>
                    <TabsContent value="deals">
                        <TableDeals data={deals} dealEstClousureOptions={dealEstClousureOptions} dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} />
                    </TabsContent>  
            </Tabs>
            
        </div>
    );
}