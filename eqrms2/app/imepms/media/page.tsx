import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { supabaseStaticListRead } from "@/lib/supabase/serverQueryHelper";
import MediaInterviewClient from "@/app/(public)/media-interview/MediaInterviewClient";

export default async function PmsMediaPage() {
  const mediaInterview = await supabaseStaticListRead<MediaInterviewDetail>({
    table: "media_interviews",
    columns: "*",
    filters: [
      (query) => query.order('publication_date', { ascending: false }),
    ],
  });

  return <MediaInterviewClient mediaInterview={mediaInterview} basePath="/imepms/media" />;
}
