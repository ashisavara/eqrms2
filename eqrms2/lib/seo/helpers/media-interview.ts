import type { Metadata } from "next";
import type { MediaInterviewDetail } from "@/types/media-interview-detail";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

/**
 * Generate SEO metadata for media interviews
 */
export async function generateMediaInterviewSEO(
  interview: MediaInterviewDetail,
  subdomain?: string
): Promise<Metadata> {
  // Extract SEO data from interview (if SEO columns exist)
  const seoData: SEOData = {
    seo_title: (interview as any).seo_title,
    seo_description: (interview as any).seo_description,
    og_title: (interview as any).og_title,
    og_description: (interview as any).og_description,
    og_image: (interview as any).og_image,
  };

  // Build content fallbacks
  const contentFallbacks: ContentFallbacks = {
    title: interview.title,
    description: interview.summary,
    image: interview.youtube_url, // Will extract YouTube thumbnail
    publishedTime: interview.publication_date,
    section: interview.publication,
    keywords: [
      'IME Capital',
      'Media Interview',
      'Investment Insights',
      interview.publication,
      interview.title,
    ].filter(Boolean),
  };

  // Build SEO config
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.mediaInterview.type,
    titleTemplate: CONTENT_TYPE_CONFIG.mediaInterview.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.mediaInterview.descriptionPrefix}${interview.title} - ${interview.publication} interview with IME Capital`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/media-interview/${interview.slug}`,
    keywords: [
      'IME Capital',
      'Media Interview',
      'Investment Insights',
      interview.publication,
      interview.title,
    ].filter(Boolean),
    article: {
      publishedTime: SEO_UTILS.formatDateForOG(interview.publication_date),
      section: interview.publication,
      tags: [interview.publication],
      authors: ['IME Capital'],
    },
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/media-interview/${interview.slug}`);
}
