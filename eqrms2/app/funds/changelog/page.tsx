import { TableRmsChangeLog } from "./TableChangelog";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsChangelog } from "@/types/rms-changelog-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const changeLog = await supabaseListRead<RmsChangelog>({
    table: "view_rms_change_log",
    columns: "id,created_at, change_type, change_desc, team_discussed, fund_slug, amc_slug, fund_name, amc_name",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ]
  });

  return (
    <div>
      <h1 className="text-2xl font-bold m-1">ChangeLog</h1>
      <TableRmsChangeLog data={changeLog}/>
    </div>
  );
}
