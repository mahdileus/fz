import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  const sitemaps = [
    "sitemap-static.xml",
    "sitemap-posts.xml",
    "sitemap-podcasts.xml",
    "sitemap-courses.xml",
    "sitemap-lessons.xml",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map((url) => `<sitemap><loc>${baseUrl}/${url}</loc></sitemap>`)
      .join("")}
  </sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
