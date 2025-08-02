import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    connectToDB();

    const formData = await req.formData();

    // دریافت فیلدهای ساده
    const title = formData.get("title");
    const longDescription = formData.get("longDescription");
    const category = formData.get("category");
    const duration = +formData.get("duration");
    const tags = JSON.parse(formData.get("tags"));


    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";


    // پردازش فایل تامنیل
    const thumbnail = formData.get("img");
    const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const thumbnailFilename = `${Date.now()}-${thumbnail.name}`;
    const thumbnailPath = path.join(process.cwd(), "public","uploads", thumbnailFilename);
    await writeFile(thumbnailPath, thumbnailBuffer);

    // پردازش فایل پادکست
    const podcast = formData.get("podcast");
    const podcastBuffer = Buffer.from(await podcast.arrayBuffer());
    const podcastFilename = `${Date.now()}-${podcast.name}`;
    const podcastPath = path.join(process.cwd(), "public","uploads", podcastFilename);
    await writeFile(podcastPath, podcastBuffer);


    // ایجاد course در دیتابیس
    const podcastes = await PodcastModel.create({
      title,
      category,
      duration,
      longDescription,
      tags,
      thumbnail: `${DOMAIN}/uploads/${thumbnailFilename}`,
      podcast: `${DOMAIN}/uploads/${podcastFilename}`,
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