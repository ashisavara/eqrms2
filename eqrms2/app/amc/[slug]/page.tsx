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

  // Fetch options and fund data in parallel
  const [amcPedigreeOptions, amcTeamPedigreeOptions, amcTeamChurnOptions, amcMaturityOptions, amcInvPhilosophyDefOptions, AMC, funds] = await Promise.all([
    fetchOptions<string, string>("master", "amc_pedigree_tag", "amc_pedigree_tag"),
    fetchOptions<string, string>("master", "amc_team_pedigree_tag", "amc_team_pedigree_tag"),
    fetchOptions<string, string>("master", "amc_team_churn_tag", "amc_team_churn_tag"),
    fetchOptions<string, string>("master", "amc_maturity_tag", "amc_maturity_tag"),
    fetchOptions<string, string>("master", "amc_inv_philosophy_def_tag", "amc_inv_philosophy_def_tag"),
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
              amcPedigreeOptions={amcPedigreeOptions}
              amcTeamPedigreeOptions={amcTeamPedigreeOptions}
              amcTeamChurnOptions={amcTeamChurnOptions}
              amcMaturityOptions={amcMaturityOptions}
              amcInvPhilosophyDefOptions={amcInvPhilosophyDefOptions}
              />
              <EditAmcDueDilButton amcData={AMC} amcId={AMC.id} />
        </div>

      <div>
          <Tabs defaultValue="rating_snapshot" className="ime-tabs">
          <TabsList className="w-full">
                <TabsTrigger value="rating_snapshot">Rating Snapshot</TabsTrigger>
                <TabsTrigger value="rating_rationale">Rating Rationale</TabsTrigger>
                <TabsTrigger value="investment_team">Team</TabsTrigger>
          </TabsList>
              <TabsContent value="rating_snapshot">
                  <h3 className="text-center font-bold mb-2"> How we rate the AMC</h3>
                  <SimpleTable 
                  headers = {[{label:"AMC"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[
                    {value: <RatingDisplay rating={AMC?.amc_rating ?? null} />},
                    {value: <RatingDisplay rating={AMC?.amc_team_rating ?? null} />},
                    {value: <RatingDisplay rating={AMC?.amc_philosophy_rating ?? null} />}
                  ]}
                  />
                  <div className="grid grid-cols-2 w-full mt-2 text-base">
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
                  <h3>Recommended Funds</h3>
                  <TableFundScreen data={funds} />
              </TabsContent>
              <TabsContent value="rating_rationale">
              <h3 className="ime-basic-h3"> Rationale behind our AMC rating</h3>
                  <TwoColLayout label="View on AMC" labelClassName="font-bold min-w-[200px]" containerClassName="mb-4">{AMC.amc_view}</TwoColLayout>
                  <TwoColLayout label="AMC's Pedigree" labelClassName="font-bold min-w-[200px]" containerClassName="mb-4">{AMC.amc_pedigree_desc}</TwoColLayout>
                  <TwoColLayout label="AMC's Team" labelClassName="font-bold min-w-[200px]" containerClassName="mb-4">{AMC.team_pedigree_desc}</TwoColLayout>
                  <TwoColLayout label="AMC's Philosophy" labelClassName="font-bold min-w-[200px]" containerClassName="mb-4">{AMC.inv_phil_desc}</TwoColLayout>
                  <TwoColLayout label="Other Salient Points" labelClassName="font-bold min-w-[200px]" containerClassName="mb-4">{AMC.salient_points}</TwoColLayout>
              </TabsContent>
              <TabsContent value="investment_team">
                  <h3 className="ime-basic-h3"> Investment Team </h3>
                  {AMC.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: AMC.amc_fm_html }} />}
              </TabsContent>  
          </Tabs>
        </div>
    </div>
  );
}