import { SupabaseSingleResource } from "@/components/supabase/singleRead";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

type Company = { id: string; ime_name: string; sector_id: number; industry: string; coverage: string };

export default function CompanyDetailsPage({ params }: { params: { id: string } }) {
    
  return (
  <SupabaseSingleResource<Company> table="eq_rms_company_view" columns="*" filters={[{ column: "id", operator: "eq", value: params.id }]}>
  {(company) => (
      <div className="p-4">
          <div className="p-4 m-4 bg-gray-600 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">{company.ime_name}</h1>
           </div>
          <div className="text-center text-gray-700 mb-5">
          <span>{company.sector_name}  | </span>
          <span>{company.industry}  | </span>
          <span>{company.coverage} | </span>
          <span><Link href={`/companies/${company.id}/edit`} className="text-blue-600 underline hover:text-blue-800">Edit</Link></span>
          </div>
          <div className="text-sm">
            <div className="text-blue-700 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.snapshot || ""}</ReactMarkdown>
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
            <div className="text-blue-700 mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{company.inv_view || ""}</ReactMarkdown>
            </div>
          </div>
      </div>
  )}
</SupabaseSingleResource>);
}

