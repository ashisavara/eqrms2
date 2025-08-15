import { fetchOptions, supabaseListRead, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Company } from "@/types/company-detail";
import SimpleTable from "@/components/tables/singleRowTable";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { QtrNotesForm } from "@/components/forms/AddQtrNotes";
import { TableQuarterlyNotes } from "./TableQuarterlyNotes";
import { EditQuarterSheet } from "./EditQuarterSheet";
import { CompanyQrtNotesValues } from "@/types/forms";
import { RatingDisplay,CompQualityRating, NumberRating, ComGrowthNumberRating, CoverageRating } from "@/components/conditional-formatting";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params to get the id
  
  // Get user roles for permission checking
  const userRoles = await getUserRoles();
  
  // Consolidate all Supabase calls into a single Promise.all for better performance
  const [qtrOptions, resultRatingOptions, qtrNotes, company] = await Promise.all([
    fetchOptions<string, string>("eq_rms_quarters", "quarter", "quarter"),
    fetchOptions<string, string>("master", "result_rating", "result_rating"),
    supabaseListRead<CompanyQrtNotesValues>({
    table: "eq_rms_qrtly_notes_view",
    columns: "*",
    filters: [
      (query) => query.order("quarter_sort", { ascending: false }),
      (query) => query.eq("company_id", id)
    ]
    }),
    supabaseSingleRead<Company>({
      table: "eq_rms_company_view", 
      columns: "*", 
      filters: [(query) => query.eq("company_id", id)]
    })
  ]);

  // Handle case where company is not found
  if (!company) {
    return <div className="p-4">Company not found</div>;
  }

  return (
        <div>
          <div className="pageHeadingBox">
            <h1>{company.ime_name}</h1>
          </div>

          <div className="mb-5 text-xs grid grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <SimpleTable 
                headers = {[{label:"CMP"},{label:"Target"},{label:"TP Multiple"},{label:"Upside"}]}
                body = {[{value:company.cmp},{value:company.target_price},{value:<span className="text-blue-800 font-bold">{Number(company.multiple).toFixed(1)} </span>},{value:<NumberRating rating={company.upside}/>}]}
              />
            </div>
            <div>
              <SimpleTable 
                headers = {[{label:"Quality"},{label:"Growth"},{label:"Momentum"},{label:"Score"}]}
                body = {[{value:<CompQualityRating rating={company.quality}/>},{value:<CompQualityRating rating={company.mt_growth}/>},{value:<CompQualityRating rating={company.market_momentum}/>},{value: <RatingDisplay rating={company.stock_score} />}]}
              />
            </div>
            <div>
              <SimpleTable 
                headers = {[{label:"FY27pe"},{label:"FY26gr"},{label:"FY27gr"},{label:"FY28gr"},{label:"FY29gr"}]}
                body = {[{value:<span className="text-blue-800 font-bold">{Number(company.pe_t2).toFixed(1)} </span>},{value:<ComGrowthNumberRating rating={Math.round(company.gr_t1)}/>},{value:<ComGrowthNumberRating rating={Math.round(company.gr_t2)}/>},{value:<ComGrowthNumberRating rating={Math.round(company.gr_t3)}/>},{value:<ComGrowthNumberRating rating={Math.round(company.gr_t4)}/>}]}
              />
            </div>
            <div>
              <SimpleTable 
                headers = {[{label:"1m"},{label:"3m"},{label:"1yr"},{label:"3yr"},{label:"5yr"}]}
                body = {[{value:<ComGrowthNumberRating rating={company["1m_return"]}/>},{value:<ComGrowthNumberRating rating={company["3m_return"]}/>},{value:<ComGrowthNumberRating rating={company["1yr_return"]}/>},{value:<ComGrowthNumberRating rating={company["3yrs_return"]}/>},{value:<ComGrowthNumberRating rating={company["5yrs_return"]}/>}]}
              />
            </div>
            <div>
              <SimpleTable
              headers={[{ label: "Positive Snapshot"},{ label: "Negative Snapshot"},{ label: "Watch For"}]}
              body={[{ value: company.positive_snapshot, className: 'bg-green-100'  },{ value: company.negative_snapshot, className: 'bg-red-100'  },{ value: company.watch_for, className: 'bg-orange-100'  }]}
              />
            </div>
            <div>
              <SimpleTable
              headers={[{ label: "Coverage"},{ label: "Sector"},{ label: "Industry"},{ label: "Sector Stance"},{ label: "Edit"}]}
              body={[{ value: <CoverageRating rating={company.coverage}/>},{ value: company.sector_name},{ value: company.industry },{ value: company.sector_name},{ value: can(userRoles, 'research', 'edit') ? <Link href={`/companies/${company.company_id}/edit`} className="text-blue-600 underline hover:text-blue-800">Edit</Link> : <span className="text-gray-400">-</span> }]}
              />
            </div>
          </div>

          <div className="text-sm">
          {company.inv_view && (
            <div className=" text-blue-800 mb-5 bg-blue-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.inv_view || ""}</ReactMarkdown>
            </div>
            )}
            
            {company.catalysts && (
            <div className="text-blue-800 mb-5 bg-blue-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.catalysts || ""}</ReactMarkdown>
            </div>
            )}

            {company.business_mix && (
            <div className="text-gray-900 mb-5 bg-gray-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.business_mix || ""}</ReactMarkdown>
            </div>
            )}

            {company.positive && (
            <div className="text-green-800 mb-5 bg-green-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.positive || ""}</ReactMarkdown>
            </div>
            )}

            {company.negative && (
            <div className="text-red-800 mb-5 bg-red-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.negative || ""}</ReactMarkdown>
            </div>
            )}

            {company.outlook && (
            <div className="text-orange-800 mb-5 bg-orange-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.outlook || ""}</ReactMarkdown>
            </div>
            )}

            {company.snapshot && (
            <div className="text-blue-800 mb-5 bg-blue-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.snapshot || ""}</ReactMarkdown>
            </div>
            )}

            {company.hidden && (
            <div className="text-gray-800 mb-5 bg-gray-50 rounded-md p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.hidden || ""}</ReactMarkdown>
            </div>
            )}
          </div>

          <ToggleVisibility toggleText="Add quarter notes">
            <QtrNotesForm
              company_id={Number(id)} // Use `id` instead of `params.id`
              qtrOptions={qtrOptions}
              resultRatingOptions={resultRatingOptions}
            />
          </ToggleVisibility>
        
          <div className="flex w-full text-xs text-center">
            <TableQuarterlyNotes 
              data={qtrNotes} 
              qtrOptions={qtrOptions}
              resultRatingOptions={resultRatingOptions}
              sheetComponent={EditQuarterSheet} 
            />
          </div>

        </div>
  );
}

