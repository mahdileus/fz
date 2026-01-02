import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const podcasts = await PodcastModel.find({}, "slug updatedAt")
      .sort({ updatedAt: -1 })
      .limit(3000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${podcasts
  .map((p) => {
    const lastmod = p.updatedAt
      ? new Date(p.updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    return `<url>
  <loc>${baseUrl}/podcasts/${p.slug}</loc>
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
