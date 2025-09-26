# Favouriting System

## Business Logic

- **Mandate-scoped favourites**: Favourites are linked to investment mandates (`im_id`), not individual users
- **Shared access**: Multiple users within the same mandate (family members, private bankers) share the same favourites
- **Entity support**: Users can favourite asset classes, categories, structures, and funds
- **Immediate UI updates**: Heart icons update instantly with optimistic rendering
- **Persistent storage**: Favourites persist across browser sessions and page reloads

---

## Database Schema

### Many-to-Many Relationship Tables
```sql
im_fav_categories (im_id, category_id)
im_fav_funds (im_id, fund_id) 
im_fav_asset_classes (im_id, asset_class_id)
im_fav_structures (im_id, structure_id)
```

### Unique Constraints (Prevents Concurrent User Conflicts)
```sql
ALTER TABLE im_fav_categories ADD CONSTRAINT unique_im_category UNIQUE (im_id, category_id);
ALTER TABLE im_fav_funds ADD CONSTRAINT unique_im_fund UNIQUE (im_id, fund_id);
ALTER TABLE im_fav_asset_classes ADD CONSTRAINT unique_im_asset_class UNIQUE (im_id, asset_class_id);
ALTER TABLE im_fav_structures ADD CONSTRAINT unique_im_structure UNIQUE (im_id, structure_id);
```

---

## Architecture Overview

### Integration with Group/Mandate Context
- **Context extension**: Favourites are part of the `GroupMandateContext`
- **Mandate switching**: Favourites clear and reload when mandate changes
- **Dual storage**: localStorage + cookies for client/server access
- **Tab synchronization**: Real-time sync between browser tabs

### Data Flow
```
Mandate Change → Load Favourites → Store in Context + localStorage
User Clicks Heart → Optimistic Update → Server Sync → Rollback on Error
Tab Change → Storage Event → Context Update → UI Refresh
```

---

## Storage Strategy

### localStorage Structure
```javascript
// Key: ime_mandate_favourites_{mandateId}
{
  mandateId: 123,
  groupId: 456,
  favourites: {
    categories: [1, 5, 12],
    funds: [23, 45, 67],
    asset_classes: [2, 4],
    structures: [1, 3]
  },
  lastSync: "2024-01-15T10:30:00Z"
}
```

### Performance Optimization
- **Lightweight data**: <50 total favourites per mandate (vs 700+ table records)
- **Instant lookup**: `favourites.categories.includes(categoryId)`
- **Context-driven**: No database calls during UI interactions
- **Mandate-scoped caching**: Fresh data on every mandate switch

---

## Component Architecture

### FavouriteHeart Component
```typescript
<FavouriteHeart 
  entityType="category" | "fund" | "asset_class" | "structure"
  entityId={number}
  size="sm" | "md" | "lg"  // Default: "sm" for tables
  className?={string}
/>
```

### Visual States
- **Favourited**: Filled heart with `bg-green-800`
- **Not Favourited**: Heart outline with `border-green-800`
- **Loading**: Brief loading state during server sync
- **Error**: Toast notification on sync failure

### Size Variants
- **sm (default)**: Tables and compact views
- **md**: Standard detail pages  
- **lg**: Hero sections and prominent displays

---

## Extended GroupMandateContext

### State Structure
```typescript
const GroupMandateContext = {
  // Existing mandate system
  currentGroup: Group | null,
  currentMandate: Mandate | null,
  
  // New favourites system
  favourites: {
    categories: number[],
    funds: number[],
    asset_classes: number[],
    structures: number[]
  },
  
  // Actions
  toggleFavourite: (entityType: EntityType, entityId: number) => Promise<void>,
  isFavourite: (entityType: EntityType, entityId: number) => boolean
}
```

### Mandate Change Integration
```typescript
setGroupAndMandate: (group, mandate) => {
  // 1. Clear existing favourites
  clearFavourites();
  
  // 2. Set new mandate
  setCurrentGroup(group);
  setCurrentMandate(mandate);
  
  // 3. Load new mandate's favourites
  loadFavouritesForMandate(mandate.id);
  
  // 4. Save to storage
  saveToStorage(group, mandate);
  saveToFavouritesStorage(mandate.id, favourites);
}
```

---

## Error Handling & Optimistic Updates

### Optimistic Update Pattern
```typescript
const toggleFavourite = async (entityType: EntityType, entityId: number) => {
  const wasAlreadyFavourite = isFavourite(entityType, entityId);
  
  try {
    // 1. Immediate UI update (optimistic)
    updateLocalFavourites(entityType, entityId, !wasAlreadyFavourite);
    
    // 2. Sync to database
    if (wasAlreadyFavourite) {
      await removeFavouriteServer(entityType, entityId);
    } else {
      await addFavouriteServer(entityType, entityId);
    }
    
  } catch (error) {
    // 3. Rollback on failure
    updateLocalFavourites(entityType, entityId, wasAlreadyFavourite);
    toast.error("Failed to update favourite");
  }
};
```

### Concurrent User Safety
- **Database constraints**: Prevent duplicate/missing row errors
- **Idempotent operations**: Safe to retry without side effects
- **Graceful degradation**: UI shows last known state on network failure

---

## Tab Synchronization

### Browser Storage Events
```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === getFavouritesStorageKey(currentMandate?.id)) {
      // Another tab updated favourites - sync immediately
      const newFavourites = JSON.parse(e.newValue || '{}');
      setFavourites(newFavourites.favourites || {});
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [currentMandate?.id]);
```

### Benefits
- **Real-time sync**: Changes appear instantly across all tabs
- **No external dependencies**: Uses native browser APIs
- **Offline friendly**: Works without network connection
- **Performance**: No additional server calls

---

## Usage Examples

### Table Integration
```typescript
// Add virtual favourites column to any table
{
  id: "is_favourite",
  header: "♥",
  size: 30,
  accessorFn: (row) => favourites.categories?.includes(row.category_id) ? 1 : 0,
  cell: ({ row }) => (
    <FavouriteHeart 
      entityType="category" 
      entityId={row.category_id} 
      size="sm"
    />
  ),
  enableSorting: true, // Favourites can be sorted to top
  meta: { isFilterOnly: false }
}
```

### Detail Page Integration
```typescript
// Hero section with large favourite heart
<div className="flex items-center gap-4">
  <h1 className="text-3xl font-bold">{category.name}</h1>
  <FavouriteHeart 
    entityType="category" 
    entityId={category.id} 
    size="lg"
  />
</div>
```

### Context Usage
```typescript
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";

function CategoryCard({ category }) {
  const { favourites, toggleFavourite, isFavourite } = useGroupMandate();
  
  const handleFavouriteClick = () => {
    toggleFavourite('category', category.id);
  };
  
  return (
    <div className="category-card">
      <h3>{category.name}</h3>
      <FavouriteHeart 
        entityType="category"
        entityId={category.id}
        size="md"
        onClick={handleFavouriteClick}
      />
    </div>
  );
}
```

---

## Server Actions

### Core Functions
```typescript
// lib/actions/favouriteActions.ts
export async function addFavourite(entityType: EntityType, entityId: number): Promise<void>
export async function removeFavourite(entityType: EntityType, entityId: number): Promise<void>
export async function loadMandateFavourites(mandateId: number): Promise<FavouritesData>
export async function toggleFavouriteServer(entityType: EntityType, entityId: number): Promise<void>
```

### Database Operations
```typescript
// Idempotent operations using INSERT ... ON CONFLICT
const addFavourite = async (entityType: EntityType, entityId: number) => {
  const tableName = `im_fav_${entityType}s`;
  const columnName = `${entityType}_id`;
  
  await supabase
    .from(tableName)
    .insert({ im_id: mandateId, [columnName]: entityId })
    .onConflict('im_id,' + columnName)
    .ignore(); // No error on duplicate
};
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] **Database constraints**: Add unique constraints to all im_fav_* tables
- [ ] **Server actions**: Create add/remove/load favourite functions
- [ ] **Type definitions**: Define EntityType and FavouritesData types

### Phase 2: Context Integration  
- [ ] **Extend GroupMandateContext**: Add favourites state and actions
- [ ] **Storage management**: localStorage save/load with mandate scoping
- [ ] **Tab synchronization**: Storage event listeners

### Phase 3: UI Components
- [ ] **FavouriteHeart component**: Size variants and visual states
- [ ] **Optimistic updates**: Immediate UI changes with error rollback
- [ ] **Toast notifications**: Success/error feedback

### Phase 4: Integration
- [ ] **Table columns**: Add favourite hearts to all entity tables
- [ ] **Detail pages**: Add favourite hearts to entity detail views
- [ ] **Testing**: Multi-tab scenarios and concurrent user edge cases

---

## Key Benefits

✅ **Instant responsiveness**: No loading states during normal operation  
✅ **Mandate-scoped**: Automatic context switching and data isolation  
✅ **Multi-tab support**: Real-time synchronization across browser tabs  
✅ **Concurrent user safety**: Database constraints prevent conflicts  
✅ **Optimistic UX**: Immediate feedback with graceful error handling  
✅ **Reusable architecture**: Single component works across all entity types  
✅ **Performance optimized**: Minimal database calls and efficient caching  

---

## Future Enhancements

- **Favourite-only table filters**: "Show only favourites" toggle
- **Favourite counts**: Display total favourites per entity type
- **Keyboard shortcuts**: Quick favourite/unfavourite hotkeys
- **Bulk operations**: Select multiple items and favourite/unfavourite together
- **Favourite notes**: Optional user notes attached to favourites
