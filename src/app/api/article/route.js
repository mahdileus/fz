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


    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${Date.now()}-${img.name}`;
    const filePath = path.join(process.cwd(), "public","uploads", filename);
    await writeFile(filePath, buffer);



    const article = await ArticleModel.create({
      title,
      slug,
      category,
      author,
      shortDescription,
      longDescription,
      timeToRead,
      tags,
      thumbnail: `${DOMAIN}/uploads/${filename}`,
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
