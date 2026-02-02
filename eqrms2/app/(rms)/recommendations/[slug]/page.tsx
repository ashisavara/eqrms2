import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import { blogDetail } from "@/types/blog-detail";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { useMDXComponents } from '@/mdx-components';

// Force dynamic rendering - no caching for RMS pages
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function RecommendationPage({ params }: PageProps) {
    const { slug } = await params;
    const userRoles = await getUserRoles();

    // Fetch blog data
    const blog = await supabaseSingleRead<blogDetail>({
        table: "blogs",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    });

    if (!blog) {
        notFound();
    }

    // Normalize content: Clean up excessive newlines
    const normalizedBody = blog.body
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Dynamically import remark plugins
    const [remarkBreaks, remarkGfm] = await Promise.all([
        import('remark-breaks').then(mod => mod.default),
        import('remark-gfm').then(mod => mod.default)
    ]);

    const mdxOptions = {
        remarkPlugins: [remarkGfm, remarkBreaks]
    };
    
    const components = useMDXComponents();

    return (
        <div className="max-w-4xl mx-auto ime-blog-page px-6 md:px-0 pt-5">
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
            <h1 className="text-2xl font-bold mb-2 text-gray-600">{blog.title}</h1>
            <div className="flex flex-row justify-center gap-2">
                <Badge variant="secondary">{blog.category}</Badge>
                <span className="text-sm text-gray-500">| Written by IME's Investor Desk on {formatDate(blog.created_at)}</span>
            </div>
            <div className="ime-blog-page">
                <MDXRemote source={normalizedBody} options={{ mdxOptions }} components={components} />
            </div>
        </div>
    );
}
