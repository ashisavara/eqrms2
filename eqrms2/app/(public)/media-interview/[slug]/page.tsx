import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import YouTube from "@/components/uiComponents/youtube";
import { notFound } from 'next/navigation';
import { getPublicMediaInterviewSlugs, getStaticMediaInterview } from '@/lib/supabase/serverQueryHelper';
import { generateMediaInterviewSEO } from '@/lib/seo/helpers/media-interview';
import type { Metadata } from 'next';

// Generate static params for all published media interviews
export async function generateStaticParams() {
    try {
        const mediaInterviews = await getPublicMediaInterviewSlugs();
        return mediaInterviews.map((mediaInterview) => ({
            slug: mediaInterview.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for media interviews:', error);
        return [];
    }
}

// Generate SEO metadata for media interviews
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const interview = await getStaticMediaInterview(slug);
    if (!interview) return {};
    return generateMediaInterviewSEO(interview);
}

// ISR: Revalidate every 7 days (604800 seconds)
export const revalidate = 604800; // 7 days

export default async function MediaInterviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    console.log('[MediaInterviewPage] Loading media interview with slug:', slug);

    try {
        console.log('[MediaInterviewPage] Fetching media interview from database...');
        const mediaInterview = await getStaticMediaInterview(slug);

        if (!mediaInterview) {
            console.log('[MediaInterviewPage] Media interview not found:', slug);
            notFound();
        }
        
        console.log('[MediaInterviewPage] Media interview found:', mediaInterview.title);

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <h2>{mediaInterview.title}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="text-sm text-gray-600"> {mediaInterview.publication} | {formatDate(mediaInterview.publication_date)}</span>
                </div>
                <p className="mb-6">{mediaInterview.summary }</p>
                <YouTube url={mediaInterview.youtube_url} />
                
            </div>
        );
    } catch (error) {
        console.error('[MediaInterviewPage] ERROR loading media interview:', error);
        return <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600">Error loading media interview</h1>
            <p>There was an error loading this media interview. Please try again later.</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                {error instanceof Error ? error.message : JSON.stringify(error)}
            </pre>
        </div>;
    }
}