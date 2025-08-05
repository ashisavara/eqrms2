import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundBasic from "@/app/funds/TableFundBasic";
import { EditCatButton } from "@/components/forms/EditCategory";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { TableCategories } from "@/app/categories/TableCategories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
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
        (query) => query.order('fund_rating', {ascending: false})
        ]
    })
  ]);
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="flex items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">{category.cat_name}</h1>
                <FavouriteHeart 
                    entityType="categories" 
                    entityId={category.category_id} 
                    size="lg"
                />
            </div>
            <p>{category.cat_description}</p>
            <EditCatButton categoryData={category} categoryId={category.category_id} />
        </div>
            <div className="p-4 text-sm">
                <h3 className="text-base font-bold text-center">Trailing Returns</h3>
                <TableCategories data={[category]} columnType="summary"/>
            </div>
            <div className="p-4 text-sm">  
                <h3 className="text-base font-bold text-center">Annual Returns</h3>
                <TableCategories data={[category]} columnType="annual"/>
            </div>
            <div className="p-4 text-sm">
                <h3 className="text-base font-bold text-center">Recommended Funds</h3>
                <TableFundBasic data={funds}/>
            </div>
    </div>
  );
}