import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { authAdmin } from "@/utils/auth-server";
import { redirect } from "next/navigation";

export async function PUT(req, { params }) {
  await connectToDB();

  const isAdmin = await authAdmin();

  if (!isAdmin) {
    redirect("/404")
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "شناسه دوره نامعتبر است!" }, { status: 422 });
  }

  const formData = await req.formData();

  const updatedData = {
    title: formData.get("title"),
    price: formData.get("price"),
    category: formData.get("category"),
    duration: formData.get("duration"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription"),
    discountPercent: formData.get("discountPercent"),
    score: 5,
    tags: JSON.parse(formData.get("tags") || "[]"),
  };

  // ذخیره فایل‌ها در صورت ارسال فایل جدید
  const introVideo = formData.get("introVideo");
  const thumbnail = formData.get("thumbnail");
  const audio = formData.get("audio")

  const uploadsPath = path.join(process.cwd(), "public", "uploads");

  const saveFile = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsPath, fileName);
    await writeFile(filePath, buffer);

    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    return `/${relativePath.replace(/\\/g, "/")}`;  // برای ویندوز: \ → /
  };


  if (introVideo && introVideo.size > 0) {
    updatedData.introVideo = await saveFile(introVideo);
  }

  if (thumbnail && thumbnail.size > 0) {
    updatedData.thumbnail = await saveFile(thumbnail);
  }
  if (audio && audio.size > 0) {
    updatedData.audio = await saveFile(audio);
  }

  // دریافت و ذخیره جلسات
  const lessonCount = parseInt(formData.get("lessonCount") || "0");
  const lessons = [];

  for (let i = 0; i < lessonCount; i++) {
    const title = formData.get(`lessonTitle-${i}`);
    const video = formData.get(`lessonVideo-${i}`);
    const thumbnail = formData.get(`lessonThumbnail-${i}`);
    const description = formData.get(`lessonDescription-${i}`);
    const audio = formData.get(`lessonAudio-${i}`);

    const lesson = { title, description };

    if (video && video.size > 0) {
      lesson.video = await saveFile(video);
    }

    if (thumbnail && thumbnail.size > 0) {
      lesson.thumbnail = await saveFile(thumbnail);
    }
    if (audio && audio.size > 0) {
      lesson.audio = await saveFile(audio);
    }

    lessons.push(lesson);
  }

  updatedData.lessons = lessons;

  await CourseModel.findByIdAndUpdate(id, updatedData);

  return NextResponse.json({ message: "دوره با موفقیت بروزرسانی شد" }, { status: 200 });
}
export async function DELETE(req, { params }) {

  await connectToDB();
  const isAdmin = await authAdmin();

  if (!isAdmin) {
    redirect("/404")
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: "Course ID is not valid !!" },
      { status: 422 }
    );
  }

  try {
    await CourseModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Course Removed Successfully :))" });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}