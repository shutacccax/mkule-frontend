"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Props {
  title: string;
  cover: string;
  pdfLink?: string;
}

export default function IssueCard({ title, cover, pdfLink }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const getDownloadLink = (link: string) => {
    return link.replace("/preview", "/view").replace("/edit", "/view");
  };

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsFullscreen(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, closeModal]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (Math.abs(distance) > 50) closeModal();
    touchStart.current = null;
    touchEnd.current = null;
  };

  if (!pdfLink) return null;

  return (
    <>
      {/* --- TRIGGER CARD (ZOOM EFFECT) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="group block text-left w-full"
      >
        {/* Simple Frame for internal zoom */}
        <div className="relative w-full aspect-[11/13] overflow-hidden rounded-xl shadow-md bg-gray-100">
          {/* Spine and Gloss overlays kept for character, but 3D movements removed */}
          <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-r from-black/10 to-transparent z-20 rounded-l-sm" />
          
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <h3
          className="mt-4 text-sm font-serif font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-bold">
          Read Issue →
        </p>
      </button>

      {/* --- MODAL (Unchanged) --- */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

          <div
            className={`relative bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
              isFullscreen 
                ? "w-screen h-screen rounded-none" 
                : "w-full max-w-6xl h-[80vh] md:h-[90vh] rounded-2xl"
            } ${isClosing ? "scale-95 translate-y-10" : "scale-100 translate-y-0"}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-100 z-10 flex items-center justify-between px-4">
              <div className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-500 truncate max-w-[200px]">
                Reading: <span className="text-black" dangerouslySetInnerHTML={{ __html: title }} />
              </div>
              <div className="sm:hidden text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Swipe to close
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getDownloadLink(pdfLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-brand hover:bg-gray-50 rounded-full transition-colors"
                >
                  <DownloadIcon />
                </a>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-500 hover:text-brand hover:bg-gray-50 rounded-full transition-colors hidden sm:block"
                >
                  {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
                </button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-white hover:bg-black rounded-full transition-all"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-gray-100 pt-14">
               <iframe
                src={pdfLink}
                className="w-full h-full animate-in fade-in zoom-in-95 duration-500 shadow-inner"
                allow="autoplay"
                title={`PDF Viewer for ${title}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Icons (CloseIcon, DownloadIcon, etc.) remain as defined previously
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12.75l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}