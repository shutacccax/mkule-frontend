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

  // Helper to determine the correct separator (? if none exists, & if one does)
  const getPageLink = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  return (
    <div className="flex justify-center items-center gap-3 pt-12 border-t border-gray-50 mt-12">

      {currentPage > 1 && (
        <a
          href={getPageLink(currentPage - 1)}
          className="px-4 py-2 border border-gray-200 text-[10px] font-sans font-black uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
        >
          Prev
        </a>
      )}

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <a
            key={page}
            href={getPageLink(page)}
            className={`w-10 h-10 flex items-center justify-center border text-[10px] font-sans font-black uppercase transition-all duration-300 ${
              page === currentPage
                ? "bg-black text-white border-black shadow-md"
                : "border-gray-100 text-gray-400 hover:border-brand hover:text-brand"
            }`}
          >
            {page}
          </a>
        ))}
      </div>

      {currentPage < totalPages && (
        <a
          href={getPageLink(currentPage + 1)}
          className="px-4 py-2 border border-gray-200 text-[10px] font-sans font-black uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
        >
          Next
        </a>
      )}

    </div>
  );
}