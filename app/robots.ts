import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkule.org';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',       // Don't index internal API routes
        '/search',     // Don't index dynamic search result pages (avoids duplicate content)
        '/admin',      // If you have a local admin route
      ],
    },
    // Points crawlers directly to your sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}