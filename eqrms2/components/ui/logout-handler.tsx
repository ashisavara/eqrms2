"use client";

import { logoutFromChangeGroupAction } from '@/app/(rms)/app/otpServerActions';

export function LogoutHandler() {
  const handleLogout = async () => {
    try {
      const result = await logoutFromChangeGroupAction();
      
      if (result.error) {
        console.error('Logout error:', result.error);
        // Still redirect even if server logout fails
      }
      
      // Redirect to RMS app landing page after logout
      window.location.href = '/app';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/app';
    }
  };

  return (
    <button onClick={handleLogout} className="w-full text-left">
      Logout
    </button>
  );
}
