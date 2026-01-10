import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";
import { EditFundsButton } from "@/components/forms/EditFunds";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FundRatingSnapshot, FundRatingSnapshotUpgrade, FundRatingRationale, FundRatingRationaleUpgrade } from "@/components/uiComponents/rating-rationales";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FundPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Get user roles for permission checking
  const userRoles = await getUserRoles();
  // Check permission for detailed view (used for rating snapshot and rationale tabs)
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');

  // Fetch fund data
  const fund = await supabaseSingleRead<RmsFundAmc>({
    table: "view_rms_funds_amc",
    columns: "*",
    filters: [
      (query) => query.eq('slug', slug)
    ]
  });

  if (!fund) {
    return <div>Fund not found</div>;
  }

  return (
    <div className="ime-funds-page">
      <div>
        <div className="flex items-center justify-center gap-4 p-4 bg-blue-950">
          <h1 className="text-2xl font-bold text-white">{fund.fund_name}</h1>
          <FavouriteHeart 
            entityType="funds" 
            entityId={fund.fund_id} 
            size="lg"
          />
        </div>
        <div className="px-4 py-0">
        <div className="flex flex-wrap gap-2 justify-center mt-2 text-sm">
            <Link href={`/amc/${fund.amc_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.amc_name} |  </Link>
             {fund.structure_name} -  
            <Link href={`/assetclass/${fund.asset_class_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.asset_class_name} -  </Link>
            <Link href={`/categories/${fund.category_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.category_name} |  </Link>
            <div className="whitespace-nowrap">
              {fund.fund_aum != null && (
                <>
                  AUM: {fund.structure_id === 5 ? `$ ${fund.fund_aum} mn` : `Rs. ${fund.fund_aum} cr`}|
                </>
              )}
            </div>
            <div className="whitespace-nowrap"> Open: {fund.open_for_subscription}  | </div>
            {can(userRoles, 'rms', 'edit_rms') ? 
              <div className="whitespace-nowrap">
                <span>Edit: </span>
                <EditFundsButton 
                fundData={fund} 
                />
                {fund.amc_id && (
                  <>
                    <EditAMCButton 
                    amcData={fund} 
                    amcId={fund.amc_id}
                    />
                    <EditAmcDueDilButton amcData={fund} amcId={fund.amc_id} />
                  </>
                )}
              {can(userRoles, 'rms', 'view_all_funds') && fund.mkt_material_link && fund.mkt_material_link.trim() !== "" && (
                <>
                  <a href={fund.mkt_material_link} target="_blank" className="blue-hyperlink"> Presentations</a>
                </>
              )}
            </div>
            :
            null
            }
        </div>
      <div>
        <Tabs defaultValue="rating_snapshot" className="w-full mx-auto mt-6 text-sm">
          <TabsList className="w-full">
            <TabsTrigger value="rating_snapshot">Snapshot</TabsTrigger>
            <TabsTrigger value="rating_rationale">Rationale</TabsTrigger>
            <TabsTrigger value="investment_team">Team</TabsTrigger>
            <TabsTrigger value="fund_details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="rating_snapshot">
            {hasDetailedAccess ? (
              <FundRatingSnapshot fund={fund} />
            ) : (
              <FundRatingSnapshotUpgrade />
            )}
            <div className="text-base seperator-line">
              <h2 className="ime-basic-h3 mt-4"> Trailing Performance </h2>
              {fund.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.trailing_perf_html }} />}
              <h2 className="ime-basic-h3 mt-6"> Annual Performance </h2>
              {fund.ann_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.ann_perf_html }} />}
              <h2 className="ime-basic-h mt-6"> Portfolio Composition </h2>
              {fund.port_comp_html && <div className="text-sm"><div dangerouslySetInnerHTML={{ __html: fund.port_comp_html }} /></div>}
            </div>
          </TabsContent>
          <TabsContent value="rating_rationale">
            {hasDetailedAccess ? (
              <FundRatingRationale fund={fund} />
            ) : (
              <FundRatingRationaleUpgrade />
            )}
          </TabsContent>
          <TabsContent value="investment_team">
            <div className="text-base">
              <h2 className="ime-basic-h3"> Investment Team </h2>
              {fund.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: fund.amc_fm_html }} />}
            </div>
          </TabsContent>
          <TabsContent value="fund_details">
            <div className="text-base">
              <h2 className="ime-basic-h3"> Fee Structure </h2>
              {fund.fee_structure_html && <div dangerouslySetInnerHTML={{ __html: fund.fee_structure_html }} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
      </div>
    </div>
  );
}