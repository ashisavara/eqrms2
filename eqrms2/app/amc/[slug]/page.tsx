import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { RatingDisplay } from "@/components/conditional-formatting";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/funds/TableFundScreen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TwoColLayout from "@/components/tables/TwoColLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AmcPage({ params }: PageProps) {
  const { slug } = await params;

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
          <EditAMCButton 
              amcData={AMC} 
              amcId={AMC.id}
              />
              <EditAmcDueDilButton amcData={AMC} amcId={AMC.id} />
        </div>

      <div>
          <Tabs defaultValue="rating_snapshot" className="ime-tabs">
          <TabsList className="w-full">
                <TabsTrigger value="rating_snapshot">Rating Snapshot</TabsTrigger>
                <TabsTrigger value="rating_rationale">Rating Rationale</TabsTrigger>
                <TabsTrigger value="funds">Funds</TabsTrigger>
          </TabsList>
              <TabsContent value="rating_snapshot">
                  <div className="border-box"><SimpleTable 
                  headers = {[{label:"AMC"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[
                    {value: <RatingDisplay rating={AMC?.amc_rating ?? null} />},
                    {value: <RatingDisplay rating={AMC?.amc_team_rating ?? null} />},
                    {value: <RatingDisplay rating={AMC?.amc_philosophy_rating ?? null} />}
                  ]}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-2">
                    <div>
                      <TwoColLayout label="AMC Pedigree">{AMC.amc_pedigree}</TwoColLayout>
                      <TwoColLayout label="Team Pedigree">{AMC.team_pedigree}</TwoColLayout>
                      <TwoColLayout label="FM Churn Risk">{AMC.inv_team_risk}</TwoColLayout>
                      <TwoColLayout label="AMC Maturity">{AMC.amc_maturity}</TwoColLayout>
                    </div>
                    <div>
                      <TwoColLayout label="Philosphy Name">{AMC.inv_phil_name}</TwoColLayout>
                      <TwoColLayout label="Inv Philosophy">{AMC.inv_philosophy_followed}</TwoColLayout>
                      <TwoColLayout label="Investment Team">{AMC.core_amc_team}</TwoColLayout>
                    </div>
                  </div>
                  </div>
                  <div className="border-box">
                    <h3> Investment Team </h3>
                    {AMC.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: AMC.amc_fm_html }} />}
                  </div>
              </TabsContent>
              <TabsContent value="rating_rationale">
                <div className="border-box flex-col gap-y-5">
                  <TwoColLayout label="View on AMC" containerClassName="mb-4">{AMC.amc_view}</TwoColLayout>
                  <TwoColLayout label="AMC Pedigree" containerClassName="mb-4">{AMC.amc_pedigree_desc}</TwoColLayout>
                  <TwoColLayout label="AMC Team" containerClassName="mb-4">{AMC.team_pedigree_desc}</TwoColLayout>
                  <TwoColLayout label="AMC's Philosophy" containerClassName="mb-4">{AMC.inv_phil_desc}</TwoColLayout>
                  <TwoColLayout label="Other Salient Points" containerClassName="mb-4">{AMC.salient_points}</TwoColLayout>
                </div>
              </TabsContent>
              <TabsContent value="funds">
                  
                  <h3>Recommended Funds</h3>
                    <TableFundScreen data={funds} />
              </TabsContent>  
          </Tabs>
        </div>
    </div>
  );
}