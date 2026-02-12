import type { NextConfig } from "next";

const cspHeader = `
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com https://platform.twitter.com;
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data: https://*.pantheonsite.io https://*.google-analytics.com https://www.facebook.com https://pbs.twimg.com https://abs.twimg.com;
frame-src https://platform.twitter.com https://syndication.twitter.com https://www.facebook.com https://drive.google.com;
connect-src 'self' https://www.google-analytics.com https://api.twitter.com https://syndication.twitter.com https://cdn.syndication.twimg.com;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
block-all-mixed-content;
upgrade-insecure-requests;
`;


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pantheonsite.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", 
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin", 
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", 
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;