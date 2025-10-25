import { MDXContent } from '@/components/MDXContent';
import { serialize } from 'next-mdx-remote/serialize';
import { blogDetail } from "@/types/blog-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { getPublicBlogSlugs, getStaticBlog } from '@/lib/supabase/serverQueryHelper';
import { generateBlogSEO } from '@/lib/seo/helpers/blog';
import type { Metadata } from 'next';

interface Blog {
    id: number;
    body: string;
    title: string;
    // Add other blog fields as needed
}

// Generate static params for all published blogs
export async function generateStaticParams() {
    try {
        const blogs = await getPublicBlogSlugs();
        return blogs.map((blog) => ({
            slug: blog.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for blogs:', error);
        return [];
    }
}

// Generate SEO metadata for blog posts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getStaticBlog(slug);
    if (!blog) return {};
    return generateBlogSEO(blog);
}

// ISR: Revalidate every 7 days (604800 seconds)
export const revalidate = 604800; // 7 days

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  
    console.log('[BlogPage] Loading blog with slug:', slug);
  
    try {
        console.log('[BlogPage] Fetching blog from database...');
        const blog = await getStaticBlog(slug);

        if (!blog) {
            console.log('[BlogPage] Blog not found:', slug);
            notFound();
        }
        
        console.log('[BlogPage] Blog found:', blog.title);

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