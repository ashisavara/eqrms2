import { MetadataRoute } from 'next';
import {
  getPublicBlogSlugs,
  getPublicMediaInterviewSlugs,
  getPublicInvestmentQuerySlugs,
  getPublicPmsAmcSlugs,
  getPublicPmsSchemeSlugs,
} from '@/lib/supabase/serverQueryHelper';

const BASE_URL = 'https://imecapital.in';

// Static landing pages
const STATIC_PAGES = [
  '',  // Homepage
  '/about-us',
  '/ime-founder-ashi-anand',
  '/our-team',
  '/expertise',
  '/client-dedication',
  '/products',
  '/pms-aif-ime',
  '/mutual-funds-ime',
  '/international-investing-ime',
  '/family-solutions',
  '/family-office-and-ultra-hni',
  '/nri-investment-solutions',
  '/retiree-solutions',
  '/corporate-solutions',
  '/rms',
  '/15-minute-introductory-call',
  '/detailed-disclaimer',
  '/blogs',
  '/media-interview',
  '/investment-query',
  '/financial-calculator',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all dynamic content slugs in parallel
    const [
      blogSlugs,
      mediaInterviewSlugs,
      investmentQuerySlugs,
      pmsAmcSlugs,
      pmsSchemeSlugs,
    ] = await Promise.all([
      getPublicBlogSlugs(),
      getPublicMediaInterviewSlugs(),
      getPublicInvestmentQuerySlugs(),
      getPublicPmsAmcSlugs(),
      getPublicPmsSchemeSlugs(),
    ]);

    // Build static pages
    const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    // Build blog pages
    const blogPages: MetadataRoute.Sitemap = blogSlugs.map((blog) => ({
      url: `${BASE_URL}/blogs/${blog.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Build media interview pages
    const mediaInterviewPages: MetadataRoute.Sitemap = mediaInterviewSlugs.map((interview) => ({
      url: `${BASE_URL}/media-interview/${interview.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Build investment query pages
    const investmentQueryPages: MetadataRoute.Sitemap = investmentQuerySlugs.map((query) => ({
      url: `${BASE_URL}/investment-query/${query.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Build PMS AMC pages
    const pmsAmcPages: MetadataRoute.Sitemap = pmsAmcSlugs.map((amc) => ({
      url: `${BASE_URL}/pms-amc/${amc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // Build PMS scheme pages
    const pmsSchemePages: MetadataRoute.Sitemap = pmsSchemeSlugs.map((scheme) => ({
      url: `${BASE_URL}/pms-scheme/${scheme.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // Combine all pages
    return [
      ...staticPages,
      ...blogPages,
      ...mediaInterviewPages,
      ...investmentQueryPages,
      ...pmsAmcPages,
      ...pmsSchemePages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if dynamic content fails
    return STATIC_PAGES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }));
  }
}

