import connectToDB from "@/configs/db";
import ArticleModel from "@/models/Article";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function PUT(req, { params }) {
  await connectToDB();

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "شناسه مقاله نامعتبر است!" }, { status: 422 });
  }

  const formData = await req.formData();

  const updatedData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    author: formData.get("author"),
    category: formData.get("category"),
    timeToRead: formData.get("timeToRead"),
    longDescription: formData.get("longDescription"),
    shortDescription: formData.get("shortDescription"),
    tags: JSON.parse(formData.get("tags") || "[]"),
  };

  // ذخیره فایل‌ها در صورت ارسال فایل جدید
  const thumbnail = formData.get("thumbnail");

const uploadsPath = path.join(process.cwd(), "public", "uploads");

const saveFile = async (file) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsPath, fileName);
  await writeFile(filePath, buffer);

  const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
  return `/${relativePath.replace(/\\/g, "/")}`;  // برای ویندوز: \ → /
};

  if (thumbnail && thumbnail.size > 0) {
    updatedData.thumbnail = await saveFile(thumbnail);
  }


  await ArticleModel.findByIdAndUpdate(id, updatedData);

  return NextResponse.json({ message: "مقاله با موفقیت بروزرسانی شد" }, { status: 200 });
}
export async function DELETE(req, { params }) {
  await connectToDB();

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "article ID is not valid !!" },
      { status: 422 }
    );
  }

  try {
    await ArticleModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "article Removed Successfully :))" });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}