import { supabaseSingleRead, supabaseListRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { GroupDetail } from "@/types/group-detail";
import { FavStructure, FavAssetClass, FavCategory, FavFunds } from "@/types/favourite-detail";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { Category } from "@/types/category-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import FinPlanClientWrapper from "./FinPlanClientWrapper";
import { GoalOptionsProvider } from "@/lib/contexts/GoalOptionsContext";
import { EditGroupButton } from "@/components/forms/EditGroup";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { InteractionDetail } from "@/types/interaction-detail";
import TableShowMeetingNotes from "@/app/(rms)/crm/TableShowMeetingNotes";
import { LeadsTagging } from "@/types/lead-detail";
import { RiskProfilerButton } from "./RiskProfilerButton";
import { formatDate } from "@/lib/utils";
import { MandateProgressBar } from "@/components/mandate/MandateProgressBar";

export default async function MandatePage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'mandate', 'view_mandate')) {
    redirect('/uservalidation');
  }

    const groupId = await getCurrentGroupId();

    // If no group selected, show message
  if (!groupId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Group Details</h1>
        <p className="text-muted-foreground">
          Please select a group using the "Select Group" button to view details.
        </p>
      </div>
    );
  }

  const [groupData, favStructure, favAssetClass, favCategory, catPerformance, finGoals, investmentFinPlan, sipFinGoals, meetingNotes, leadsData] = await Promise.all([ 
    supabaseSingleRead<GroupDetail>({
        table: "client_group",
        columns: "*",
        filters: [
            (query) => query.eq("group_id", groupId)
        ],
    }),
    supabaseListRead<FavStructure>({
        table: "view_im_fav_structure",
        columns: "*",
        filters: [
            (query) => query.eq("group_id", groupId)
        ],
    }),
    supabaseListRead<FavAssetClass>({
        table: "view_im_fav_assetclass",
        columns: "*",
        filters: [
            (query) => query.eq("group_id", groupId)
        ],
    }),
    supabaseListRead<FavCategory>({
        table: "view_im_fav_categories",
        columns: "*",
        filters: [
            (query) => query.eq("group_id", groupId)
        ],
    }),
    supabaseListRead<Category>({
        table: "view_im_fav_categories",
        columns: "*",
        filters: [
            (query) => query.eq("group_id", groupId)
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

  if (!groupData) {
    return <div className="p-4">Group not found</div>;
  }

  const goalOptionsForm = finGoals.map(goal => ({
    value: String(goal.goal_id),
    label: goal.goal_name as string
  }));

  return (
    <GoalOptionsProvider goalOptions={goalOptionsForm}>
      <div className="mandatePage">
        <div className="pageHeadingBox"><h1>Group Details</h1></div>
          <Tabs defaultValue="mandate" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="mandate">Details</TabsTrigger>
              <TabsTrigger value="finplan">Fin Plan</TabsTrigger>
              <TabsTrigger value="meetingnotes">Meeting Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="mandate">
              <div className="flex gap-2 mb-4">
                { can(userRoles, 'mandate', 'edit_mandate') && (
                  <EditGroupButton groupData={groupData} groupId={groupId} />
                )}
              </div>
              <div className="border-box">
                <h3>Progress</h3>
                <MandateProgressBar
                  background_done={groupData.background_done}
                  risk_profile_done={groupData.risk_profile_done}
                  fin_plan_done={groupData.fin_plan_done}
                  inv_plan_done={groupData.inv_plan_done}
                  shortlisting_done={groupData.shortlisting_done}
                />
              </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div className="border-box">
                        <b>Last Review:</b><br/> {formatDate(groupData.last_review_date)}
                      </div>
                      <div className="border-box bg-green-50">
                          <p className="font-bold">Selected Risk Profile</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.rp_override || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box bg-blue-50">
                          <div className="flex items-center gap-2">
                            <p className="font-bold">Calculated Risk Profile</p>
                            { can(userRoles, 'mandate', 'edit_mandate') && (<RiskProfilerButton groupId={groupId} />)}
                          </div>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_profile_calculated || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box bg-blue-50">
                          <p className="font-bold">Risk Taking Ability</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_appetite || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box bg-blue-50">
                          <p className="font-bold">Risk Appetite</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_taking_ability || ""}</ReactMarkdown>
                      </div>
                  </div>
                  <div className="border-box">
                          <p className="font-bold">One Line Objective</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.one_line_objective || ""}</ReactMarkdown>
                      </div>
                  <div className="text-sm">
                      <div className="border-box">
                          <p className="font-bold">Investor Background</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.investments_background || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box">
                          <p className="font-bold">Investments Purpose</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.investments_purpose || ""}</ReactMarkdown>
                      </div>
                      
                      <div className="border-box">
                          <p className="font-bold">Investment Plan</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.inv_plan || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box">
                          <p className="font-bold">Investment Recommendations</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.investment_recommendations || ""}</ReactMarkdown>
                      </div>
                      <div className="border-box">
                          <p className="font-bold">To-Dos</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.other_mandate_details || ""}</ReactMarkdown>
                      </div>
                  </div>
                  <div className="border-box">
                  <div>
                  <p className="font-bold">Shortlisted Universe</p>
                  <p>Use the <Link href="/funds" className="blue-hyperlink">RMS</Link> to add your favourite structures, asset classes, and categories.</p>
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