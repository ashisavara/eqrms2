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

  // Build content fallbacks
  const contentFallbacks: ContentFallbacks = {
    title: blog.title,
    description: blog.body,
    image: blog.featured_image,
    publishedTime: blog.created_at ? new Date(blog.created_at).toISOString() : undefined,
    section: blog.category,
    tags: [blog.category],
    keywords: ['IME Capital', 'Blog', blog.category, 'Investment Research'],
  };

  // Build SEO config
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.blog.type,
    titleTemplate: CONTENT_TYPE_CONFIG.blog.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.blog.descriptionPrefix}${blog.title}`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/blogs/${blog.slug}`,
    keywords: ['IME Capital', 'Blog', blog.category, 'Investment Research'],
    article: {
      publishedTime: SEO_UTILS.formatDateForOG(blog.created_at),
      section: blog.category,
      tags: [blog.category],
      authors: ['IME Capital'],
    },
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/blogs/${blog.slug}`);
}
