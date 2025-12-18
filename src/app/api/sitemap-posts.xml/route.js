import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PostModel from "@/models/Article";

export async function GET() {
  try {
    await connectToDB();
    const posts = await PostModel.find({}, "slug updatedAt").lean();  // lean اضافه شد

    const baseUrl = process.env.BASE_URL || "https://firouzehjavaherian.com";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts
        .map((p) => {
          const lastmod = p.updatedAt
            ? new Date(p.updatedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];  // چک null اضافه شد

          return `<url>
  <loc>${baseUrl}/posts/${p.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>daily</changefreq> 
  <priority>0.8</priority>
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