import type { Metadata } from "next";
import type { RmsFundAmc } from "@/types/funds-detail";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

/**
 * Generate SEO metadata for PMS schemes/funds
 */
export async function generateFundSEO(
  fund: RmsFundAmc,
  subdomain?: string
): Promise<Metadata> {
  // Extract SEO data from fund (if SEO columns exist)
  const seoData: SEOData = {
    seo_title: (fund as any).seo_title,
    seo_description: (fund as any).seo_description,
    og_title: (fund as any).og_title,
    og_description: (fund as any).og_description,
    og_image: (fund as any).og_image,
  };

  // Build content fallbacks
  const contentFallbacks: ContentFallbacks = {
    title: fund.fund_name || 'Untitled Fund',
    description: fund.investment_view || fund.strategy_view || '',
    section: fund.category_name || fund.asset_class_name || '',
    keywords: [
      'IME Capital',
      'PMS Scheme',
      'Fund Analysis',
      fund.fund_name || '',
      fund.amc_name || '',
      fund.category_name || '',
      fund.asset_class_name || '',
      fund.structure_name || '',
    ].filter(Boolean),
  };

  // Build SEO config
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.fund.type,
    titleTemplate: CONTENT_TYPE_CONFIG.fund.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.fund.descriptionPrefix}${fund.fund_name} - ${fund.amc_name} ${fund.category_name} fund analysis by IME Capital`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/pms-scheme/${fund.slug}`,
    keywords: [
      'IME Capital',
      'PMS Scheme',
      'Fund Analysis',
      fund.fund_name || '',
      fund.amc_name || '',
      fund.category_name || '',
      fund.asset_class_name || '',
      fund.structure_name || '',
    ].filter(Boolean),
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/pms-scheme/${fund.slug}`);
}
