## ADDING A NEW FORM 

Steps to take
1) types/forms.ts: Make sure types is defined in types/forms.ts
2) Identify the fields which will need to be passed in options 
3) page.tsx: (a) pulls in data to pass into forms via SupabaseListRead (b) runs the <___form> component by passing in the relevant props
4) component/forms/___form.tsx component: edit form component that handles UI/UX interactivity of displaying the sheet, form validation, form submission via api/
5) api/___/route.ts: uses SupabaseUpdate to update that data

## ADDING A NEW TABLE (client side sorting)
Steps to take
1) types/___ : confirm if a data type has been defined (often there is one for a detailed view, and one or more for forms)
2) columns.ts: define the column.ts file
3) table.ts: create the table.ts file  
        -- make sure to rename the table in the export function 
        -- replace the filters based on requirements & see if any custom functionality needed / not needed
4) page.tsx:
        -- supabase import of read 
        -- replace import to the new table name