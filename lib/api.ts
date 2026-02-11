const baseUrl = process.env.NEXT_PUBLIC_WP_URL;

export async function getPosts() {
  // Bypasses Pantheon's Varnish cache by changing the URL every 60 seconds
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } } 
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export async function getPostsByCategory(slug: string, limit = 4) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  // Cache categories longer (e.g., 1 hour) since they rarely change
  const catRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/categories?slug=${slug}`,
    { next: { revalidate: 3600 } } 
  );
  const catData = await catRes.json();

  if (!catData.length) return [];

  const categoryId = catData[0].id;

  const postRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=${limit}&_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } } 
  );

  return postRes.json();
}

export async function getPostsByAuthor(authorId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?author=${authorId}&_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
  );
  return res.json();
}

export async function getAuthorData(authorId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/users/${authorId}`);
  if (!res.ok) return null;
  return res.json();
}