import type { Metadata } from "next";
import type { SEOData, SEOConfig, ContentFallbacks, SEOGenerationResult } from './types';
import { SEO_DEFAULTS, SEO_UTILS } from './constants';

/**
 * Core SEO metadata generator
 * Handles the fallback chain: SEO columns → content fields → site defaults
 */
export async function generateSEOMetadata(
  seoData: SEOData,
  contentFallbacks: ContentFallbacks,
  config: SEOConfig = {},
  currentPath?: string
): Promise<Metadata> {
  // Determine if we should noindex (for staging subdomains)
  const shouldNoIndex = config.noIndex || false;

  // Generate the core SEO data
  const result = generateSEOData(seoData, contentFallbacks, config, currentPath);

  // Build the Metadata object
  const metadata: Metadata = {
    title: result.title,
    description: result.description,
    robots: result.robots,
    keywords: result.keywords.length > 0 ? result.keywords : undefined,
    openGraph: {
      title: result.title,
      description: result.description,
      url: result.url,
      siteName: SEO_DEFAULTS.siteName,
      images: [
        {
          url: result.image,
          width: 1200,
          height: 630,
          alt: result.title,
        },
      ],
      type: result.type as any,
      ...(result.article && {
        publishedTime: result.article.publishedTime,
        modifiedTime: result.article.modifiedTime,
        section: result.article.section,
        tags: result.article.tags,
        authors: result.article.authors,
      }),
    },
    twitter: {
      card: SEO_DEFAULTS.twitterCard,
      title: result.title,
      description: result.description,
      images: [result.image],
    },
    alternates: {
      canonical: result.url,
    },
  };

  return metadata;
}

/**
 * Generate core SEO data with fallback chain
 */
function generateSEOData(
  seoData: SEOData,
  contentFallbacks: ContentFallbacks,
  config: SEOConfig,
  currentPath?: string
): SEOGenerationResult {
  // Title fallback chain
  const title = seoData.seo_title || 
                seoData.og_title || 
                contentFallbacks.title || 
                'Untitled';

  // Description fallback chain
  const description = seoData.seo_description || 
                     seoData.og_description || 
                     contentFallbacks.description || 
                     config.descriptionFallback || 
                     SEO_DEFAULTS.defaultDescription;

  // Image fallback chain
  const image = seoData.og_image || 
                contentFallbacks.image || 
                config.imageFallback || 
                SEO_DEFAULTS.defaultImage;

  // Process the data
  const processedTitle = processTitle(title, config.titleTemplate);
  const processedDescription = processDescription(description);
  const processedImage = processImage(image);
  const processedUrl = processUrl(currentPath, config.canonicalUrl);

  // Determine robots directive
  const robots = config.noIndex ? 'noindex,nofollow' : 'index,follow';

  // Build keywords array
  const keywords = buildKeywords(contentFallbacks.keywords, config.keywords);

  // Build article metadata if applicable
  const article = buildArticleMetadata(contentFallbacks, config.article);

  return {
    title: processedTitle,
    description: processedDescription,
    image: processedImage,
    type: config.type || 'website',
    url: processedUrl,
    robots: robots as 'index,follow' | 'noindex,nofollow',
    keywords,
    article,
  };
}

/**
 * Process title with template
 */
function processTitle(title: string, template?: string): string {
  const titleTemplate = template || SEO_DEFAULTS.titleTemplate;
  return titleTemplate.replace('{title}', title);
}

/**
 * Process description (truncate and clean)
 */
function processDescription(description: string | null | undefined): string {
  // Handle null/undefined/empty strings
  if (!description || typeof description !== 'string') {
    return SEO_DEFAULTS.defaultDescription;
  }
  
  try {
    // Strip HTML and markdown
    let cleanDescription = SEO_UTILS.stripHtml(description);
    cleanDescription = SEO_UTILS.stripMarkdown(cleanDescription);
    
    // Truncate to 160 characters
    return SEO_UTILS.truncateText(cleanDescription, 160);
  } catch (error) {
    console.error('Error processing description:', error);
    return SEO_DEFAULTS.defaultDescription;
  }
}

/**
 * Process image URL
 */
function processImage(image: string): string {
  if (!image) return SEO_DEFAULTS.defaultImage;
  
  // If it's a YouTube URL, extract thumbnail
  if (image.includes('youtube.com') || image.includes('youtu.be')) {
    const thumbnail = SEO_UTILS.extractYouTubeThumbnail(image);
    if (thumbnail) return thumbnail;
  }
  
  // If it's a Supabase storage path, build full URL
  if (image.startsWith('/') && !image.startsWith('http')) {
    return SEO_UTILS.buildStorageUrl(image);
  }
  
  // If it's already a full URL, return as is
  if (image.startsWith('http')) {
    return image;
  }
  
  // If it's a relative path, prepend base URL
  if (image.startsWith('/')) {
    return `${SEO_DEFAULTS.baseUrl}${image}`;
  }
  
  // Default fallback
  return SEO_DEFAULTS.defaultImage;
}

/**
 * Process URL for canonical and OpenGraph
 */
function processUrl(currentPath?: string, canonicalUrl?: string): string {
  if (canonicalUrl) return canonicalUrl;
  if (currentPath) return SEO_UTILS.generateCanonicalUrl(currentPath);
  return SEO_DEFAULTS.baseUrl;
}

/**
 * Build keywords array
 */
function buildKeywords(contentKeywords?: string[], configKeywords?: string[]): string[] {
  const keywords = new Set<string>();
  
  // Add content keywords
  if (contentKeywords) {
    contentKeywords.forEach(keyword => {
      if (keyword && keyword.trim()) {
        keywords.add(keyword.trim());
      }
    });
  }
  
  // Add config keywords
  if (configKeywords) {
    configKeywords.forEach(keyword => {
      if (keyword && keyword.trim()) {
        keywords.add(keyword.trim());
      }
    });
  }
  
  return Array.from(keywords);
}

/**
 * Build article metadata
 */
function buildArticleMetadata(
  contentFallbacks: ContentFallbacks,
  articleConfig?: SEOConfig['article']
): SEOGenerationResult['article'] {
  const article: SEOGenerationResult['article'] = {};
  
  // Published time
  if (contentFallbacks.publishedTime) {
    const publishedTime = SEO_UTILS.formatDateForOG(contentFallbacks.publishedTime);
    if (publishedTime) {
      article.publishedTime = publishedTime;
    }
  }
  
  // Modified time
  if (contentFallbacks.modifiedTime) {
    const modifiedTime = SEO_UTILS.formatDateForOG(contentFallbacks.modifiedTime);
    if (modifiedTime) {
      article.modifiedTime = modifiedTime;
    }
  }
  
  // Section
  if (contentFallbacks.section) {
    article.section = contentFallbacks.section;
  }
  
  // Tags
  if (contentFallbacks.tags && contentFallbacks.tags.length > 0) {
    article.tags = contentFallbacks.tags;
  }
  
  // Authors (default to IME Capital)
  article.authors = ['IME Capital'];
  
  // Override with config if provided
  if (articleConfig) {
    if (articleConfig.publishedTime) article.publishedTime = articleConfig.publishedTime;
    if (articleConfig.modifiedTime) article.modifiedTime = articleConfig.modifiedTime;
    if (articleConfig.section) article.section = articleConfig.section;
    if (articleConfig.tags) article.tags = articleConfig.tags;
    if (articleConfig.authors) article.authors = articleConfig.authors;
  }
  
  return Object.keys(article).length > 0 ? article : undefined;
}
