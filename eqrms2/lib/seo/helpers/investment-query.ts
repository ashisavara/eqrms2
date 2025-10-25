import type { Metadata } from "next";
import type { InvQueryDetail } from "@/types/inv-query-detail";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

/**
 * Generate SEO metadata for investment queries
 */
export async function generateInvestmentQuerySEO(
  query: InvQueryDetail,
  subdomain?: string
): Promise<Metadata> {
  // Extract SEO data from query (if SEO columns exist)
  const seoData: SEOData = {
    seo_title: (query as any).seo_title,
    seo_description: (query as any).seo_description,
    og_title: (query as any).og_title,
    og_description: (query as any).og_description,
    og_image: (query as any).og_image,
  };

  // Build content fallbacks
  const contentFallbacks: ContentFallbacks = {
    title: query.title,
    description: query.body,
    publishedTime: query.created_at,
    section: query.query_categories,
    keywords: [
      'IME Capital',
      'Investment Query',
      'Investment Research',
      query.query_categories,
      query.title,
    ].filter(Boolean),
  };

  // Build SEO config
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.investmentQuery.type,
    titleTemplate: CONTENT_TYPE_CONFIG.investmentQuery.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.investmentQuery.descriptionPrefix}${query.title} - Expert investment insights by IME Capital`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/investment-query/${query.slug}`,
    keywords: [
      'IME Capital',
      'Investment Query',
      'Investment Research',
      query.query_categories,
      query.title,
    ].filter(Boolean),
    article: {
      publishedTime: SEO_UTILS.formatDateForOG(query.created_at),
      section: query.query_categories,
      tags: query.query_categories ? [query.query_categories] : undefined,
      authors: ['IME Capital'],
    },
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/investment-query/${query.slug}`);
}
