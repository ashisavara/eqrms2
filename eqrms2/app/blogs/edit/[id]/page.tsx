import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import { EditBlogForm } from './EditBlogForm';

interface Blog {
  id: number;
  created_at: string;
  body: string;
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const blog = await supabaseSingleRead<Blog>({
    table: "blogs",
    columns: "*",
    filters: [
      (query) => query.eq("id", id)
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

  return <EditBlogForm initialData={blog} />;
}
