import { blogDetail } from "@/types/blog-detail";
import { supabaseStaticListRead } from "@/lib/supabase/serverQueryHelper";
import BlogsClient from "@/app/(public)/blogs/BlogsClient";

export default async function PmsBlogsPage() {
  const blogs = await supabaseStaticListRead<blogDetail>({
    table: "blogs_pms",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false }),
      (query) => query.eq('status', 'Published'),
    ],
  });

  return <BlogsClient blogs={blogs} basePath="/imepms/blog" />;
}
