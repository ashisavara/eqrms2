import { EditMediaInterviewForm } from "@/components/forms/EditMediaInterview";
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { notFound } from "next/navigation";
import UserLog from '@/components/rms/UserLog';

export default async function EditMediaInterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const interviewId = parseInt(id, 10);
    
    if (isNaN(interviewId)) {
        notFound();
    }

    const mediaInterviewData = await supabaseSingleRead<MediaInterviewDetail>({
        table: "media_interviews",
        columns: "*",
        filters: [
            (query) => query.eq("interview_id", interviewId)
        ],
    });

    if (!mediaInterviewData) {
        notFound();
    }

    // Convert MediaInterviewDetail to MediaInterviewValues format
    // Convert string date to Date object if needed
    const getDateValue = (date: Date | string | null | undefined): Date | null => {
        if (!date) return null;
        if (date instanceof Date) return date;
        return new Date(date);
    };

    const initialData = {
        title: mediaInterviewData.title || "",
        publication: mediaInterviewData.publication || "",
        publication_date: getDateValue(mediaInterviewData.publication_date),
        youtube_url: mediaInterviewData.youtube_url || "",
        summary: mediaInterviewData.summary || "",
        slug: mediaInterviewData.slug || "",
        article_link: mediaInterviewData.article_link || ""
    };

    return (
        <div>
            <UserLog segment="internal-public-site" entityId={interviewId} entitySlug={mediaInterviewData.slug ?? null} entityTitle={mediaInterviewData.title ?? null} pagePath="/internal/public-site/media-interview/edit/[id]" />
            <EditMediaInterviewForm initialData={initialData} id={interviewId} />
        </div>
    );
}

