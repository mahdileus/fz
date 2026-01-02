import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const courses = await CourseModel.find(
      { published: true },
      "slug updatedAt"
    )
      .sort({ updatedAt: -1 })
      .limit(3000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${courses
  .map(
    (c) => `<url>
  <loc>${baseUrl}/courses/${c.slug}</loc>
  <lastmod>${c.updatedAt.toISOString().split("T")[0]}</lastmod>
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
    // مهم: sitemap نباید 500 بده
    return new NextResponse("", { status: 200 });
  }
}
