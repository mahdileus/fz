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

    // فیلدهای سئو جدید
    const metaTitle = formData.get("metaTitle") || title;  // default to title
    const metaDescription = formData.get("metaDescription") || shortDescription;  // default to shortDescription
    const metaKeywords = formData.get("metaKeywords") ? JSON.parse(formData.get("metaKeywords")) : tags;  // default to tags
    const canonicalUrl = formData.get("canonicalUrl") || `/posts/${slug}`;  // default to /posts/slug
    const seoSchema = formData.get("seoSchema") ? JSON.parse(formData.get("seoSchema")) : {};  // default to empty object
    const viewCount = +formData.get("viewCount") || 0;  // default 0
    const isPublished = formData.get("isPublished") === "true";  // boolean from form

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
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      seoSchema,
      viewCount,
      isPublished,
    });

    return Response.json({ message: "مقاله با موفقیت ایجاد شد", article }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB();
  const articles = await ArticleModel.find({}, "-__v").populate("comments");
  return Response.json(articles);
}