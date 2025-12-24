import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { blogDetail } from "@/types/blog-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { getPublicBlogSlugs, getStaticBlog } from '@/lib/supabase/serverQueryHelper';
import { generateBlogSEO } from '@/lib/seo/helpers/blog';
import { SEO_DEFAULTS } from '@/lib/seo/constants';
import type { Metadata } from 'next';
import { useMDXComponents } from '@/mdx-components';
import RmaCta from "@/components/uiComponents/rma-cta";


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
    try {
        const { slug } = await params;
        const blog = await getStaticBlog(slug);
        if (!blog) return {};
        return generateBlogSEO(blog);
    } catch (error) {
        console.error('Error generating metadata for blog:', error);
        // Return safe default metadata to prevent 5xx errors
        return {
            title: 'IME Capital Blog',
            description: SEO_DEFAULTS.defaultDescription,
        };
    }
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

        console.log('[BlogPage] Preparing MDX options...');
        // Prepare MDX options for server-side rendering
        // remarkBreaks: treats single line breaks within paragraphs as <br>
        // remarkGfm: enables GitHub Flavored Markdown (tables, strikethrough, etc.)
        const mdxOptions = {
            remarkPlugins: [remarkGfm, remarkBreaks]
        };
        
        const components = useMDXComponents();
        
        console.log('[BlogPage] MDX ready for rendering');

    return (
        <div className="max-w-4xl mx-auto ime-blog-pag px-6 md:px-0 pt-5">
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
            <div className="ime-blog-page">
                <MDXRemote source={normalizedBody} options={{ mdxOptions }} components={components} />
            </div>
            <h2>Experience the benefits of working with a 'research-first' investments firm</h2>
            <RmaCta />
        </div>
    );
    } catch (error) {
        console.error('[BlogPage] ERROR loading blog:', error);
        // Log full error details for debugging
        console.error('[BlogPage] Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
        // Show 404 to user (cleaner UX, no technical details exposed)
        notFound();
    }
}