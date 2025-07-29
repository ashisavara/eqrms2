import { getUserRoles } from './getUserRoles';
import { can } from '@/lib/permissions';
import Link from 'next/link';

/**
 * Progressive content wrapper - shows different content based on authentication/permission level
 */
export async function ProgressiveContent({
  group,
  action,
  children,
  guestFallback,
  unauthorizedFallback,
  className = ""
}: {
  group: string;
  action: string;
  children: React.ReactNode;
  guestFallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
  className?: string;
}) {
  const userRoles = await getUserRoles();
  
  // Guest user (not authenticated)
  if (userRoles.length === 0) {
    return guestFallback || <DefaultLoginPrompt />;
  }
  
  // Authenticated but no permission
  if (!can(userRoles, group as any, action)) {
    return unauthorizedFallback || <DefaultUpgradePrompt />;
  }
  
  // Has permission - show content
  return <div className={className}>{children}</div>;
}

/**
 * Default login prompt for guest users
 */
function DefaultLoginPrompt() {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          See Detailed Analysis
        </h3>
        <p className="text-gray-600 mb-4">
          Login to view performance charts, detailed returns, and comprehensive analysis
        </p>
        <div className="flex gap-3 justify-center">
          <Link 
            href="/auth/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/sign-up" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Default upgrade prompt for users without sufficient permissions
 */
function DefaultUpgradePrompt() {
  return (
    <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Premium Content
        </h3>
        <p className="text-gray-600 mb-4">
          Contact our team to upgrade your access and view this content
        </p>
        <Link 
          href="/contact" 
          className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
        >
          Contact Sales
        </Link>
      </div>
    </div>
  );
}

/**
 * Simple login prompt component
 */
export function LoginPrompt({ message = "Login to see more details" }: { message?: string }) {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-800 text-center mb-3">{message}</p>
      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Login →
        </Link>
      </div>
    </div>
  );
}

/**
 * Authentication-aware wrapper that passes user status to children
 */
export async function AuthWrapper({ children }: { children: (props: {
  userRoles: string[];
  isAuthenticated: boolean;
  isGuest: boolean;
}) => React.ReactNode }) {
  const userRoles = await getUserRoles();
  
  return children({
    userRoles,
    isAuthenticated: userRoles.length > 0,
    isGuest: userRoles.length === 0
  });
} 