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
import MandateBox from "@/components/uiComponents/mandate-box";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import { LessonSheet } from "@/app/(rms)/academy/LessonSheet";
import UserLog from "@/components/rms/UserLog";

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
      <>
        <UserLog segment="mandate" entityTitle="Investment Mandate" pagePath="/mandate" entitySlug="mandate" />
        <div>
          <h1 className="text-2xl font-bold mb-4">Group Details</h1>
          <p className="text-muted-foreground">
            Please select a group using the "Select Group" button to view details.
          </p>
        </div>
      </>
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
    return (
      <>
        <UserLog segment="mandate" entityId={groupId} entityTitle="Investment Mandate" pagePath="/mandate" entitySlug="mandate" />
        <div className="p-4">Group not found</div>
      </>
    );
  }

  const goalOptionsForm = finGoals.map(goal => ({
    value: String(goal.goal_id),
    label: goal.goal_name as string
  }));

  return (
    <GoalOptionsProvider goalOptions={goalOptionsForm}>
      <UserLog segment="mandate" entityTitle="Investment Mandate" pagePath="/mandate" entitySlug="mandate" />
      <div className="mandatePage">
      <RmsPageTitle 
                title="Investment Mandate" 
                caption="Your strategic investment plan, to help identify the right investments & help you meet your goals" 
            />
        {/* ✅ Top-level filters */}
        <div className="px-4 py-0">
          <Tabs defaultValue="mandate" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="mandate">Mandate</TabsTrigger>
              <TabsTrigger value="finplan">Fin Plan</TabsTrigger>
              <TabsTrigger value="meetingnotes">Meeting Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="mandate">
              <div className="flex gap-2 mb-4">
              <LessonSheet lessonId={2} lessonName="Importance of your Investment Mandate" courseTitle="Investment Mandate" />
                { can(userRoles, 'mandate', 'edit_mandate') && (
                  <EditGroupButton groupData={groupData} groupId={groupId} />
                )} | { can(userRoles, 'mandate', 'edit_mandate') && (<RiskProfilerButton groupId={groupId} />)} |
                  { groupData.google_sheet_link && (<a href={groupData.google_sheet_link} target="_blank" rel="noopener noreferrer" className="blue-hyperlink"> Google Sheet Link
                  </a>
                )}
              </div>
              <MandateBox heading="Progress">
                <MandateProgressBar
                  background_done={groupData.background_done}
                  risk_profile_done={groupData.risk_profile_done}
                  fin_plan_done={groupData.fin_plan_done}
                  inv_plan_done={groupData.inv_plan_done}
                  shortlisting_done={groupData.shortlisting_done}
                />
              </MandateBox>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <MandateBox heading="Last Review">
                        {formatDate(groupData.last_review_date)}
                      </MandateBox>
                      
                      <MandateBox heading="Selected Risk Profile">
                        <div className="font-bold"><ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.rp_override || ""}</ReactMarkdown></div>
                      </MandateBox>
                      
                      <MandateBox heading="Calculated Risk Profile">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_profile_calculated || ""}</ReactMarkdown>
                      </MandateBox>
                      
                      <MandateBox heading="Risk Taking Ability">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_appetite || ""}</ReactMarkdown>
                      </MandateBox>
                      
                      <MandateBox heading="Risk Appetite">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.risk_taking_ability || ""}</ReactMarkdown>
                      </MandateBox>
                  </div>
                  <MandateBox heading="One Line Objective">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.one_line_objective || "-"}</ReactMarkdown>
                  </MandateBox>
                  
                  <MandateBox heading="Investor Background">
                    <p><span className="font-bold"> Products Invested In: </span> {groupData.pdts_invested_in || "_______________"}</p>
                    <p><span className="font-bold"> Years of Investment Experience: </span> {groupData.yrs_investing || "_______________"}</p>
                    <p><span className="font-bold"> Quantum of Investment: </span> {groupData.quantum_of_inv || "_______________"}</p>
                    <p><span className="font-bold"> Past Advisor: </span> {groupData.past_advisor || "_______________"}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.investments_background || "-"}</ReactMarkdown>
                  </MandateBox>
                  
                  <MandateBox heading="Investments Purpose">
                    <p><span className="font-bold"> Portfolio Liquidity Requirements: </span> {groupData.portfolio_liquidity_req || "_______________"}</p>
                    <p><span className="font-bold"> Fin Plan Quality: </span> {groupData.fin_plan_quality || "_______________"}</p>
                    <p><span className="font-bold"> Fin Goals: </span> {groupData.fin_goals || "_______________"}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.investments_purpose || "-"}</ReactMarkdown>
                  </MandateBox>
                      
                  <MandateBox heading="Investment Plan">
                    <p><span className="font-bold"> Comfort Specific Products: </span> {groupData.pdt_comfort || "____________"} </p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.inv_plan || "-"}</ReactMarkdown>
                  </MandateBox>
                
                  
                  <MandateBox heading="To-Dos">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{groupData.other_mandate_details || "-"}</ReactMarkdown>
                  </MandateBox>

                  <MandateBox heading="Shortlisted Universe">
                    <div>
                      {(!groupData.rp_override || groupData.rp_override.trim() === "") ? (
                        <p>
                          <b>Recommendations based on Risk-profile:</b> Please add/select a risk-profile to see recommendations.
                        </p>
                      ) : (
                        <>
                          <p>
                            {(groupData.rp_override.toLowerCase().includes("conservative") || groupData.rp_override.toLowerCase().includes("very conservative")) && (
                              <Link href="/categories/conservative">
                                <button type="button" className="blue-hyperlink px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 transition">{groupData.rp_override} Shortlist</button>
                              </Link>
                            )}
                            {groupData.rp_override.toLowerCase().includes("balanced") && (
                              <Link href="/categories/balanced">
                                <button type="button" className="blue-hyperlink px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 transition">{groupData.rp_override} Shortlist</button>
                              </Link>
                            )}
                            {(groupData.rp_override.toLowerCase().includes("aggressive") || groupData.rp_override.toLowerCase().includes("very aggressive")) && (
                              <Link href="/categories/aggressive">
                                <button type="button" className="blue-hyperlink px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 transition">{groupData.rp_override} Shortlist</button>
                              </Link>
                            )}
                          </p>
                        </>
                      )}
                      <p><Link href="/categories">
                                <button type="button" className="blue-hyperlink px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 transition">Entire Universe</button>
                              </Link> </p>
                              </div>
                      <div className="mt-4">
                      <span className="font-bold">Favourite Structures: </span>
                      {favStructure.map((structure, idx) => (
                          <span key={structure.fav_structure_id}>
                              {structure.structure_slug ? (
                                  <Link href={`/structure/${structure.structure_slug}`} className="blue-hyperlink hover:underline">{structure.structure_name}</Link>
                              ) : (
                                  structure.structure_name
                              )}
                              {idx < favStructure.length - 1 && " | "}
                          </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">Favourite Asset Classes: </span>
                      {favAssetClass.map((assetClass, idx) => (
                          <span key={assetClass.fav_asset_class_id}>
                              {assetClass.asset_class_slug ? (
                                  <Link href={`/assetclass/${assetClass.asset_class_slug}`} className="blue-hyperlink hover:underline">{assetClass.asset_class_name}</Link>
                              ) : (
                                  assetClass.asset_class_name
                              )}
                              {idx < favAssetClass.length - 1 && " | "}
                          </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">Favourite Categories: </span>
                      {favCategory.map((category, idx) => (
                          <span key={category.fav_category_id}>
                              {category.slug ? (
                                  <Link href={`/categories/${category.slug}`} className="blue-hyperlink hover:underline">{category.cat_name}</Link>
                              ) : (
                                  category.cat_name
                              )}
                              {idx < favCategory.length - 1 && " | "}
                          </span>
                      ))}
                    </div>
                  </MandateBox>
            </TabsContent>
            
            <TabsContent value="finplan">
              <FinPlanClientWrapper 
                finGoalsData={finGoals} 
                investmentFinPlanData={investmentFinPlan} 
                sipFinGoalsData={sipFinGoals}
                userRoles={userRoles}
                groupId={groupId}
                groupData={groupData}
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
      </div>
    </GoalOptionsProvider>
  )


}