import { MetadataRoute } from 'next';

// 1. Force the sitemap to update in the background (e.g., every 1 hour)
export const revalidate = 3600; 

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkule.org';
const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 2. Add ISR revalidation to the fetch calls
    const postRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=100`, {
      next: { revalidate: 3600 }
    });
    
    // 3. Fallback to empty array if Pantheon fails, preventing a 500 crash
    const posts = postRes.ok ? await postRes.json() : [];

    const postEntries = posts.map((post: any) => ({
      url: `${BASE_URL}/news/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch Categories
    const catRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories`, {
      next: { revalidate: 86400 } // Categories rarely change, cache for 24 hours
    });
    const categories = catRes.ok ? await catRes.json() : [];

    const categoryEntries = categories.map((cat: any) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // Static Pages
    const routes = ['', '/search'].map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }));

    return [...routes, ...categoryEntries, ...postEntries];
    
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    // Return at least the homepage if the API completely fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}