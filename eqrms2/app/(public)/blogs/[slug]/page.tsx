import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MDXContent } from '@/components/MDXContent';
import { serialize } from 'next-mdx-remote/serialize';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { blogDetail } from "@/types/blog-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Blog {
    id: number;
    body: string;
    title: string;
    // Add other blog fields as needed
}

// Force dynamic rendering since we need cookies for Supabase
export const dynamic = 'force-dynamic';

// Optionally revalidate every 24 hours for better performance
export const revalidate = 86400; // 24 hours in seconds

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  
    console.log('[BlogPage] Loading blog with slug:', slug);
  
    try {
        console.log('[BlogPage] Fetching blog from database...');
        const blog = await supabaseSingleRead<blogDetail>({
            table: "blogs",
            columns: "*",
            filters: [
                (query) => query.eq("slug", slug)
            ]
        });

        if (!blog) {
            console.log('[BlogPage] Blog not found:', slug);
            return <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold">Blog not found</h1>
                <p>The blog post you're looking for doesn't exist.</p>
            </div>;
        }
        
        console.log('[BlogPage] Blog found:', blog.title);
        
        // Get user roles for edit button check (optional - won't break if fails)
        let userRoles: string[] = [];
        try {
            userRoles = await getUserRoles();
            console.log('[BlogPage] User roles retrieved');
        } catch (error) {
            // Silently fail - edit button just won't show
            console.log('[BlogPage] Could not get user roles:', error instanceof Error ? error.message : 'Unknown error');
        }

        console.log('[BlogPage] Normalizing blog content...');
        // Normalize content: Clean up excessive newlines
        // Replace 3+ consecutive newlines with exactly 2 (proper paragraph break)
        const normalizedBody = blog.body
            .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with exactly 2
            .trim();  // Remove leading/trailing whitespace

        console.log('[BlogPage] Importing remark plugins...');
        // Dynamically import remark plugins to avoid ES6 import issues
        const [remarkBreaks, remarkGfm] = await Promise.all([
            import('remark-breaks').then(mod => mod.default),
            import('remark-gfm').then(mod => mod.default)
        ]);

        console.log('[BlogPage] Serializing MDX content...');
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
        
        console.log('[BlogPage] MDX serialization complete');

    return (
        <div className="max-w-4xl mx-auto p-6 ime-blog-page">
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

            {/* Featured Image */}
            {blog.featured_image && (
                <div className="mb-8">
                    <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog${blog.featured_image}`}
                        alt={blog.title}
                        className="w-full h-auto rounded-lg shadow-sm"
                    />
                </div>
            )}

            {/* Blog Content */}
            <h1 className="text-3xl font-bold mb-2 text-gray-600">{blog.title}</h1>
            <div className="flex flex-row justify-center">
                
                <Badge variant="secondary">{blog.category} </Badge>  <span className="text-sm text-gray-500">| Written by IME's Investor Desk on {formatDate(blog.created_at)} </span>
            </div>
            <div className="prose prose-lg">
                <MDXContent mdxSource={mdxSource} />
            </div>
        </div>
    );
    } catch (error) {
        console.error('[BlogPage] ERROR loading blog:', error);
        console.error('[BlogPage] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600">Error loading blog</h1>
            <p>There was an error loading this blog post. Please try again later.</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                {error instanceof Error ? error.message : JSON.stringify(error)}
            </pre>
            <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">Stack trace</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
                    {error instanceof Error ? error.stack : 'No stack trace available'}
                </pre>
            </details>
        </div>;
    }
}