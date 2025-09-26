# Progressive Content Implementation Guide

## Overview
This guide shows you how to implement progressive enhancement in your pages using the ProgressiveContent components. Each component serves different use cases for building a freemium experience.

## Component Overview

### 1. `ProgressiveContent` - The Main Component
**Purpose**: Automatically shows different content based on user authentication and permissions
**Best for**: Content sections, detailed analysis, premium features

### 2. `LoginPrompt` - Inline Login Nudges  
**Purpose**: Small, subtle prompts that fit inline with existing content
**Best for**: Call-to-action buttons, feature teases, watchlist prompts

### 3. `AuthWrapper` - Full Control
**Purpose**: Gives you complete control over conditional rendering
**Best for**: Navigation menus, complex layouts, custom logic

---

## Real-World Usage Examples

### Example 1: Fund Details Page
```typescript
// app/funds/[slug]/page.tsx
import { ProgressiveContent, LoginPrompt } from "@/lib/auth/ProgressiveContent";

export default async function FundPage({ params }) {
  const { slug } = await params;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Always visible - basic fund info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vanguard S&P 500 ETF</h1>
        <p className="text-gray-600">Tracks the S&P 500 Index</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>Expense Ratio: 0.03%</div>
          <div>AUM: $350B+</div>
          <div>Inception: 2010</div>
        </div>
      </div>

      {/* Progressive - detailed performance data */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
        <ProgressiveContent 
          group="funds" 
          action="view_detailed"
          guestFallback={
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📊 Unlock Detailed Performance</h3>
              <p className="text-gray-600 mb-4">
                See 10-year returns, risk metrics, Sharpe ratios, and more
              </p>
              <LoginPrompt message="Login to access comprehensive performance data" />
            </div>
          }
        >
          <DetailedPerformanceCharts />
          <RiskMetrics />
          <BenchmarkComparisons />
        </ProgressiveContent>
      </div>

      {/* Progressive - holdings breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Holdings Breakdown</h2>
        <ProgressiveContent group="funds" action="view_detailed">
          <HoldingsTable />
          <SectorAllocation />
        </ProgressiveContent>
      </div>

      {/* Always visible with inline login prompt */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent News</h2>
        <div className="space-y-4">
          <NewsItem />
          <NewsItem />
          <LoginPrompt message="Login to see all fund-related news and analysis" />
        </div>
      </div>
    </div>
  );
}
```

### Example 2: Research Reports Page
```typescript
// app/research/page.tsx
import { ProgressiveContent, AuthWrapper } from "@/lib/auth/ProgressiveContent";

export default async function ResearchPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Research & Analysis</h1>
      
      {/* Always visible - research summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ResearchSummaryCard title="Q4 Market Outlook" />
        <ResearchSummaryCard title="Tech Sector Analysis" />
        <ResearchSummaryCard title="ESG Investment Trends" />
      </div>

      {/* Progressive - full research reports */}
      <ProgressiveContent 
        group="research" 
        action="view_detailed"
        guestFallback={
          <div className="p-8 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-xl font-bold mb-4">🔬 Full Research Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h4 className="font-bold">Premium Features Include:</h4>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>50+ page detailed reports</li>
                  <li>Analyst recommendations</li>
                  <li>Price targets & forecasts</li>
                  <li>Risk assessments</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded shadow-sm">
                <h4 className="font-bold">Recent Reports:</h4>
                <ul className="mt-2 text-sm text-gray-600">
                  <li>• AI Revolution in Finance (45 pages)</li>
                  <li>• Renewable Energy Outlook (38 pages)</li>
                  <li>• Biotech Investment Guide (52 pages)</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <Link 
                href="/auth/sign-up" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
              >
                Access Full Reports →
              </Link>
            </div>
          </div>
        }
      >
        <FullResearchReports />
      </ProgressiveContent>

      {/* Progressive - analyst tools */}
      <div className="mt-12">
        <ProgressiveContent 
          group="research" 
          action="edit"
          unauthorizedFallback={
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-600">
                Analyst tools are available to research team members
              </p>
            </div>
          }
        >
          <AnalystToolsPanel />
        </ProgressiveContent>
      </div>
    </div>
  );
}
```

### Example 3: Navigation with AuthWrapper
```typescript
// components/MainNavigation.tsx
import { AuthWrapper } from "@/lib/auth/ProgressiveContent";
import { can } from "@/lib/permissions";
import Link from "next/link";

export async function MainNavigation() {
  return (
    <AuthWrapper>
      {({ userRoles, isAuthenticated, isGuest }) => (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="font-bold text-xl">
                FinanceApp
              </Link>

              {/* Main Navigation */}
              <div className="flex space-x-6">
                <Link href="/funds" className="hover:text-blue-600">
                  Funds
                </Link>
                <Link href="/companies" className="hover:text-blue-600">
                  Companies
                </Link>
                
                {/* Show research link only if user has access */}
                {can(userRoles, 'research', 'view_basic') && (
                  <Link href="/research" className="hover:text-blue-600">
                    Research
                  </Link>
                )}
                
                {/* Admin menu for admin users */}
                {can(userRoles, 'admin', 'view') && (
                  <div className="relative group">
                    <button className="hover:text-blue-600">Admin ▼</button>
                    <div className="absolute hidden group-hover:block top-full left-0 bg-white shadow-lg rounded-md py-2 w-48">
                      <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-50">
                        User Management
                      </Link>
                      <Link href="/admin/permissions" className="block px-4 py-2 hover:bg-gray-50">
                        Permissions
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth Actions */}
              <div className="flex items-center space-x-4">
                {isGuest ? (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/sign-up" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">
                      {userRoles.includes('admin') ? '👑' : '👤'} {userRoles.join(', ')}
                    </span>
                    <Link href="/profile" className="hover:text-blue-600">
                      Profile
                    </Link>
                    <form action="/auth/logout" method="post">
                      <button className="text-red-600 hover:text-red-800">
                        Logout
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </AuthWrapper>
  );
}
```

### Example 4: Dashboard with Multiple Permission Levels
```typescript
// app/dashboard/page.tsx
import { ProgressiveContent, AuthWrapper } from "@/lib/auth/ProgressiveContent";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";

export default async function DashboardPage() {
  const userRoles = await getUserRoles();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Personal portfolio - authenticated users only */}
      <ProgressiveContent group="client_portal" action="view_basic">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
          <PortfolioOverview />
        </div>
      </ProgressiveContent>

      {/* Detailed analytics - higher permission level */}
      <ProgressiveContent 
        group="analytics" 
        action="view_detailed"
        unauthorizedFallback={
          <div className="p-6 bg-yellow-50 rounded-lg mb-8">
            <h3 className="font-bold">📊 Advanced Analytics</h3>
            <p className="text-gray-600 mt-2">
              Upgrade to access portfolio analytics, risk metrics, and performance attribution
            </p>
            <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded">
              Upgrade Account
            </button>
          </div>
        }
      >
        <AdvancedAnalytics />
      </ProgressiveContent>

      {/* Research access based on role */}
      {can(userRoles, 'research', 'view_basic') && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest Research</h2>
          <ProgressiveContent group="research" action="view_detailed">
            <ResearchFeed />
          </ProgressiveContent>
        </div>
      )}

      {/* Admin panel */}
      <ProgressiveContent group="admin" action="view">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Administration</h2>
          <AdminQuickActions />
        </div>
      </ProgressiveContent>
    </div>
  );
}
```

### Example 5: Interactive Features with LoginPrompt
```typescript
// components/FundCard.tsx
import { LoginPrompt } from "@/lib/auth/ProgressiveContent";
import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";

export async function FundCard({ fund }) {
  const userRoles = await getUserRoles();
  const canViewDetailed = can(userRoles, 'funds', 'view_detailed');

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-xl font-bold">{fund.name}</h3>
      <p className="text-gray-600">{fund.description}</p>
      
      {/* Always visible basic info */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>Expense Ratio: {fund.expenseRatio}</div>
        <div>AUM: {fund.aum}</div>
      </div>

      {/* Interactive buttons based on auth */}
      <div className="mt-6 flex gap-3">
        <Link 
          href={`/funds/${fund.slug}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
        
        {canViewDetailed ? (
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ❤️ Add to Watchlist
          </button>
        ) : (
          <div className="flex-1">
            <LoginPrompt message="Login to save funds to your watchlist" />
          </div>
        )}
      </div>

      {/* Performance preview */}
      {canViewDetailed ? (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">1Y Return</div>
          <div className="text-lg font-bold text-green-600">+{fund.oneYearReturn}%</div>
        </div>
      ) : (
        <div className="mt-4">
          <LoginPrompt message="Login to see performance data" />
        </div>
      )}
    </div>
  );
}
```

## Quick Reference

### Permission Groups & Actions
```typescript
// Common permission checks
'funds' + 'view_basic'      // Public fund info
'funds' + 'view_detailed'   // Performance, holdings
'research' + 'view_basic'   // Public research summaries
'research' + 'view_detailed' // Full reports
'admin' + 'view'           // Admin panels
'analytics' + 'view_detailed' // Advanced charts
```

### Component Decision Tree
- **Need automatic fallbacks?** → Use `ProgressiveContent`
- **Need subtle inline prompts?** → Use `LoginPrompt`
- **Need complex custom logic?** → Use `AuthWrapper`
- **Need simple permission check?** → Use `can(userRoles, group, action)`

### Performance Tips
- User roles are automatically cached per request
- Always use `await getUserRoles()` in server components
- Avoid nested `ProgressiveContent` - use `AuthWrapper` for complex scenarios
- Custom fallbacks are more conversion-friendly than defaults 