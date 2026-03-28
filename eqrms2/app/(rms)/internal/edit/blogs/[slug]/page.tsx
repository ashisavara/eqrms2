import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import { EditBlogForm } from './EditBlogForm';
import { blogDetail } from '@/types/blog-detail';
import UserLog from '@/components/rms/UserLog';

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blog = await supabaseSingleRead<blogDetail>({
    table: "blogs",
    columns: "*",
    filters: [
      (query) => query.eq("slug", slug)
    ]
  });

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Blog not found</h1>
        <p className="text-gray-600">The blog you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <UserLog segment="internal-edit-blogs" entityId={blog.id} entitySlug={slug} entityTitle={blog.title ?? null} pagePath="/internal/edit/blogs/[slug]" />
      <EditBlogForm initialData={blog} />
    </>
  );
}
