import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Force dynamic rendering for internal pages
export const dynamic = 'force-dynamic';

export default async function MediaInterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const interviewId = parseInt(id, 10);
    
    if (isNaN(interviewId)) {
        notFound();
    }

    try {
        const mediaInterview = await supabaseSingleRead<MediaInterviewDetail>({
            table: "media_interviews",
            columns: "*",
            filters: [
                (query) => query.eq("interview_id", interviewId)
            ],
        });

        if (!mediaInterview) {
            notFound();
        }

        return (
            <div className="max-w-4xl mx-auto px-6 md:px-0 pt-5">
                {/* Edit Button */}
                <div className="mb-4 flex justify-end">
                    <Link href={`/internal/public-site/media-interview/edit/${interviewId}`}>
                        <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white">
                            Edit Media Interview
                        </Button>
                    </Link>
                </div>

                {/* Media Interview Content */}
                <h1 className="text-3xl font-bold mb-2 text-gray-600">{mediaInterview.title}</h1>
                <div className="flex flex-row justify-center mb-4">
                    <Badge variant="secondary">{mediaInterview.publication}</Badge>
                    {mediaInterview.publication_date && (
                        <span className="text-sm text-gray-500 ml-2">| Published on {formatDate(mediaInterview.publication_date)}</span>
                    )}
                </div>
                
                {mediaInterview.youtube_url && (
                    <div className="mb-6">
                        <a 
                            href={mediaInterview.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                        >
                            Watch on YouTube
                        </a>
                    </div>
                )}

                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{mediaInterview.summary}</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('[MediaInterviewPage] ERROR loading media interview:', error);
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600">Error loading media interview</h1>
                <p>There was an error loading this media interview. Please try again later.</p>
                <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                    {error instanceof Error ? error.message : JSON.stringify(error)}
                </pre>
            </div>
        );
    }
}

