# Architecture Overview

## Architecture Preferences
- DRY: make use of DRY to the extent possible, without over abstracting, making logic too complex etc .. fine balance of DRY and code readability 

## Security Patterns
- Authentication via Supabase Auth
- Row Level Security in Supabase
- Server Actions for sensitive operations
- Supabase user roles table defines user role .. at the supabase end these roles are injected into the JWT, which then gives access to the role to show or hide UI elements, specific actions etc

## Performance Considerations
- Server Components for initial render
- Selective hydration
- Optimistic updates
- Edge runtime where applicable 

## Data Fetching Strategy
- All data fetching will only happen server side (no data fetching on a client component)
- This is very imp .. we want to avoid any exposure of anon keys or JWTs to the clent

### Server-Side Data Fetching
- All data fetching is performed on the server side.
- All `page.tsx` files are server components.
- Client components are included within server components when needed.
- This approach ensures better performance and security by leveraging server-side rendering.
- lib/supabase/serverQueryHelper is a server utility to deal with all supabase interactions (using the supabase server client)
- even api/___/layout.ts uses serverQueryHelper to fetch/update/insert/delete data

### Client Component Interaction with Supabase
- Client components interact with Supabase via `api/___/route.ts`.
- The `route.ts` files use `serverQueryHelper` to perform operations.
- This pattern avoids direct API calls from the client, enhancing security and consistency.
- It allows client components to leverage server-side logic and data access patterns. 

## Specific elements/functionalities etc & how we design them

### Edit Forms
- Edit/page.tsx is a server component which interacts with the following components/helpers
- Actual Edit form is a client-component form-wrapper: gets intital load data (passed in as a prop), creates the form structure (using specific field components from FormFields.tsx), updates data (via api/__/route.ts -- to avoid pulling in next/headers into a client component by interacting with serverQueryHelper.ts directly) 
- Component/Form/FormFields.tsx : holds all the actual form input elements (text area, multiselect, checkbox etc)
- form types defined in forms.ts
- serverQueryHelper.ts used to fetch initial data (to pass onto the Edit Form component as a prop) and also to update data in supabase (but via api/___/route.ts to avoid )
- shadcn sheets used for pop-up forms

## LIBRARIES INSTALLED (note- may not be exhaustive)
- react-textarea-autosize: for resizable text boxes 
- sonner (toast notifications)