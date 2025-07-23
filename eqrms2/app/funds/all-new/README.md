# 🎯 Server-Side Table Template

This directory contains a **perfect template** for creating new large tables (>1000 records) with server-side filtering, sorting, and pagination.

## 🚀 Quick Start

### **To Create a New Table:**

1. **📁 Copy this directory**
   ```bash
   cp -r app/funds/all-new app/my-new-table
   ```

2. **🔧 Update key configuration** (in `page.tsx`):
   ```tsx
   // Change these parts:
   import { MyDataType } from '@/types/my-data';        // Your data type
   
   const filterKeys = ['status', 'category', 'type'];   // Your filter columns
   const sortColumn = 'created_at';                     // Your default sort
   
   const filterConfig = {
     status: { table: 'status_master', valueCol: 'status', labelCol: 'status_name' },
     // ... your filter sources
   };
   
   serverSideQuery<MyDataType>({
     table: "my_view",                                  // Your Supabase view
     columns: "id,name,status,created_at",             // Your columns
     searchColumns: ['name', 'description'],          // Your search columns
   });
   
   const config = {
     basePath: '/my-new-table',                        // Your route
     title: 'My New Table',                           // Your title
     columns: [                                       // Your table columns
       { key: 'name', header: 'Name', align: 'left' },
       // ... your columns
     ]
   };
   ```

3. **✅ Test your new table** - It should work immediately!

## 📊 What You Get Automatically

✅ **URL-based state management** - Shareable, bookmarkable URLs  
✅ **Multi-select filtering** - From dedicated Supabase tables  
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

- **New table from template**: ~15 minutes
- **Without template**: ~3+ hours

## 📚 Need More Help?

- See `docs/SERVER_SIDE_TABLES.md` for complete documentation
- Check the original implementation for working examples
- Ask the team for specific use cases!

---

**This template gives you production-ready large tables in minutes, not hours! 🚀** 