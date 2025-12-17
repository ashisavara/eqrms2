'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface UserValidationClientProps {
  isTrialEnded: boolean;
}

export default function UserValidationClient({ isTrialEnded }: UserValidationClientProps) {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+918088770050';
    const message = isTrialEnded 
      ? 'Request Extension for Trial Access' 
      : 'Request Validation for App Access';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleWhatsAppClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {isTrialEnded ? 'Request Extension via WhatsApp' : 'Request Validation via WhatsApp'}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        {isTrialEnded 
          ? 'Contact our team to request an extension of your trial period.' 
          : 'Validation is required to confirm that you are a genuine potential investor, and not competition/media.'}
      </p>
      {!isTrialEnded && (
        <p className="text-xs text-gray-500 text-center">
          You will receive a call from our central team, to ask you some basic qualification questions in order to validate your account. Validation typically takes 1 business day.
        </p>
      )}
    </div>
  );
}

