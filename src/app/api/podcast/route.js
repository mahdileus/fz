import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";
import { writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";


export async function POST(req) {
  try {
    connectToDB();

    const formData = await req.formData();

    // دریافت فیلدهای ساده
    const title = formData.get("title");
    const slug = slugify(formData.get("slug"), { lower: true, strict: true });
    const longDescription = formData.get("longDescription");
    const category = formData.get("category");
    const duration = +formData.get("duration");
    const tags = JSON.parse(formData.get("tags"));
        const uploadDir = "/var/www/uploads";
    
        // ذخیره تامنیل پادکست
        const thumbnail = formData.get("thumbnail");
        if (!thumbnail || typeof thumbnail.arrayBuffer !== "function") {
          throw new Error("Thumbnail نامعتبر است یا ارسال نشده");
        }
        const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
        const thumbnailName = `${Date.now()}-${thumbnail.name}`;
        const thumbnailPath = path.join(uploadDir, thumbnailName);
        await writeFile(thumbnailPath, thumbnailBuffer);


    // پردازش فایل پادکست
    const podcast = formData.get("podcast");
    const podcastBuffer = Buffer.from(await podcast.arrayBuffer());
    const podcastFilename = `${Date.now()}-${podcast.name}`;
    const podcastPath = path.join(uploadDir, podcastFilename);
    await writeFile(podcastPath, podcastBuffer);


    // ایجاد course در دیتابیس
    const podcastes = await PodcastModel.create({
      title,
      slug,
      category,
      duration,
      longDescription,
      tags,
      thumbnail: `/uploads/${thumbnailName}`,
      podcast: `/uploads/${podcastFilename}`,
    });

    return Response.json(
      { message: "podcast created successfully", data: podcastes },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error", error: err }, { status: 500 });
  }
}


export async function GET() {
  const podcastes = await PodcastModel.find({}, '-__v').populate("comments");
  return Response.json(podcastes)

}