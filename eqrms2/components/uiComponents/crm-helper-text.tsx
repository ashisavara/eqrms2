import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function CrmHelperText() {
    return (
        <div>
            <ToggleVisibility toggleText="Definitions">
            <h2>CRM Helper</h2>
                <Tabs defaultValue="interactions" className="w-full mx-auto mt-6 text-xs">
                    <TabsList className="w-full">
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="importance">Importance</TabsTrigger>
                        <TabsTrigger value="wealth">Wealth</TabsTrigger>
                    </TabsList>
                        <TabsContent value="interactions">
                            <ul>
                            <li><b>Interaction types:</b> Follow-ups (no response back from client) | Meeting (detailed discussion with a client) | Interactions (everything else)</li>
                                <li><b>Basic:</b> Short conversation (not indepth)</li>
                                <li><b>Detail:</b> Detailed converstion (in-depth & completed pitch)</li>
                                <li><b>RMS Demo:</b> Taking through RMS</li>
                                <li><b>Booking:</b> RM Meeting Booked</li>
                                <li><b>Consultation:</b> Has to include one of Portfolio Review, Inv Mandate, Financial Plan, Risk Profiling, Deals or Recommendations</li>
                                <li><b>Deal:</b> Deal discussed with indication to proceed</li>
                                <li><b>Documentation:</b> Documentation related discussion</li>
                                <li><b>Servicing:</b> Servicing related discussions</li>
                            </ul>       
                        </TabsContent>
                        <TabsContent value="importance">
                            <p><b>Important:</b> This is an indicator of ongoing activity levels. Based on the tagging, you are expecting BOTH the last contact date & the follow-up date to be within</p>
                            <ul>
                                <b><u>Active Leads</u></b>
                                <li><b>Urgent:</b> 15 days </li>
                                <li><b>High:</b> 30 days</li>
                                <br/>
                                <b><u>No ongoing activity</u></b>
                                <li><b>Medium: </b> 60 days</li>
                                <li><b>Low: </b> 90 days (low normally for leads that we want to pause for a bit)</li>
                                <li><b>Not Set: </b> Not set</li>
                                <br/>
                                <b><u>RM No longer interested in pursuing</u></b>
                                <li><b>Telecaller: </b> Transfer to Tele-calling team.</li>
                                <li><b>DB Nuture: </b> No more calls from our side - only digital campaigns</li>
                                <li><b>Avoid: </b> Avoid this lead</li>
                                

                            </ul>
                        </TabsContent>
                        <TabsContent value="wealth">
                            <p>Defined as value of liquid financial assets (not including Real Estate with no ST intent to sell)</p>
                            <ul>
                                <li><b>0) NA: </b> Not Applicable (for non-leads)</li>
                                <li><b>0) Unknown: </b> Not sure</li>
                                <li><b>0) Retail: </b> 0 - 50 lakhs</li>
                                <li><b>1) Wealth: </b> 50 lakhs - 2 cr</li>
                                <li><b>2) Affluent: </b> 2 - 10 cr</li>
                                <li><b>3) HNI: </b> 10 - 25cr </li>
                                <li><b>4) Ultra-HNI: </b> 25cr+</li>
                            </ul>
                        </TabsContent>
                </Tabs>
                </ToggleVisibility>


        </div>
    )
}




