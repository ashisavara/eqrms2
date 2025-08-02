import { fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { InteractionDetail } from "@/types/interaction-detail";
import TableInteractions from "./TableInteractions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CrmDetailPage() {
    const [meetings, interaction] = await Promise.all([
        
        supabaseListRead<InteractionDetail>({
            table: "view_meeting_notes_with_leads",
            columns: "*",
            filters: [
                (query) => query.order('created_at', { ascending: false }),
                (query) => query.eq('interaction_type', 'Meeting')
            ]
        }),
        supabaseListRead<InteractionDetail>({
            table: "view_meeting_notes_with_leads",
            columns: "*",
            filters: [
                (query) => query.order('created_at', { ascending: false }),
                (query) => query.eq('interaction_type', 'Interaction')
            ]
        }),
    ]);

    return (
        <div>
            <Tabs defaultValue="meetings" className="w-full mx-auto mt-6 text-sm">
                <TabsList className="w-full">
                        <TabsTrigger value="meetings">Meetings</TabsTrigger>
                        <TabsTrigger value="deals">Deals</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                </TabsList>
                    <TabsContent value="meetings">
                    <TableInteractions data={meetings} />
                    </TabsContent>
                    <TabsContent value="deals">
                        Rating Rationale content
                    </TabsContent>
                    <TabsContent value="interactions">
                        <TableInteractions data={interaction} />
                    </TabsContent>  
            </Tabs>





            
            
        </div>
    );
}