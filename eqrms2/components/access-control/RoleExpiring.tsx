import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentUser } from "@/lib/supabase/serverQueryHelper";
import { formatDate } from "@/lib/utils";

export default async function RoleExpiring() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return null; // Don't render anything if no user is logged in
  }

  const roleData = await supabaseListRead({
    table: 'acl_user_roles',
    columns: 'user_uuid, user_role_name_id, expires_on',
    filters: [
      (query) => query.eq('user_uuid', currentUser.id)
    ]
  });

  return (
    <div className="bg-red-500 text-white p-2 rounded-md mb-2 text-center">
      {roleData.map((userRole, index) => {
        const roleId = userRole.user_role_name_id;
        return (
          <div key={index}>
            {roleId === 7 && (
              <p>Your trial access to the IME RMS will expire on <span className="font-bold">{formatDate(userRole?.expires_on)}</span>.</p>
            )}
            {roleId === 11 && (
              <p>As a new user you get a limited 1 day trial to the IME RMS, which is extended to 15 days post-validation of your account. </p>
            )}
          </div>
        );
      })}
    </div>
  );
}