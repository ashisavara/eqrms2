import { blogDetail } from "@/types/blog-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import Link from "next/link";

export default async function BlogsPage() {
  const blogs = await supabaseListRead<blogDetail>({
    table: "blogs",
    columns: "*",
    filters: [
      (query) => query.order('id', { ascending: true })
    ],
  });

  return (
      <div className="ime-blog-page">
        <h1>Blog List</h1>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <span>{blog.id}</span>
            <Link href={`/blogs/${blog.slug}`}><span className="blue-hyperlink my-5">      {blog.title}</span></Link>
          </div>
        ))}
      </div>
  );
}

