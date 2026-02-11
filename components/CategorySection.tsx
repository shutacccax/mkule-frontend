export default function CategorySection({ title, posts }: any) {
  if (!posts || !posts.length) return null;

  return (
    <section className="mb-24 pt-12 border-t border-gray-900">
      
      {/* Updated Header with Block Tag */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
        <div className="bg-brand px-3.5 py-1.5 rounded-md shadow-sm">
            <h2 className="text-[11px] font-sans font-black uppercase tracking-[0.01em] text-white leading-tight">
            {title}
            </h2>
        </div>

        <a
            href={`/category/${title.toLowerCase()}`}
            className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 hover:text-brand transition-colors"
        >
            View All →
        </a>
        </div>

      {/* Grid Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.slice(0, 4).map((post: any) => (
          <a key={post.id} href={`/news/${post.slug}`} className="group flex flex-col">
            {post._embedded?.["wp:featuredmedia"] && (
              <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post.title.rendered}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
            
            <div className="flex-1">
               <h3
                className="text-lg font-bold leading-[1.3] mb-3 group-hover:text-brand transition"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div
                className="text-sm text-gray-500 line-clamp-2 mb-4 font-light"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-400">
              <span>By {post._embedded?.author?.[0]?.name || "MKULE"}</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}