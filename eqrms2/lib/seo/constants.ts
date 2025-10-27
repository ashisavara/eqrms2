import type { SEODefaults } from './types';

/**
 * Site-wide SEO constants and defaults
 */
export const SEO_DEFAULTS: SEODefaults = {
  siteName: 'IME Capital',
  titleTemplate: 'IME - {title}',
  defaultDescription: 'Proprietary Fund Research Database by IME Capital - Expert insights on mutual funds, PMS schemes, and investment strategies.',
  defaultImage: '/og-default.svg',
  twitterCard: 'summary_large_image',
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://imecapital.in'
    : 'http://localhost:3000',
};

/**
 * Supabase storage configuration
 */
export const SUPABASE_CONFIG = {
  storageUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  storageBucket: 'blog', // Default bucket for blog images
};

/**
 * SEO field mappings for different content types
 */
export const SEO_FIELD_MAPPINGS = {
  blog: {
    title: 'title',
    description: 'body',
    image: 'featured_image',
    publishedTime: 'created_at',
    section: 'category',
  },
  fund: {
    title: 'fund_name',
    description: 'investment_view',
    image: null, // No featured images for funds
    publishedTime: null,
    section: 'category_name',
  },
  amc: {
    title: 'amc_name',
    description: 'amc_view',
    image: null, // No featured images for AMCs
    publishedTime: null,
    section: 'structure',
  },
  investmentQuery: {
    title: 'title',
    description: 'body',
    image: null, // No featured images for queries
    publishedTime: 'created_at',
    section: 'query_categories',
  },
  mediaInterview: {
    title: 'title',
    description: 'summary',
    image: 'youtube_url', // Will extract thumbnail
    publishedTime: 'publication_date',
    section: 'publication',
  },
} as const;

/**
 * Content type configurations
 */
export const CONTENT_TYPE_CONFIG = {
  blog: {
    type: 'article' as const,
    titleTemplate: 'IME - {title}',
    descriptionPrefix: 'IME Capital Blog: ',
  },
  fund: {
    type: 'website' as const,
    titleTemplate: "IME's View on {title}",
    descriptionPrefix: 'Expert analysis of ',
  },
  amc: {
    type: 'website' as const,
    titleTemplate: "IME's View on {title}",
    descriptionPrefix: 'Expert analysis of ',
  },
  investmentQuery: {
    type: 'article' as const,
    titleTemplate: 'IME - {title}',
    descriptionPrefix: 'Investment Query: ',
  },
  mediaInterview: {
    type: 'video.other' as const,
    titleTemplate: 'IME - {title}',
    descriptionPrefix: 'Media Interview: ',
  },
} as const;

/**
 * Utility functions for SEO
 */
export const SEO_UTILS = {
  /**
   * Truncate text to specified length
   */
  truncateText: (text: string, maxLength: number = 160): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  /**
   * Strip HTML tags from text
   */
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  },

  /**
   * Strip markdown formatting from text
   */
  stripMarkdown: (markdown: string): string => {
    return markdown
      .replace(/#{1,6}\s+/g, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`([^`]+)`/g, '$1') // Code
      .replace(/\n+/g, ' ') // Newlines
      .replace(/\s+/g, ' ') // Multiple spaces
      .trim();
  },

  /**
   * Extract YouTube thumbnail URL from YouTube URL
   */
  extractYouTubeThumbnail: (youtubeUrl: string): string | null => {
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return null;
  },

  /**
   * Build Supabase storage URL
   */
  buildStorageUrl: (path: string, bucket: string = SUPABASE_CONFIG.storageBucket): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL
    return `${SUPABASE_CONFIG.storageUrl}/storage/v1/object/public/${bucket}${path}`;
  },

  /**
   * Format date for OpenGraph
   */
  formatDateForOG: (date: Date | string): string => {
    const d = new Date(date);
    return d.toISOString();
  },

  /**
   * Generate canonical URL
   */
  generateCanonicalUrl: (path: string, baseUrl: string = SEO_DEFAULTS.baseUrl): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  },
};
