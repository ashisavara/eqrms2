// Server component: fetches data using utility + renders the client form

import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { EditCompanyForm } from "@/components/forms/EditCompanyForm"; // this is the client-side form
import { CompanySnapshotFormValues } from "@/types/forms"; // optional: type of the form values
import { notFound } from "next/navigation";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";

type Props = {
  params: Promise<{ id: string }>; // Changed to Promise
};

export default async function EditCompanyPage({ params }: Props) {
  const { id } = await params;
  
  const companyData = await supabaseSingleRead<CompanySnapshotFormValues>({
    table: "eq_rms_company",
    filters: [(query: any) => query.eq("company_id", id)],
    columns: "snapshot,positive,negative,outlook,inv_view,positive_snapshot,negative_snapshot,watch_for",
  });

  if (!companyData) return notFound(); // Show 404 if company doesn't exist

  const sanitizedData = Object.fromEntries(
    Object.entries(companyData).map(([key, value]) => [key, value ?? ""])
  ) as CompanySnapshotFormValues;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <EditCompanyForm companyId={id} defaultValues={sanitizedData} />
    </div>
  );
}
