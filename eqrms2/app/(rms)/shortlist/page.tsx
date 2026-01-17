import { supabaseListRead, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { FavFunds, FavCategory, FavStructure, FavAssetClass } from "@/types/favourite-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import { Category } from "@/types/category-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { FundAmcComparison } from "@/components/uiComponents/fund-amc-comparison";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";


export default async function InvestmentsPage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'investments', 'view_investments')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }


  // Get current group ID from cookies (server-side)
  const groupId = await getCurrentGroupId();
  
  // If no group selected, show message
  if (!groupId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Investments</h1>
        <p className="text-muted-foreground">
          Please select a group using the "Select Group" button to view investments.
        </p>
      </div>
    );
  }
  // Fetch investments for the selected group (server-side)
  const [favFunds, favStructure, favAssetClass, favCategory, catPerformance, fundComparisons] = await Promise.all([
    supabaseListRead<RmsFundsScreener>({
      table: "view_im_fav_funds",
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
    supabaseListRead<{ fund_id: number | null }>({
      table: "im_fund_comparison",
      columns: "fund_id",
      filters: [
        (query) => query.eq("group_id", groupId)
      ],
    })
  ]);

  const fundComparisonIds = fundComparisons
    .map((item) => item.fund_id)
    .filter((fundId): fundId is number => Number.isFinite(fundId));

  return (
    <div>
        <RmsPageTitle 
                title="Shortlist" 
                caption="Your shortlisted asset classes, categories, investment structures & funds." 
            />

        <div className="px-4 py-0">
        <Tabs defaultValue="categories" className="ime-tabs mt-6">
              <TabsList className="w-full">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="funds">Funds</TabsTrigger>
                    <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
            </TabsList>
                  <TabsContent value="categories">
                    <div className="border-box">
                      <div>
                        <span className="font-bold">Shortlisted Universe: </span>
                        <span>Use the <Link href="/funds" className="blue-hyperlink">RMS</Link> to add your favourite structures, asset classes, and categories.</span><br/><br/>
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
                      <h3 className="mt-8">Trailing Performance</h3>
                      <TableCategories data={catPerformance} columnType="summary" userRoles={userRoles} />
                      <div className="hidden md:block">
                        <h3 className="mt-8">Annual Performance</h3>
                        <TableCategories data={catPerformance} columnType="annual" userRoles={userRoles} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="funds">
                  <TableFundScreen data={favFunds} userRoles={userRoles} />
                  </TabsContent>
                  <TabsContent value="comparisons">
                  <FundAmcComparison fundIds={fundComparisonIds} />
                  </TabsContent>
            </Tabs>   

    </div>
    </div>
  );
}