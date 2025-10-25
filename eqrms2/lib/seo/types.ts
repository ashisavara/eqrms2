import type { Metadata } from "next";

/**
 * Optional SEO columns that can be added to any content table
 */
export interface SEOData {
  seo_title?: string | null;
  seo_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
}

/**
 * Configuration for SEO metadata generation
 */
export interface SEOConfig {
  /** Content type for OpenGraph type */
  type?: 'website' | 'article' | 'video.other';
  /** Custom title template (defaults to "IME - {title}") */
  titleTemplate?: string;
  /** Custom description fallback */
  descriptionFallback?: string;
  /** Custom OG image fallback */
  imageFallback?: string;
  /** Whether to include robots noindex */
  noIndex?: boolean;
  /** Custom canonical URL */
  canonicalUrl?: string;
  /** Additional keywords */
  keywords?: string[];
  /** Article-specific metadata */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    authors?: string[];
  };
}

/**
 * Site-wide SEO defaults
 */
export interface SEODefaults {
  siteName: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  baseUrl: string;
}

/**
 * Content fallback fields for when SEO columns don't exist
 */
export interface ContentFallbacks {
  title?: string;
  description?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  keywords?: string[];
}

/**
 * SEO metadata generation result
 */
export interface SEOGenerationResult {
  title: string;
  description: string;
  image: string;
  type: string;
  url: string;
  robots: 'index,follow' | 'noindex,nofollow';
  keywords: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    authors?: string[];
  };
}
