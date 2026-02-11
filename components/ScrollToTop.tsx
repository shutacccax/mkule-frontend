"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Handle Visibility
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);

      // 2. Calculate Scroll Progress Percentage
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollY / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-10 scale-75 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.15)] hover:border-brand/30 transition-all duration-500"
      >
        {/* --- PROGRESS CIRCLE --- */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-100"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="100"
            strokeDashoffset={100 - scrollProgress}
            strokeLinecap="round"
            className="text-brand transition-all duration-200 ease-out"
          />
        </svg>

        {/* --- ICON --- */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-900 group-hover:text-brand group-hover:-translate-y-1 transition-all duration-300 ease-out"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>

        {/* --- TOOLTIP (Desktop Only) --- */}
        <span className="absolute right-full mr-4 px-2 py-1 bg-black text-white text-[9px] font-sans font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Back to Top
        </span>
      </button>
    </div>
  );
}