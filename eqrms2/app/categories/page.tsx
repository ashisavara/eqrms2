import { TableCategories } from "./TableCategories";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const category = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, asset_class_name, one_yr, three_yr, five_yr, cat_summary,rms_show ",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.order('five_yr', { ascending: false })
    ]
  });

  return (
    <div>
      <h1 className="text-2xl font-bold m-1">Categories</h1>
      <TableCategories data={category}/>
    </div>
  );
}
