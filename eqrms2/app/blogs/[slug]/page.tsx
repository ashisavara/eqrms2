import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { MDXContent } from '@/components/MDXContent';
import { serialize } from 'next-mdx-remote/serialize';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { blogDetail } from "@/types/blog-detail";

interface Blog {
    id: number;
    body: string;
    title: string;
    // Add other blog fields as needed
}

// Fallback revalidation: Rebuild daily as safety net
export const revalidate = 86400; // 24 hours in seconds

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
    try {
        const blogs = await supabaseListRead<Blog>({
            table: "blogs",
            columns: "slug",
            filters: []
        });

        return blogs.map((blog) => ({
            id: blog.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params for blogs:', error);
        return []; // Return empty array on error to avoid build failure
    }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const userRoles = await getUserRoles();
  
    const blog = await supabaseSingleRead<blogDetail>({
        table: "blogs",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    });

    if (!blog) {
        return <div>Blog not found</div>;
    }

    // Normalize content: Clean up excessive newlines
    // Replace 3+ consecutive newlines with exactly 2 (proper paragraph break)
    const normalizedBody = blog.body
        .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with exactly 2
        .trim();  // Remove leading/trailing whitespace

    // Dynamically import remark plugins to avoid ES6 import issues
    const [remarkBreaks, remarkGfm] = await Promise.all([
        import('remark-breaks').then(mod => mod.default),
        import('remark-gfm').then(mod => mod.default)
    ]);

    // Serialize MDX server-side for SEO
    // remarkBreaks: treats single line breaks within paragraphs as <br>
    // remarkGfm: enables GitHub Flavored Markdown (tables, strikethrough, etc.)
    const mdxSource = await serialize(normalizedBody, {
        mdxOptions: {
            remarkPlugins: [
                remarkGfm,
                remarkBreaks
            ]
        },
        parseFrontmatter: true
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Edit Button */}
            {can(userRoles, 'blogs', 'edit') && (
                <div className="mb-6 flex justify-end">
                    <Link href={`/blogs/edit/${slug}`}>
                        <Button variant="outline" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Blog
                        </Button>
                    </Link>
                </div>
            )}

            {/* Blog Content */}
            <h1>{blog.title}</h1>
            <div className="prose prose-lg">
                <MDXContent mdxSource={mdxSource} />
            </div>
        </div>
    )
}