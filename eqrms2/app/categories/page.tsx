import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableCategories } from "./TableCategories";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const Eqcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Equity'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const Debtcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Debt'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const Hybridcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Hybrid'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const Altcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Alternatives'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const GlobalEqcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Global - Equity'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const GlobalDebtcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Global - Debt'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  const GlobalAltcategory = await supabaseListRead<Category>({
    table: "view_rms_category",
    columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
    filters: [
      (query) => query.eq('rms_show', true),
      (query) => query.eq('asset_class_name', 'Global - Alt'),  
      (query) => query.order('five_yr', { ascending: false }),
    ]
  });

  return (
    <div>
        <Tabs defaultValue="rating_snapshot" className="w-full mx-auto mt-6">
            <TabsList className="w-full">
                <TabsTrigger value="Equity">Equity</TabsTrigger>
                <TabsTrigger value="Debt">Debt</TabsTrigger>
                <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
                <TabsTrigger value="Alternatives">Altenatives</TabsTrigger>
                <TabsTrigger value="Global-Equity">Global-Equity</TabsTrigger>
                <TabsTrigger value="Global-Debt">Global-Debt</TabsTrigger>
                <TabsTrigger value="Global-Alt">Global-Alt</TabsTrigger>
            </TabsList>
            <TabsContent value="Equity">
                <TableCategories data={Eqcategory}/>
            </TabsContent>  
            <TabsContent value="Debt">
                <TableCategories data={Debtcategory}/>
            </TabsContent>
            <TabsContent value="Hybrid">
                <TableCategories data={Hybridcategory}/>
            </TabsContent>
            <TabsContent value="Alternatives">
                <TableCategories data={Altcategory}/>
            </TabsContent>
            <TabsContent value="Global-Equity">
                <TableCategories data={GlobalEqcategory}/>
            </TabsContent>
            <TabsContent value="Global-Debt">
                <TableCategories data={GlobalDebtcategory}/>
            </TabsContent>
            <TabsContent value="Global-Alt">
                <TableCategories data={GlobalAltcategory}/>
            </TabsContent>
        </Tabs>
    </div>
  );
}
