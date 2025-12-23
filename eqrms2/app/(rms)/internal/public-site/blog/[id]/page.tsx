import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { blogDetail } from "@/types/blog-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Force dynamic rendering for internal pages
export const dynamic = 'force-dynamic';

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blogId = parseInt(id, 10);
    
    if (isNaN(blogId)) {
        notFound();
    }

    try {
        const blog = await supabaseSingleRead<blogDetail>({
            table: "blogs",
            columns: "*",
            filters: [
                (query) => query.eq("id", blogId)
            ],
        });

        if (!blog) {
            notFound();
        }
        
        // Normalize content: Clean up excessive newlines
        const normalizedBody = blog.body
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Import remark plugins for MDX rendering
        const [remarkBreaks, remarkGfm] = await Promise.all([
            import('remark-breaks').then(mod => mod.default),
            import('remark-gfm').then(mod => mod.default)
        ]);

        const mdxOptions = {
            remarkPlugins: [remarkGfm, remarkBreaks]
        };
        
        const components = useMDXComponents();

        return (
            <div className="max-w-4xl mx-auto ime-blog-pag px-6 md:px-0 pt-5">
                {/* Edit Button */}
                <div className="mb-4 flex justify-end">
                    <Link href={`/internal/public-site/blog/edit/${blogId}`}>
                        <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white">
                            Edit Blog
                        </Button>
                    </Link>
                </div>

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
                <div className="flex flex-row justify-center mb-4">
                    <Badge variant="secondary">{blog.category}</Badge>
                    <span className="text-sm text-gray-500 ml-2">| Written by IME's Investor Desk on {formatDate(blog.created_at)}</span>
                </div>
                <div className="ime-blog-page">
                    <MDXRemote source={normalizedBody} options={{ mdxOptions }} components={components} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('[BlogPage] ERROR loading blog:', error);
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600">Error loading blog</h1>
                <p>There was an error loading this blog post. Please try again later.</p>
                <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                    {error instanceof Error ? error.message : JSON.stringify(error)}
                </pre>
            </div>
        );
    }
}