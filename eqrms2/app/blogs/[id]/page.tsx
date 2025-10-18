import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MDXContent } from '@/components/MDXContent';
import { serialize } from 'next-mdx-remote/serialize';

interface Blog {
    id: number;
    body: string;
    // Add other blog fields as needed
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await supabaseSingleRead<Blog>({
        table: "blogs",
        columns: "*",
        filters: [
            (query) => query.eq("id", id)
        ]
    });

    if (!blog) {
        return <div>Blog not found</div>;
    }

    // Serialize MDX server-side for SEO
    const mdxSource = await serialize(blog.body);

    return (
        <div className="prose prose-lg">
            <MDXContent mdxSource={mdxSource} />
        </div>
    )
}