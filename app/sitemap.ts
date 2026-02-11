import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkule.org';
const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all posts to include in sitemap
  const postRes = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=100`);
  const posts = await postRes.json();

  const postEntries = posts.map((post: any) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 2. Fetch all categories
  const catRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories`);
  const categories = await catRes.json();

  const categoryEntries = categories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. Static Pages
  const routes = ['', '/search'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  return [...routes, ...categoryEntries, ...postEntries];
}