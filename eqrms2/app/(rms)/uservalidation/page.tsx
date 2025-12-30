import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Shield } from 'lucide-react';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import UserValidationClient from './UserValidationClient';

export default async function UserValidation() {
  const userRoles = await getUserRoles();
  const isTrialEnded = userRoles === 'trial_ended';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Shield className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isTrialEnded ? 'Trial Ended - Request Extension' : 'Account Validation Required'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {isTrialEnded 
                ? 'Your trial period has ended. Please request an extension to continue accessing the IME RMS.' 
                : 'Your account is not yet validated. You need to be validated to access key features of the IME RMS.'}
            </p>
            
          </div>
          
          <UserValidationClient isTrialEnded={isTrialEnded} />
          
        </CardContent>
      </Card>
    </div>
  );
}
