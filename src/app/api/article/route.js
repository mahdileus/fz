import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";

export async function POST(req) {
  try {
    await connectToDB();
    const formData = await req.formData();

    const title = formData.get("title");
    const slug = slugify(formData.get("slug"), { lower: true, strict: true });
    const category = formData.get("category");
    const author = formData.get("author");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const timeToRead = +formData.get("timeToRead");
    const tags = JSON.parse(formData.get("tags"));
    const img = formData.get("img");


    const uploadDir = "/var/www/uploads";

    // ذخیره تامنیل پست
    const thumbnail = formData.get("thumbnail");
    if (!thumbnail || typeof thumbnail.arrayBuffer !== "function") {
      throw new Error("Thumbnail نامعتبر است یا ارسال نشده");
    }
    const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const thumbnailName = `${Date.now()}-${thumbnail.name}`;
    const thumbnailPath = path.join(uploadDir, thumbnailName);
    await writeFile(thumbnailPath, thumbnailBuffer);



    const article = await ArticleModel.create({
      title,
      slug,
      category,
      author,
      shortDescription,
      longDescription,
      timeToRead,
      tags,
      thumbnail: `/uploads/${thumbnailName}`,
    });

    return Response.json({ message: "مقاله با موفقیت ایجاد شد", article }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "خطای داخلی سرور", error: err }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB();
  const articles = await ArticleModel.find({}, "-__v").populate("comments");
  return Response.json(articles);
}
