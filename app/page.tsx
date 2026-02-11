import Image from "next/image";
import { getPosts, getPostsByCategory } from "@/lib/api";
import CategorySection from "@/components/CategorySection";

// Enables Incremental Static Regeneration for the homepage
export const revalidate = 60;

// Properly typed interface to resolve the 'any' errors
interface Post {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

export default async function Home() {
  const posts = await getPosts();
  const featured = posts[0];
  const latestSidebar = posts.slice(1, 5);
  const remaining = posts.slice(5, 11);

  const categories = ["news", "features", "culture", "opinion", "editorial", "grafx"];
  const categoryData = await Promise.all(
    categories.map(async (cat) => ({
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      posts: await getPostsByCategory(cat),
    }))
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* --- HERO SECTION --- */}
      <section className="grid lg:grid-cols-12 gap-12 mb-24">
        {/* Main Featured Post */}
        {featured && (
          <div className="lg:col-span-8 group">
            <article className="space-y-6">
              
              <a href={`/news/${featured.slug}`} className="block relative aspect-[16/9] overflow-hidden rounded-2xl shadow-sm bg-gray-100">
                {featured._embedded?.["wp:featuredmedia"] && (
                  <img
                    src={featured._embedded["wp:featuredmedia"][0].source_url}
                    alt="Featured"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-brand text-white text-[10px] font-sans font-black uppercase tracking-widest px-4 py-1.5 rounded-md shadow-lg">
                    Featured Story
                  </span>
                </div>
              </a>

              <div className="space-y-4">
                <a href={`/news/${featured.slug}`} className="block">
                  <h1 
                    className="text-4xl md:text-5xl font-serif font-black leading-[1.1] tracking-tight group-hover:text-brand transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: featured.title.rendered }}
                  />
                </a>
                
                <div 
                  className="text-gray-600 text-lg line-clamp-2 max-w-2xl font-light tracking-tight"
                  dangerouslySetInnerHTML={{ __html: featured.excerpt.rendered }}
                />
                
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  By {featured._embedded?.author?.[0]?.name || "Staff"} • {new Date(featured.date).toLocaleDateString()}
                </p>
              </div>
            </article>
          </div>
        )}

        {/* 3. Sidebar Latest */}
        <div className="lg:col-span-4 border-l border-gray-100 pl-8 hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand">The Latest</h3>
             <div className="h-[1px] flex-1 bg-gray-100" />
          </div>
          <div className="space-y-8">
            {latestSidebar.map((post: Post) => (
              <a key={post.id} href={`/news/${post.slug}`} className="group block border-b border-gray-50 pb-6 last:border-0">
                <h4 
                  className="font-serif font-bold text-lg leading-snug group-hover:text-brand transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORY SECTIONS --- */}
      <div className="space-y-8">
        {categoryData.map((cat) => (
          <CategorySection key={cat.title} title={cat.title} posts={cat.posts} />
        ))}
      </div>
    </main>
  );
}