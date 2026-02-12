"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header({
  latestIssueUrl,
}: {
  latestIssueUrl?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 60) setScrolled(true);
      else if (offset < 10) setScrolled(false);
    };

    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setCurrentDate(formatted);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
    
    setSearchOpen(false); 
  }

  const [currentDate, setCurrentDate] = useState("");


  const navItems = ["News", "Features", "Culture", "Opinion", "Editorial", "Grafx", "Issues"];

  return (
    <>
      <div className="h-20 md:h-48 w-full bg-white transition-all duration-300" />

      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            scrolled 
            ? "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border-b border-gray-100" 
            : "shadow-[0_15px_35px_-10px_rgba(0,0,0,0.03)] border-b border-transparent"
        }`}
      >
        {isPending && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-100 overflow-hidden z-[60]">
            <div className="h-full bg-brand animate-indeterminate-bar"></div>
          </div>
        )}

        {/* --- TOP DATE BAR --- */}
        <div
          className={`border-b border-gray-100 bg-white transition-all duration-500 overflow-hidden ${
            scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-[10px] md:text-[11px] font-sans uppercase tracking-widest text-gray-500">
            
            <span>{currentDate}</span>

            <a
              href={latestIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors font-bold"
            >
              Latest Issue →
            </a>
          </div>
        </div>



        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16" : "h-20 md:h-28"
          }`}>
            
            {/* LEFT: Menu Button */}
            <div className="flex-1 basis-0 flex items-center">
              <button
                onClick={() => {
                  setMobileOpen(!mobileOpen);
                  if (searchOpen) setSearchOpen(false); 
                }}
                className={`flex flex-col gap-1.5 group transition-all duration-500 ${
                  !scrolled ? "md:opacity-0 md:-translate-x-4 md:pointer-events-none" : "md:opacity-100 md:translate-x-0"
                }`}
              >
                <div className={`h-[2px] bg-black group-hover:bg-brand transition-all duration-300 ${scrolled ? 'w-5' : 'w-6'}`}></div>
                <div className={`h-[2px] bg-black group-hover:bg-brand transition-all duration-300 ${scrolled ? 'w-4' : 'w-6'}`}></div>
                <div className={`h-[2px] bg-black group-hover:bg-brand transition-all duration-300 ${scrolled ? 'w-5' : 'w-6'}`}></div>
              </button>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-none flex items-center justify-center">
              <Link href="/" className="block relative group">
                <div
                  className={`relative transition-all duration-500 ${
                    scrolled ? "h-8 w-[120px]" : "h-10 md:h-20 w-[180px] md:w-[300px]"
                  }`}
                >
                  <Image
                    src="/logo-header.png"
                    alt="Mkule Logo"
                    fill
                    sizes="(max-width: 768px) 180px, 300px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>


            {/* RIGHT: Search Toggle */}
            <div className="flex-1 basis-0 flex justify-end items-center">
              {/* Desktop Search Logic */}
              <div className="hidden md:flex items-center justify-end relative">
                <button 
                  onClick={() => setSearchOpen(true)} 
                  className={`text-gray-400 hover:text-brand p-2 transition-all duration-300 ${
                    searchOpen ? "opacity-0 pointer-events-none scale-75 absolute" : "opacity-100 scale-100 relative"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  searchOpen ? "w-60 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-4"
                }`}>
                  <form onSubmit={handleSearch} className="flex items-center relative w-full">
                    <input
                      type="text" 
                      autoFocus={searchOpen}
                      placeholder={isPending ? "SEARCHING..." : "SEARCH..."}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={isPending}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-brand outline-none text-[11px] font-sans font-bold uppercase tracking-widest py-1 pl-0 pr-6 text-gray-900 placeholder:text-gray-300 transition-colors"
                    />
                  </form>
                </div>
              </div>

              {/* Mobile Toggle */}
              <button 
                onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (mobileOpen) setMobileOpen(false);
                }} 
                className="md:hidden text-gray-400 hover:text-brand p-2 transition-colors relative z-10"
              >
                {searchOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className={`hidden md:flex justify-center border-t border-gray-50 overflow-hidden transition-all duration-500 ${scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100 py-4"}`}>
            <div className="flex gap-10">
              {navItems.map((item) => (
                <Link 
                  key={item} 
                  href={item === "Issues" ? "/issues" : `/category/${item.toLowerCase()}`} 
                  className="text-[12px] font-sans font-bold uppercase tracking-[0.25em] text-gray-500 hover:text-brand transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* --- MOBILE SEARCH BAR (DROPDOWN) --- */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-xl transition-all duration-300 ease-out z-40 ${
            searchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                    type="text"
                    placeholder={isPending ? "SEARCHING..." : "SEARCH..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isPending}
                    autoFocus={searchOpen}
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-xs font-sans font-bold uppercase tracking-widest text-gray-900 focus:ring-1 focus:ring-brand outline-none transition-all"
                />
                {isPending && (
                     <div className="absolute right-3">
                        <svg className="animate-spin h-4 w-4 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     </div>
                )}
            </form>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2 duration-300">
             {navItems.map((item) => (
                <Link 
                  key={item} 
                  href={item === "Issues" ? "/issues" : `/category/${item.toLowerCase()}`} 
                  className="text-sm font-sans font-black uppercase tracking-widest text-center hover:text-brand" 
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
          </div>
        )}
      </header>
    </>
  );
}