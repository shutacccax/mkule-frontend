"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <header className={`sticky top-0 z-50 bg-white border-b transition-all duration-300 ${
      scrolled ? "border-gray-100 shadow-sm" : "border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- MAIN HEADER ROW --- */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14 md:h-20" : "h-16 md:h-32"
        }`}>
          
          {/* LEFT: Menu Button */}
          <div className="flex-1 basis-0 flex items-center">
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                if (searchOpen) setSearchOpen(false); 
              }}
              className={`flex flex-col gap-1 group ${!scrolled && "md:hidden"}`}
            >
              <div className="w-5 h-[2px] bg-black group-hover:bg-brand transition-colors"></div>
              <div className="w-5 h-[2px] bg-black group-hover:bg-brand transition-colors"></div>
              <div className="w-5 h-[2px] bg-black group-hover:bg-brand transition-colors"></div>
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="flex-none flex items-center">
            <a href="/" className="block">
              <Image
                src="/logo-header.png"
                alt="Mkule Logo"
                width={300}
                height={80}
                className={`object-contain transition-all duration-300 w-auto ${
                  scrolled ? "h-8 md:h-12" : "h-10 md:h-20"
                }`}
                priority
              />
            </a>
          </div>

          {/* RIGHT: Search Area */}
          <div className="flex-1 basis-0 flex justify-end items-center">
            {/* 1. DESKTOP SEARCH: Inline in the navbar */}
            <div className="hidden md:block">
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-400 hover:text-brand p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              ) : (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <input
                    type="text" autoFocus placeholder="Search..." value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-b-2 border-brand outline-none text-xs font-sans font-bold uppercase tracking-widest px-1 w-40"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-[10px] font-black text-gray-300 hover:text-brand">✕</button>
                </form>
              )}
            </div>

            {/* 2. MOBILE SEARCH: Professional SVG Icon, opens bottom bar */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden text-gray-400 hover:text-brand p-2 transition-colors"
            >
              {searchOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* --- MOBILE-ONLY SEARCH ROW --- */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-50 py-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch}>
              <input
                type="text" autoFocus placeholder="Search articles..." value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-50 rounded-md px-4 py-2 text-sm font-sans font-bold uppercase tracking-widest outline-none border border-transparent focus:border-brand/20"
              />
            </form>
          </div>
        )}

        {/* --- DESKTOP NAVIGATION --- */}
        {!scrolled && (
          <nav className="hidden md:flex justify-center gap-8 border-t border-gray-50 py-4">
            {["News", "Features", "Culture", "Opinion", "Editorial", "Grafx"].map((item) => (
              <a key={item} href={`/category/${item.toLowerCase()}`} className="text-[11px] font-sans font-black uppercase tracking-[0.25em] text-gray-500 hover:text-brand transition-colors">
                {item}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4">
           {["News", "Features", "Culture", "Opinion", "Editorial", "Grafx"].map((item) => (
              <a key={item} href={`/category/${item.toLowerCase()}`} className="text-sm font-sans font-black uppercase tracking-widest text-center hover:text-brand" onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
        </div>
      )}
    </header>
  );
}