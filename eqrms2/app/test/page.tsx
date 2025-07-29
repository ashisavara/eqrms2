import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/auth/getUserRoles";

export default async function TestPage() {
  const userRoles = await getUserRoles();

  return (
    <div>
      {JSON.stringify(userRoles, null, 2)}
    </div>
  );
}
