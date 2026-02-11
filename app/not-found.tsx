import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center text-center">
      
      {/* --- BRANDED ERROR CODE --- */}
      <div className="mb-8">
        <div className="bg-brand px-4 py-2 rounded-sm shadow-md inline-block mb-4">
          <span className="text-xl font-sans font-black uppercase text-white leading-none tracking-tighter">
            Error 404
          </span>
        </div>
        <div className="h-[2px] w-12 bg-gray-200 mx-auto" />
      </div>

      {/* --- ERROR MESSAGE --- */}
      <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight mb-6">
        Page Not Found
      </h1>
      
      <p className="text-lg font-sans font-light text-gray-500 max-w-md mx-auto leading-relaxed mb-12">
        The article or page you are looking for might have been moved, deleted, or does not exist.
      </p>

      {/* --- NAVIGATION SUGGESTIONS --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl border-t border-gray-100 pt-12">
        {["News", "Features", "Culture", "Opinion", "Editorial", "Grafx"].map((item) => (
          <Link
            key={item}
            href={`/category/${item.toLowerCase()}`}
            className="group p-4 border border-gray-100 rounded-xl hover:border-brand hover:bg-gray-50 transition-all duration-300"
          >
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 group-hover:text-brand">
              Go to
            </p>
            <p className="font-serif font-bold text-lg text-gray-900">
              {item}
            </p>
          </Link>
        ))}
      </div>

      {/* --- RETURN HOME --- */}
      <div className="mt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-sans font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand transition-colors shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Homepage
        </Link>
      </div>

    </main>
  );
}