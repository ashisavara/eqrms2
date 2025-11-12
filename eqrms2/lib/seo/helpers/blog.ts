import type { Metadata } from "next";
import type { blogDetail } from "@/types/blog-detail";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

/**
 * Generate SEO metadata for blog posts
 */
export async function generateBlogSEO(
  blog: blogDetail,
  subdomain?: string
): Promise<Metadata> {
  // Extract SEO data from blog (if SEO columns exist)
  const seoData: SEOData = {
    seo_title: (blog as any).seo_title,
    seo_description: (blog as any).seo_description,
    og_title: (blog as any).og_title,
    og_description: (blog as any).og_description,
    og_image: (blog as any).og_image,
  };

  // Safely extract blog fields with null checks
  const blogTitle = blog.title || 'Untitled Blog Post';
  const blogBody = blog.body || '';
  const blogCategory = blog.category || 'General';
  const blogSlug = blog.slug || '';

  // Build content fallbacks with safe defaults
  const contentFallbacks: ContentFallbacks = {
    title: blogTitle,
    description: blogBody,
    image: blog.featured_image || undefined,
    publishedTime: blog.created_at ? new Date(blog.created_at).toISOString() : undefined,
    section: blogCategory,
    tags: blogCategory ? [blogCategory] : [],
    keywords: ['IME Capital', 'Blog', blogCategory, 'Investment Research'].filter(Boolean),
  };

  // Build SEO config with safe defaults
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.blog.type,
    titleTemplate: CONTENT_TYPE_CONFIG.blog.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.blog.descriptionPrefix}${blogTitle}`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: blogSlug ? `/blogs/${blogSlug}` : undefined,
    keywords: ['IME Capital', 'Blog', blogCategory, 'Investment Research'].filter(Boolean),
    article: {
      publishedTime: SEO_UTILS.formatDateForOG(blog.created_at),
      section: blogCategory || undefined,
      tags: blogCategory ? [blogCategory] : undefined,
      authors: ['IME Capital'],
    },
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, blogSlug ? `/blogs/${blogSlug}` : undefined);
}
