import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { RatingDisplay } from "@/components/conditional-formatting";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/funds/TableFundScreen";

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
      <div>
        <h1 className="text-2xl font-bold p-4 bg-gray-100 rounded text-center">{AMC.amc_name}</h1>
        <div className="flex flex-row gap-2 justify-center">
            <div> {AMC.amc_name} |  </div>
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
        </div>
      <div>
            <div>
                <div className="border-2 border-gray-300 rounded-md m-2 p-2 text-sm">
                  <h3 className="text-center font-bold mb-2"> How we rate the AMC</h3>
                  <SimpleTable 
                  headers = {[{label:"AMC"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[{value:<RatingDisplay rating={AMC.amc_rating} />},{value:<RatingDisplay rating={AMC.amc_team_rating} />},{value:<RatingDisplay rating={AMC.amc_philosophy_rating} />}]}
                  />
                  <div className="grid grid-cols-2 w-full mt-2 text-base">
                    <div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">AMC Pedigree</span></div>
                          <div className="flex-1 min-w-0">{AMC.amc_pedigree}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Team Pedigree</span></div>
                          <div className="flex-1 min-w-0">{AMC.team_pedigree}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">FM Churn Risk</span></div>
                          <div className="flex-1 min-w-0">{AMC.inv_team_risk}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">AMC Maturity</span></div>
                          <div className="flex-1 min-w-0">{AMC.amc_maturity}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Philosphy Name</span></div>
                          <div className="flex-1 min-w-0">{AMC.inv_phil_name}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Inv Philosophy</span></div>
                          <div className="flex-1 min-w-0">{AMC.inv_philosophy_followed}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Investment Team</span></div>
                          <div className="flex-1 min-w-0">{AMC.core_amc_team}</div>
                      </div>
                  </div>
                </div>
            </div>
          
          <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
                  <h3 className="ime-basic-h3"> Rationale behind our AMC rating</h3>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">View on AMC</span></div>
                      <div className="flex-1 min-w-0">{AMC.amc_view}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Pedigree</span></div>
                      <div className="flex-1 min-w-0">{AMC.amc_pedigree_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Team</span></div>
                      <div className="flex-1 min-w-0">{AMC.team_pedigree_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Philosophy</span></div>
                      <div className="flex-1 min-w-0">{AMC.inv_phil_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Other Salient Points</span></div>
                      <div className="flex-1 min-w-0">{AMC.salient_points}</div>
                  </div>
            </div>
            <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
              <h3 className="ime-basic-h3"> Investment Team </h3>
              {AMC.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: AMC.amc_fm_html }} />}
            </div>
            <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
                <h3>Recommended Funds</h3>
                <TableFundScreen data={funds} />
            </div>
      </div>
    </div>
</div>
  );
}