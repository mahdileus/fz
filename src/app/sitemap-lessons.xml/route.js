import { NextResponse } from "next/server";
import connectToDB from "@/configs/db";
import Course from "@/models/Course";

export async function GET() {
  await connectToDB();

  const courses = await Course.find({}).lean();
  const baseUrl = "https://firouzehjavaherian.com";

  const urls = [];

  courses.forEach((course) => {
    course.lessons.forEach((lesson, index) => {
      urls.push(`
        <url>
          <loc>${baseUrl}/course/${course.slug}/lesson/${index}</loc>
          <lastmod>${lesson.updatedAt?.toISOString() || course.updatedAt?.toISOString()}</lastmod>
          <priority>0.9</priority>
        </url>
      `);
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
