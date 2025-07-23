## DEALING WITH FORMS
- PAGES INVOLVED
    - page.tsx: the page on which the form is displayed 
    - components/form-component: the component that actually generates the form (if an edit form, then it gets passed in the initial values as props)
    - components/formFields: helper component used to generate the actual fields
    - serverQueryHelper: interact with supabase - (a) fetching data this is directly called via page.tsx (b) submit form uses intermediary API to prevent calling head into a client component
    - types/forms.ts: where the form data object is defined
    - api/___/route.ts: used to handle submisstions -- is called by the form component, and handles the update via serverQueryHelper
- TYPICAL STEPS
    - types/forms.ts: define (if not already done for other form) the form object
    - components/form-component: create the form

## DEALING WITH SHEETS FOR TABLE ROW EDITING
- APPROACH: Use Shadcn Sheet components to pop up edit forms when clicking on table entries
- ARCHITECTURE: 
    - page.tsx: server component that passes different sheet components as props to tables
    - Table component: client component that manages sheet open/close state and selected row data
    - columns-*.tsx: configuration files that define clickable elements and callbacks
    - Sheet components: wrapper components containing Sheet + specific form/display content

- COMPONENT STRUCTURE:
    ```
    page.tsx (Server) 
    └── TableComponent (Client) - manages state
        ├── ReactTableWrapper - displays table
        ├── columns - configuration with clickable elements
        └── SheetComponent (prop) - contains Sheet + Form
    ```

- DATA FLOW:
    ```
    Table Row Click → selectedData (row.original) → SheetComponent → Form Component
    ```

- IMPLEMENTATION PATTERN:
    - page.tsx: Pass different sheet components as props for different behaviors
      ```tsx
      <TableQuarterlyNotes data={data} sheetComponent={EditQuarterlyNotesSheet} />
      <TableSummaryNotes data={data} sheetComponent={ViewOnlySheet} />
      ```
    - Table component: Manage state and render passed sheet component
      ```tsx
      const [isSheetOpen, setIsSheetOpen] = useState(false);
      const [selectedData, setSelectedData] = useState(null);
      {isSheetOpen && <SheetComponent data={selectedData} onClose={() => setIsSheetOpen(false)} />}
      ```
    - Columns: Define clickable elements that trigger sheet opening
      ```tsx
      cell: ({ row }) => <button onClick={() => handleClick(row.original)}>Edit</button>
      ```

- FLEXIBILITY: 
    - Same table can have different sheet behaviors based on props
    - Different tables can have completely different sheet content
    - Server components stay clean, client components handle interactivity
    - Sheet components can contain any content: forms, displays, complex layouts 

## DEALING WITH TABLE FILTERING - HYBRID MULTI-SELECT APPROACH
- PROBLEM SOLVED: Enable multi-select within same filter (e.g., "Auto" + "Pharma" sectors) while maintaining iterative filtering between different filters
- ARCHITECTURE:
    - ReactTableWrapper: Contains all filtering logic with hybrid option generation
    - MultiSelectFilter: Reusable dropdown component with checkboxes
    - Filter configuration: Passed as props to ReactTableWrapper

- HYBRID LOGIC (3-STEP APPROACH):
    ```
    Step 1: Generate original options from full dataset (enables multi-select)
    Step 2: Calculate filtered options excluding current filter (enables iterative filtering)
    Step 3: Combine strategies:
        - Filters WITH selections → Show ALL original options
        - Filters WITHOUT selections → Show filtered options from other filters
    ```

- USER EXPERIENCE:
    ```
    Initial: All filters show all options
    Select "Auto" sector: 
        - Sector dropdown: Still shows all sectors (can add "Pharma")
        - Industry dropdown: Only shows Auto industries
    Add "Pharma" sector:
        - Sector dropdown: Still shows all sectors  
        - Industry dropdown: Shows Auto + Pharma industries combined
    ```

- IMPLEMENTATION:
    ```tsx
    // In page component
    const filters = [
      { column: "sector_name", title: "Sector", placeholder: "Select sectors..." },
      { column: "industry", title: "Industry", placeholder: "Select industries..." }
    ];
    return <ReactTableWrapper table={table} filters={filters} />;
    
    // In column definitions  
    { accessorKey: "sector_name", header: "Sector", filterFn: "arrIncludesSome" }
    ```

- KEY FILES:
    - components/data-table/ReactTableWrapper.tsx: Hybrid filtering logic
    - components/data-table/MultiSelectFilter.tsx: Dropdown component
    - TableComponent.tsx: Filter configuration and custom filterFns
