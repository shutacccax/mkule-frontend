"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. When the pathname or searchParams change, navigation is "done"
    setLoading(false);

    // 2. Add global click listener to catch navigation starts
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor && 
        anchor.href && 
        anchor.target !== "_blank" && 
        anchor.host === window.location.host && // Only internal links
        anchor.href !== window.location.href // Don't trigger for same page
      ) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname, searchParams]); // Reset when URL changes

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logomark.png"
          alt="Mkule"
          width={120}
          height={120}
          className={`transition-all duration-700 ${
            loading ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        />
        {/* Added a small themed indicator */}
        <div className="w-12 h-[2px] bg-gray-100 overflow-hidden">
          <div className="h-full bg-brand animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}