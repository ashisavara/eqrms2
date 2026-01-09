import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { AmcRatingSnapshot, AmcRatingSnapshotUpgrade, AmcRatingRationale, AmcRatingRationaleUpgrade } from "@/components/uiComponents/rating-rationales";

// Force dynamic rendering to prevent static generation issues with dynamic data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AmcPage({ params }: PageProps) {
  const { slug } = await params;

  const userRoles = await getUserRoles();
  
  // Check permission for detailed view (used for rating snapshot and rationale tabs)
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');
  

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
        (query) => query.eq('amc_slug', slug),
        (query) => query.gt('fund_rating', 2),
        (query) => query.eq('open_for_subscription', 'Y'),
        (query) => query.order('fund_rating', {ascending: false})
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
                {hasDetailedAccess ? (
                  <AmcRatingSnapshot amc={AMC} />
                ) : (
                  <AmcRatingSnapshotUpgrade />
                )}
                      <div className="mt-6">
                        <h2 className="ime-basic-h3"> Investment Team </h2>
                        {AMC.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: AMC.amc_fm_html }} />}
                      </div>
              </TabsContent>
              <TabsContent value="rating_rationale">
                {hasDetailedAccess ? (
                  <AmcRatingRationale amc={AMC} />
                ) : (
                  <AmcRatingRationaleUpgrade />
                )}
                      {AMC.amc_body && (
                      <div className="rms-body" dangerouslySetInnerHTML={{ __html: AMC.amc_body }} />
                    )}
              </TabsContent>
              <TabsContent value="funds">
                  
                  <h2>Recommended Funds</h2>
                    <TableFundScreen data={funds} userRoles={userRoles} />
              </TabsContent>  
          </Tabs>
        </div>
    </div>
  );
}