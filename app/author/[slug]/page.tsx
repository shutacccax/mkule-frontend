import type { Metadata } from "next";
import Pagination from "@/components/Pagination";

// --- TYPES ---
interface Author {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Post {
  id: number;
  slug: string;
  date: string;
  categories: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

// --- API HELPERS ---
async function getAuthor(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/users?slug=${slug}&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

async function getAuthorPosts(authorId: number, page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  // Fetching 6 posts per page
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?author=${authorId}&_embed&per_page=6&page=${page}&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return { posts: [], totalPages: 0 };
  
  const posts = await res.json();
  const totalPages = Number(res.headers.get("X-WP-TotalPages")) || 1;
  
  return { posts, totalPages };
}

// --- METADATA ---
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: "Author Not Found | Mkule" };

  return {
    title: `${author.name} | The Manila Collegian`,
    description: author.description || `Articles written by ${author.name}`,
  };
}

// --- MAIN COMPONENT ---
export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Number(sParams?.page) || 1;

  const author: Author | null = await getAuthor(slug);

  if (!author) {
    return (
      <div className="p-20 text-center font-serif italic text-gray-500">
        Author profile not found.
      </div>
    );
  }

  const { posts, totalPages } = await getAuthorPosts(author.id, currentPage);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      
      {/* --- MINIMALIST HEADER --- */}
      <header className="mb-16 border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand">
            Staff Writer
          </p>
          {/* Reduced size from 8xl to 5xl */}
          <h1 className="text-4xl md:text-5xl font-serif font-black uppercase leading-tight tracking-tight">
            {author.name}
          </h1>
          {author.description && (
            <div 
              className="mt-4 text-gray-500 max-w-xl font-light leading-relaxed prose prose-sm italic text-sm"
              dangerouslySetInnerHTML={{ __html: author.description }}
            />
          )}
        </div>
      </header>

      {/* --- ARTICLE LIST --- */}
      <div className="space-y-12">
        {posts.length > 0 ? (
          <>
            {posts.map((post: Post) => {
              const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";

              return (
                <article key={post.id} className="group grid md:grid-cols-12 gap-8 pb-12 border-b border-gray-100 last:border-0">
                  
                  <div className="md:col-span-4">
                    <a href={`/news/${post.slug}`} className="block overflow-hidden rounded-sm bg-gray-100 aspect-[4/3]">
                      {post._embedded?.["wp:featuredmedia"] ? (
                        <img
                          src={post._embedded["wp:featuredmedia"][0].source_url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif italic text-xs">
                          Mkule
                        </div>
                      )}
                    </a>
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">
                      {categoryName}
                    </p>
                    
                    <a href={`/news/${post.slug}`}>
                      <h2
                        className="text-2xl md:text-3xl font-serif font-bold leading-tight group-hover:text-brand transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </a>
                    
                    <div
                      className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    
                    <div className="pt-2 flex flex-col gap-1">
                       <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-900">
                         / {author.name}
                       </p>
                       <p className="text-[10px] font-medium uppercase tracking-tighter text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                       </p>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Pagination call */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                // Ensure the path is absolute and correctly formatted
                basePath={`/author/${slug}`} 
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center font-serif italic text-gray-400">
            No articles found.
          </div>
        )}
      </div>
      
    </main>
  );
}