import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { RatingDisplay, RatingDisplayWithStar,RatingContainer,RmsFundFmChurnRiskRating,RmsAmcMaturityRating } from "@/components/conditional-formatting";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TwoColLayout from "@/components/tables/TwoColLayout";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";

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
                      <FlexRms2Col label="AMC Pedigree">
                        <RatingContainer rating={AMC.amc_rating ?? 0}>{AMC.amc_pedigree}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Team Pedigree">
                        <RatingContainer rating={AMC.amc_team_rating ?? 0}>{AMC.team_pedigree}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="FM Churn Risk">
                        <RmsFundFmChurnRiskRating rating={AMC.inv_team_risk ?? ''} />
                      </FlexRms2Col>
                      <FlexRms2Col label="AMC Maturity">
                        <RmsAmcMaturityRating rating={AMC.amc_maturity ?? ''} />
                      </FlexRms2Col>
                    </div>
                    <div>
                      <FlexRms2Col label="Philosphy Name">
                        <RatingContainer rating={AMC.amc_philosophy_rating ?? 0}>{AMC.inv_phil_name}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Inv Philosophy">
                        <RatingContainer rating={AMC.amc_philosophy_rating ?? 0}>{AMC.inv_philosophy_followed}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Investment Team">
                        <RatingContainer rating={AMC.amc_team_rating ?? 0}>{AMC.core_amc_team}</RatingContainer>
                      </FlexRms2Col>
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
                  {AMC.amc_view && AMC.amc_view.trim() !== "" && (
                    <FlexRms2Col label="View on AMC">
                      {AMC.amc_view}
                    </FlexRms2Col>
                  )}
                  {AMC.amc_pedigree_desc && AMC.amc_pedigree_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC Pedigree">
                      {AMC.amc_pedigree_desc}
                    </FlexRms2Col>
                  )}
                  {AMC.team_pedigree_desc && AMC.team_pedigree_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC Team">
                      {AMC.team_pedigree_desc}
                    </FlexRms2Col>
                  )}
                  {AMC.inv_phil_desc && AMC.inv_phil_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC's Philosophy">
                      {AMC.inv_phil_desc}
                    </FlexRms2Col>
                  )}
                  {AMC.salient_points && AMC.salient_points.trim() !== "" && (
                    <FlexRms2Col label="Other Salient Points">
                      {AMC.salient_points}
                    </FlexRms2Col>
                  )}
                </div>
                {AMC.amc_body && <div className="rms-body" dangerouslySetInnerHTML={{ __html: AMC.amc_body }} />}
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