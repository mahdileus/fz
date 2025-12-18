import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import slugify from "slugify";

export const config = {
  api: {
    bodyParser: false,  // اضافه: برای multipart/form-data (آپلود فایل) لازمه
  },
};

export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "شناسه مقاله نامعتبر است!" }, { status: 422 });
    }

    const formData = await req.formData();

    const updatedData = {
      title: formData.get("title"),
      slug: slugify(formData.get("slug") || '', { lower: true, strict: true }),  // اضافه: دوباره slugify اگر تغییر داد
      category: formData.get("category"),
      author: formData.get("author"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
      timeToRead: +formData.get("timeToRead"),
      tags: JSON.parse(formData.get("tags") || "[]"),
      // فیلدهای سئو جدید
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      metaKeywords: formData.get("metaKeywords") ? JSON.parse(formData.get("metaKeywords")) : undefined,
      canonicalUrl: formData.get("canonicalUrl"),
      seoSchema: formData.get("seoSchema") ? JSON.parse(formData.get("seoSchema")) : undefined,
      viewCount: +formData.get("viewCount"),
      isPublished: formData.get("isPublished") === "true",
    };

    const uploadsPath = "/var/www/uploads";

    const saveFile = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsPath, fileName);
      await writeFile(filePath, buffer);
      return `/uploads/${fileName}`;
    };

    const thumbnail = formData.get("thumbnail");
    if (thumbnail && thumbnail.size > 0) {
      updatedData.thumbnail = await saveFile(thumbnail);
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(id, updatedData, { new: true });

    return NextResponse.json({ message: "مقاله با موفقیت بروزرسانی شد", article: updatedArticle }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "شناسه مقاله نامعتبر است!" }, { status: 422 });
    }

    await ArticleModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "مقاله با موفقیت حذف شد" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}