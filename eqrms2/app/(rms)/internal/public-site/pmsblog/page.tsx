import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { blogDetail } from "@/types/blog-detail";
import TablePmsBlog from "./TablePmsBlog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function PmsBlogPage() {
  const blogs = await supabaseListRead<blogDetail>({
    table: "blogs_pms",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false }),
    ],
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">PMS Blogs</h1>
        <Link href="/internal/public-site/pmsblog/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Add PMS Blog
          </Button>
        </Link>
      </div>
      <TablePmsBlog data={blogs} />
    </div>
  );
}
