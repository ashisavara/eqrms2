# MDX UI Blocks - Documentation

This directory contains reusable UI components that are available for use in MDX content (blogs, articles, etc.).

## Workflow for Adding New MDX Components

### 1. Create Component
- Create a new file in this directory (`/components/uiBlocks/`)
- Use **server components** by default (avoid `'use client'` unless necessary)
- Keep components **simple and reusable**
- Use **Tailwind classes** for styling (minimal custom CSS)
- SEO-friendly: Static content should be in the initial render

### 2. Define Props
- Discuss and define clear, minimal props
- Add TypeScript interfaces for props
- Keep prop names intuitive

### 3. Register Component
- Add component to `/mdx-components.tsx` at the root
- Import and add to the `components` object

### 4. Document Component
- Add component to the Component Directory Sheet
- Include component name, description, and props
- Update `/components/uiBlocks/ComponentDirectory.tsx`

## Component Guidelines

### ✅ Do
- Use server components when possible
- Leverage Tailwind utility classes
- Keep components simple and focused
- Make components reusable with props
- Ensure SEO-friendly (static content visible in HTML)

### ❌ Don't
- Avoid `'use client'` unless interactive features are essential
- Don't use complex custom CSS
- Don't create overly complicated components
- Don't hide SEO-important content behind client-side state

## Example Component Structure

```tsx
// red-Container.tsx
export default function RedContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-red-500 p-4 rounded-md">
            {children}
        </div>
    )
}
```

## Using Components in MDX

Components registered in `mdx-components.tsx` can be used directly in your MDX content:

```mdx
<RedContainer>
    This content will be displayed in a red container
</RedContainer>
```

## Component Directory

To view all available components and their props, click the "MDX Components" button in the blog editor.

