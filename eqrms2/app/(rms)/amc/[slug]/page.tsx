import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { RatingDisplay, RatingDisplayWithStar,RatingContainer } from "@/components/conditional-formatting";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TwoColLayout from "@/components/tables/TwoColLayout";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent static generation issues with dynamic data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AmcPage({ params }: PageProps) {
  const { slug } = await params;

  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'rms', 'view_detailed')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  // Fetch AMC and fund data in parallel
  const [AMC, funds] = await Promise.all([
    supabaseSingleRead<AMC>({
      table: "rms_amc",
      columns: "*",
      filters: [
        (query) => query.eq('slug', slug)
      ]
    }), 
    supabaseListRead<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "*",
      filters: [
        (query) => query.eq('amc_slug', slug)
      ]
    })
  ]);

  if (!AMC) {
    return <div>AMC not found</div>;
  }

  return (
    <div>
        <div className="pageHeadingBox">
          <h1>{AMC.amc_name}</h1>
          {AMC.structure}
          {AMC.aum != null && (
            <>
              {" | AUM: "}
              {AMC.structure === "Global AMC"
                ? `$ ${AMC.aum} bn`
                : `Rs. ${AMC.aum} cr`}
              {" | "}
            </>
          )}
          {(can(userRoles, 'rms', 'edit_rms')) && (
          <>
              <EditAMCButton amcData={AMC} amcId={AMC.id} />
              <EditAmcDueDilButton amcData={AMC} amcId={AMC.id} />
          </>
          )}
          {(can(userRoles,'rms','view_all_funds')) && (
            <>
            {AMC.mkt_material_link && AMC.mkt_material_link.trim() !== "" && (
              <a href={AMC.mkt_material_link} target="_blank" className="blue-hyperlink"> Presentations</a>
            )}
            </>
          )}
        </div>

      <div>
          <Tabs defaultValue="rating_snapshot" className="ime-tabs">
          <TabsList className="w-full">
                <TabsTrigger value="rating_snapshot">Snapshot</TabsTrigger>
                <TabsTrigger value="rating_rationale">Rationale</TabsTrigger>
                <TabsTrigger value="funds">Funds</TabsTrigger>
          </TabsList>
              <TabsContent value="rating_snapshot">
                  <div className="text-sm">
                  <h2 className="ime-basic-h3"> IME AMC rating</h2>
                  <SimpleTable 
                  headers = {[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[
                    {value: <RatingDisplayWithStar rating={AMC?.amc_rating ?? null} />},
                    {value: <RatingDisplayWithStar rating={AMC?.amc_pedigree_rating ?? null} />},
                    {value: <RatingDisplayWithStar rating={AMC?.amc_team_rating ?? null} />},
                    {value: <RatingDisplayWithStar rating={AMC?.amc_philosophy_rating ?? null} />}
                  ]}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-200">
                    
                    <div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">AMC Pedigree</span></div>
                        <div className="w-full pr-4 md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_rating ?? 0}>{AMC.amc_pedigree}</RatingContainer></div>
                      </div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">Team Pedigree</span></div>
                        <div className="w-full pr-4 md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_team_rating ?? 0}>{AMC.team_pedigree}</RatingContainer></div>
                      </div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">FM Churn Risk</span></div>
                        <div className="w-full pr-4 md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_team_rating ?? 0}>{AMC.inv_team_risk}</RatingContainer></div>
                      </div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">AMC Maturity</span></div>
                        <div className="w-full pr-4 md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_rating ?? 0}>{AMC.amc_maturity}</RatingContainer></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">Philosphy Name</span></div>
                        <div className="w-full md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_philosophy_rating ?? 0}>{AMC.inv_phil_name}</RatingContainer></div>
                      </div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">Inv Philosophy</span></div>
                        <div className="w-full md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_philosophy_rating ?? 0}>{AMC.inv_philosophy_followed}</RatingContainer></div>
                      </div>
                      <div className="flex flex-col md:flex-row mb-2">
                        <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">Investment Team</span></div>
                        <div className="w-full md:flex-1 md:min-w-0"><RatingContainer rating={AMC.amc_team_rating ?? 0}>{AMC.core_amc_team}</RatingContainer></div>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className="mt-6">
                    <h2> Investment Team </h2>
                    {AMC.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: AMC.amc_fm_html }} />}
                  </div>
              </TabsContent>
              <TabsContent value="rating_rationale">
                <div className="flex-col gap-y-5 text-sm">
                  <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">View on AMC</span></div>
                    <div className="w-full pr-4 md:flex-1 md:min-w-0">{AMC.amc_view}</div>
                  </div>
                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">AMC Pedigree</span></div>
                    <div className="w-full pr-4 md:flex-1 md:min-w-0">{AMC.amc_pedigree_desc}</div>
                  </div>
                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">AMC Team</span></div>
                    <div className="w-full pr-4 md:flex-1 md:min-w-0">{AMC.team_pedigree_desc}</div>
                  </div>
                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">AMC's Philosophy</span></div>
                    <div className="w-full pr-4 md:flex-1 md:min-w-0">{AMC.inv_phil_desc}</div>
                  </div>
                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-[160px] md:min-w-[160px] md:flex-shrink-0"><span className="font-bold">Other Salient Points</span></div>
                    <div className="w-full pr-4 md:flex-1 md:min-w-0">{AMC.salient_points}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="funds">
                  
                  <h2>Recommended Funds</h2>
                    <TableFundScreen data={funds} />
              </TabsContent>  
          </Tabs>
        </div>
    </div>
  );
}