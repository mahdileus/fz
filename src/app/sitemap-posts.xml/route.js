import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PostModel from "@/models/Article";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const posts = await PostModel.find(
      { published: true },
      "slug updatedAt"
    )
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts
  .map(
    (p) => `<url>
  <loc>${baseUrl}/posts/${p.slug}</loc>
  <lastmod>${p.updatedAt.toISOString().split("T")[0]}</lastmod>
</url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return new NextResponse("", { status: 200 });
  }
}
