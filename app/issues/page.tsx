import Image from "next/image";
import type { Metadata } from "next";
import IssueCard from "@/components/IssueCard";

interface IssuePost {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
  acf?: {
    pdf_link?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}

export const metadata: Metadata = {
  title: "Print Issues | Mkule",
  description: "Browse all print issues of Mkule.",
};

async function getIssues(): Promise<IssuePost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_URL;
  const catRes = await fetch(`${baseUrl}/wp-json/wp/v2/categories?slug=issues`, { next: { revalidate: 3600 } });
  const catData = await catRes.json();
  const categoryId = catData[0]?.id;
  if (!categoryId) return [];

  const postsRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&_embed&per_page=50&orderby=date&order=desc`,
    { cache: "no-store" }
    );

  return postsRes.json();
}

export default async function IssuesPage() {
  const issues = await getIssues();

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      
      {/* --- MINIMALIST HEADER (Matches Category Pages) --- */}
      <header className="mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-brand px-3 py-1 rounded-sm shadow-sm">
             <h1 className="text-sm font-sans font-black uppercase text-white leading-none">
              Print Issues
            </h1>
          </div>
          <div className="h-[1px] flex-1 bg-gray-200" />
        </div>
      </header>

      {/* --- THE BOOKSHELF GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {issues.map((issue) => {
          const cover = issue._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          const pdfLink = issue.acf?.pdf_link;

          if (!cover) return null;

          return (
            <div key={issue.id} className="relative group">
              <IssueCard
                title={issue.title.rendered}
                cover={cover}
                pdfLink={pdfLink}
              />
              
              {/* Subtle Shelf Shadow to maintain the bookshelf feel */}
              <div className="absolute -bottom-6 left-0 right-0 h-4 bg-black/[0.02] blur-xl rounded-full scale-x-90 translate-y-1 group-hover:bg-black/[0.05] transition-all duration-500" />
            </div>
          );
        })}
      </div>

      {/* --- EMPTY STATE --- */}
      {issues.length === 0 && (
        <div className="text-center py-40 border border-dashed border-gray-200 rounded-lg">
          <p className="font-serif italic text-gray-400">The archive is currently empty.</p>
        </div>
      )}
    </main>
  );
}