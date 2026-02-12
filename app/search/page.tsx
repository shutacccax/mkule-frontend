import { Metadata } from "next";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import Image from "next/image";

// --- 1. DYNAMIC METADATA & NOINDEX ---
export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `Search results for "${query}" | Mkule` : "Search | Mkule",
    description: `Search results for ${query} from The Manila Collegian.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

interface Post {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>; 
  };
}

async function getSearchResults(query: string, page: number, order: "asc" | "desc" = "desc") {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=10&page=${page}&_embed&order=${order}`,
    { cache: "no-store" } // Search must be dynamic
  );

  if (!res.ok) return { posts: [], totalPages: 0 };

  const posts = await res.json();
  const totalPages = Number(res.headers.get("X-WP-TotalPages")) || 0;
  return { posts, totalPages };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; order?: "asc" | "desc" }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const currentPage = Number(params.page) || 1;
  const currentOrder = params.order || "desc";

  const data = query.length > 0
      ? await getSearchResults(query, currentPage, currentOrder)
      : { posts: [], totalPages: 0 };

  const { posts: results, totalPages } = data;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      
      {/* --- HEADER --- */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand px-3 py-1 rounded-sm shadow-sm flex-none">
              <span className="text-[10px] font-sans font-black uppercase text-white tracking-widest leading-none">
                Search
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-gray-400">
                Results for
              </span>
              <h1 className="text-lg font-serif font-bold italic text-gray-900 leading-none">
                "{query}"
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-md">
              <Link
                href={`/search?q=${encodeURIComponent(query)}&order=desc`}
                className={`px-3 py-1 text-[10px] font-sans font-black uppercase tracking-tight rounded-sm transition-all ${
                  currentOrder === "desc" ? "bg-black text-white" : "text-gray-500 hover:text-black"
                }`}
              >
                Newest
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&order=asc`}
                className={`px-3 py-1 text-[10px] font-sans font-black uppercase tracking-tight rounded-sm transition-all ${
                  currentOrder === "asc" ? "bg-black text-white" : "text-gray-500 hover:text-black"
                }`}
              >
                Oldest
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- RESULTS LIST --- */}
      {results.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="font-serif italic text-2xl text-gray-400">
            No articles found matching your query.
          </p>
          <Link
            href="/"
            className="inline-block text-brand font-sans font-black uppercase tracking-widest text-xs border-b border-brand pb-1"
          >
            Return to Homepage
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-10">
            {results.map((post: Post) => (
              <article 
                key={post.id} 
                className="group flex flex-col md:flex-row gap-6 md:gap-10 pb-10 border-b border-gray-100 last:border-0"
              >
                {/* Image Section (Left) */}
                <div className="md:w-[35%] shrink-0">
                  <Link
                    href={`/news/${post.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden rounded-md bg-gray-100 shadow-sm"
                  >
                    {post._embedded?.["wp:featuredmedia"] ? (
                      <Image
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt={post.title.rendered}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif italic text-sm">
                        Mkule News
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content Section (Right) */}
                <div className="flex-1 flex flex-col justify-center space-y-2.5">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">
                      {post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Article"}
                    </p>
                    <div className="h-[1px] w-6 bg-gray-200" />
                    <time className="text-[10px] font-sans font-bold uppercase tracking-tighter text-gray-400 whitespace-nowrap">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          timeZone: 'Asia/Manila' 
                        })}
                    </time>
                  </div>

                  <Link href={`/news/${post.slug}`}>
                    <h2
                      className="text-2xl md:text-3xl font-serif font-bold leading-tight group-hover:text-brand transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>

                  <div
                    className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 font-normal tracking-tight leading-relaxed max-w-2xl"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  
                  <div className="pt-2">
                     <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-900">
                        / {post._embedded?.author?.[0]?.name || "Staff"}
                     </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/search?q=${encodeURIComponent(query)}&order=${currentOrder}`}
            />
          </div>
        </>
      )}
    </main>
  );
}