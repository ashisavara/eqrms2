import { blogDetail } from "@/types/blog-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import BlogsClient from "@/app/(public)/blogs/BlogsClient";

export default async function BlogsPage() {
  const blogs = await supabaseListRead<blogDetail>({
    table: "blogs",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return <BlogsClient blogs={blogs} />;
}

