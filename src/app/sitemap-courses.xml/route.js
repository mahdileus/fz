import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";

export async function GET() {
  const baseUrl = "https://firouzehjavaherian.com";

  try {
    await connectToDB();

    const courses = await CourseModel.find({}, "slug updatedAt")
      .sort({ updatedAt: -1 })
      .limit(3000)
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${courses
  .map((c) => {
    const lastmod = c.updatedAt
      ? new Date(c.updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    return `<url>
  <loc>${baseUrl}/courses/${c.slug}</loc>
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
