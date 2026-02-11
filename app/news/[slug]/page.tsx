import Image from "next/image";
import ReadingProgress from "@/components/ReadingProgress"; 
import type { Metadata } from "next";

// --- METADATA GENERATION ---
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const post = data[0];

  if (!post) {
    return {
      title: "Article Not Found | Mkule",
    };
  }

  const cleanDescription = post.excerpt.rendered.replace(/<[^>]+>/g, "");

  return {
    title: `${post.title.rendered} | Mkule`,
    description: cleanDescription,
    openGraph: {
      title: post.title.rendered,
      description: cleanDescription,
      images: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url 
        ? [post._embedded["wp:featuredmedia"][0].source_url] 
        : [],
    },
  };
}

// --- TYPES ---
interface Post {
  id: number;
  date: string;
  modified: string;
  slug: string;
  categories: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Media[];
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

interface Media {
  id?: number;
  source_url: string;
  caption?: {
    rendered: string;
  };
  alt_text?: string;
}

// --- HELPERS ---
function getReadingTime(content: string): number {
  const wordsPerMinute = 225; 
  const text = content.replace(/<[^>]*>/g, ""); 
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

async function getRelatedPosts(categoryId: number, currentPostId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&exclude=${currentPostId}&_embed`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

// --- MAIN COMPONENT ---
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post = await getPost(slug);

  if (!post) {
    return <div className="p-20 text-center font-serif italic text-gray-500">Post not found</div>;
  }

  const categoryId = post.categories?.[0];
  const relatedPosts = categoryId ? await getRelatedPosts(categoryId, post.id) : [];
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";
  const authorName = post._embedded?.author?.[0]?.name || "Staff";
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/news/${slug}`;
  const readingTime = getReadingTime(post.content.rendered);
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // --- JSON-LD SCHEMA ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title.rendered,
    "image": featuredImage ? [featuredImage] : [],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.modified).toISOString(),
    "author": [{
      "@type": "Person",
      "name": authorName,
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Mkule",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo-header.png`
      }
    },
    "description": post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 160)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ReadingProgress />

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* --- 1. METADATA --- */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand px-3 py-1 rounded-sm shadow-sm">
            <h2 className="text-sm font-sans font-black uppercase text-white leading-none">
              {category}
            </h2>
          </div>
          <div className="h-[1px] flex-1 bg-gray-100" />
          <div className="flex flex-col items-end">
            <time className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                timeZone: 'Asia/Manila' 
              })}
              {" • "}
              {new Date(post.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Manila' 
              })} PHT
            </time>
            <span className="text-[10px] font-sans font-black uppercase tracking-tighter text-brand">
                {readingTime} min read
            </span>
          </div>
        </div>

        {/* --- 2. TITLE --- */}
        <h1
          className="text-4xl md:text-6xl font-serif font-black leading-[1.05] mb-10 tracking-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* --- 3. BYLINE & SHARE --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-y border-gray-100 mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-serif italic text-brand font-bold border border-gray-200">
              {authorName.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Written By</p>
              <p className="font-serif font-bold text-lg leading-none">{authorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400">Share</span>
            <div className="flex gap-3">
                <ShareButton platform="facebook" url={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`} />
                <ShareButton platform="twitter" url={`https://twitter.com/intent/tweet?url=${articleUrl}`} />
            </div>
          </div>
        </div>

        {/* --- 4. FEATURED IMAGE --- */}
        {post._embedded?.["wp:featuredmedia"] && (
          <figure className="mb-20">
            <img
              src={post._embedded["wp:featuredmedia"][0].source_url}
              alt={post._embedded["wp:featuredmedia"][0].alt_text || ""}
              className="w-full h-auto rounded-2xl shadow-sm"
            />
            {post._embedded["wp:featuredmedia"][0].caption?.rendered && (
              <figcaption 
                className="mt-4 text-xs font-sans font-medium text-gray-500 leading-relaxed border-l border-gray-200 pl-4"
                dangerouslySetInnerHTML={{ __html: post._embedded["wp:featuredmedia"][0].caption.rendered }}
              />
            )}
          </figure>
        )}

        {/* --- 5. CONTENT --- */}
        <article
          className="prose prose-2xl max-w-none 
                     font-sans font-normal tracking-tight
                     text-xl md:text-[20px] lg:text-[20px] 
                     prose-p:text-gray-900 
                     prose-p:font-normal 
                     prose-p:leading-[1.8]
                     prose-headings:font-serif 
                     prose-headings:font-black 
                     prose-headings:tracking-tighter
                     prose-blockquote:border-brand 
                     prose-blockquote:bg-gray-50 
                     prose-blockquote:py-4 
                     prose-blockquote:px-10
                     prose-a:text-brand 
                     prose-a:font-bold 
                     hover:prose-a:underline
                     prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* --- END MARKER --- */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 mb-4 text-center">
            End of Article
          </p>
          <div className="flex justify-center">
            <div className="h-1 w-12 bg-brand rounded-full" />
          </div>
        </div>

        {/* --- RELATED POSTS --- */}
        {relatedPosts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-10">
              More from this section
            </h3>
            <div className="grid md:grid-cols-3 gap-10">
              {relatedPosts.map((related: any) => (
                <article key={related.id} className="group space-y-4">
                  <a href={`/news/${related.slug}`} className="block aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                    {related._embedded?.["wp:featuredmedia"] && (
                      <img
                        src={related._embedded["wp:featuredmedia"][0].source_url}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </a>
                  <a href={`/news/${related.slug}`}>
                    <h4
                      className="font-serif font-bold leading-snug group-hover:text-brand transition-colors"
                      dangerouslySetInnerHTML={{ __html: related.title.rendered }}
                    />
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function ShareButton({ platform, url }: { platform: string; url: string }) {
  const icons: Record<string, React.ReactElement> = {
    facebook: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
    twitter: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all duration-300"
    >
      {icons[platform]}
    </a>
  );
}