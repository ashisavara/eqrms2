import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { blogDetail } from "@/types/blog-detail";
import TableBlog from "./TableBlog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogs = await supabaseListRead<blogDetail>({
    table: "blogs",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/internal/public-site/blog/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Blog
          </Button>
        </Link>
      </div>
      <TableBlog data={blogs} />
    </div>
  );
}

