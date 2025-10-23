import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import MediaInterviewClient from "./MediaInterviewClient";

export default async function MediaInterviewPage() {
  const mediaInterview = await supabaseListRead<MediaInterviewDetail>({
    table: "media_interviews",
    columns: "*",
    filters: [
      (query) => query.order('publication_date', { ascending: false })
    ],
  });

  return <MediaInterviewClient mediaInterview={mediaInterview} />;
}