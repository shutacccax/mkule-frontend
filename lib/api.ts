const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
const ISSUES_CAT_ID = 9;

export async function getPosts() {
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?_embed&per_page=10&categories_exclude=${ISSUES_CAT_ID}`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostsByCategory(slug: string, limit = 4) {
  // Cache categories for 1 hour as they rarely change
  const catRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/categories?slug=${slug}`,
    { next: { revalidate: 3600 } } 
  );
  const catData = await catRes.json();

  if (!catData || !catData.length) return [];

  const categoryId = catData[0].id;

  const postRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=${limit}&_embed`,
    { next: { revalidate: 60 } } 
  );

  if (!postRes.ok) return [];
  return postRes.json();
}

export async function getPostsByAuthor(authorId: string) {
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?author=${authorId}&_embed`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) return [];
  return res.json();
}

export async function getAuthorData(authorId: string) {
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/users/${authorId}`,
    { next: { revalidate: 3600 } } // Authors don't change often; cache for 1 hour
  );
  if (!res.ok) return null;
  return res.json();
}

export async function getLatestIssues() {
  // Removed cacheBuster and set revalidate to 60 for production scaling
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${ISSUES_CAT_ID}&_embed&per_page=4`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  
  return data;
}