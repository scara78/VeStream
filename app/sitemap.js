import { getTMDBTrending } from '@/services/movieApi';

/**
 * Dynamic Sitemap Generator for VeStream
 * Includes static pages and trending content
 */
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    // Fetch trending content for dynamic sitemap
    const trending = await getTMDBTrending('all', 'week');

    if (trending?.results) {
      // Add top 50 trending items to sitemap
      const trendingUrls = trending.results.slice(0, 50).map((item) => {
        const type = item.media_type || 'movie';
        return {
          url: `${baseUrl}/watch/${type}/${item.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      });

      routes.push(...trendingUrls);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
