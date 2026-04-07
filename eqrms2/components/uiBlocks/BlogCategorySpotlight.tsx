// MDX: <BlogCategorySpotlight categorySlug="small-cap" />
// Optional: heading="Custom title" showAnnualReturns

import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { RmsCategoryStanceRating } from "@/components/conditional-formatting";
import EditorialMetricPill from "@/components/uiComponents/editorial-metric-pill";
import { PerformanceFootnote } from "@/components/ui/performance-footnote";

type BlogCategoryRow = {
  cat_name: string;
  cat_long_name: string | null;
  slug: string;
  cat_summary: string | null;
  cat_description: string | null;
  one_yr: number | null;
  three_yr: number | null;
  five_yr: number | null;
  category_stance: string | null;
  category_risk_profile: string | null;
  return_range: string | null;
  exp_return: number | null;
  cy_1: number | null;
  cy_2: number | null;
  cy_3: number | null;
  cy_4: number | null;
  cy_5: number | null;
};

function cleanText(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\r\n/g, "\n").replace(/\n+/g, " ").trim();
}

function formatReturnPct(v: number | null | undefined): string {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return `${Number(v).toFixed(1)}%`;
}

const CATEGORY_COLUMNS =
  "cat_name, cat_long_name, slug, cat_summary, cat_description, one_yr, three_yr, five_yr, category_stance, category_risk_profile, return_range, exp_return, cy_1, cy_2, cy_3, cy_4, cy_5";

export interface BlogCategorySpotlightProps {
  /** `rms_category.slug`, e.g. `small-cap`, `mid-cap` */
  categorySlug: string;
  /** Overrides the default section title (defaults to category display name) */
  heading?: string;
  /** Show a compact row of the five most recent calendar-year averages (cy_1–cy_5) */
  showAnnualReturns?: boolean;
}

export default async function BlogCategorySpotlight({
  categorySlug,
  heading,
  showAnnualReturns = false,
}: BlogCategorySpotlightProps) {
  const slug = categorySlug?.trim();
  if (!slug) {
    return (
      <aside className="my-8 rounded-lg border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
        Provide a <code className="rounded bg-amber-100 px-1">categorySlug</code> (e.g.{" "}
        <code className="rounded bg-amber-100 px-1">small-cap</code>) for this block.
      </aside>
    );
  }

  const row = await supabaseSingleRead<BlogCategoryRow>({
    table: "rms_category",
    columns: CATEGORY_COLUMNS,
    filters: [(q) => q.eq("slug", slug), (q) => q.eq("rms_show", true)],
  });

  if (!row) {
    return (
      <aside className="my-8 rounded-lg border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
        No published category found for slug <span className="font-mono text-stone-800">{slug}</span>.
      </aside>
    );
  }

  const title = heading?.trim() || row.cat_name;
  const summary = cleanText(row.cat_summary);
  const description = cleanText(row.cat_description);

  return (
<div>
      
        
          <h2>
            IME's view on the {title} category
          </h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {row.category_stance && (
            <EditorialMetricPill label="IME stance">
              <RmsCategoryStanceRating rating={row.category_stance} />
            </EditorialMetricPill>
          )}
          {row.category_risk_profile && (
            <EditorialMetricPill label="Risk profile">
              <RmsCategoryStanceRating rating={row.category_risk_profile} />
            </EditorialMetricPill>
          )}
          {row.return_range != null && row.return_range !== "" && (
            <EditorialMetricPill label="Typical return range">
              <span className="font-semibold tabular-nums text-stone-900">{row.return_range}%</span>
            </EditorialMetricPill>
          )}
        </div>

        {summary && (
          <p className="mb-4 text-base leading-relaxed text-stone-800 md:text-[1.05rem]">{summary}</p>
        )}
        {description && (
          <p className="mb-6 text-sm leading-relaxed text-stone-600 md:text-base">{description}</p>
        )}

        <div>
          <h4 className="mb-3 text-sm font-semibold text-stone-800">Category average returns (trailing)</h4>
          <dl className="grid grid-cols-3 gap-3 text-center sm:gap-4">
            <div className="rounded-md bg-white/90 px-2 py-3 shadow-sm ring-1 ring-stone-100">
              <dt className="text-xs font-medium text-stone-500">1 year</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                {formatReturnPct(row.one_yr)}
              </dd>
            </div>
            <div className="rounded-md bg-white/90 px-2 py-3 shadow-sm ring-1 ring-stone-100">
              <dt className="text-xs font-medium text-stone-500">3 year</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                {formatReturnPct(row.three_yr)}
              </dd>
            </div>
            <div className="rounded-md bg-white/90 px-2 py-3 shadow-sm ring-1 ring-stone-100">
              <dt className="text-xs font-medium text-stone-500">5 year</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900">
                {formatReturnPct(row.five_yr)}
              </dd>
            </div>
          </dl>
          <PerformanceFootnote
            variant="muted"
            className="!mt-3"
            additionalText="Figures are category averages across funds in the category, not a single fund."
          />
        </div>

        {showAnnualReturns && (
          <div className="mt-5 rounded-lg border border-dashed border-stone-200 bg-white/50 px-4 py-4">
            <h4 className="mb-3 text-sm font-semibold text-stone-800">Recent calendar years (category average)</h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs sm:text-sm">
              {[row.cy_1, row.cy_2, row.cy_3, row.cy_4, row.cy_5].map((v, i) => (
                <div key={i} className="rounded bg-stone-50 py-2 ring-1 ring-stone-100">
                  <div className="text-[0.65rem] font-medium uppercase tracking-wide text-stone-400">
                    Year {i + 1}
                  </div>
                  <div className="mt-1 font-semibold tabular-nums text-stone-800">{formatReturnPct(v)}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Year 1 is the most recent period in our data; each column is the category average for that calendar year.
            </p>
          </div>
        )}
      </div>
  );
}
