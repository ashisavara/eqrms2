import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "./TableFundScreen";

export default async function FundsPage() {
  const funds = await supabaseListRead<RmsFundsScreener>({
    table: "view_rms_funds_screener",
    columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription, estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
    filters: [
      (query) => query.eq('open_for_subscription', 'Y'),
      (query) => query.gte('fund_rating', 3)
    ]
  });

  return (
    <div>
      <TableFundScreen data={funds} />
    </div>
  );
}

