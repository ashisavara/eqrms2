import type { AcademyWebinarDetail } from "@/types/webinar-detail";
import { supabaseStaticListRead } from "@/lib/supabase/serverQueryHelper";
import WebinarsClient from "./WebinarsClient";

export const revalidate = 604800;

export default async function WebinarsPage() {
  const webinars = await supabaseStaticListRead<AcademyWebinarDetail>({
    table: "academy_webinar",
    columns: "*",
    filters: [(query) => query.order("webinar_date", { ascending: false })],
  });

  return <WebinarsClient webinars={webinars} />;
}
