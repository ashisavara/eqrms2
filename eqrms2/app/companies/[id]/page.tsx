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
          <div className="p-4 m-4 bg-gray-600 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold">{company.ime_name}</h1>
          </div>

          <div className="text-center text-gray-700 mb-5">
            <span>{company.sector_name}  | </span>
            <span>{company.industry}  | </span>
            <span>{company.coverage} | </span>
            <span><Link href={`/companies/${company.company_id}/edit`} className="text-blue-600 underline hover:text-blue-800">Edit</Link></span>
          </div>

          <div className="mb-5 text-sm">
            <SimpleTable
              headers={[
                { label: "Positive Snapshot"},
                { label: "Negative Snapshot"},
                { label: "Watch For"}
              ]}
              body={[
                { value: company.positive_snapshot, className: 'bg-green-100'  },
                { value: company.negative_snapshot, className: 'bg-red-100'  },
                { value: company.watch_for, className: 'bg-orange-100'  }
              ]}
            />
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
        
          <TableQuarterlyNotes 
            data={qtrNotes} 
            qtrOptions={qtrOptions}
            resultRatingOptions={resultRatingOptions}
            sheetComponent={EditQuarterSheet} 
          />

        </div>

        
      )}
    </SupabaseSingleResource>
  );
}

