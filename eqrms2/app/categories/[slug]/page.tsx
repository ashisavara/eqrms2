import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundBasic from "@/app/funds/TableFundBasic";
import { EditCatButton } from "@/components/forms/EditCategory";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { TableCategories } from "@/app/categories/TableCategories";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'rms', 'view_detailed')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  const [category, funds] = await Promise.all([
    supabaseSingleRead<Category>({
    table: "rms_category",
    columns: "*",
    filters: [
      (query) => query.eq('slug', slug)
    ]
    }),
    supabaseListRead<RmsFundsScreener>({
        table: "view_rms_funds_screener",
        columns: "*",
        filters: [
        (query) => query.eq('category_slug', slug),
        (query) => query.gt('fund_rating', 3),
        (query) => query.eq('open_for_subscription', 'Y'),
        (query) => query.order('fund_rating', {ascending: false})
        ]
    })
  ]);
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
        <div className="pageHeadingBox">
            <div className="flex items-center justify-center gap-4">
                <h1>{category.cat_name}</h1>
                <FavouriteHeart 
                    entityType="categories" 
                    entityId={category.category_id} 
                    size="lg"
                />
            </div>
            <p className="text-sm">{category.cat_description}</p>
            {(can(userRoles, 'rms', 'edit_rms')) && (
                <EditCatButton categoryData={category} categoryId={category.category_id} />
            )}
        </div>
            <div className="text-sm mt-6">
                <h3>Trailing Returns</h3>
                <PerformanceFootnote additionalText="Category returns are average returns for all funds in category." />
                <TableCategories data={[category]} columnType="summary"/>
            </div>
            <div className="text-sm mt-6 hidden md:block">  
                <h3>Annual Returns</h3>
                <TableCategories data={[category]} columnType="annual"/>
            </div>
            <div className="text-sm mt-6">
                <h3>Recommended Funds</h3>
                <TableFundBasic data={funds}/>
                <PerformanceFootnote additionalText="In recommended funds on the category page, we only show our 4 & 5-star rated funds, to focus on top recommendations & avoid overwhelming investors with too many options. You can use the category filter on the funds page in RMS, to see a larger list including 3-star rated funds. For 2-star and below funds, please connect with your IME Dedicated Private Banker." />
            </div>
    </div>
  );
}