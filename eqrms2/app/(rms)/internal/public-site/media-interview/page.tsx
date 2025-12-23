import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import TableMediaInterview from "./TableMediaInterview";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function MediaInterviewPage() {
  const mediaInterviews = await supabaseListRead<MediaInterviewDetail>({
    table: "media_interviews",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Media Interviews</h1>
        <Link href="/internal/public-site/media-interview/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Media Interview
          </Button>
        </Link>
      </div>
      <TableMediaInterview data={mediaInterviews} />
    </div>
  );
}

