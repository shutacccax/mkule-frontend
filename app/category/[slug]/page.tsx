import Link from "next/link"; // 1. Import Link
import Image from "next/image";
import Pagination from "@/components/Pagination";

// --- TYPES ---
interface Post {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: Array<{ 
      name: string; 
      slug: string; // Added slug for clickable byline
    }>;
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

async function getPostsByCategory(slug: string, page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000); 

  const catRes = await fetch(`${baseUrl}/wp-json/wp/v2/categories?slug=${slug}`, {
    next: { revalidate: 3600 } 
  });
  const catData = await catRes.json();
  if (!catData || !catData.length) return null;

  const categoryId = catData[0].id;

  const postRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=6&page=${page}&_embed&cb=${cacheBuster}`,
    { 
      next: { revalidate: 60 } 
    }
  );

  if (!postRes.ok) return null;

  const posts = await postRes.json();
  const totalPages = Number(postRes.headers.get("X-WP-TotalPages")) || 1;

  return { posts, totalPages };
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ page?: string }> 
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Number(sParams?.page) || 1;

  const data = await getPostsByCategory(slug, currentPage);

  if (!data) {
    return (
      <div className="p-20 text-center font-serif italic text-gray-500">
        Category "{slug}" not found.
      </div>
    );
  }

  const { posts, totalPages } = data;

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      
      {/* HEADER */}
      <header className="mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-brand px-3 py-1 rounded-sm shadow-sm">
             <h1 className="text-sm font-sans font-black uppercase text-white leading-none">
              {slug}
            </h1>
          </div>
          <div className="h-[1px] flex-1 bg-gray-200" />
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-16">

        {/* FEED */}
        <div className="lg:col-span-8">
          <div className="space-y-12">
            {posts.map((post: any) => (
              <article key={post.id} className="group grid md:grid-cols-12 gap-6 pb-12 border-b border-gray-100 last:border-0">
                
                {/* Thumbnail */}
                <div className="md:col-span-4">
                  {/* 2. CHANGE: <a> to <Link> */}
                  <Link href={`/news/${post.slug}`} className="block overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
                    {post._embedded?.["wp:featuredmedia"] ? (
                      <img
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif italic text-xs">
                        Mkule News
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content */}
                <div className="md:col-span-8 space-y-3">
                  <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">
                    {slug}
                  </p>
                  
                  {/* 3. CHANGE: <a> to <Link> */}
                  <Link href={`/news/${post.slug}`}>
                    <h2
                      className="text-2xl font-serif font-bold leading-tight group-hover:text-brand transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>

                  <div
                    className="text-sm text-gray-600 line-clamp-2 font-light tracking-tight leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  
                  <div className="pt-1 flex flex-col gap-0.5">
                      {post._embedded?.author?.[0] && (
                        /* 4. CHANGE: <a> to <Link> */
                        <Link 
                          href={`/author/${post._embedded.author[0].slug}`}
                          className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 hover:text-brand transition-colors duration-300"
                        >
                          / {post._embedded.author[0].name}
                        </Link>
                      )}
                      <p className="text-[10px] font-medium uppercase tracking-tighter text-gray-400">
                         {new Date(post.date).toLocaleDateString()}
                      </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/category/${slug}`}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: STICKY SIDEBAR --- */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-12">
            {/* Facebook Widget */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                Follow Us
              </h3>
              <div className="bg-white border border-gray-100 p-1 rounded-lg overflow-hidden">
                 <div
                    className="fb-page"
                    data-href="https://www.facebook.com/themanilacollegian"
                    data-tabs="timeline"
                    data-width="340" 
                    data-height="400"
                    data-small-header="true"
                    data-adapt-container-width="true"
                    data-hide-cover="false"
                    data-show-facepile="true"
                 ></div>
              </div>
            </section>

            {/* Recent Stories Sidebar */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-6">
                Recent Stories
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 5).map((post: Post) => (
                  <a key={post.id} href={`/news/${post.slug}`} className="group block">
                    <h4 
                      className="font-serif font-bold text-sm leading-snug group-hover:text-brand transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </aside>

      </div>
    </main>
  );
}