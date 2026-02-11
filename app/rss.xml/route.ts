import { NextResponse } from 'next/server';

// 1. Tell Next.js to revalidate this Route Handler every hour
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkule.org';
const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

export async function GET() {
  try {
    // 2. Add revalidation to the fetch and handle potential Pantheon timeouts
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=20&_embed`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`WordPress API responded with status: ${res.status}`);
    }

    const posts = await res.json();

    // 3. Ensure posts is an array before mapping to prevent crashes
    if (!Array.isArray(posts)) {
      throw new Error("Invalid data format received from WordPress");
    }

    const feedItems = posts
      .map((post: any) => {
        // Extract the author name safely
        const authorName = post._embedded?.author?.[0]?.name || "Staff";

        return `
        <item>
          <title><![CDATA[${post.title.rendered}]]></title>
          <link>${BASE_URL}/news/${post.slug}</link>
          <guid isPermaLink="false">${BASE_URL}/news/${post.slug}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <dc:creator><![CDATA[${authorName}]]></dc:creator>
          <description><![CDATA[${post.excerpt.rendered}]]></description>
          <content:encoded><![CDATA[${post.content.rendered}]]></content:encoded>
        </item>
      `;
      })
      .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" 
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:wfw="http://wellformedweb.org/CommentAPI/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
      xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    >
      <channel>
        <title>The Manila Collegian</title>
        <link>${BASE_URL}</link>
        <description>Official Student Publication of the University of the Philippines Manila</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        // Next.js handles internal cache, this header tells Vercel's Edge CDN to cache it
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error("Error generating RSS feed:", error);
    // Return a 500 status if it completely fails, rather than malformed XML
    return new NextResponse("Internal Server Error generating RSS feed.", { status: 500 });
  }
}