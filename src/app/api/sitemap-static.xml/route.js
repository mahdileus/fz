import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.BASE_URL || "https://firouzehjavaherian.com";
    const pages = [
      "",  // homepage
      "my-story",
      "about-us",
      "contact-us",
      "posts",
      "podcasts",
      "courses",
      // اگر صفحه جدید داری، اینجا اضافه کن
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => {
    const priority = p === "" ? "1.0" : "0.8";  // dynamic برای homepage
    return `<url>
  <loc>${baseUrl}/${p}</loc>
  <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  <changefreq>monthly</changefreq>  <!-- اضافه شد برای سئو بهتر -->
  <priority>${priority}</priority>
</url>`;
  })
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    return new NextResponse(`Error generating sitemap: ${err.message}`, { status: 500 });
  }
}