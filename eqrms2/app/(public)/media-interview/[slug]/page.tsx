import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import YouTube from "@/components/uiComponents/youtube";

export default async function MediaInterviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const mediaInterview = await supabaseSingleRead<MediaInterviewDetail>({
        table: "media_interviews",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    });

    if (!mediaInterview) {
        return <div>Media Interviews not found</div>;
    }

    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h2>{mediaInterview.title}</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="text-sm text-gray-600"> {mediaInterview.publication} | {formatDate(mediaInterview.publication_date)}</span>
            </div>
            <p className="mb-6">{mediaInterview.summary }</p>
            <YouTube url={mediaInterview.youtube_url} />
            
        </div>);
    
    }