import { supabaseSingleRead, supabaseListRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId, getCurrentMandateId } from "@/lib/auth/serverGroupMandate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MandateDetail } from "@/types/mandate-detail";
import { FavStructure, FavAssetClass, FavCategory, FavFunds } from "@/types/favourite-detail";
import { TableCategories } from "@/app/categories/TableCategories";
import TableFundScreen from "@/app/funds/TableFundScreen";
import { Category } from "@/types/category-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import FinPlanClientWrapper from "./FinPlanClientWrapper";
import { GoalOptionsProvider } from "@/lib/contexts/GoalOptionsContext";
import { EditMandateButton } from "@/components/forms/EditMandate";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { InteractionDetail } from "@/types/interaction-detail";
import TableShowMeetingNotes from "@/app/crm/TableShowMeetingNotes";
import { LeadsTagging } from "@/types/lead-detail";

export default async function MandatePage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'mandate', 'view_mandate')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

    const groupId = await getCurrentGroupId();
    const mandate = await getCurrentMandateId();

    // If no group selected, show message
  if (!groupId || !mandate) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Investments</h1>
        <p className="text-muted-foreground">
          Please select a group using the "Select Group & Mandate" button to view investments.
        </p>
      </div>
    );
  }

  const [invMandate, favStructure, favAssetClass, favCategory, catPerformance, finGoals, investmentFinPlan, sipFinGoals, meetingNotes, leadsData] = await Promise.all([ 
    supabaseSingleRead<MandateDetail>({
        table: "investment_mandate",
        columns: "*",
        filters: [
            (query) => query.eq("im_id", mandate)
        ],
    }),
    supabaseListRead<FavStructure>({
        table: "view_im_fav_structure",
        columns: "*",
        filters: [
            (query) => query.eq("im_id", mandate)
        ],
    }),
    supabaseListRead<FavAssetClass>({
        table: "view_im_fav_assetclass",
        columns: "*",
        filters: [
            (query) => query.eq("im_id", mandate)
        ],
    }),
    supabaseListRead<FavCategory>({
        table: "view_im_fav_categories",
        columns: "*",
        filters: [
            (query) => query.eq("im_id", mandate)
        ],
    }),
    supabaseListRead<Category>({
        table: "view_im_fav_categories",
        columns: "*",
        filters: [
            (query) => query.eq("im_id", mandate)
        ],
    }),
    supabaseListRead({
        table: "fin_goals",
        columns: "*",
        filters: [
          (query) => query.eq("group_id", groupId)
        ], 
      }),
      supabaseListRead({
        table: "view_investments_details",
        columns: "fund_name, goal_name, investor_name, asset_class_name, cur_amt, fv_inv, goal_id, exp_return, investment_id",
        filters: [
          (query) => query.eq("group_id", groupId)
        ]
      }),
      supabaseListRead({
        table: "view_inv_sip_details",
        columns: "sip_fund_name, goal_name, investor_name, sip_amount, months_left, sip_fv, goal_id, exp_return, sip_id",
        filters: [
          (query) => query.eq("group_id", groupId)
        ], 
      }),
        supabaseListRead<InteractionDetail>({
          table:"view_crm_meeting_notes",
          columns: "*",
          filters: [
            (query) => query.eq("show_to_client",true),
            (query) => query.eq("rel_group_id", groupId)
          ]
        }),
        supabaseListRead<LeadsTagging>({
          table: "view_leads_tagcrm",
          columns: "lead_id, lead_name, rel_group_id",
          filters: [
            (query) => query.eq("rel_group_id", groupId)
          ]
        })
  ])

  if (!invMandate) {
    return <div className="p-4">Mandate not found</div>;
  }

  const goalOptionsForm = finGoals.map(goal => ({
    value: String(goal.goal_id),
    label: goal.goal_name as string
  }));

  return (
    <GoalOptionsProvider goalOptions={goalOptionsForm}>
      <div>
        <div className="pageHeadingBox"><h1>Investment Mandate</h1></div>
          <Tabs defaultValue="mandate" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="mandate">Mandate</TabsTrigger>
              <TabsTrigger value="finplan">Fin Plan</TabsTrigger>
              <TabsTrigger value="meetingnotes">Meeting Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="mandate">
              { can(userRoles, 'mandate', 'edit_mandate') && (
              <EditMandateButton mandateData={invMandate} mandateId={mandate} />)}
                  <div className="flex flex-col md:flex-row gap-2">
                      <div className="border-box md:w-[250px] bg-green-50">
                          <p className="font-bold">Risk Profile</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{invMandate.rp_override || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box md:flex-1">
                          <p className="font-bold">One Line Objective</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{invMandate.one_line_objective || ""}</ReactMarkdown>
                      </div>
                  </div>
                  <div className="text-sm">
                      <div className="border-box">
                          <p className="font-bold">Investment Plan</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{invMandate.inv_plan || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box">
                          <p className="font-bold">Other Mandate Details</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{invMandate.other_mandate_details || ""}</ReactMarkdown>
                      </div>
                  </div>
                  <div className="border-box">
                  <div>
                  <span className="font-bold">Favourite Structures: </span>
                      {favStructure.map((structure, idx) => (
                          <span key={structure.fav_structure_id}>
                              {structure.structure_name}
                              {idx < favStructure.length - 1 && " | "}
                          </span>
                      ))}
                  </div>
                  <div>
                  <span className="font-bold">Favourite Asset Classes: </span>
                      {favAssetClass.map((assetClass, idx) => (
                          <span key={assetClass.fav_asset_class_id}>
                              {assetClass.asset_class_name}
                              {idx < favAssetClass.length - 1 && " | "}
                          </span>
                      ))}
                  </div>
                  <div>
                  <span className="font-bold">Favourite Categories: </span>
                      {favCategory.map((category, idx) => (
                          <span key={category.fav_category_id}>
                              {category.cat_name}
                              {idx < favCategory.length - 1 && " | "}
                          </span>
                      ))}
                  </div>
                  </div>
                  <div>
                      <h3 className="mt-4">Trailing Performance</h3>
                      <TableCategories data={catPerformance} columnType="summary"/>
                      <div className="hidden md:block">
                        <h3 className="mt-4">Annual Performance</h3>
                        <TableCategories data={catPerformance} columnType="annual"/>
                      </div>
                  </div>
            </TabsContent>
            
            <TabsContent value="finplan">
              <FinPlanClientWrapper 
                finGoalsData={finGoals} 
                investmentFinPlanData={investmentFinPlan} 
                sipFinGoalsData={sipFinGoals}
                userRoles={userRoles}
              />
            </TabsContent>
            <TabsContent value="meetingnotes">
            {can(userRoles, 'crm', 'view_leads') && ( 
              <div>
                {leadsData.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {leadsData.map((lead, idx) => (
                      <span key={lead.lead_id}>
                        <a 
                          href={`/crm/${lead.lead_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blue-hyperlink text-sm"
                        >
                          {lead.lead_name}
                        </a>
                        {idx < leadsData.length - 1 && " | "}
                      </span>
                    ))}
                  </div>  
                )}
              </div>
              )}
              <TableShowMeetingNotes data={meetingNotes} />
            </TabsContent>
          </Tabs>

          
          
      </div>
    </GoalOptionsProvider>
  )


}