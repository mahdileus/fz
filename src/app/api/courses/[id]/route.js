import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { authAdmin } from "@/utils/auth-server";
import { redirect } from "next/navigation";
import { spawn } from "child_process";
import fs from "fs";

export async function PUT(req, { params }) {
  await connectToDB();

  const isAdmin = await authAdmin();
  if (!isAdmin) redirect("/404");

  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "شناسه دوره نامعتبر است!" }, { status: 422 });
  }

  const formData = await req.formData();

  const updatedData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    price: +formData.get("price"),
    category: formData.get("category"),
    duration: +formData.get("duration"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription"),
    discountPercent: formData.get("discountPercent"),
    score: +formData.get("score") || 5,
    tags: JSON.parse(formData.get("tags") || "[]"),
  };

  const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
  const uploadsPath = path.join(process.cwd(), "public/uploads");

  const saveFile = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsPath, fileName);
    await writeFile(filePath, buffer);

    const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
    return `/${relativePath.replace(/\\/g, "/")}`;
  };

  const convertToHLS = async (videoPath, slug, index) => {
    const hlsFolder = path.join(process.cwd(), "public/uploads/hls", `${slug}-${index}`);
    if (!fs.existsSync(hlsFolder)) fs.mkdirSync(hlsFolder, { recursive: true });

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", videoPath,
        "-profile:v", "baseline",
        "-level", "3.0",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-f", "hls",
        path.join(hlsFolder, "playlist.m3u8")
      ]);

      ffmpeg.stdout.on("data", d => console.log(d.toString()));
      ffmpeg.stderr.on("data", d => console.log(d.toString()));
      ffmpeg.on("close", code => code === 0 ? resolve(true) : reject(new Error("FFmpeg failed")));
    });

    return `${DOMAIN}/uploads/hls/${slug}-${index}/playlist.m3u8`;
  };

  // فایل‌های اصلی
  const introVideo = formData.get("introVideo");
  const thumbnail = formData.get("thumbnail");

  if (introVideo && introVideo.size > 0) updatedData.introVideo = await saveFile(introVideo);
  if (thumbnail && thumbnail.size > 0) updatedData.thumbnail = await saveFile(thumbnail);

  // جلسات
  const lessonCount = parseInt(formData.get("lessonCount") || "0");
  const lessons = [];

  for (let i = 0; i < lessonCount; i++) {
    const lessonTitle = formData.get(`lessonTitle-${i}`);
    const lessonDescription = formData.get(`lessonDescription-${i}`);
    const lessonVideo = formData.get(`lessonVideo-${i}`);
    const lessonThumbnail = formData.get(`lessonThumbnail-${i}`);
    const lessonAudio = formData.get(`lessonAudio-${i}`);

    const lesson = { title: lessonTitle, description: lessonDescription };

    if (lessonVideo && lessonVideo.size > 0) {
      const videoPath = path.join(uploadsPath, `${Date.now()}-${lessonVideo.name}`);
      const buffer = Buffer.from(await lessonVideo.arrayBuffer());
      await writeFile(videoPath, buffer);
      lesson.video = await convertToHLS(videoPath, updatedData.slug, i);
    }

    if (lessonThumbnail && lessonThumbnail.size > 0) {
      lesson.thumbnail = await saveFile(lessonThumbnail);
    }
    if (lessonAudio && lessonAudio.size > 0) {
      lesson.audio = await saveFile(lessonAudio);
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
  if (!isAdmin) redirect("/404");

  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "شناسه دوره نامعتبر است!" }, { status: 422 });
  }

  try {
    await CourseModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "دوره با موفقیت حذف شد" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "خطای سرور داخلی", error: err.message }, { status: 500 });
  }
}
