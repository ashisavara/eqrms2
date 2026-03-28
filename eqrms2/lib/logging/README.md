# RMS User Logging (Concise)

This logging system writes one page-view row to `public.user_logs` from server-rendered RMS pages.

## How to use

Render `UserLog` in an `(rms)` page:

```tsx
import UserLog from "@/components/rms/UserLog";

<UserLog
  segment="mandate"
  entityId={groupId}
  entityTitle={groupData.group_name}
  pagePath="/mandate"
/>
```

`UserLog` is server-side and returns `null` (no UI).

## Data sources

- `user_id`: from `getCachedSessionIdentity()` (`session.user.id`)
- `user_role`: from JWT claim `user_roles` via `getCachedSessionIdentity()`
- `user_name`: from JWT claim `lead_name` via `getCachedSessionIdentity()` (can be `null`)
- `group_id`: from cookie `ime_group_id` via `getCurrentGroupId()` (can be `null`, still logged)
- `segment`: required prop
- `entity_id`, `entity_slug`, `entity_title`: optional props
- `page_path`: from `pagePath` prop when provided; otherwise derived from request headers when possible

## Flow

1. Page renders `<UserLog ... />`
2. `UserLog` calls `logUserPageView(...)`
3. Logger fetches identity + group + page path
4. Logger inserts row using `supabaseInsertRow("user_logs", row)`

## Safety behavior

- Skips logging if user is `guest`/`no_role` or `user_id` is missing
- Errors are swallowed with `console.error` (page should not break)

## Route checklist

See `lib/logging/ROUTE_LOGGING_MAP.md` for current `(rms)` route coverage (`segment`, `pagePath`, and dynamic id/slug mapping).
