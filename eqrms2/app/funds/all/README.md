# 🎯 Server-Side Table Template with Iterative Filtering

This directory contains a **perfect template** for creating new large tables (>1000 records) with server-side filtering, sorting, pagination, and **iterative filtering**.

## 🔄 **NEW: Iterative Filtering**

Filter options now **automatically update** based on applied filters! Users only see options that will return results.

**Example**: Select AMC = "HDFC" → Category filter only shows categories where HDFC has funds.

This creates a much better user experience and prevents "empty result" situations.

## 🚀 Quick Start

### **To Create a New Table:**

1. **📁 Copy this directory**
   ```bash
   cp -r app/funds/all-new app/my-new-table
   ```

2. **🔧 Update server component** (in `page.tsx`):
   ```tsx
   // Change these parts in page.tsx:
   import { MyDataType } from '@/types/my-data';        // Your data type
   import MyTableClient from './MyTableClient';        // Your client component
   
   const filterKeys = ['status', 'category', 'type'];   // Your filter columns
   const searchColumns = ['name', 'description'];      // Your search columns
   const sortColumn = 'created_at';                     // Your default sort
   
   const filterConfig = {
     status: { table: 'status_master', valueCol: 'status', labelCol: 'status_name' },
     // ... your filter sources
   };
   
   serverSideQuery<MyDataType>({
     table: "my_view",                                  // Your Supabase view
     columns: "id,name,status,created_at",             // Your columns
     searchColumns: searchColumns,                     // Your search columns
   });
   
   // Pass to client component for iterative filtering:
   return <MyTableClient 
     filterConfig={filterConfig} 
     searchColumns={searchColumns}
     // ... other props
   />;
   ```

3. **🎨 Update client component** (rename and modify `FundsTableClient.tsx`):
   ```tsx
   // Change these parts in MyTableClient.tsx:
   const config = {
     basePath: '/my-new-table',                        // Your route
     title: 'My New Table',                           // Your title
     columns: [                                       // Your table columns with render functions
       { 
         key: 'name', 
         header: 'Name', 
         align: 'left',
         render: (value, row) => <Link href={`/items/${row.id}`}>{value}</Link>
       },
       // ... your columns with custom rendering
     ],
     
     // 🔄 ITERATIVE FILTERING (automatically enabled!)
     sourceTable: 'my_main_view',                     // Your main data table
     filterConfig: filterConfig,                      // Passed from server component
     searchColumns: searchColumns                     // Passed from server component
   };
   ```

4. **✅ Test your new table** - It should work immediately!

## 📊 What You Get Automatically

✅ **URL-based state management** - Shareable, bookmarkable URLs  
✅ **Multi-select filtering** - From dedicated Supabase tables  
✅ **🔄 Iterative filtering** - Filter options update dynamically (NEW!)  
✅ **Server-side pagination** - Handles thousands of records efficiently  
✅ **Global search** - Across multiple columns  
✅ **Column sorting** - Click headers or use dropdown  
✅ **Custom cell rendering** - Links, components, conditional formatting  
✅ **Responsive design** - Works on mobile and desktop  
✅ **TypeScript safety** - Full type checking  

## 🎨 Column Examples

The template shows all common column patterns:

```tsx
// Simple text column
{ key: 'name', header: 'Name' }

// Left-aligned column  
{ key: 'description', header: 'Description', align: 'left' }

// Link column
{ 
  key: 'name', 
  header: 'Name', 
  render: (value, row) => <Link href={`/items/${row.id}`}>{value}</Link> 
}

// Conditional rendering
{ 
  key: 'amount', 
  header: 'Amount', 
  render: (value) => value !== null ? `$${value}` : '-' 
}

// Custom component
{ 
  key: 'rating', 
  header: 'Rating', 
  render: (value) => <RatingDisplay rating={value} /> 
}
```

## 🔧 Filter Configuration Patterns

```tsx
// From dedicated master table
category: { 
  table: 'categories', 
  valueCol: 'id', 
  labelCol: 'name' 
}

// From main view (for Y/N, status fields)
status: { 
  table: 'my_main_view', 
  valueCol: 'status', 
  labelCol: 'status' 
}

// Special handling (like ratings 1-5)
rating: { table: '', valueCol: '', labelCol: '' } // Handled automatically
```

## ⏱️ Development Time

- **New table from template**: ~20 minutes (server + client components)
- **Without template**: ~3+ hours

## 🏗️ Architecture Pattern

This template uses **Server + Client Component architecture**:
- **Server Component** (`page.tsx`): Handles data fetching, URL parsing, filter configuration
- **Client Component** (`TableClient.tsx`): Handles UI rendering, render functions, interactions

This pattern solves Next.js App Router limitations while maintaining optimal performance.

## 📚 Need More Help?

- See `docs/SERVER_SIDE_TABLES.md` for complete documentation
- Check the original implementation for working examples
- Ask the team for specific use cases!

---

**This template gives you production-ready large tables in minutes, not hours! 🚀** 