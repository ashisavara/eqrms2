import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentUser } from "@/lib/supabase/serverQueryHelper";
import { formatDate } from "@/lib/utils";

export default async function RoleExpiring() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return null; // Don't render anything if no user is logged in
  }

  const roleData = await supabaseSingleRead({
    table: 'login_profile',
    columns: 'uuid, user_role_name_id, expires_on',
    filters: [
      (query) => query.eq('uuid', currentUser.id)
    ]
  });

  return (
    <div className="bg-red-500 text-white p-2 rounded-md mb-2 text-center">
        {roleData?.user_role_name_id === 7 && (
        <p className="my-1 text-sm">You currently have complimentary trial access to all IME RMS features, including support from a dedicated Private Banker for your financial plan, investment mandate, and portfolio review. After the trial, you can still access the app, but premium features (IME ratings and editing of plans/investments) will be disabled. Your trial expires on <span className="font-bold">15-Jan-26. </span></p>
        )}  
    </div>
  );
}