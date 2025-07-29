import { getUserRoles, getUserStatus } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";
import { ProgressiveContent, LoginPrompt, AuthWrapper } from "@/lib/auth/ProgressiveContent";

// Simulate fund data component
function BasicFundInfo() {
  return (
    <div className="p-4 bg-gray-50 rounded">
      <h3 className="font-bold">Vanguard S&P 500 ETF (VOO)</h3>
      <p className="text-gray-600">Tracks the S&P 500 Index</p>
      <p><strong>Expense Ratio:</strong> 0.03%</p>
      <p><strong>AUM:</strong> $350B+</p>
    </div>
  );
}

// Detailed fund data (requires authentication)
function DetailedFundInfo() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded">
        <h4 className="font-bold">Performance Analysis</h4>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>1Y Return: <span className="font-bold text-green-600">+12.4%</span></div>
          <div>3Y Return: <span className="font-bold text-green-600">+8.9%</span></div>
          <div>5Y Return: <span className="font-bold text-green-600">+11.2%</span></div>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 rounded">
        <h4 className="font-bold">Holdings Analysis</h4>
        <p>Top 10 holdings account for 28.5% of fund</p>
        <p>Sector allocation: Technology (29%), Healthcare (13%), Financials (13%)</p>
      </div>
    </div>
  );
}

// Admin controls (requires admin permissions)
function AdminControls() {
  return (
    <div className="p-4 bg-red-50 rounded border border-red-200">
      <h4 className="font-bold text-red-800">Admin Controls</h4>
      <div className="flex gap-2 mt-2">
        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">
          Edit Fund Data
        </button>
        <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
          Manage Holdings
        </button>
      </div>
    </div>
  );
}

// Component showing research analysis
function ResearchAnalysis() {
  return (
    <div className="p-4 bg-purple-50 rounded">
      <h4 className="font-bold">Internal Research Analysis</h4>
      <p className="text-sm text-gray-600 mt-1">Last updated: Today</p>
      <div className="mt-2">
        <p><strong>Rating:</strong> BUY</p>
        <p><strong>Price Target:</strong> $425</p>
        <p><strong>Risk Level:</strong> Low</p>
      </div>
    </div>
  );
}

// Main page demonstrating progressive enhancement
export default async function Test2Page() {
  const userStatus = await getUserStatus();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Progressive Enhancement Demo</h1>
      <p className="text-gray-600 mb-8">
        This page shows different content based on your authentication status and permissions.
      </p>
      
      {/* User Status Display */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Your Current Status:</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Authenticated: {userStatus.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
          <div>Guest: {userStatus.isGuest ? '✅ Yes' : '❌ No'}</div>
          <div>Roles: {userStatus.roles.length > 0 ? userStatus.roles.join(', ') : 'None'}</div>
          <div>Admin: {userStatus.isAdmin ? '✅ Yes' : '❌ No'}</div>
        </div>
      </div>

      {/* Always Visible Content */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">📊 Fund Information (Always Visible)</h2>
        <BasicFundInfo />
      </div>

      {/* Progressive Content - Detailed Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">📈 Detailed Analysis</h2>
        <ProgressiveContent
          group="funds"
          action="view_detailed"
          guestFallback={<LoginPrompt message="Login to see detailed performance data, holdings analysis, and more" />}
        >
          <DetailedFundInfo />
        </ProgressiveContent>
      </div>

      {/* Progressive Content - Research Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">🔬 Research Analysis</h2>
        <ProgressiveContent
          group="research"
          action="view_detailed"
          guestFallback={
            <div className="p-4 bg-purple-50 rounded border">
              <p className="text-center text-purple-800">
                🔐 Internal research analysis available to authenticated users
              </p>
              <div className="text-center mt-2">
                <LoginPrompt message="Login to access our research team's analysis" />
              </div>
            </div>
          }
        >
          <ResearchAnalysis />
        </ProgressiveContent>
      </div>

      {/* Progressive Content - Admin Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">⚙️ Admin Functions</h2>
        <ProgressiveContent
          group="admin"
          action="view"
          guestFallback={
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-center text-gray-600">
                Admin controls are only visible to administrators
              </p>
            </div>
          }
          unauthorizedFallback={
            <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-center text-yellow-800">
                ⚠️ Admin access required
              </p>
            </div>
          }
        >
          <AdminControls />
        </ProgressiveContent>
      </div>

      {/* AuthWrapper Example */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">🔄 Dynamic Content</h2>
        <AuthWrapper>
          {({ userRoles, isAuthenticated, isGuest }) => (
            <div className="p-4 bg-slate-50 rounded">
              {isGuest && (
                <div>
                  <p className="text-blue-600">👋 Welcome! You're browsing as a guest.</p>
                  <p className="text-sm text-gray-600">Create an account to unlock premium features.</p>
                </div>
              )}
              
              {isAuthenticated && (
                <div>
                  <p className="text-green-600">✅ Welcome back! You have access to:</p>
                  <ul className="list-disc list-inside text-sm mt-2">
                    {can(userRoles, 'funds', 'view_detailed') && <li>Detailed fund analysis</li>}
                    {can(userRoles, 'research', 'view_detailed') && <li>Research reports</li>}
                    {can(userRoles, 'admin', 'view') && <li>Admin controls</li>}
                    {userRoles.length === 0 && <li>Basic information only</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </AuthWrapper>
      </div>

      {/* Testing Instructions */}
      <div className="mt-12 p-6 bg-blue-100 rounded">
        <h3 className="font-bold">🧪 Test Instructions:</h3>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><strong>As Guest:</strong> You should see basic fund info + login prompts</li>
          <li><strong>As Authenticated User:</strong> You should see detailed analysis + research</li>
          <li><strong>As Admin:</strong> You should see all content including admin controls</li>
          <li><strong>Different Roles:</strong> Try different role combinations to see progressive access</li>
        </ul>
        
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="font-bold text-green-800">✅ Architecture Benefits:</p>
          <ul className="list-disc list-inside text-sm text-green-700">
            <li>Single JWT decode per page (cached)</li>
            <li>Clean URLs (no /protected prefix)</li>
            <li>Progressive enhancement for conversion</li>
            <li>Server-side security (no client tampering)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 