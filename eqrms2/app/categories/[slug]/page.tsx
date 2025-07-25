import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundBasic from "@/app/funds/TableFundBasic";
import { EditCatButton } from "@/components/forms/EditCategory";

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
            <h1 className="text-2xl font-bold">{category.cat_name}</h1>
            <p className="font-bold">{category.cat_summary}</p>
            <p>{category.cat_description}</p>
            <EditCatButton categoryData={category} categoryId={category.category_id} />
        </div>
            <div className="p-4 text-sm">
                <h3 className="text-base font-bold text-center">Trailing Returns</h3>
                <SimpleTable 
                headers={[{label:"Category"},{label:"1 yr"},{label:"3 yr"},{label:"5 yr"}]} 
                body={[{value:category.cat_name},{value:Math.round(category.one_yr*10)/10},{value:Math.round(category.three_yr*10)/10},{value:Math.round(category.five_yr*10)/10}]} 
                />
            </div>
            <div className="p-4 text-sm">  
                <h3 className="text-base font-bold text-center">Annual Returns</h3>
                <SimpleTable 
                headers={[{label:"Category"},{label:"2024"},{label:"2023"},{label:"2022"},{label:"2021"},{label:"2020"},{label:"2019"},{label:"2018"},{label:"2017"},{label:"2016"},{label:"2015"}]} 
                body={[{value:category.cat_name},{value:Math.round(category.cy_1*10)/10},{value:Math.round(category.cy_2*10)/10},{value:Math.round(category.cy_3*10)/10},{value:Math.round(category.cy_4*10)/10},{value:Math.round(category.cy_5*10)/10},{value:Math.round(category.cy_6*10)/10},{value:Math.round(category.cy_7*10)/10},{value:Math.round(category.cy_8*10)/10},{value:Math.round(category.cy_9*10)/10},{value:Math.round(category.cy_10*10)/10}]} 
                />
            </div>
            <div className="p-4 text-sm">
                <h3 className="text-base font-bold text-center">Recommended Funds</h3>
                <TableFundBasic data={funds}/>
            </div>
    </div>
  );
}