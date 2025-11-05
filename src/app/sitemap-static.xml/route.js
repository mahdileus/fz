import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";
  const pages = [
    "",
    "my-story",
    "about-us",
    "contact-us",
    "posts",
    "podcasts",
    "courses",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (p) => `
      <url>
        <loc>${baseUrl}/${p}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
        <priority>${p === "" ? "1.0" : "0.8"}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
