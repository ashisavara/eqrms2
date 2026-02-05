import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import WhitepapersClient from "./WhitepapersClient";

export default async function WhitepapersPage() {
  const whitepapers = await supabaseListRead<AcademyWhitepaperDetail>({
    table: "academy_whitepapers",
    columns: "*",
    filters: [(query) => query.order("whitepaper_date", { ascending: false })],
  });

  return <WhitepapersClient whitepapers={whitepapers} />;
}
