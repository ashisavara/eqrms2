import { serverSideQuery, getMultipleFilterOptions } from "@/lib/supabase/serverSideQueryHelper";
import { LeadsTagging } from "@/types/lead-detail";
import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./TableCrmTags";

const TABLE_VIEW = "v_lead_tags";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  const filterKeys = [
    "importance",
    "lead_progression",
    "lead_source",
    "lead_type",
    "wealth_level",
    "rm_name",
    "digital_campaign",
  ];

  const filters: Record<string, string[] | number[]> = {};
  filterKeys.forEach((key) => {
    const value = params[key];
    if (value) {
      if (key.includes("rating") || key.includes("_id")) {
        filters[key] = Array.isArray(value) ? value.map(Number) : [Number(value)];
      } else {
        filters[key] = Array.isArray(value) ? value : [value];
      }
    }
  });

  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 50;
  const sortColumn = (params.sort as string) || "days_followup";
  const sortOrder = (params.order as string) || "asc";
  const search = (params.search as string) || "";

  return {
    filters,
    pagination: { page, pageSize },
    sorting: [{ column: sortColumn, direction: sortOrder as "asc" | "desc" }],
    search,
  };
}

export default async function TagsCrmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { filters, pagination, sorting, search } = parseSearchParams(params);

  const supabase = await createClient();

  const filterConfig = {
    importance: { table: TABLE_VIEW, valueCol: "importance", labelCol: "importance" },
    lead_progression: { table: TABLE_VIEW, valueCol: "lead_progression", labelCol: "lead_progression" },
    lead_source: { table: TABLE_VIEW, valueCol: "lead_source", labelCol: "lead_source" },
    lead_type: { table: TABLE_VIEW, valueCol: "lead_type", labelCol: "lead_type" },
    wealth_level: { table: TABLE_VIEW, valueCol: "wealth_level", labelCol: "wealth_level" },
    rm_name: { table: TABLE_VIEW, valueCol: "rm_name", labelCol: "rm_name" },
    digital_campaign: { table: TABLE_VIEW, valueCol: "digital_campaign", labelCol: "digital_campaign" },
  };

  const [filterOptions, tableData, aggregationResult] = await Promise.all([
    getMultipleFilterOptions(
      ["importance", "lead_progression", "lead_source", "lead_type", "wealth_level", "rm_name", "digital_campaign"],
      filterConfig
    ),
    serverSideQuery<LeadsTagging>({
      table: TABLE_VIEW,
      columns: "*",
      filters,
      search,
      searchColumns: ["lead_name", "lead_summary", "rm_name", "lead_source", "lead_type", "lead_progression"],
      pagination,
      sorting,
      staticFilters: [],
    }),
    supabase.rpc("get_crm_aggregations", {
      p_importance: filters.importance ?? null,
      p_lead_progression: filters.lead_progression ?? null,
      p_lead_source: filters.lead_source ?? null,
      p_lead_type: filters.lead_type ?? null,
      p_wealth_level: filters.wealth_level ?? null,
      p_rm_name: filters.rm_name ?? null,
      p_digital_campaign: filters.digital_campaign ?? null,
      p_search: search || null,
    }),
  ]);

  const aggregations = aggregationResult.error ? null : aggregationResult.data;
  if (aggregationResult.error) {
    console.error("Aggregation fetch failed:", aggregationResult.error);
  }

  return (
    <div className="p-4">
        <p>Note: need to create a new aggregation RPC function for the tag table. this still uses the all table which is why aggregations are not working correctly.</p>
    <LeadsTable
      data={tableData.data}
      pagination={{
        currentPage: tableData.currentPage,
        totalPages: tableData.totalPages,
        hasNextPage: tableData.hasNextPage,
        hasPreviousPage: tableData.hasPreviousPage,
        pageSize: tableData.pageSize,
        totalCount: tableData.totalCount,
      }}
      filterOptions={filterOptions as {
        importance: { value: string; label: string }[];
        lead_progression: { value: string; label: string }[];
        lead_source: { value: string; label: string }[];
        lead_type: { value: string; label: string }[];
        wealth_level: { value: string; label: string }[];
        rm_name: { value: string; label: string }[];
        digital_campaign: { value: string; label: string }[];
      }}
      filterConfig={filterConfig}
      searchColumns={["lead_name", "lead_summary", "rm_name", "lead_source", "lead_type", "lead_progression"]}
      aggregations={aggregations}
    />
    </div>
  );
}
