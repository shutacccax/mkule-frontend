import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageLink = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  return (
    <nav 
      aria-label="Pagination"
      className="flex flex-col items-center gap-8 pt-16 border-t border-gray-100 mt-20"
    >
      {/* Editorial Page Indicator */}
      <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={getPageLink(currentPage - 1)}
            className="group flex items-center gap-2 px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-gray-900 hover:text-brand transition-colors duration-300"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Prev
          </Link>
        ) : (
          <div className="px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-gray-200 cursor-not-allowed">
            Prev
          </div>
        )}

        {/* Page Numbers */}
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={getPageLink(page)}
              className={`relative w-10 h-10 flex items-center justify-center text-[11px] font-sans font-black transition-all duration-300
                ${page === currentPage
                  ? "text-brand after:absolute after:bottom-2 after:w-1 after:h-1 after:bg-brand after:rounded-full"
                  : "text-gray-400 hover:text-black"
                }`}
            >
              {page.toString().padStart(2, '0')}
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageLink(currentPage + 1)}
            className="group flex items-center gap-2 px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-gray-900 hover:text-brand transition-colors duration-300"
          >
            Next
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        ) : (
          <div className="px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-gray-200 cursor-not-allowed">
            Next
          </div>
        )}
      </div>
    </nav>
  );
}