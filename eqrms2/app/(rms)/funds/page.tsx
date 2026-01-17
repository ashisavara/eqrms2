import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "./TableFundScreen";
import { TableAmcScreen } from "@/app/(rms)/amc/TableAmcScreen";
import { AMC } from "@/types/amc-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";

// Force dynamic rendering to prevent static generation issues with AMC data
export const dynamic = 'force-dynamic';

export default async function FundsPage() {
  const userRoles = await getUserRoles();

  const [funds, mfAmc, pmsAmc, globalAmc] = await Promise.all([
    supabaseListRead<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription, estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters: [
        (query) => query.eq('open_for_subscription', 'Y'),
        (query) => query.gte('fund_rating', 3), 
        (query) => query.order('fund_rating', { ascending: false }),
        (query) => query.order('structure_name', { ascending: false }),
        (query) => query.order('asset_class_id', { ascending: true }),
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.eq('structure', ['MF']),
        (query) => query.gt('amc_rating', 2),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.in('structure', ['PMS','AIF']),
        (query) => query.gt('amc_rating', 2),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.eq('structure', ['Global AMC']),
        (query) => query.gt('amc_rating', 2),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
  ]);


  return (
    <div>
      <RmsPageTitle 
                title="IME RMS" 
                caption="Direct access to IME Central Research Team's insights across funds, AMC's, asset classes, categories & more." 
            />
        {/* ✅ Top-level filters */}
        <div className="px-4 py-0">
        <Tabs defaultValue="funds" className="w-full mx-auto mt-6 text-sm">
            <TabsList className="w-full">
                <TabsTrigger value="funds">Funds</TabsTrigger>
                <TabsTrigger value="amc">AMCs</TabsTrigger>
          </TabsList>
                <TabsContent value="funds">
                    <TableFundScreen data={funds} userRoles={userRoles} />
                    <PerformanceFootnote />
                </TabsContent>
                <TabsContent value="amc">
                  <Tabs defaultValue="MF" className="w-full mx-auto mt-2">
                      <TabsList className="w-full">
                          <TabsTrigger value="MF">MF</TabsTrigger>
                          <TabsTrigger value="PMS/AIF">PMS/AIF</TabsTrigger>
                          <TabsTrigger value="Global">Global</TabsTrigger>
                      </TabsList>
                      <TabsContent value="MF">
                        <TableAmcScreen data={mfAmc} userRoles={userRoles} />
                      </TabsContent>
                      <TabsContent value="PMS/AIF">
                        <p className="text-sm text-gray-500 mt-0 mb-0">Note: Certain PMS AMCs also offer AIF's similar to their PMS offerings, that are managed by the same team. Prominent examples include Alfaccurate, Buoyant, Carnelian, Sameeksha, Abakkus, WhiteOak and others. </p>
                        <TableAmcScreen data={pmsAmc} userRoles={userRoles} />
                      </TabsContent>
                      <TabsContent value="Global">
                        <TableAmcScreen data={globalAmc} userRoles={userRoles} />
                      </TabsContent>
                  </Tabs>
                </TabsContent>
      </Tabs>




    </div>
     
    </div>
  );
}

