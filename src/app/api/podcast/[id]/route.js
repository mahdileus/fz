import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function PUT(req, { params }) {
  await connectToDB();

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "شناسه پادکست نامعتبر است!" }, { status: 422 });
  }

  const formData = await req.formData();

  const updatedData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    duration: formData.get("duration"),
    longDescription: formData.get("longDescription"),
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

  // ذخیره فایل‌ها در صورت ارسال فایل جدید
  const podcast = formData.get("podcast");
  const thumbnail = formData.get("thumbnail");

  const uploadsPath = "/var/www/uploads"

  const saveFile = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsPath, fileName);
    await writeFile(filePath, buffer);

    // مسیر public-facing برای فرانت‌اند
    return `/uploads/${fileName}`;
  };


  if (podcast && podcast.size > 0) {
    updatedData.podcast = await saveFile(podcast);
  }

  if (thumbnail && thumbnail.size > 0) {
    updatedData.thumbnail = await saveFile(thumbnail);
  }


  await PodcastModel.findByIdAndUpdate(id, updatedData);

  return NextResponse.json({ message: "پادکست با موفقیت بروزرسانی شد" }, { status: 200 });
}
export async function DELETE(req, { params }) {
  await connectToDB();

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "podcasy ID is not valid !!" },
      { status: 422 }
    );
  }

  try {
    await PodcastModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "podcast Removed Successfully :))" });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}