import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import Link from "next/link";

export default async function MediaInterviewPage() {
  const mediaInterview = await supabaseListRead<MediaInterviewDetail>({
    table: "media_interviews",
    columns: "*",
    filters: [
      (query) => query.order('publication_date', { ascending: false })
    ],
  });

  return (
      <div className="ime-mediaInterview-page">
        <h1>Media Interviews</h1>
        {mediaInterview.map((mediaInterview) => (
          <div key={mediaInterview.interview_id}>
            <span>{mediaInterview.interview_id}</span>
            <Link href={`/media-interview/${mediaInterview.slug}`}><span className="blue-hyperlink my-5">      {mediaInterview.title}</span></Link>
          </div>
        ))}
      </div>
  );
}

