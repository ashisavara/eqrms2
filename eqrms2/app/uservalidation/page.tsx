'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Shield, Clock } from 'lucide-react';

export default function UserValidation() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+918088770050';
    const message = 'Request Validation for App Access';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Shield className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Validation Required
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your account is not yet validated. You need to be validated to access key features of the IME RMS.
            </p>
            
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Request Validation via WhatsApp
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Validation is required to confirm that you are a genuine potential investor, and not competition/media.   
            </p>
            <p className="text-xs text-gray-500 text-center">
                You will receive a call from our central team, to ask you some basic qualification questions in order to validate your account. Validation typically takes 1 business day.
            </p>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
