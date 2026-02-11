"use client";

import React, { useState } from "react";
import { sendEmailAction } from "@/lib/actions";

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(""); // Clear previous errors

    const formData = new FormData(event.currentTarget);
    const result = await sendEmailAction(formData);

    if (result.success) {
        setIsSent(true);
    } else {
        // Show the error message to the user
        setErrorMessage(result.error || "Something went wrong. Please try again.");
    }
    setIsPending(false);
    }

  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-12 gap-20">
        
        <div className="md:col-span-8">
          <h1 className="text-5xl font-serif font-black mb-12 tracking-tight">Contact Us</h1>

          {isSent ? (
            <div className="bg-gray-50 p-12 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold italic">Message Received.</h2>
              <p className="text-gray-500 font-sans tracking-tight">
                Thank you for reaching out. An editor will review your inquiry shortly.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-[10px] font-sans font-black uppercase tracking-widest text-brand border-b border-brand pb-1 pt-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-3">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400">Subject</label>
                <input name="subject" type="text" required placeholder="What is this regarding?"
                  className="w-full border-b border-gray-200 bg-transparent py-4 text-xl font-sans outline-none focus:border-brand transition-colors placeholder:text-gray-200" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400">Message</label>
                <textarea name="message" required rows={5} placeholder="Write your message here..."
                  className="w-full border-b border-gray-200 bg-transparent py-4 text-xl font-sans outline-none focus:border-brand transition-colors resize-none placeholder:text-gray-200" />
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400">Your Name</label>
                  <input name="name" type="text" className="w-full border-b border-gray-200 bg-transparent py-3 outline-none focus:border-brand transition-colors" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400">Email Address</label>
                  <input name="email" type="email" required className="w-full border-b border-gray-200 bg-transparent py-3 outline-none focus:border-brand transition-colors" />
                </div>
              </div>

              {/* 1. Insert the Error Message here */}
                {errorMessage && (
                <p className="text-xs font-sans font-bold uppercase tracking-widest text-brand mb-4 animate-pulse">
                    {errorMessage}
                </p>
                )}

              <button type="submit" disabled={isPending}
                className="px-12 py-4 bg-black text-white text-[10px] font-sans font-black uppercase tracking-[0.2em] hover:bg-brand disabled:bg-gray-400 transition-all duration-300 shadow-lg shadow-gray-200"
              >
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* --- SIDEBAR --- */}
        <aside className="md:col-span-4 space-y-12 pt-4">
          <div className="space-y-6">
            <h3 className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">Visit Our Office</h3>
            <p className="font-serif text-lg leading-relaxed text-gray-600">
              4th Floor Student Center,<br />University of the Philippines Manila,<br />Ermita, Philippines
            </p>
          </div>
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-sans font-black uppercase tracking-widest text-brand">Online Inquiries</h3>
            <a href="mailto:mkule.upm@up.edu.ph" className="font-serif text-2xl font-bold hover:text-brand transition-colors break-words">
              mkule.upm@up.edu.ph
            </a>
          </div>
        </aside>

      </div>
    </main>
  );
}