// Server component: fetches data using utility + renders the client form

import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { EditCompanyForm } from "@/components/forms/EditCompanyForm"; // this is the client-side form
import { CompanySnapshotFormValues } from "@/types/forms"; // optional: type of the form values
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EditCompanyPage({ params }: Props) {
  // Fetch existing company data using utility
  const companyData = await supabaseSingleRead<CompanySnapshotFormValues>({
    table: "eq_rms_valscreen",
    filters: [{ column: "rel_company_id", operator: "eq", value: params.id }],
    columns: "*",
  });

  if (!companyData) return notFound(); // 404 if company not found

  return (
    <div className="max-w-6xl mx-auto p-4">
      <EditCompanyForm companyId={params.id} defaultValues={companyData} />
    </div>
  );
}
