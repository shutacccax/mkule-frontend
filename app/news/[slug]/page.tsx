import Image from "next/image";
import ReadingProgress from "@/components/ReadingProgress";
import type { Metadata } from "next";
import { headers } from "next/headers";

// --- METADATA GENERATION ---
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const headersList = await headers();
  const host = headersList.get("host") ?? "mkule.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;
  const articleUrl = `${siteUrl}/news/${slug}`;

  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
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
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title.rendered,
      description: cleanDescription,
      url: articleUrl,
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
  acf?: {
    kicker?: string;
  };
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
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

async function getRelatedPosts(categoryId: number, currentPostId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const cacheBuster = Math.floor(Date.now() / 60000);

  const res = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=3&exclude=${currentPostId}&_embed&cb=${cacheBuster}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  return res.json();
}

// --- MAIN COMPONENT ---
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post = await getPost(slug);

  if (!post) {
    return (
      <div className="p-20 text-center font-serif italic text-gray-500">
        Post not found
      </div>
    );
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "mkule.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;
  const articleUrl = `${siteUrl}/news/${slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);

  const categoryId = post.categories?.[0];
  const relatedPosts = categoryId
    ? await getRelatedPosts(categoryId, post.id)
    : [];

  const category =
    post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";

  const authorName =
    post._embedded?.author?.[0]?.name || "Staff";

  const readingTime = getReadingTime(post.content.rendered);
  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // --- JSON-LD ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title.rendered,
    image: featuredImage ? [featuredImage] : [],
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.modified).toISOString(),
    author: [
      {
        "@type": "Person",
        name: authorName,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Mkule",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-header.png`,
      },
    },
    mainEntityOfPage: articleUrl,
    description: post.excerpt.rendered
      .replace(/<[^>]+>/g, "")
      .slice(0, 160),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ReadingProgress />

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand px-3 py-1 rounded-sm shadow-sm">
            <h2 className="text-sm font-sans font-black uppercase text-white">
              {category}
            </h2>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-10">
          {post.acf?.kicker && (
            <p className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.15em] text-gray-500 mb-4">
              {post.acf.kicker}
            </p>
          )}

          <h1
            className="text-4xl md:text-6xl font-serif font-black leading-[1.05]"
            dangerouslySetInnerHTML={{
              __html: post.title.rendered,
            }}
          />
        </div>

        {/* SHARE */}
        <div className="flex justify-between py-6 border-y border-gray-100 mb-12">
          <div>
            <p className="text-sm font-serif font-bold">
              {authorName}
            </p>
          </div>

          <div className="flex gap-2">
            <ShareButton
              platform="facebook"
              url={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            />
            <ShareButton
              platform="twitter"
              url={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
            />
          </div>
        </div>

        {/* CONTENT */}
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
      </main>
    </>
  );
}

function ShareButton({
  platform,
  url,
}: {
  platform: string;
  url: string;
}) {
  const icons: Record<string, React.ReactElement> = {
    facebook: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
    twitter: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
      </svg>
    ),
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all"
    >
      {icons[platform]}
    </a>
  );
}
