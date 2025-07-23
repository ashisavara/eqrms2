# Server-Side Table Helper System

A comprehensive set of reusable components for building server-side filtered, sorted, and paginated tables in Next.js with Supabase.

## 🎯 **When to Use**

### **Server-Side Tables** (This system)
- ✅ **Large datasets** (>1000 records)
- ✅ **Internal-only pages** (page refreshes acceptable)
- ✅ **Complex filtering** needs with dedicated filter tables
- ✅ **Performance critical** (only fetch needed data)

### **Client-Side Tables** (ReactTableWrapper)
- ✅ **Small datasets** (<1000 records) 
- ✅ **Public-facing pages** (smooth UX required)
- ✅ **Simple filtering** from dataset unique values
- ✅ **Interactive features** (live search, instant sorting)

## 🏗️ **System Architecture**

```
📁 lib/hooks/
└── useServerTableState.ts          # URL state management

📁 components/server-table/
├── ServerTablePage.tsx             # Complete page template
├── ServerTableFilters.tsx          # Filter UI component  
├── ServerTable.tsx                 # Table renderer
└── index.ts                        # Clean exports

📁 lib/supabase/
└── serverSideQueryHelper.ts        # Data fetching utilities
```

## 🚀 **Quick Start**

### **1. Simple Usage (Recommended)**

```tsx
// app/my-table/page.tsx
import { ServerTablePage, ServerTablePageConfig } from '@/components/server-table';
import { MyDataType } from '@/types/my-data';

export default async function MyTablePage({ searchParams }) {
  // 1. Parse URL parameters (copy from existing pattern)
  const { filters, pagination, sorting, search } = parseSearchParams(await searchParams);
  
  // 2. Fetch data using existing serverSideQuery helper  
  const data = await serverSideQuery<MyDataType>({
    table: "my_view",
    columns: "id,name,status,created_at", 
    filters,
    search,
    searchColumns: ['name'],
    pagination,
    sorting
  });

  // 3. Configure table (the only custom part!)
  const config: ServerTablePageConfig<MyDataType> = {
    basePath: '/my-table',
    title: 'My Table',
    
    tableStateConfig: {
      filterKeys: ['status', 'type'],
      defaultSort: { column: 'created_at', direction: 'desc' },
      defaultPageSize: 50
    },
    
    filterConfigs: [
      { key: 'status', title: 'Status', options: statusOptions },
      { key: 'type', title: 'Type', options: typeOptions }
    ],
    
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'created_at', label: 'Created Date' }
    ],
    
    columns: [
      { key: 'name', header: 'Name', align: 'left' },
      { key: 'status', header: 'Status' },
      { 
        key: 'created_at', 
        header: 'Created', 
        render: (value) => formatDate(value) 
      }
    ]
  };

  // 4. Render (just one line!)
  return <ServerTablePage config={config} data={data.data} pagination={data} />;
}
```

**That's it!** Your table now has:
- ✅ URL-based filtering, sorting, pagination
- ✅ Multi-select filters with search
- ✅ Responsive pagination controls  
- ✅ Custom column rendering
- ✅ Consistent styling with existing tables

### **2. Advanced Usage (Custom Components)**

If you need more control, use individual components:

```tsx
import { ServerTableFilters, ServerTable } from '@/components/server-table';

export default function CustomPage() {
  return (
    <div>
      <h1>Custom Layout</h1>
      
      {/* Custom filter layout */}
      <div className="grid grid-cols-2 gap-4">
        <ServerTableFilters {...filterProps} />
        <div>Custom sidebar content</div>
      </div>
      
      {/* Custom table wrapper */}
      <div className="custom-wrapper">
        <ServerTable {...tableProps} />
      </div>
    </div>
  );
}
```

## 🔧 **Configuration Reference**

### **ServerTablePageConfig**

```typescript
interface ServerTablePageConfig<T> {
  // Required
  basePath: string;                    // e.g., '/funds/all'
  title: string;                       // Page title
  tableStateConfig: {
    filterKeys: string[];              // URL parameter keys for filters
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
    defaultPageSize?: number;
  };
  filterConfigs: FilterConfig[];       // Filter definitions
  sortOptions: SortOption[];           // Sort dropdown options
  columns: ServerTableColumn<T>[];     // Table column definitions
  
  // Optional
  description?: string;                // Subtitle text
  searchPlaceholder?: string;          // Search input placeholder
  showSearch?: boolean;                // Show/hide search (default: true)
  showSort?: boolean;                  // Show/hide sort (default: true)
  emptyMessage?: string;               // No results message
  tableClassName?: string;             // Additional table CSS classes
  showPagination?: boolean;            // Show/hide pagination (default: true)
  pageSizeOptions?: number[];          // Page size dropdown options
}
```

### **Column Definitions**

```typescript
interface ServerTableColumn<T> {
  key: string;                         // Property key in data object
  header: string;                      // Column header text
  align?: 'left' | 'center' | 'right'; // Text alignment
  render?: (value: any, row: T) => React.ReactNode; // Custom renderer
  className?: string;                  // Additional CSS classes
}
```

### **Filter Configurations**

```typescript
interface FilterConfig {
  key: string;                         // Filter key (matches filterKeys)
  title: string;                       // Filter label
  placeholder?: string;                // Dropdown placeholder
  options: FilterOption[];             // Available options
}

interface FilterOption {
  value: any;                          // Filter value (string, number, etc.)
  label: string;                       // Display text
}
```

## 📋 **Common Patterns**

### **Custom Cell Renderers**

```tsx
columns: [
  // Link column
  {
    key: 'fund_name',
    header: 'Fund Name', 
    align: 'left',
    render: (value, row) => (
      <Link href={`/funds/${row.slug}`} className="text-blue-600 hover:underline">
        {value}
      </Link>
    )
  },
  
  // Rating display
  {
    key: 'rating',
    header: 'Rating',
    render: (value) => <RatingDisplay rating={value} />
  },
  
  // Conditional formatting
  {
    key: 'performance',
    header: 'Performance',
    render: (value) => (
      <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
        {value !== null ? `${value}%` : '-'}
      </span>
    )
  },
  
  // Date formatting  
  {
    key: 'created_at',
    header: 'Created',
    render: (value) => formatDate(value)
  }
]
```

### **Filter Options from Supabase**

```tsx
// Use existing helper for filter options
const filterOptions = await getMultipleFilterOptions([
  'status',
  'category', 
  'type'
], {
  status: { table: 'status_master', valueCol: 'status', labelCol: 'status_name' },
  category: { table: 'categories', valueCol: 'id', labelCol: 'name' },
  type: { table: 'my_view', valueCol: 'type', labelCol: 'type' } // From view itself
});

const config = {
  filterConfigs: [
    { key: 'status', title: 'Status', options: filterOptions.status },
    { key: 'category', title: 'Category', options: filterOptions.category },
    { key: 'type', title: 'Type', options: filterOptions.type }
  ]
  // ...
};
```

### **Search Configuration**

```tsx
// Multiple search columns
const data = await serverSideQuery({
  // ...
  search,
  searchColumns: ['name', 'description', 'category_name', 'tags'],
  // ...
});

// Custom search placeholder
const config = {
  searchPlaceholder: 'Search by name, description, or tags...',
  // ...
};
```

## 🎨 **Styling Customization**

### **Table Styling**
```tsx
const config = {
  tableClassName: 'text-sm', // Smaller text
  // or
  tableClassName: 'border-2 border-blue-200', // Custom border
};
```

### **Column-Specific Styling**
```tsx
columns: [
  {
    key: 'amount',
    header: 'Amount',
    className: 'font-mono text-right', // Monospace, right-aligned
    render: (value) => `$${value.toLocaleString()}`
  }
]
```

## 🔄 **URL State Management**

The system automatically manages all state via URL parameters:

```
/my-table?status=active&status=pending&search=test&sort=name&order=asc&page=2&pageSize=100
```

### **URL Parameters**
- **Filters**: `?key=value&key=value2` (multiple values supported)
- **Search**: `?search=query`
- **Sorting**: `?sort=column&order=asc|desc`  
- **Pagination**: `?page=2&pageSize=50`

### **Benefits**
- ✅ **Shareable URLs**: Users can bookmark and share filtered views
- ✅ **Browser Navigation**: Back/forward buttons work correctly
- ✅ **Deep Linking**: Direct links to specific filter states
- ✅ **State Persistence**: Refreshing preserves current view

## 🛠️ **Migration Guide**

### **From Custom Implementation**

```tsx
// Before: Custom components (200+ lines)
export default function MyTable() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  // ... 100+ lines of state management
  // ... Custom filter UI components  
  // ... Custom table rendering
  // ... Custom pagination logic
}

// After: ServerTablePage (20 lines)
export default async function MyTable({ searchParams }) {
  const { filters, pagination, sorting, search } = parseSearchParams(await searchParams);
  const data = await serverSideQuery({ /* config */ });
  const config = { /* table configuration */ };
  
  return <ServerTablePage config={config} data={data.data} pagination={data} />;
}
```

### **Benefits of Migration**
- 📉 **90% less code** to maintain
- 🎯 **Consistent UX** across all large tables  
- 🚀 **Faster development** of new tables
- 🐛 **Fewer bugs** due to shared, tested components
- 📱 **Responsive design** built-in

## 📊 **Performance Considerations**

### **Data Fetching**
- Only fetches visible page data (25-200 records vs full dataset)
- Parallel fetching of filter options and table data
- Server-side filtering reduces database load

### **Client-Side**
- Minimal JavaScript bundle (no client-side table library)
- Fast page loads (server-rendered content)
- Progressive enhancement (works without JS)

### **Caching**
- Use Next.js caching for filter options that rarely change:
```tsx
const filterOptions = await getMultipleFilterOptions(
  // ... config
  { revalidate: 3600 } // Cache for 1 hour
);
```

## 🧪 **Testing**

### **URL State Testing**
```tsx
// Test filter state parsing
const params = { status: ['active', 'pending'], page: '2' };
const state = parseSearchParams(params);
expect(state.filters.status).toEqual(['active', 'pending']);
expect(state.pagination.page).toBe(2);
```

### **Component Testing**
```tsx
// Test table rendering
render(
  <ServerTable 
    data={mockData} 
    columns={mockColumns}
    pagination={mockPagination}
    basePath="/test"
    tableStateConfig={mockConfig}
  />
);
expect(screen.getByText('Test Data')).toBeInTheDocument();
```

## 🚨 **Common Pitfalls**

### **Filter Key Mismatches**
```tsx
// ❌ Wrong: filterKeys and filterConfigs don't match
tableStateConfig: {
  filterKeys: ['status', 'type'] // 'type' key
},
filterConfigs: [
  { key: 'status', title: 'Status', options: [] },
  { key: 'category', title: 'Category', options: [] } // 'category' key - MISMATCH!
]

// ✅ Correct: Keys match exactly
tableStateConfig: {
  filterKeys: ['status', 'category']
},
filterConfigs: [
  { key: 'status', title: 'Status', options: [] },
  { key: 'category', title: 'Category', options: [] }
]
```

### **Column Key Mismatches**
```tsx
// ❌ Wrong: Column key doesn't exist in data
columns: [
  { key: 'fund_name', header: 'Fund' }, // Data has 'fundName', not 'fund_name'
]

// ✅ Correct: Key matches data property
columns: [
  { key: 'fundName', header: 'Fund' },
]
```

### **Async SearchParams**
```tsx
// ❌ Wrong: Not awaiting searchParams in App Router
export default function MyPage({ searchParams }) {
  const { filters } = parseSearchParams(searchParams); // Error!
}

// ✅ Correct: Always await searchParams
export default async function MyPage({ searchParams }) {
  const { filters } = parseSearchParams(await searchParams);
}
```

## 🎓 **Best Practices**

1. **Start Simple**: Use ServerTablePage for most cases
2. **Consistent Naming**: Match filter keys, column keys, and data properties exactly
3. **Type Safety**: Define TypeScript interfaces for your data types
4. **Filter Options**: Use getMultipleFilterOptions for consistent filter data
5. **Error Handling**: Add try-catch around data fetching
6. **Loading States**: Consider adding loading.tsx for better UX
7. **Responsive Design**: Test on mobile devices (tables automatically scroll)
8. **Performance**: Use appropriate page sizes (25-100 for mobile, 50-200 for desktop)

## 📚 **Examples**

See working examples in:
- `app/funds/all/page-refactored.tsx` - Complete refactored example
- `app/funds/all/page.tsx` - Original implementation for comparison
- `app/companies/all/` - Similar pattern for companies data

## 🆘 **Troubleshooting**

### **Filters Not Working**
1. Check filterKeys match filterConfigs keys exactly
2. Verify column names exist in your Supabase view
3. Check serverSideQuery configuration

### **TypeScript Errors**
1. Ensure your data type includes all column keys
2. Check FilterOption types match your data
3. Verify async/await on searchParams

### **Styling Issues**
1. Check Tailwind classes are available
2. Verify component imports are correct
3. Test responsive breakpoints

### **Performance Issues**
1. Reduce page size for faster queries
2. Add database indexes on filtered columns
3. Consider caching frequently-used filter options

---

**Need help?** Check existing implementations or ask the team! 🚀 