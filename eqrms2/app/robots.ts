import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Determine base URL based on host
  const baseUrl = host === 'imecapital.in' 
    ? 'https://imecapital.in'
    : host.startsWith('rms.')
    ? 'https://rms.imecapital.in'
    : `https://${host}`;

  // RMS subdomain - disallow all (private/authenticated content)
  if (host.startsWith('rms.')) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Root domain (imecapital.in) - allow crawling with sitemap
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

