import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";

export async function GET() {
  await connectToDB();
  const posts = await CourseModel.find({}, "slug updatedAt");

  const baseUrl = "https://firouzehjavaherian.com";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map(
        (c) => `
      <url>
        <loc>${baseUrl}/posts/${c.slug}</loc>
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
