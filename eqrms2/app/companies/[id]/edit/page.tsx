// Server component: fetches data using utility + renders the client form

import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { EditCompanyForm } from "@/components/forms/EditCompanyForm"; // this is the client-side form
import { CompanySnapshotFormValues } from "@/types/forms"; // optional: type of the form values
import { notFound } from "next/navigation";
import { fetchOptions } from "@/lib/supabase/serverQueryHelper";

type Props = {
  params: Promise<{ id: string }>; // Changed to Promise
};

export default async function EditCompanyPage({ params }: Props) {
  const { id } = await params;
  
  const companyData = await supabaseSingleRead<CompanySnapshotFormValues>({
    table: "eq_rms_company",
    filters: [(query: any) => query.eq("company_id", id)],
    columns: "snapshot,positive,negative,outlook,inv_view,positive_snapshot,negative_snapshot,watch_for, business_mix, catalysts, hidden, coverage, stock_score, quality",
  });

  if (!companyData) return notFound(); // Show 404 if company doesn't exist

  const sanitizedData = Object.fromEntries(
    Object.entries(companyData).map(([key, value]) => [key, value ?? ""])
  ) as CompanySnapshotFormValues;

  const coverageOptions = await fetchOptions<string,string>("master", "coverage_tags", "coverage_tags");
  const qualityOptions = await fetchOptions<string,string>("master", "company_quality_tags", "company_quality_tags");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <EditCompanyForm companyId={id} defaultValues={sanitizedData} coverageOptions={coverageOptions} qualityOptions={qualityOptions} />
    </div>
  );
}
