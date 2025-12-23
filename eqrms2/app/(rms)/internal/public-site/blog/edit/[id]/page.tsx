import { EditBlogForm } from "@/components/forms/EditBlog";
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { blogDetail } from "@/types/blog-detail";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blogId = parseInt(id, 10);
    
    if (isNaN(blogId)) {
        notFound();
    }

    const blogData = await supabaseSingleRead<blogDetail>({
        table: "blogs",
        columns: "*",
        filters: [
            (query) => query.eq("id", blogId)
        ],
    });

    if (!blogData) {
        notFound();
    }

    // Convert blogDetail to BlogValues format
    const initialData = {
        title: blogData.title || "",
        body: blogData.body || "",
        featured_image: blogData.featured_image || "",
        status: blogData.status || "",
        category: blogData.category || ""
    };

    return (
        <div>
            <EditBlogForm initialData={initialData} id={blogId} />
        </div>
    );
}