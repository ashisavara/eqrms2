import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { blogDetail } from "@/types/blog-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { getPmsBlogSlugs, getStaticPmsBlog } from '@/lib/supabase/serverQueryHelper';
import { useMDXComponents } from '@/mdx-components';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const blogs = await getPmsBlogSlugs();
        return blogs.map((blog) => ({ slug: blog.slug }));
    } catch (error) {
        console.error('Error generating static params for PMS blogs:', error);
        return [];
    }
}

export const revalidate = 604800; // 7 days

export default async function PmsBlogPage({ params }: PageProps) {
    const { slug } = await params;

    console.log('[PmsBlogPage] Loading blog with slug:', slug);

    try {
        const blog = await getStaticPmsBlog(slug);

        if (!blog) {
            console.log('[PmsBlogPage] Blog not found:', slug);
            notFound();
        }

        const normalizedBody = blog.body
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        const [remarkBreaks, remarkGfm] = await Promise.all([
            import('remark-breaks').then(mod => mod.default),
            import('remark-gfm').then(mod => mod.default),
        ]);

        const mdxOptions = {
            remarkPlugins: [remarkGfm, remarkBreaks],
        };

        const components = useMDXComponents();

        return (
            <div className="max-w-4xl mx-auto ime-blog-pag px-6 md:px-0 pt-5">
                {blog.featured_image && (
                    <div className="mb-8">
                        <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog${blog.featured_image}`}
                            alt={blog.title}
                            className="w-full h-auto rounded-lg shadow-sm"
                        />
                    </div>
                )}

                <h1 className="text-2xl font-bold mb-2 text-gray-600">{blog.title}</h1>
                <div className="flex flex-row justify-center gap-2">
                    <Badge variant="secondary">{blog.category}</Badge>
                    <span className="text-sm text-gray-500">| Written by IME PMS on {formatDate(blog.created_at)}</span>
                </div>
                <div className="ime-blog-page">
                    <MDXRemote source={normalizedBody} options={{ mdxOptions }} components={components} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('[PmsBlogPage] ERROR loading blog:', error);
        notFound();
    }
}
