# SEO Utility Documentation

## Overview

The SEO utility system provides comprehensive metadata generation for all public routes in the IME Capital application. It uses a hybrid approach with a reusable core generator and content-type-specific helpers.

## Architecture

```
lib/seo/
├── types.ts              # Generic SEO types
├── constants.ts          # Site-wide defaults and configuration
├── generator.ts          # Core reusable utility
└── helpers/
    ├── blog.ts           # Blog SEO helper
    ├── fund.ts           # PMS scheme SEO helper
    ├── amc.ts            # AMC SEO helper
    ├── investment-query.ts  # Investment query SEO helper
    └── media-interview.ts   # Media interview SEO helper
```

## Key Features

✅ **Handles both cases**: Works with or without SEO columns in database
✅ **Content-specific**: Each content type has tailored SEO logic
✅ **Sensible fallbacks**: Automatic fallback chain for missing data
✅ **Image handling**: Supports featured images (blogs) and defaults
✅ **Type-safe**: Full TypeScript support with existing types
✅ **Subdomain-aware**: Handles noindex for staging environments
✅ **Maintainable**: Clear separation, easy to extend

## SEO Column Convention

All content tables can optionally include these SEO columns:

- `seo_title` - Custom page title
- `seo_description` - Custom meta description
- `og_title` - Custom OpenGraph title
- `og_description` - Custom OpenGraph description
- `og_image` - Custom OpenGraph image

## Fallback Chain

The system implements a fallback chain for each field:

1. **SEO-specific columns** (if they exist and have data)
2. **Content fields** (title, description, featured_image, etc.)
3. **Site-wide defaults** (defined in constants)

## Content Type Mappings

### Blogs (`/blogs/[slug]`)
- **Title**: `seo_title` → `title`
- **Description**: `seo_description` → first 160 chars of `body` (strip markdown)
- **OG Image**: `og_image` → `featured_image` → default
- **Type**: `article`
- **Article metadata**: Published time, section (category), tags

### PMS Schemes (`/pms-scheme/[slug]`)
- **Title**: `seo_title` → `"IME's View on {fund_name}"`
- **Description**: `seo_description` → `investment_view` (first 160 chars) → default
- **OG Image**: `og_image` → default (no featured images)
- **Type**: `website`
- **Keywords**: Fund name, AMC name, category, asset class

### PMS AMCs (`/pms-amc/[slug]`)
- **Title**: `seo_title` → `"IME's View on {amc_name}"`
- **Description**: `seo_description` → `amc_view` (first 160 chars) → default
- **OG Image**: `og_image` → default
- **Type**: `website`
- **Keywords**: AMC name, structure

### Investment Queries (`/investment-query/[slug]`)
- **Title**: `seo_title` → `title`
- **Description**: `seo_description` → first 160 chars of `body` (strip HTML)
- **OG Image**: `og_image` → default
- **Type**: `article`
- **Article metadata**: Published time, section (categories), tags

### Media Interviews (`/media-interview/[slug]`)
- **Title**: `seo_title` → `title`
- **Description**: `seo_description` → `summary` → default
- **OG Image**: `og_image` → YouTube thumbnail (extract from `youtube_url`) → default
- **Type**: `video.other`
- **Article metadata**: Published time, section (publication), tags

## Usage

### Adding SEO to New Content Types

1. **Create a helper function** in `lib/seo/helpers/`:

```typescript
// lib/seo/helpers/new-content.ts
import type { Metadata } from "next";
import type { NewContentType } from "@/types/new-content-type";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

export async function generateNewContentSEO(
  content: NewContentType,
  subdomain?: string
): Promise<Metadata> {
  const seoData: SEOData = {
    seo_title: (content as any).seo_title,
    seo_description: (content as any).seo_description,
    og_title: (content as any).og_title,
    og_description: (content as any).og_description,
    og_image: (content as any).og_image,
  };

  const contentFallbacks: ContentFallbacks = {
    title: content.title,
    description: content.description,
    // ... other fallbacks
  };

  const config: SEOConfig = {
    type: 'website', // or 'article'
    titleTemplate: 'IME - {title}',
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/new-content/${content.slug}`,
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/new-content/${content.slug}`);
}
```

2. **Add generateMetadata to your page**:

```typescript
// app/(public)/new-content/[slug]/page.tsx
import { generateNewContentSEO } from '@/lib/seo/helpers/new-content';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = await getStaticNewContent(slug);
  if (!content) return {};
  return generateNewContentSEO(content);
}
```

3. **Update type definitions** to include optional SEO fields:

```typescript
// types/new-content-type.ts
export type NewContentType = {
  id: number;
  title: string;
  description: string;
  slug: string;
  // ... other fields
  // Optional SEO fields
  seo_title?: string | null;
  seo_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
};
```

### Adding Custom OG Images

1. **Upload image** to Supabase storage or public folder
2. **Set og_image field** in your content record
3. **For Supabase storage**: Use path like `/path/to/image.jpg`
4. **For public folder**: Use path like `/images/custom-og.jpg`

### Subdomain Handling

The system automatically handles subdomain-specific SEO:

- **Production**: Full SEO with indexing
- **RMS subdomain**: `noindex, nofollow`
- **Public subdomain**: `noindex, nofollow` (temporarily)

## Testing SEO Metadata

### 1. View Page Source
Check that meta tags appear in the HTML source:
```html
<title>IME - Your Page Title</title>
<meta name="description" content="Your page description">
<meta property="og:title" content="IME - Your Page Title">
<meta property="og:description" content="Your page description">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
```

### 2. Social Media Preview
Test with tools like:
- [OpenGraph.xyz](https://www.opengraph.xyz/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 3. Search Console
Monitor in Google Search Console for:
- Indexing status
- Rich results
- Mobile usability

## Configuration

### Site-wide Defaults
Edit `lib/seo/constants.ts` to modify:
- Site name
- Title template
- Default description
- Default OG image
- Base URL

### Content Type Configuration
Edit `CONTENT_TYPE_CONFIG` in `lib/seo/constants.ts` to modify:
- OpenGraph types
- Title templates
- Description prefixes

## Troubleshooting

### Common Issues

1. **Missing meta tags**: Check that `generateMetadata()` is exported from your page
2. **Wrong images**: Verify image URLs are accessible and properly formatted
3. **Noindex not working**: Ensure subdomain detection is working in middleware
4. **TypeScript errors**: Make sure SEO fields are added to type definitions

### Debug Mode

Add console logging to helpers to debug:

```typescript
export async function generateBlogSEO(blog: blogDetail, subdomain?: string): Promise<Metadata> {
  console.log('SEO Debug:', { blog: blog.title, subdomain });
  // ... rest of function
}
```

## Best Practices

1. **Always provide fallbacks**: Ensure content has meaningful titles and descriptions
2. **Optimize images**: Use 1200x630px for OG images
3. **Keep descriptions concise**: Aim for 150-160 characters
4. **Test regularly**: Verify SEO metadata after changes
5. **Monitor performance**: Use Search Console to track SEO performance

## Future Enhancements

- Structured data (JSON-LD) support
- Dynamic OG image generation
- SEO analytics integration
- A/B testing for meta descriptions
- Automated SEO audits
