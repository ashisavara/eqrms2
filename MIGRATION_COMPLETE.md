# Investment Mandate to Client Group Migration - COMPLETE

## Migration Date
December 24, 2025

## Overview
Successfully migrated the application from a dual `client_group` + `investment_mandate` structure to a simplified `client_group`-only structure. All mandate functionality has been consolidated into the `client_group` table.

## What Was Changed

### 1. Database Layer (Application Side)
- ✅ All queries now use `client_group` table instead of `investment_mandate`
- ✅ Favouriting (`im_fav_*` tables) now queries by `group_id` instead of `im_id`
- ✅ Views (`view_im_fav_*`) now filter by `group_id`

### 2. Context & State Management
- ✅ `GroupMandateContext` completely rewritten - removed all mandate state
- ✅ Only tracks `currentGroup` (no more `currentMandate`, `availableMandates`)
- ✅ Removed `loadMandatesForGroup`, `setGroupAndMandate` functions
- ✅ Simplified to `setGroup(group)` for selection
- ✅ Removed mandate cookie (`ime_mandate_id`)
- ✅ Favourites storage now keyed by `group_id` only

### 3. Server Functions
- ✅ `getCurrentMandateId()` removed from `serverGroupMandate.ts`
- ✅ `loadGroupMandates()` removed from `groupMandateActions.ts`
- ✅ `loadMandateFavourites()` → `loadGroupFavourites()` in `favouriteActions.ts`
- ✅ JWT extraction updated to only return `groupInfo` (no `mandateInfo`)

### 4. Pages & Components

#### Updated Pages:
- ✅ `/mandate/page.tsx` → Now uses `client_group` table, displays group details
- ✅ `/investments/page.tsx` → Uses `group_id` for all queries
- ✅ Both pages updated permission checks and messaging

#### Updated Forms:
- ✅ Created `EditGroup.tsx` (replaces EditMandate functionality)
- ✅ Created `UpdateGroupName.tsx` (simplified from UpdateGroupMandateNames)
- ✅ `EditPortRecommendation.tsx` → Now updates `client_group` table
- ✅ `ChangeGroup.tsx` → Completely rewritten, removed mandate selection
- ✅ `ContextDisplay.tsx` → Shows only group (removed mandate display)

#### Updated Components:
- ✅ `RiskProfilerButton.tsx` → Takes only `groupId` prop
- ✅ `RiskProfilerForm.tsx` → Uses `groupId` for all operations
- ✅ `TableInvestments.tsx` → Changed `mandateId` prop to `groupId`
- ✅ `change-group-handler.tsx` → Simplified to group-only selection

### 5. Conversational Forms
- ✅ `riskProfilerActions.ts` → `submitRiskProfiler()` now takes `groupId`
- ✅ `mandateActions.ts` → Functions updated to use `client_group` table
  - `loadMandateData()` → `loadGroupData()` (with legacy alias)
  - `updateMandateField()` → `updateGroupField()` (with legacy alias)

### 6. Types
- ✅ Created `types/group-detail.ts` with `GroupDetail` type
- ✅ Added `EditGroupSchema` and `EditGroupValues` to `types/forms.ts`
- ✅ Updated `FavouritesStorage` type to remove `mandateId`

## Files Created
1. `components/forms/EditGroup.tsx` - New group editing form
2. `components/forms/UpdateGroupName.tsx` - Simplified name update
3. `types/group-detail.ts` - Group type definition

## Files Modified (21 total)
1. `lib/contexts/GroupMandateContext.tsx` - Complete rewrite
2. `lib/actions/favouriteActions.ts` - Changed to group_id
3. `lib/actions/groupMandateActions.ts` - Removed mandate loading
4. `lib/auth/serverGroupMandate.ts` - Removed mandate cookie functions
5. `lib/auth/getUserRoles.ts` - Removed mandate from JWT
6. `lib/conversational-forms/mandateActions.ts` - Updated to use client_group
7. `lib/conversational-forms/riskProfilerActions.ts` - Changed to groupId
8. `app/(rms)/mandate/page.tsx` - Now uses client_group
9. `app/(rms)/mandate/RiskProfilerButton.tsx` - Removed mandateId prop
10. `app/(rms)/investments/page.tsx` - Uses group_id
11. `app/(rms)/investments/TableInvestments.tsx` - Changed prop to groupId
12. `components/forms/ChangeGroup.tsx` - Complete rewrite
13. `components/forms/ContextDisplay.tsx` - Removed mandate display
14. `components/forms/EditPortRecommendation.tsx` - Uses client_group
15. `components/conversational-form/RiskProfilerForm.tsx` - Uses groupId
16. `components/ui/change-group-handler.tsx` - Simplified to group-only
17. `types/favourites-detail.ts` - Removed mandateId from storage type
18. `types/forms.ts` - Added EditGroupSchema

## Database Columns (Unchanged)
The following still exist in the database but are no longer used by the application:
- `investment_mandate` table (entire table - can be dropped after verification)
- `client_group.primary_inv_mandate` FK (legacy, not used)
- `client_group.mandate_name` (still used for display in admin tools)

## What Still References "Mandate"
### Expected/Intentional:
1. **Admin Tools**: `/internal/link-login-lead` - Uses `client_group.mandate_name` column for display
2. **Legacy Files** (not actively used):
   - `EditMandate.tsx` - Old form (can be deleted)
   - `UpdateGroupMandateNames.tsx` - Old form (replaced by UpdateGroupName.tsx)
   - `MandateFormSheet.tsx` - Conversational form (not actively used)
   - `types/mandate-detail.ts` - Old type (can be deleted)

### Documentation:
- Various `.md` files in `lib/conversational-forms/` that document the old system

## Testing Checklist
- [ ] Group selection works correctly
- [ ] Favouriting works with group_id
- [ ] Mandate page (group details) displays correctly
- [ ] Investments page loads with group_id
- [ ] Edit Group form saves correctly
- [ ] Risk Profiler saves to client_group
- [ ] Context display shows only group
- [ ] No console errors related to mandate
- [ ] All pages that required group+mandate now work with just group

## Next Steps (Optional Cleanup)
1. **Delete unused files:**
   - `components/forms/EditMandate.tsx`
   - `components/forms/UpdateGroupMandateNames.tsx`
   - `components/conversational-form/MandateFormSheet.tsx`
   - `types/mandate-detail.ts`

2. **Database cleanup** (after thorough testing):
   - Drop `investment_mandate` table
   - Remove `im_id` columns from `im_fav_*` tables
   - Remove `client_group.primary_inv_mandate` FK

3. **Update documentation:**
   - Update any user-facing docs that mention "mandate"
   - Update API documentation if applicable

## Rollback Plan
If issues are discovered:
1. The `investment_mandate` table and all data still exists in Supabase
2. Git revert to commit before migration
3. All `im_fav_*` tables have both `im_id` and `group_id` columns

## Notes
- Migration was done in a "big bang" approach to avoid partial state issues
- All legacy function names have aliases for backward compatibility
- Context file name kept as `GroupMandateContext.tsx` to avoid massive import updates
- The term "mandate" may still appear in UI labels - can be updated gradually

