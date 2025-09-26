import TableAccOnboard  from "./TableAccOnboard";
import { AccountOnboarding } from "@/types/account-onboard-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { AddAcOnboardButton } from "@/components/forms/AddAcOnboard";
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function AcOnboardPage() {
  const userRoles = await getUserRoles();
  const ongoing = await supabaseListRead<AccountOnboarding>({
    table: "v_account_onboard",
    columns: "*",
  });

  return (
    <div>
        <div className="pageHeadingBox"><h1>Account Onboarding</h1></div>
        <AddAcOnboardButton />
      <TableAccOnboard data={ongoing} />
    </div>
  );
}