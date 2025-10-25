import type { Metadata } from "next";
import type { AMC } from "@/types/amc-detail";
import type { SEOData, SEOConfig, ContentFallbacks } from '../types';
import { generateSEOMetadata } from '../generator';
import { CONTENT_TYPE_CONFIG, SEO_UTILS } from '../constants';

/**
 * Generate SEO metadata for AMCs
 */
export async function generateAmcSEO(
  amc: AMC,
  subdomain?: string
): Promise<Metadata> {
  // Extract SEO data from AMC (if SEO columns exist)
  const seoData: SEOData = {
    seo_title: (amc as any).seo_title,
    seo_description: (amc as any).seo_description,
    og_title: (amc as any).og_title,
    og_description: (amc as any).og_description,
    og_image: (amc as any).og_image,
  };

  // Build content fallbacks
  const contentFallbacks: ContentFallbacks = {
    title: amc.amc_name || 'Untitled AMC',
    description: amc.amc_view || amc.amc_pedigree_desc || '',
    section: amc.structure || '',
    keywords: [
      'IME Capital',
      'AMC Analysis',
      'Asset Management Company',
      amc.amc_name || '',
      amc.structure || '',
    ].filter(Boolean),
  };

  // Build SEO config
  const config: SEOConfig = {
    type: CONTENT_TYPE_CONFIG.amc.type,
    titleTemplate: CONTENT_TYPE_CONFIG.amc.titleTemplate,
    descriptionFallback: `${CONTENT_TYPE_CONFIG.amc.descriptionPrefix}${amc.amc_name} - Asset Management Company analysis by IME Capital`,
    noIndex: subdomain === 'rms' || subdomain === 'public',
    canonicalUrl: `/pms-amc/${amc.slug}`,
    keywords: [
      'IME Capital',
      'AMC Analysis',
      'Asset Management Company',
      amc.amc_name || '',
      amc.structure || '',
    ].filter(Boolean),
  };

  return generateSEOMetadata(seoData, contentFallbacks, config, `/pms-amc/${amc.slug}`);
}
