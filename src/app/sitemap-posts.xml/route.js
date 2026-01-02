import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PostModel from "@/models/Article";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const posts = await PostModel.find({}, "slug updatedAt")
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts
  .map((p) => {
    const lastmod = p.updatedAt
      ? new Date(p.updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    return `<url>
  <loc>${baseUrl}/posts/${p.slug}</loc>
  <lastmod>${lastmod}</lastmod>
</url>`;
  })
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        headers: { "Content-Type": "application/xml" },
        status: 200,
      }
    );
  }
}
