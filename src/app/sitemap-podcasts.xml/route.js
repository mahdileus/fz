import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const podcasts = await PodcastModel.find(
      "slug updatedAt"
    )
      .sort({ updatedAt: -1 })
      .limit(3000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${podcasts
  .map(
    (p) => `<url>
  <loc>${baseUrl}/podcasts/${p.slug}</loc>
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
    // خیلی مهم: sitemap نباید 500 بده
    return new NextResponse("", { status: 200 });
  }
}
