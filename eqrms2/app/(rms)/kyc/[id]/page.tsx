
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { GroupInvestorDetail } from "@/types/group-investor-detail";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { EditGroupInvestorKycButton } from "@/components/forms/EditGroupInvestorKyc";

export const dynamic = "force-dynamic";

function formatBool(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "-";
}

function formatText(value: string | null | undefined) {
  return value && value.trim() !== "" ? value : "-";
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function FieldInline({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-1 text-[11px]">
      <span className="text-[10px] text-gray-500 whitespace-nowrap">{label}:</span>
      <span className={mono ? "font-mono text-[11px]" : "text-[11px]"}>{value}</span>
    </div>
  );
}
export default async function KycInvestorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const userRoles = await getUserRoles();
  if (!can(userRoles, "internal", "kyc")) {
    redirect("/404");
  }

  const investor = await supabaseSingleRead<GroupInvestorDetail>({
    table: "group_investors",
    columns: "*",
    filters: [(query) => query.eq("investor_id", id)],
  });

  if (!investor) {
    return <div className="p-4 text-xs">Investor not found.</div>;
  }

  return (
    <div className="px-4 py-3 text-xs space-y-4">
      <div className="pageHeadingBox mb-2 flex items-center justify-between">
        <h1 className="text-white text-sm">
          KYC – {investor.investor_name}{" "}
          <span className="text-[10px] font-normal">
            ({investor.investor_type}) • ID: {investor.investor_id}
          </span>
        </h1>
        <EditGroupInvestorKycButton investor={investor} />
      </div>

      {/* Section 1: Core KYC status */}
      <section className="border rounded-md p-1 bg-white">
        <h3>KYC Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <FieldInline label="Investor Name" value={formatText(investor.investor_name)} />
          <FieldInline label="Investor Type" value={formatText(investor.investor_type)} />
          <FieldInline label="KYC Status" value={formatText(investor.kyc_status)} />
          <FieldInline label="KRA" value={formatText(investor.kra)} />
          <FieldInline label="MF Ready" value={formatBool(investor.mf_ready)} />
          <FieldInline label="PMS Ready" value={formatBool(investor.pms_ready)} />
          <FieldInline label="AIF Ready" value={formatBool(investor.aif_ready)} />
          <FieldInline label="Kristal Ready" value={formatBool(investor.kristal_ready)} />
          <div className="col-span-2 md:col-span-4">
            <FieldInline
              label="Drive Link"
              value={
                investor.drive_link ? (
                  <a
                    href={investor.drive_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 underline truncate"
                  >
                    {investor.drive_link}
                  </a>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </div>
      </section>

      {/* Section 2: Contact & PAN */}
      <section className="border rounded-md p-1 bg-white">
        <h3>Contact & PAN</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <div className="md:col-span-2">
            <FieldInline label="Registered Email" value={formatText(investor.reg_email)} />
          </div>
          <FieldInline label="Phone Number" value={formatText(investor.phone_number)} />
          <FieldInline label="Client Name (PAN)" value={formatText(investor.client_name_pan)} />
          <FieldInline label="PAN Available" value={formatBool(investor.pan_available_bool)} />
          <FieldInline label="PAN Number" value={formatText(investor.pan_number)} mono />
        </div>
      </section>

      {/* Section 3: Personal & Financial Profile */}
      <section className="border rounded-md p-1 bg-white">
        <h3>Profile Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <FieldInline label="Marital Status" value={formatText(investor.marital_status)} />
          <FieldInline label="Gender" value={formatText(investor.gender)} />
          <FieldInline label="Net Worth" value={formatText(investor.networth)} />
          <FieldInline label="Annual Income" value={formatText(investor.annual_income)} />
          <FieldInline label="Wealth Source" value={formatText(investor.wealth_source)} />
          <FieldInline label="Occupation Type" value={formatText(investor.occupation_type)} />
          <FieldInline label="Mother's Name" value={formatText(investor.mother_name)} />
          <FieldInline label="City of Birth" value={formatText(investor.city_birth)} />
          <FieldInline label="Country of Birth" value={formatText(investor.country_birth)} />
        </div>
      </section>

      {/* Section 4: India Documentation */}
      <section className="border rounded-md p-1 bg-white">
        <h3>India Documentation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <FieldInline label="POA India" value={formatBool(investor.poa_india_bool)} />
          <FieldInline label="POA India Type" value={formatText(investor.poa_india_type)} />
          <FieldInline label="Bank Proof" value={formatBool(investor.bank_proof_bool)} />
          <FieldInline label="Bank Proof Type" value={formatText(investor.bank_proof_type)} />
        </div>
      </section>

      {/* Section 5: Nominee Details */}
      <section className="border rounded-md p-1 bg-white">
        <h3>Primary Nominee</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <FieldInline label="Nominee Name" value={formatText(investor.prime_nominee_name)} />
          <FieldInline label="Nominee ID" value={formatText(investor.prime_nominee_id)} />
          <FieldInline label="Relation" value={formatText(investor.prime_nominee_relation)} />
          <div className="md:col-span-2">
            <FieldInline
              label="Other Nominees"
              value={<span className="whitespace-pre-wrap">{formatText(investor.other_nominees)}</span>}
            />
          </div>
        </div>
      </section>

      {/* Section 6: Overseas / NRI Documentation */}
      <section className="border rounded-md p-1 bg-white">
        <h3>Overseas / NRI Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <FieldInline label="POA Overseas" value={formatBool(investor.poa_overseas_bool)} />
          <FieldInline label="POA Overseas Type" value={formatText(investor.poa_overseas_type)} />
          <FieldInline label="Tax ID" value={formatText(investor.tax_id)} />
          <FieldInline label="Tax ID Type" value={formatText(investor.tax_id_type)} />
          <FieldInline label="Visa" value={formatBool(investor.visa_bool)} />
          <FieldInline label="Passport" value={formatBool(investor.passport_bool)} />
          <FieldInline label="Stamp" value={formatBool(investor.stamp_bool)} />
          <FieldInline label="Stamp Date" value={formatDate(investor.stamp_date)} />
          <div className="md:col-span-2">
            <FieldInline
              label="Address Details"
              value={<span className="whitespace-pre-wrap">{formatText(investor.address_details)}</span>}
            />
          </div>
          <div className="md:col-span-2">
            <FieldInline
              label="Citizenship / TIN Details"
              value={<span className="whitespace-pre-wrap">{formatText(investor.citizenship_tin_details)}</span>}
            />
          </div>
        </div>
      </section>

      {/* Section 7: Comments */}
      <section className="border rounded-md p-1 bg-white">
        <h3>Comments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-blue-500 mb-1">Internal Comments</div>
            <div className="whitespace-pre-wrap bg-gray-50 rounded-sm p-2 min-h-[40px]">
              {formatText(investor.comments_internal)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-blue-500 mb-1">Client-facing Comments</div>
            <div className="whitespace-pre-wrap bg-gray-50 rounded-sm p-2 min-h-[40px]">
              {formatText(investor.comments_client_facing)}
            </div>
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="text-[10px] text-blue-500">
        Created: {formatDate(investor.created_at)} • Group ID: {investor.group_id}
      </section>
    </div>
  );
}

