import { EditLoginProfile } from '@/components/forms/EditLoginProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import { EditLoginProfileValues } from '@/types/forms';
import { redirect } from 'next/navigation';
import { WhatsAppButton } from './WhatsAppButton';
import { getUserRoles } from '@/lib/auth/getUserRoles';

export default async function UserValidation() {
  // Get current user UUID
  const currentUser = await getCurrentUser();
  const uuid = currentUser?.id;

  // Get user roles for permission checking
  const userRoles = await getUserRoles();

  if (!uuid) {
    console.log('No UUID found');
    redirect('/app');
  }

  // Fetch login_profile data including user_role_name_id
  const loginProfile = await supabaseSingleRead<{
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    client_confirmation?: boolean | null;
    finacial_pdts_invested_in?: string[] | null;
    existing_advisor?: boolean | null;
    existing_financial_plan?: boolean | null;
    existing_inv_mandate?: boolean | null;
    net_worth?: string | null;
    hear_ime_capital?: string | null;
    internal_notes?: string | null;
    user_role_name_id?: number | null;
  }>({
    table: 'login_profile',
    columns: '*',
    filters: [
      (query) => query.eq('uuid', uuid)
    ]
  });

  if (!loginProfile) {
    console.log('No UUID found');
    redirect('/app');
  }

  const userRoleNameId = loginProfile.user_role_name_id;

  // Handle different user_role_name_id cases
  if (userRoleNameId === 9) {
    // Show validation failed message with WhatsApp button
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-red-600">Account Validation Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600">
                Your account could not be successfully validated.
              </p>
              <WhatsAppButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userRoleNameId !== 12) {
    // Redirect to investments for any other role
    redirect('/investments');
  }

  // user_role_name_id = 12: Show the form
  const initialData: EditLoginProfileValues = {
    first_name: loginProfile.first_name || '',
    last_name: loginProfile.last_name || '',
    email: loginProfile.email || '',
    client_confirmation: loginProfile.client_confirmation || false,
    finacial_pdts_invested_in: loginProfile.finacial_pdts_invested_in || [],
    existing_advisor: loginProfile.existing_advisor || false,
    existing_financial_plan: loginProfile.existing_financial_plan || false,
    existing_inv_mandate: loginProfile.existing_inv_mandate || false,
    net_worth: loginProfile.net_worth || '',
    hear_ime_capital: loginProfile.hear_ime_capital || '',
    internal_notes: loginProfile.internal_notes || null,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl py-2">
        <Card>
          <CardHeader>
            <CardTitle className="bg-gray-200 rounded-md my-0 p-2 text-base font-bold text-center text-gray-600">Complete Profile to Activate Account</CardTitle>
          </CardHeader>
          <CardContent>
            <EditLoginProfile 
              initialData={initialData}
              uuid={uuid}
              userRoles={userRoles}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
