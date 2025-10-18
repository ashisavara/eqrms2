import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MDXContent } from '@/components/MDXContent';
import { serialize } from 'next-mdx-remote/serialize';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

interface Blog {
    id: number;
    body: string;
    // Add other blog fields as needed
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const userRoles = await getUserRoles();
  
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
        <div className="max-w-4xl mx-auto p-6">
            {/* Edit Button */}
            {can(userRoles, 'blogs', 'edit') && (
                <div className="mb-6 flex justify-end">
                    <Link href={`/blogs/edit/${id}`}>
                        <Button variant="outline" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Blog
                        </Button>
                    </Link>
                </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg">
                <MDXContent mdxSource={mdxSource} />
            </div>
        </div>
    )
}