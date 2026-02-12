"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start text-center md:text-left">
          
          {/* LEFT SIDE — BRAND + IDENTITY */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
            <Link href="/" className="block">
              <div className="relative w-[190px] md:w-[240px] aspect-[2.5/1]">
                <Image 
                  src="/logo-header.png" 
                  alt="Mkule Logo" 
                  fill 
                  className="object-contain" 
                  priority 
                />
              </div>
            </Link>

            <div className="space-y-2">
              <p className="text-[11px] md:text-[14px] font-sans tracking-tight text-gray-600">
                Official Student Publication of the University of the Philippines Manila
              </p>
              <p className="text-[9px] md:text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-brand">
                Magna est veritas et prevaelebit
              </p>
            </div>

            <div className="text-[13px] md:text-sm text-gray-700 leading-relaxed space-y-2">
              <p>4th Floor Student Center,<br />UP Manila, Ermita, Philippines</p>
              <p>
                <a href="mailto:mkule.upm@up.edu.ph" className="hover:text-brand transition-colors font-bold">
                  mkule.upm@up.edu.ph
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — NAVIGATION & SOCIALS */}
          <div className="md:text-right flex flex-col items-center md:items-end w-full">
            <nav className="flex flex-col items-center md:items-end gap-y-6 mb-8 w-full md:w-auto">
              <div className="flex justify-center md:justify-end w-full md:w-auto gap-x-6 sm:gap-x-8">
                {["News", "Features", "Culture", "Opinion"].map((cat) => (
                  <Link 
                    key={cat} 
                    href={`/category/${cat.toLowerCase()}`} 
                    className="text-[11px] font-sans font-black uppercase tracking-[0.15em] text-gray-500 hover:text-brand transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <div className="flex justify-center md:justify-end w-full md:w-auto gap-x-10 sm:gap-x-12">
                {["Editorial", "Grafx", "Issues"].map((cat) => (
                  <Link 
                    key={cat} 
                    href={cat === "Issues" ? "/issues" : `/category/${cat.toLowerCase()}`} 
                    className="text-[11px] font-sans font-black uppercase tracking-[0.15em] text-gray-500 hover:text-brand transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className="flex justify-center md:justify-end gap-x-6 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 mb-8 border-t border-gray-200 pt-4 w-full md:w-auto">
              <Link href="/about" className="hover:text-brand transition-colors">About Us</Link>
              <Link href="/editorial-board" className="hover:text-brand transition-colors">Editorial Board</Link>
              <Link href="/contact" className="hover:text-brand transition-colors">Contact Us</Link>
            </nav>

            <div className="flex items-center justify-center md:justify-end gap-4 mb-6">
              <SocialIcon platform="facebook" href="https://facebook.com/themanilacollegian" />
              <SocialIcon platform="instagram" href="https://instagram.com/themanilacollegian" />
              <SocialIcon platform="twitter" href="https://twitter.com/mkule" />
              <SocialIcon platform="tiktok" href="https://tiktok.com/@themanilacollegian" />
            </div>

            <p className="text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-widest text-gray-400">
              © {currentYear} Mkule. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, platform }: { href: string; platform: string }) {
  const icons: Record<string, React.ReactElement> = {
    facebook: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
    instagram: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    twitter: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    tiktok: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
      </svg>
    )
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all duration-300"
    >
      {icons[platform]}
    </a>
  );
}