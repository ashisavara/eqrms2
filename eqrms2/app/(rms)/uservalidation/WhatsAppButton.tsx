'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918088770050'; // +918088770050 without the +
    const message = 'Request Manual Validation';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleWhatsAppClick}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Send WhatsApp to Request Manual Validation
    </Button>
  );
}

