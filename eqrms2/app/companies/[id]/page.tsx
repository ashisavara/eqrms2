import { SupabaseSingleResource } from "@/components/supabase/singleRead";
import { fetchOptions, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
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

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params to get the id
  
  // Fetch options for qtr and result rating
  const qtrOptions = await fetchOptions<string, string>("eq_rms_quarters", "quarter", "quarter");
  const resultRatingOptions = await fetchOptions<string, string>("master", "result_rating", "result_rating");
  const qtrNotes = await supabaseListRead<CompanyQrtNotesValues>({
    table: "eq_rms_qrtly_notes_view",
    columns: "*",
    filters: [
      (query) => query.order("quarter_sort", { ascending: false }),
      (query) => query.eq("company_id", id)
    ]
  });


  return (
    <SupabaseSingleResource<Company> table="eq_rms_company_view" columns="*" filters={[(query: any) => query.eq("company_id", id)]}>
      {(company) => (
        <div className="p-4">
          <div className="p-4 m-4 bg-gray-400 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold">{company.ime_name}</h1>
          </div>

          <div className="mb-5 text-xs grid grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <SimpleTable 
                headers = {[{label:"CMP"},{label:"Target"},{label:"Upside"},{label:"Multiple"}]}
                body = {[{value:company.cmp},{value:company.target_price},{value:company.upside},{value:company.multiple}]}
              />
            </div>
            <div className="text-center text-gray-800 mb-5 text-base">
              <span>{company.sector_name}  | </span>
              <span>{company.industry}  | </span>
              <span>{company.coverage} | </span>
              <span><Link href={`/companies/${company.company_id}/edit`} className="text-blue-600 underline hover:text-blue-800">Edit</Link></span>
            </div>
            <div>
              <SimpleTable 
                headers = {[{label:"FY27pe"},{label:"FY26gr"},{label:"FY27gr"},{label:"FY28gr"},{label:"FY29gr"}]}
                body = {[{value:Math.round(company.pe_t2)},{value:Math.round(company.gr_t1)},{value:Math.round(company.gr_t2)},{value:Math.round(company.gr_t3)},{value:Math.round(company.gr_t4)}]}
              />
            </div>
            <div>
              <SimpleTable 
                headers = {[{label:"1m"},{label:"3m"},{label:"1yr"},{label:"3yr"},{label:"5yr"}]}
                body = {[{value:company["1m_return"]},{value:company["3m_return"]},{value:company["1yr_return"]},{value:company["3yrs_return"]},{value:company["5yrs_return"]}]}
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
                headers = {[{label:"Quality"},{label:"Growth"},{label:"Momentum"},{label:"Score"}]}
                body = {[{value:company.quality},{value:company.mt_growth},{value:company.market_momentum},{value:company.stock_score}]}
              />
            </div>
          </div>

          <div className="text-sm">
            <div className="text-blue-900 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.inv_view || ""}</ReactMarkdown>
            </div>

            <div className="text-green-700 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.positive || ""}</ReactMarkdown>
            </div>
            <div className="text-red-700 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.negative || ""}</ReactMarkdown>
            </div>
            <div className="text-orange-700 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.outlook || ""}</ReactMarkdown>
            </div>
            <div className="text-blue-800 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.snapshot || ""}</ReactMarkdown>
            </div>
          </div>

          <ToggleVisibility toggleText="Add quarter notes">
            <QtrNotesForm
              company_id={Number(id)} // Use `id` instead of `params.id`
              qtrOptions={qtrOptions}
              resultRatingOptions={resultRatingOptions}
            />
          </ToggleVisibility>
        
          <div className="flex w-screen text-xs text-center">
            <TableQuarterlyNotes 
              data={qtrNotes} 
              qtrOptions={qtrOptions}
              resultRatingOptions={resultRatingOptions}
              sheetComponent={EditQuarterSheet} 
            />
          </div>

        </div>

        
      )}
    </SupabaseSingleResource>
  );
}

