"use client";

import { logoutFromChangeGroupAction } from '@/app/(canvas)/auth/otp-login/otpServerActions';

export function LogoutHandler() {
  const handleLogout = async () => {
    try {
      const result = await logoutFromChangeGroupAction();
      
      if (result.error) {
        console.error('Logout error:', result.error);
        // Still redirect even if server logout fails
      }
      
      // Redirect to root landing page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  };

  return (
    <button onClick={handleLogout} className="w-full text-left">
      Logout
    </button>
  );
}
