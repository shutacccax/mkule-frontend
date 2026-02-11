import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Merriweather, Libre_Franklin } from 'next/font/google';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteLoader from "@/components/RouteLoader";
import { GoogleAnalytics } from '@next/third-parties/google'


const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-serif', // Named for easy CSS reference
});

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-sans', // Named for easy CSS reference
});

export const metadata: Metadata = {
  title: {
    default: "The Manila Collegian",
    template: "%s | The Manila Collegian",
  },
  description: "Official Student Publication of the University of the Philippines Manila.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${libreFranklin.variable} bg-white text-black antialiased`}
      >

        {/* Sticky Navbar */}
        <Header />

        <div id="fb-root"></div>
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>
        <Script
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v24.0"
          strategy="lazyOnload"
        />

        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />

        <Footer />
        

      </body>
    </html>
  );
}
