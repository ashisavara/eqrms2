import { getUserRoles } from './getUserRoles';
import { can } from '@/lib/permissions';
import Link from 'next/link';

/**
 * Progressive content wrapper - shows different content based on authentication/permission level
 * 
 * This is the main component for implementing progressive enhancement. It automatically
 * checks user permissions and shows appropriate content or fallbacks.
 * 
 * @param group - Permission group to check (e.g., 'funds', 'research', 'rms', 'admin')
 * @param action - Permission action to check (e.g., 'view_basic', 'view_detailed', 'edit', 'delete')
 * @param children - Content to show when user has the required permission
 * @param guestFallback - Custom content to show to guest users (not authenticated)
 * @param unauthorizedFallback - Custom content to show to authenticated users without permission
 * @param className - Optional CSS classes to apply to the wrapper div
 * 
 * @example
 * // Basic usage - shows detailed analysis to authenticated users, login prompt to guests
 * <ProgressiveContent group="funds" action="view_detailed">
 *   <DetailedFundAnalysis />
 * </ProgressiveContent>
 * 
 * @example
 * // Custom guest fallback with specific messaging
 * <ProgressiveContent 
 *   group="research" 
 *   action="view_detailed"
 *   guestFallback={
 *     <div className="p-4 bg-purple-50 rounded">
 *       <h3>Premium Research</h3>
 *       <p>Our analysts provide in-depth research reports. Sign up to access!</p>
 *       <Link href="/auth/sign-up">Get Access →</Link>
 *     </div>
 *   }
 * >
 *   <ResearchReport />
 * </ProgressiveContent>
 * 
 * @example
 * // Admin-only content with custom unauthorized message
 * <ProgressiveContent
 *   group="admin"
 *   action="view"
 *   guestFallback={<div>This area is for administrators only</div>}
 *   unauthorizedFallback={<div>Contact your admin for access to this feature</div>}
 * >
 *   <AdminDashboard />
 * </ProgressiveContent>
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
 * 
 * This is shown when no custom guestFallback is provided to ProgressiveContent.
 * It's designed to be conversion-focused with clear call-to-action buttons.
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
 * 
 * This is shown when no custom unauthorizedFallback is provided to ProgressiveContent.
 * It's designed for authenticated users who need higher permission levels.
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
 * Simple login prompt component for inline use
 * 
 * Use this when you want a smaller, more subtle login prompt that fits 
 * inline with other content rather than replacing an entire section.
 * 
 * @param message - Custom message to display (optional)
 * 
 * @example
 * // Basic usage with default message
 * <LoginPrompt />
 * 
 * @example
 * // Custom message for specific content
 * <LoginPrompt message="Sign up to save this fund to your watchlist" />
 * 
 * @example
 * // Inline with other content
 * <div>
 *   <h3>Fund Performance</h3>
 *   <p>1Y Return: +12.4%</p>
 *   <LoginPrompt message="Login to see 5-year historical data" />
 * </div>
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
 * 
 * This is a render prop component that gives you full control over how to handle
 * different authentication states. Use this when you need more complex logic
 * than what ProgressiveContent provides.
 * 
 * @param children - Function that receives user status and returns JSX
 * 
 * @example
 * // Basic usage - conditional rendering based on auth status
 * <AuthWrapper>
 *   {({ userRoles, isAuthenticated, isGuest }) => (
 *     <div>
 *       {isGuest && <p>Welcome! Create an account to unlock more features.</p>}
 *       {isAuthenticated && <p>Welcome back, {userRoles.join(', ')} user!</p>}
 *     </div>
 *   )}
 * </AuthWrapper>
 * 
 * @example
 * // Complex conditional rendering with multiple checks
 * <AuthWrapper>
 *   {({ userRoles, isAuthenticated, isGuest }) => (
 *     <div>
 *       {isGuest && (
 *         <div className="bg-blue-50 p-4 rounded">
 *           <h3>Discover Premium Features</h3>
 *           <ul>
 *             <li>Advanced analytics</li>
 *             <li>Portfolio tracking</li>
 *             <li>Research reports</li>
 *           </ul>
 *           <Link href="/auth/sign-up">Start Free Trial</Link>
 *         </div>
 *       )}
 *       
 *       {isAuthenticated && (
 *         <div>
 *           <h3>Your Dashboard</h3>
 *           {can(userRoles, 'funds', 'view_detailed') && <FundsList />}
 *           {can(userRoles, 'research', 'view_detailed') && <ResearchSection />}
 *           {can(userRoles, 'admin', 'view') && <AdminPanel />}
 *         </div>
 *       )}
 *     </div>
 *   )}
 * </AuthWrapper>
 * 
 * @example
 * // Navigation menu that changes based on permissions
 * <AuthWrapper>
 *   {({ userRoles, isAuthenticated }) => (
 *     <nav>
 *       <Link href="/">Home</Link>
 *       <Link href="/funds">Funds</Link>
 *       
 *       {isAuthenticated ? (
 *         <>
 *           {can(userRoles, 'research', 'view') && <Link href="/research">Research</Link>}
 *           {can(userRoles, 'admin', 'view') && <Link href="/admin">Admin</Link>}
 *           <Link href="/profile">Profile</Link>
 *         </>
 *       ) : (
 *         <>
 *           <Link href="/auth/login">Login</Link>
 *           <Link href="/auth/sign-up">Sign Up</Link>
 *         </>
 *       )}
 *     </nav>
 *   )}
 * </AuthWrapper>
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