import { LeadsTagging } from "@/types/lead-detail";
import { supabaseListRead, fetchOptions, fetchStringOptions } from "@/lib/supabase/serverQueryHelper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractionDetail } from "@/types/interaction-detail";
import { Deals } from "@/types/deals";
import { CallsDetail } from "@/types/calls-detail";
import { AddLeadButton } from "@/components/forms/AddLeads";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import TableSales from "./TableSales";
import TableInteractions from "../TableInteractions";
import TableCalls from "./TableCalls";

export default async function CrmPage() {
    const userRoles = await getUserRoles();
  
    // Check permission first
    if (!can(userRoles, 'crm', 'view_leads')) {
      redirect('/uservalidation'); // or wherever you want to send them
    }


    const [leads, interactions, calls, referralPartnerOptions] = await Promise.all([
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
        supabaseListRead<CallsDetail>({
            table: "frejun_call_logs",
            columns: "candidate_number, candidate_name, lead_id, status, call_start_time, call_duration, recording_url, link",
            filters: [(query) => query.order('call_start_time', { ascending: false })],
        }),

        fetchOptions<string, string>("view_referral_partner","lead_name","lead_name"),
    ]);

    return (
        <div className="px-4 py-0">
            
            <Tabs defaultValue="crm" className="w-full mx-auto mt-6 text-sm">
                <TabsList className="w-full">
                        <TabsTrigger value="crm">CRM</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="calls">Calls</TabsTrigger>
                </TabsList>
                    <TabsContent value="crm">
                        <AddLeadButton referralPartnerOptions={referralPartnerOptions} /> 
                        <TableSales data={leads} />
                    </TabsContent>
                    <TabsContent value="interactions">
                    <TableInteractions data={interactions} leadsData={leads} />
                    </TabsContent>
                    <TabsContent value="calls">
                        <TableCalls data={calls} />
                    </TabsContent>
            </Tabs>
            
        </div>
    );
}