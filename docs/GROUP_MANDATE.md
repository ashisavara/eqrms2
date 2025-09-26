# Group & Investment Mandate System

## Business Logic

- On supabase, we have a concept called client_group (primary key is group_id and name is group_name) and investment_mandate (pimary key is im_id and name is mandate_name)... investment_mandates are related to groups (1 group can have multiple mandates)
- Every user has a default group_id and im_id ..... external users will only have a single group_id, within which they may have multiple mandates .. our private bankers can access all group_ids that they have been given access to, via an acl_group table
- groups and investment mandates drive a lot of permissions and access control to the data ... at any point in time, there can only be 1 group + 1 associated invesmtent mandate selected - which defines what data is shown 
- this concept of group and investment mandate is used quite extensively across the website 
- the idea is that on login, we will call supabase to fetch the default group_id and im_id (along with their names) and save this in an app context -- so that this can be used all across the app -- since this impacts the login process WE WILL IMPLEMENT THIS LOGIN SETTING OF GROUP AND MANDATE AT A LATER STAGE
- for now, I seek to create a component which can be displayed in a sheet, which has (a) a drop down select which allows them to select groups they have access to (b) once a group has been selected, it needs to display a list of all linked investment mandates ... on clicking an investment mandate, the selected group and mandate need to be saved as app contexts to be available throughout the app 
- while we will mostly almost always have a group and mandate, it may be useful to just also take care of null handling ..

---

## Implemented Architecture

### 1. Context System (`lib/contexts/GroupMandateContext.tsx`)
**Purpose**: App-wide state management for current group and mandate selection

**Key Features**:
- React Context Provider wrapping the entire app
- State for current group/mandate + available options
- Loading states for async operations
- **Dual storage**: localStorage + cookies for client/server access
- Automatic restoration of saved selection on app load

**Storage Implementation**:
- **localStorage** (`ime_group_mandate_selected`) - Fast client-side access, full data object
- **Cookies** (`ime_group_id`, `ime_mandate_id`) - Server-side accessible, just IDs

**Main Functions**:
- `setGroupAndMandate(group, mandate)` - Sets selection, saves to both localStorage & cookies, shows toast, reloads page
- `loadAvailableGroups()` - Fetches user's accessible groups
- `loadMandatesForGroup(groupId)` - Fetches mandates for selected group
- `clearSelection()` - Clears current selection from both localStorage & cookies

### 2. Server Actions (`lib/actions/groupMandateActions.ts`)
**Purpose**: Bridge between client components and server-side database operations

**Why Needed**: Client components ("use client") cannot directly import server functions ("use server")

**Functions**:
- `loadUserGroups()` - Server action to get user's accessible groups via RLS
- `loadGroupMandates(groupId)` - Server action to get mandates for specific group

**Database Queries**:
```typescript
// Groups: RLS automatically filters based on user's ACL permissions
supabaseListRead({
  table: "client_group",
  columns: "group_id, group_name"
  // No filters needed - RLS handles access control!
});

// Mandates: Simple filter by group_id
supabaseListRead({
  table: "investment_mandate", 
  columns: "im_id, mandate_name",
  filters: [(query) => query.eq('group_id', groupId)]
});
```

### 3. Server-Side Helpers (`lib/auth/serverGroupMandate.ts`)
**Purpose**: Access current group/mandate selection from server components

**Why Needed**: Server components cannot access React Context or localStorage, but can read cookies

**Functions**:
- `getCurrentGroupId()` - Get current group ID from cookies (server-side)
- `getCurrentMandateId()` - Get current mandate ID from cookies (server-side)
- `getCurrentGroupMandate()` - Get both group and mandate IDs from cookies (server-side)

**Server Component Usage**:
```typescript
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";

export default async function MyServerPage() {
  const groupId = await getCurrentGroupId();
  
  if (!groupId) {
    return <div>Please select a group to view data</div>;
  }
  
  const data = await supabaseListRead({
    table: "my_table",
    filters: [(query) => query.eq("group_id", groupId)]
  });
  
  return <div>Data for Group {groupId}</div>;
}
```

### 4. UI Components

#### ChangeGroup Component (`components/forms/ChangeGroup.tsx`)
**Purpose**: Main user interface for selecting group and mandate

**Features**:
- Sheet overlay with group dropdown and mandate list
- Enhanced SelectInput with search (when >7 options)
- Loading states and error handling
- Current selection display with badges
- Auto-close on mandate selection

#### Context Display Component (`components/forms/ContextDisplay.tsx`)
**Purpose**: Debug/visual display of current context state

**Shows**:
- Current group and mandate with colored badges
- Loading states
- Debug IDs for verification
- Positioned below main navigation

### 5. Integration Points

#### Layout Integration (`app/layout.tsx`)
- `GroupMandateProvider` wraps entire app
- `ChangeGroup` button in top-right navigation
- `ContextDisplay` centered below navigation
- `Toaster` for success/error messages

#### Enhanced Form Components (`components/forms/FormFields.tsx`)
- `SelectInput` enhanced with search functionality for >7 options
- Search input replaces title to save space
- Real-time filtering and "No options found" state

---

## Data Flow

1. **App Load** → Context restores saved selection from localStorage
2. **User clicks "Select Group & Mandate"** → Sheet opens, loads available groups
3. **User selects group** → Loads mandates for that group
4. **User clicks mandate** → Sets context, saves to both localStorage & cookies, shows toast, reloads page
5. **Page reload** → Context restores selection from localStorage, server components read from cookies

---

## Security & Access Control

- **RLS (Row Level Security)** handles all access control at database level
- **No custom ACL logic** in application code
- **Server-side rendering** for sensitive data
- **localStorage & cookies** only store selection IDs, not sensitive data
- **Cookies** have 1-year expiry and SameSite=Lax for security

---

## Key Features

✅ **Dual Storage** - localStorage (client) + cookies (server) for universal access  
✅ **Server-side Data Fetching** - Pure server components can access selection  
✅ **Persistence** - Selection survives page reloads and browser sessions  
✅ **Search** - Enhanced dropdowns with search for long lists  
✅ **Loading States** - Proper UX during data fetching  
✅ **Error Handling** - Toast messages and graceful degradation  
✅ **Type Safety** - Full TypeScript support  
✅ **Performance** - Cached data, parallel loading, no prop drilling  
✅ **Security** - RLS-based access control, secure cookie settings  

---

## Usage Across App

### Client Components (React Context)
```typescript
"use client";
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";

function MyClientComponent() {
  const { currentGroup, currentMandate } = useGroupMandate();
  
  // Use current selection to filter data, control permissions, etc.
  return <div>Current: {currentGroup?.name} | {currentMandate?.name}</div>;
}
```

### Server Components (Cookies)
```typescript
import { getCurrentGroupId, getCurrentGroupMandate } from "@/lib/auth/serverGroupMandate";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";

export default async function MyServerPage() {
  // Option 1: Get just group ID
  const groupId = await getCurrentGroupId();
  
  // Option 2: Get both group and mandate IDs
  const selection = await getCurrentGroupMandate();
  // selection = { groupId: 1, mandateId: 101 } or null
  
  if (!groupId) {
    return <div>Please select a group to view data</div>;
  }
  
  // Fetch data filtered by group
  const data = await supabaseListRead({
    table: "my_table",
    filters: [(query) => query.eq("group_id", groupId)]
  });
  
  return <div>Showing {data.length} items for Group {groupId}</div>;
}
```

### Key Benefits
- **Client components**: Full group/mandate objects with names
- **Server components**: Group/mandate IDs for database filtering
- **Automatic sync**: Both storage methods updated together
- **Performance**: No need to pass props down component tree

---

## Future Integration

- **Login Integration** - Set default group/mandate on user login
- **User Profile** - Store user's default selections in database
- **Auto-logout** - Trigger when user's group access changes
- **Advanced Permissions** - Integrate with role-based permission system 