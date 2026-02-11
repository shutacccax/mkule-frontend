const baseUrl = process.env.NEXT_PUBLIC_WP_URL;

const ISSUES_CAT_ID = 9;

export async function getPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  // We exclude Category 9 so issues don't show up in the Hero or Latest feed
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?_embed&per_page=10&categories_exclude=${ISSUES_CAT_ID}`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) throw new Error("Failed to fetch posts");
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

export async function getLatestIssues() {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  // This ensures Pantheon gives us fresh data every time you refresh
  const cacheBuster = Date.now(); 

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${ISSUES_CAT_ID}&_embed&per_page=4&cb=${cacheBuster}`,
    { 
      next: { revalidate: 0 }, // Force zero caching for this specific call while debugging
      cache: 'no-store' 
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  
  // LOG THIS: Check your terminal/console. If it says [], the ID or Category is wrong.
  console.log("Fetched Issues:", data.length); 
  
  return data;
}