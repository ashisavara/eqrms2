import { EditMediaInterviewForm } from "@/components/forms/EditMediaInterview";
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { notFound } from "next/navigation";

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
        slug: mediaInterviewData.slug || ""
    };

    return (
        <div>
            <EditMediaInterviewForm initialData={initialData} id={interviewId} />
        </div>
    );
}

