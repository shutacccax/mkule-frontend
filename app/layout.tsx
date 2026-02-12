import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Merriweather, Libre_Franklin } from 'next/font/google';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteLoader from "@/components/RouteLoader";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/next"
import ScrollToTop from "@/components/ScrollToTop";

export const revalidate = 60;

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-serif', // Named for easy CSS reference
});

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-sans', // Named for easy CSS reference
});

async function getLatestIssuePdf() {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;

  // Get Issues category
  const catRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/categories?slug=issues`,
    { next: { revalidate: 3600 } }
  );

  const catData = await catRes.json();
  const categoryId = catData[0]?.id;
  if (!categoryId) return null;

  // Get most recent post in that category
  const postsRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=1&orderby=date&order=desc`,
    { next: { revalidate: 60 } }
  );

  const posts = await postsRes.json();

  return posts?.[0]?.acf?.pdf_link || null;
}

const latestIssuePdf = await getLatestIssuePdf();


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
        <Header latestIssueUrl={latestIssuePdf} />


        <div id="fb-root"></div>
        <Suspense fallback={null}>
          <RouteLoader />
        </Suspense>

        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />

        <Footer />

        <ScrollToTop />
        

      </body>
    </html>
  );
}
