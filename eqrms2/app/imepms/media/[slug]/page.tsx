import { formatDate } from "@/lib/utils";
import YouTube from "@/components/uiComponents/youtube";
import { notFound } from 'next/navigation';
import { getPublicMediaInterviewSlugs, getStaticMediaInterview } from '@/lib/supabase/serverQueryHelper';
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
    try {
        const mediaInterviews = await getPublicMediaInterviewSlugs();
        return mediaInterviews.map((mediaInterview) => ({ slug: mediaInterview.slug }));
    } catch (error) {
        console.error('Error generating static params for PMS media interviews:', error);
        return [];
    }
}

export const revalidate = 604800; // 7 days

export default async function PmsMediaInterviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const mediaInterview = await getStaticMediaInterview(slug);

        if (!mediaInterview) {
            notFound();
        }

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <h2>{mediaInterview.title}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <span className="text-sm text-gray-600">{mediaInterview.publication} | {formatDate(mediaInterview.publication_date)}</span>
                </div>
                <p className="mb-6">{mediaInterview.summary}</p>
                <YouTube url={mediaInterview.youtube_url} />
                {mediaInterview.article_link && (
                    <a
                        href={mediaInterview.article_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                        <Button>View Article</Button>
                    </a>
                )}
            </div>
        );
    } catch (error) {
        console.error('[PmsMediaInterviewPage] ERROR loading media interview:', error);
        notFound();
    }
}
