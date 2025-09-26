# User Roles & Permissions System

## Overview
Comprehensive role-based permission system for conditional UI rendering and access control. Built with security-first principles using server-side JWT extraction and React context.

## Architecture

### Core Principles
- **Server-side only**: No client-side role exposure or JWT handling
- **Single extraction**: 1 JWT decode per page load in layout
- **Context distribution**: Roles passed via React context (no prop drilling)
- **Permission groups**: Logical groupings instead of per-table permissions
- **Clean syntax**: `can('group', 'action')` throughout components

### Security Model
- JWT custom claims function adds `user_roles` to token during authentication
- Server components extract roles from JWT payload on each page load
- Zero client-side storage or manipulation of roles
- Roles rarely change (logout trigger if modified during session)

## Implementation Plan

### Phase 1: Foundation (Simple)
1. **JWT Extraction Function** - Server-side role extraction
2. **Role Context Provider** - React context for role distribution  
3. **Basic Permission System** - 2-3 permission groups
4. **Test Page** - `/test2` for conditional visibility testing

### Phase 2: Full System
1. **Complete Permission Groups** - All 5-7 groups defined
2. **Enhanced Can Function** - Full permission matrix
3. **Layout Integration** - Extract in protected layout
4. **App-wide Implementation** - Replace existing auth checks

## Permission Groups Structure

### Planned Groups (5-7 total)
```typescript
export const PERMISSION_GROUPS = {
  rms: {
    view: ['client', 'rm', 'research', 'admin'],
    edit: ['rm', 'research', 'admin'], 
    delete: ['admin'],
    create: ['rm', 'admin']
  },
  research: {
    view: ['research', 'admin'],
    edit: ['research', 'admin'],
    delete: ['admin']
  },
  client_portal: {
    view: ['client', 'wealth', 'admin'],
    edit: ['wealth', 'admin']
  },
  // ... 2-4 more groups
}
```

### User Roles
- `admin` - Full access to everything
- `rm` - Relationship manager permissions
- `research` - Research team permissions  
- `client` - Client portal access
- `wealth` - Wealth management permissions
- `super_admin` - System administration

## Usage Patterns

### In Components
```typescript
// Server component
export default function LeadsPage() {
  const userRoles = useRoles(); // From context
  
  return (
    <div>
      <h1>Leads</h1>
      {can(userRoles, 'rms', 'create') && <CreateLeadButton />}
      {can(userRoles, 'rms', 'edit') && <EditButton />}
      {can(userRoles, 'rms', 'delete') && <DeleteButton />}
    </div>
  );
}
```

### Enhanced Syntax (Future)
```typescript
// After creating enhanced can function
{can('rms', 'edit') && <EditButton />}
{can('research', 'view') && <ResearchPanel />}
```

## Technical Implementation

### File Structure
```
lib/
├── permissions.ts          # Permission groups & can function
├── auth/
│   ├── RoleProvider.tsx    # React context provider
│   └── getUserRoles.ts     # JWT extraction utility
app/
├── protected/
│   └── layout.tsx          # Role extraction & provider setup
└── test2/
    └── page.tsx            # Testing conditional visibility
```

### Key Functions
1. **`getUserRoles()`** - Extract roles from JWT server-side
2. **`RoleProvider`** - React context for role distribution
3. **`useRoles()`** - Hook to access roles in components
4. **`can(roles, group, action)`** - Permission checking function

## Performance Benefits
- **1 JWT decode** per page (vs 10-50+ without optimization)
- **No repeated Supabase calls** across components
- **Efficient context sharing** instead of prop drilling
- **Server-side extraction** (no client processing)

## Security Benefits  
- **Zero client exposure** of JWT tokens or role data
- **Server-side verification** on every page load
- **Tamper-proof** role checking
- **Consistent with security-first architecture**

## Implementation Steps

### Step 1: Basic Setup
- [x] Create `getUserRoles()` utility function
- [x] Build simple `RoleProvider` context
- [x] Create basic permission groups (2-3)
- [x] Build test page with conditional rendering

### Step 2: Integration
- [x] Add role extraction to protected layout
- [x] Test performance with multiple components
- [x] Verify security (no client exposure)

### Step 3: Full Rollout
- [x] Define all permission groups (7 comprehensive groups)
- [x] Create enhanced `can()` function (`useCan()` hook)
- [ ] Replace existing auth checks app-wide
- [ ] Performance testing & optimization

## Current Status: Progressive Enhancement Complete ✅

### ✅ Completed Features
- JWT custom claims integration working
- Server-side role extraction with React cache (1 per request)
- Progressive enhancement architecture supporting guest users
- Clean URLs without /protected prefix
- Guest user support with conversion-focused login prompts
- 7 comprehensive permission groups with progressive access levels
- Helper components for seamless content enhancement
- Full security - no client-side role exposure

### 🏗️ Final Architecture: Progressive Enhancement

#### **Core Principles**
- **Guest-first**: Public pages work without authentication
- **Progressive disclosure**: More content unlocked with authentication
- **Clean URLs**: `/funds/vanguard` not `/protected/funds/vanguard`
- **Server-side security**: Zero client tampering risk
- **Performance optimized**: Single JWT decode per request with React cache

#### **Permission Levels**
```typescript
// Progressive permission structure
view_basic: ['guest', 'client', 'rm', 'research', 'admin', 'super_admin']  // Public
view_detailed: ['client', 'rm', 'research', 'admin', 'super_admin']       // Authenticated
edit: ['rm', 'admin', 'super_admin']                                      // Staff
delete: ['admin', 'super_admin']                                          // Admin only
```

#### **Usage Patterns**
```typescript
// Progressive content wrapper
<ProgressiveContent
  group="funds"
  action="view_detailed"
  guestFallback={<LoginPrompt />}
>
  <DetailedAnalysis />
</ProgressiveContent>

// Direct permission check
const userRoles = await getUserRoles(); // Cached
if (can(userRoles, 'funds', 'view_detailed')) {
  return <DetailedContent />;
}
```

### 🚀 Ready for Production Use
The progressive enhancement system is production-ready and optimized for:
- **SEO**: Public pages fully crawlable
- **Conversion**: Clear upgrade paths for guests
- **Security**: Server-side role verification
- **Performance**: Cached role extraction
- **UX**: Seamless authentication experience

## Testing Strategy
- **Test Page**: `/test2`