import { NextResponse } from "next/server";
import fs from 'fs/promises';  // اضافه برای lastmod dynamic

export async function GET() {
  try {
    const baseUrl = process.env.BASE_URL || "https://firouzehjavaherian.com";
    const sitemaps = [
      "sitemap-static.xml",
      "sitemap-posts.xml",
      "sitemap-podcasts.xml",
      "sitemap-courses.xml",
      // اگر sitemap جدید اضافه کردی، اینجا بذار
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await Promise.all(
  sitemaps.map(async (url) => {
    try {
      const stat = await fs.stat(`public/${url}`);  // مسیر فایل sitemap رو چک کن (فرض public)
      const lastmod = new Date(stat.mtime).toISOString().split("T")[0];
      return `<sitemap>
  <loc>${baseUrl}/${url}</loc>
  <lastmod>${lastmod}</lastmod> 
</sitemap>`;
    } catch {
      return `<sitemap><loc>${baseUrl}/${url}</loc></sitemap>`;  // اگر فایل نبود، فقط loc
    }
  })
).then((items) => items.join("\n"))}
</sitemapindex>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    return new NextResponse(`Error generating sitemap index: ${err.message}`, { status: 500 });
  }
}