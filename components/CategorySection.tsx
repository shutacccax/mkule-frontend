export default function CategorySection({ title, secondaryTitle, posts, secondaryPosts, layout }: any) {
  if (!posts || !posts.length) return null;

  // --- LAYOUT: EDITORIAL (60%) & OPINION (40%) ---
  if (layout === "editorial") {
    const featured = posts[0];
    return (
      <section className="py-1">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12">
          
          {/* Main Editorial - 60% */}
          <div className="lg:col-span-6 group">
            <div className="flex justify-between items-center mb-4">
              <Tag title={title} />
              <ViewAll link={title} />
            </div>
            <a href={`/news/${featured.slug}`} className="block space-y-4">
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                <img 
                  src={featured._embedded?.["wp:featuredmedia"]?.[0]?.source_url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-black leading-tight group-hover:text-brand transition duration-300" dangerouslySetInnerHTML={{ __html: featured.title.rendered }} />
              <div className="text-gray-700 text-lg md:text-xl font-normal line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: featured.excerpt.rendered }} />
              <Metadata author={featured._embedded?.author?.[0]?.name} date={featured.date} />
            </a>
          </div>

          {/* Opinion Column - 40% */}
          <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="flex justify-between items-center mb-6">
              <Tag title={secondaryTitle} />
              <ViewAll link={secondaryTitle} />
            </div>
            <div className="space-y-10">
              {secondaryPosts?.slice(0, 3).map((post: any) => (
                <a key={post.id} href={`/news/${post.slug}`} className="group block space-y-4">
                  <div className="aspect-video overflow-hidden rounded-md bg-gray-100 shadow-sm">
                     <img src={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-serif font-bold text-xl leading-tight group-hover:text-brand transition duration-300" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <div className="text-sm text-gray-600 line-clamp-2 font-normal leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                    <Metadata author={post._embedded?.author?.[0]?.name} date={post.date} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- LAYOUT: FEATURES & CULTURE (50/50 Split) ---
  if (layout === "split") {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-1">
        <div>
          <div className="flex justify-between items-center mb-4">
             <Tag title={title} />
             <ViewAll link={title} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {posts.slice(0, 2).map((post: any) => <CompactCard key={post.id} post={post} />)}
          </div>
        </div>
        <div className="lg:border-l lg:border-gray-100 lg:pl-8">
          <div className="flex justify-between items-center mb-4">
             <Tag title={secondaryTitle} />
             <ViewAll link={secondaryTitle} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {secondaryPosts?.slice(0, 2).map((post: any) => <CompactCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>
    );
  }

  // --- DEFAULT NEWS LAYOUT ---
  return (
    <section className="py-1">
      <div className="flex justify-between items-center mb-4">
        <Tag title={title} />
        <ViewAll link={title} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {posts.slice(0, 4).map((post: any) => <CompactCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}

// UI HELPERS
function Tag({ title, color = "bg-brand" }: { title: string, color?: string }) {
  return (
    <div className={`inline-block ${color} px-3 py-1 rounded-sm shadow-sm`}>
      <h2 className="text-[10px] font-sans font-black uppercase text-white tracking-widest leading-none">{title}</h2>
    </div>
  );
}

function ViewAll({ link }: { link: string }) {
  return (
    <a 
      href={`/category/${link.toLowerCase()}`} 
      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors flex items-center gap-1 group"
    >
      View All 
      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
    </a>
  );
}

function Metadata({ author, date }: { author?: string, date: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
       <span className="text-gray-700 italic">/ {author || "Staff"}</span>
       <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
    </div>
  );
}

function CompactCard({ post }: any) {
  return (
    <a href={`/news/${post.slug}`} className="group space-y-4">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100 shadow-sm">
        <img src={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-brand transition" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="text-sm text-gray-600 line-clamp-2 font-normal leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        <Metadata author={post._embedded?.author?.[0]?.name} date={post.date} />
      </div>
    </a>
  );
}