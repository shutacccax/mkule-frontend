import Image from "next/image";
import { getPosts, getPostsByCategory, getLatestIssues } from "@/lib/api"; 
import IssueCard from "@/components/IssueCard";
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
    "wp:term"?: Array<Array<{ name: string }>>; // Added to fix the TS error
  };
}
// --- HELPER COMPONENTS ---

function Metadata({ author, date }: { author?: string, date: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
       <span className="text-gray-600 italic">/ {author || "Staff"}</span>
       <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
    </div>
  );
}

function CategoryLabel({ post }: { post: any }) {
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";
  return (
    <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand mb-1">
      {category}
    </p>
  );
}

export default async function Home() {
  // Fetch everything in one go
  const [posts, issues] = await Promise.all([
    getPosts(),
    getLatestIssues()
  ]);

  const featured = posts[0];
  const latestSidebar = posts.slice(1, 10);
  const subFeatures = posts.slice(7, 10);

  const categories = ["news", "features", "culture", "opinion", "editorial", "grafx"];
  const categoryData = await Promise.all(
    categories.map(async (cat) => ({
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      posts: await getPostsByCategory(cat),
    }))
  );



return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* --- HERO & SIDEBAR CONTAINER --- */}
      <section className="grid lg:grid-cols-12 gap-12 mb-16 border-b border-gray-300 pb-10">
        
        {/* LEFT COLUMN: Hero + Sub-Features */}
        <div className="lg:col-span-8">
          
          {/* Main Featured Post */}
          {featured && (
            <article className="group mb-12">
              {/* CHANGE: aspect-[3/4] makes it taller/vertical on mobile. 
                  sm:aspect-[16/9] switches it back to wide for desktop.
              */}
              <a href={`/news/${featured.slug}`} className="block relative aspect-[3/4] sm:aspect-[16/9] overflow-hidden rounded-2xl shadow-sm bg-gray-100 mb-6">
                {featured._embedded?.["wp:featuredmedia"] && (
                  <img
                    src={featured._embedded["wp:featuredmedia"][0].source_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-brand text-white text-[10px] font-sans font-black uppercase tracking-widest px-4 py-1.5 rounded-md shadow-lg">
                    Latest Story
                  </span>
                </div>
              </a>

              <div className="space-y-3">
                {/* Red Category Text */}
                <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand mb-1">
                  {featured._embedded?.["wp:term"]?.[0]?.[0]?.name || "News"}
                </p>
                
                <a href={`/news/${featured.slug}`}>
                  <h1 
                    className="text-4xl md:text-5xl font-serif font-black leading-[1.1] tracking-tight group-hover:text-brand transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: featured.title.rendered }}
                  />
                </a>
                
                {/* Big Readable Excerpt */}
                <div 
                  className="text-gray-700 text-lg md:text-l font-normal line-clamp-4 max-w-2xl leading-relaxed mt-4"
                  dangerouslySetInnerHTML={{ __html: featured.excerpt.rendered }}
                />
                
                {/* Metadata: Author and Date */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                  <span className="text-gray-700 italic">/ {featured._embedded?.author?.[0]?.name || "Staff"}</span>
                  <span>{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </article>
          )}

          {/* Sub-Hero Row (3 Stories underneath) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
            {subFeatures.map((post: Post) => (
              <article key={post.id} className="group space-y-3">
                <a href={`/news/${post.slug}`} className="block aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  {post._embedded?.["wp:featuredmedia"] && (
                    <img
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      alt=""
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                </a>
                <div className="space-y-2">
                  <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">
                    {post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News"}
                  </p>
                  <a href={`/news/${post.slug}`}>
                    <h3 
                      className="font-serif font-bold text-base leading-snug group-hover:text-brand transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </a>
                  <div 
                    className="text-sm text-gray-600 line-clamp-2 font-normal leading-relaxed mt-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                    <span className="text-gray-700 italic">/ {post._embedded?.author?.[0]?.name || "Staff"}</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Latest (6 Items) */}
        <aside className="lg:col-span-4 lg:border-l lg:border-gray-300 lg:pl-8 hidden lg:block">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand">Latest</h3>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>
          <div className="space-y-6">
            {posts.slice(1, 10).map((post: Post) => (
              <a 
                key={post.id} 
                href={`/news/${post.slug}`} 
                className="group grid grid-cols-12 gap-3 items-start border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="col-span-3 aspect-square overflow-hidden rounded-sm bg-gray-100">
                  {post._embedded?.["wp:featuredmedia"] && (
                    <img
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      alt=""
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                    />
                  )}
                </div>
                <div className="col-span-9 space-y-1">
                  <p className="text-[10px] font-sans font-black uppercase text-brand">
                    {post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News"}
                  </p>
                  <h4 
                    className="font-serif font-bold text-[16px] leading-tight group-hover:text-brand transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter text-gray-400 mt-2">
                    <span className="text-gray-600 italic">/ {post._embedded?.author?.[0]?.name || "Staff"}</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </aside>

      </section>

      {/* --- CATEGORY SECTIONS --- */}
      <div className="space-y-10"> 
        {categoryData.map((cat) => {
          if (cat.title === "Culture" || cat.title === "Opinion") return null;
          
          if (cat.title === "Features") {
            const cultureData = categoryData.find(c => c.title === "Culture");
            return (
              <CategorySection 
                key="feats-cult" 
                title="Features" 
                secondaryTitle="Culture"
                posts={cat.posts} 
                secondaryPosts={cultureData?.posts}
                layout="split" 
              />
            );
          }

          if (cat.title === "Editorial") {
            const opinionData = categoryData.find(c => c.title === "Opinion");
            return (
              <CategorySection 
                key="ed-op" 
                title="Editorial" 
                secondaryTitle="Opinion"
                posts={cat.posts} 
                secondaryPosts={opinionData?.posts}
                layout="editorial" 
              />
            );
          }

          return (
            <CategorySection 
              key={cat.title} 
              title={cat.title} 
              posts={cat.posts} 
              layout="news" 
            />
          );
        })}
      </div>

      {/* --- PRINT ISSUES BOOKSHELF (New) --- */}
      {/* --- PRINT ISSUES BOOKSHELF (Homepage Fix) --- */}
      {issues.length > 0 && (
        <section className="border-t border-gray-300 pt-16 pb-12 mt-12">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              {/* The Red Pill Tag */}
              <div className="bg-brand px-4 py-1.5 rounded-sm shadow-sm">
                <h2 className="text-xs font-sans font-black uppercase text-white tracking-widest leading-none">
                  Print Edition
                </h2>
              </div>
              {/* Decorative Line */}
              <div className="h-[1px] flex-1 bg-gray-200 hidden md:block" />
            </div>

            <a 
              href="/issues" 
              className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand transition-colors whitespace-nowrap ml-4"
            >
              Full Archive →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {issues.map((issue: any) => {
              // FIX: Use 'pdf_link' to match your ACF setup and Issues page
              let rawLink = issue.acf?.pdf_link || "#";
              
              // Clean for Google Drive preview mode
              let cleanLink = rawLink;
              if (cleanLink.includes("drive.google.com")) {
                cleanLink = cleanLink.replace(/\/view.*/, "/preview").replace(/\/edit.*/, "/preview");
              }

              return (
                <IssueCard 
                  key={issue.id}
                  title={issue.title.rendered}
                  cover={issue._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg"}
                  pdfLink={cleanLink}
                />
              );
            })}
          </div>
        </section>
      )}
      
    </main>
  );
}