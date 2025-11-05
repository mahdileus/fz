import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";

export async function GET() {
  await connectToDB();
  const posts = await PodcastModel.find({}, "slug updatedAt");

  const baseUrl = "https://firouzehjavaherian.com";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map(
        (p) => `
      <url>
        <loc>${baseUrl}/posts/${p.slug}</loc>
        <lastmod>${new Date(p.updatedAt).toISOString().split("T")[0]}</lastmod>
        <priority>0.8</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
