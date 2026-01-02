import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  const pages = [
    { path: "", priority: "1.0" },
    { path: "my-story", priority: "0.6" },
    { path: "about-us", priority: "0.6" },
    { path: "contact-us", priority: "0.6" },
    { path: "posts", priority: "0.4" },
    { path: "podcasts", priority: "0.4" },
    { path: "courses", priority: "0.4" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ path, priority }) => `<url>
  <loc>${baseUrl}${path ? `/${path}` : ""}</loc>
  <changefreq>monthly</changefreq>
  <priority>${priority}</priority>
</url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
