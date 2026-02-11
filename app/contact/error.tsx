"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 text-center space-y-6">
      <h2 className="text-4xl font-serif font-black italic text-gray-300">
        System Interruption.
      </h2>
      <p className="text-gray-500 font-sans tracking-tight max-w-md mx-auto">
        We encountered a technical issue while loading the contact portal. 
        Please refresh the page or try again later.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 px-8 py-3 border border-black text-[10px] font-sans font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
      >
        Try Again
      </button>
    </main>
  );
}