import Image from "next/image";
import { getPosts, getPostsByCategory, getLatestIssues } from "@/lib/api"; 
import IssueCard from "@/components/IssueCard";
import CategorySection from "@/components/CategorySection";

export const dynamic = "force-dynamic";

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

// --- HELPER COMPONENTS ---

function Metadata({ author, date }: { author?: string, date: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
       <span className="text-gray-600 italic">/ {author || "Staff"}</span>
       <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
  );
}

function CategoryLabel({ post }: { post: Post }) {
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";
  return (
    <p className="text-[10px] font-sans font-black uppercase tracking-widest text-brand mb-1">
      {category}
    </p>
  );
}

export default async function Home() {
  const [posts, issues] = await Promise.all([
    getPosts(),
    getLatestIssues()
  ]);

  const featured = posts[0];
  const subFeatures = posts.slice(7, 10);

  const categories = ["news", "features", "culture", "opinion", "editorial", "grafx"];
  const categoryData = await Promise.all(
    categories.map(async (cat) => ({
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      posts: await getPostsByCategory(cat),
    }))
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-gray-900">
      
      {/* --- HERO & SIDEBAR CONTAINER --- */}
      {/* LIGHTENED BORDER: changed border-gray-300 to border-gray-200 */}
      <section className="grid lg:grid-cols-12 gap-12 mb-16 border-b border-gray-200 pb-10">
        
        {/* LEFT COLUMN: Hero + Sub-Features */}
        <div className="lg:col-span-8">
          
          {featured && (
            <article className="group mb-12">
              <a href={`/news/${featured.slug}`} className="block relative aspect-[3/4] sm:aspect-[16/9] overflow-hidden rounded-2xl shadow-sm bg-gray-50 mb-6">
                {featured._embedded?.["wp:featuredmedia"] && (
                  <Image
                    src={featured._embedded["wp:featuredmedia"][0].source_url}
                    alt={featured.title.rendered}
                    fill
                    priority 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-brand text-white text-[10px] font-sans font-black uppercase tracking-widest px-4 py-1.5 rounded-md shadow-lg">
                    Latest Story
                  </span>
                </div>
              </a>

              <div className="space-y-3">
                <CategoryLabel post={featured} />
                
                <a href={`/news/${featured.slug}`}>
                  <h1 
                    className="text-4xl md:text-5xl font-serif font-black leading-[1.1] tracking-tight group-hover:text-brand transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: featured.title.rendered }}
                  />
                </a>
                
                {/* STRENGTHENED TEXT: text-black for visibility */}
                <div 
                  className="text-black text-lg md:text-xl font-normal line-clamp-4 max-w-2xl leading-relaxed mt-4"
                  dangerouslySetInnerHTML={{ __html: featured.excerpt.rendered }}
                />
                
                <Metadata 
                  author={featured._embedded?.author?.[0]?.name}
                  date={featured.date}
                />
              </div>
            </article>
          )}

          {/* Sub-Hero Row */}
          {/* LIGHTENED BORDER: changed border-gray-100 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
            {subFeatures.map((post: Post) => (
              <article key={post.id} className="group space-y-3">
                <a href={`/news/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
                  {post._embedded?.["wp:featuredmedia"] && (
                    <Image
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      alt={post.title.rendered}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  )}
                </a>
                <div className="space-y-2">
                  <CategoryLabel post={post} />
                  <a href={`/news/${post.slug}`}>
                    <h3 
                      className="font-serif font-bold text-base leading-snug group-hover:text-brand transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </a>
                  {/* STRENGTHENED TEXT: text-gray-900 */}
                  <div 
                    className="text-sm text-gray-900 line-clamp-2 font-normal leading-relaxed mt-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <Metadata 
                    author={post._embedded?.author?.[0]?.name}
                    date={post.date}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Latest */}
        {/* LIGHTENED BORDER: border-gray-200 */}
        <aside className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8 hidden lg:block">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand">Latest</h3>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>
          <div className="space-y-6">
            {posts.slice(1, 10).map((post: Post) => (
              <a 
                key={post.id} 
                href={`/news/${post.slug}`} 
                className="group grid grid-cols-12 gap-3 items-start border-b border-gray-100 pb-6 last:border-0 last:pb-0"
              >
                <div className="col-span-3 relative aspect-square overflow-hidden rounded-sm bg-gray-50">
                  {post._embedded?.["wp:featuredmedia"] && (
                    <Image
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      alt={post.title.rendered}
                      fill
                      sizes="100px"
                      className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                    />
                  )}
                </div>
                <div className="col-span-9 space-y-1">
                  <CategoryLabel post={post} />
                  <h4 
                    className="font-serif font-bold text-[16px] leading-tight group-hover:text-brand transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <Metadata author={post._embedded?.author?.[0]?.name} date={post.date} />
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

      {/* --- PRINT ISSUES BOOKSHELF --- */}
      {/* LIGHTENED BORDER: border-gray-200 */}
      {issues.length > 0 && (
        <section className="border-t border-gray-200 pt-16 pb-12 mt-12">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-brand px-4 py-1.5 rounded-sm shadow-sm">
                <h2 className="text-xs font-sans font-black uppercase text-white tracking-widest leading-none">
                  Print Edition
                </h2>
              </div>
              <div className="h-[1px] flex-1 bg-gray-100 hidden md:block" />
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
              let rawLink = issue.acf?.pdf_link || "#";
              let cleanLink = rawLink.includes("drive.google.com") 
                ? rawLink.replace(/\/view.*/, "/preview").replace(/\/edit.*/, "/preview") 
                : rawLink;

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