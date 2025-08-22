import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";
import { authAdmin } from "@/utils/auth-server";
import { writeFile } from "fs/promises";
import { redirect } from "next/navigation";
import slugify from "slugify";
import path from "path";

export async function POST(req) {
  try {
    const isAdmin = await authAdmin();

    if (!isAdmin) {
      redirect("/404")
    }
    await connectToDB();

    const formData = await req.formData();

    // دریافت فیلدهای اصلی دوره
    const title = formData.get("title");
    const slug = slugify(formData.get("slug"), { lower: true, strict: true });
    const price = +formData.get("price");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const discountPercent = formData.get("discountPercent");
    const category = formData.get("category");
    const duration = +formData.get("duration");
    const score = +formData.get("score") || 5;
    const tags = JSON.parse(formData.get("tags") || "[]");

    // ذخیره تامنیل دوره
    const thumbnail = formData.get("thumbnail");
    const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const thumbnailName = `${Date.now()}-${thumbnail.name}`;
    const thumbnailPath = path.join(process.cwd(), "public/uploads", thumbnailName);
    await writeFile(thumbnailPath, thumbnailBuffer);

    // ذخیره ویدیوی معرفی
    const introVideo = formData.get("introVideo");
    const introBuffer = Buffer.from(await introVideo.arrayBuffer());
    const introName = `${Date.now()}-${introVideo.name}`;
    const introPath = path.join(process.cwd(), "public/uploads", introName);
    await writeFile(introPath, introBuffer);
    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

    // جلسات را بخوان
    const lessonCount = +formData.get("lessonCount") || 0;
    const lessons = [];

    for (let i = 0; i < lessonCount; i++) {
      const lessonTitle = formData.get(`lessonTitle-${i}`);
      const lessonVideo = formData.get(`lessonVideo-${i}`);
      const lessonThumbnail = formData.get(`lessonThumbnail-${i}`);
      const lessonDescription = formData.get(`lessonDescription-${i}`);
      const lessonAudio = formData.get(`lessonAudio-${i}`);

      // ذخیره ویدیو جلسه
      const lessonVideoBuffer = Buffer.from(await lessonVideo.arrayBuffer());
      const lessonVideoName = `${Date.now()}-${lessonVideo.name}`;
      const lessonVideoPath = path.join(process.cwd(), "public", "uploads", lessonVideoName);
      await writeFile(lessonVideoPath, lessonVideoBuffer);

      // ذخیره تامنیل جلسه
      const lessonThumbBuffer = Buffer.from(await lessonThumbnail.arrayBuffer());
      const lessonThumbName = `${Date.now()}-${lessonThumbnail.name}`;
      const lessonThumbPath = path.join(process.cwd(), "public", "uploads", lessonThumbName);
      await writeFile(lessonThumbPath, lessonThumbBuffer);
      //audio
      const lessonAudioBuffer = Buffer.from(await lessonAudio.arrayBuffer());
      const lessonAudioName = `${Date.now()}-${lessonAudio.name}`;
      const lessonAudioPath = path.join(process.cwd(), "public", "uploads", lessonAudioName);
      await writeFile(lessonAudioPath, lessonAudioBuffer);

      lessons.push({
        title: lessonTitle,
        description: lessonDescription,
        video: `${DOMAIN}/uploads/${lessonVideoName}`,
        thumbnail: `${DOMAIN}/uploads/${lessonThumbName}`,
        audio: `${DOMAIN}/uploads/${lessonAudioName}`,

      });
    }

    // ساخت دوره در دیتابیس
    const newCourse = await CourseModel.create({
      title,
      slug,
      price,
      category,
      duration,
      discountPercent,
      shortDescription,
      longDescription,
      score,
      tags,
      thumbnail: `/uploads/${thumbnailName}`,
      introVideo: `/uploads/${introName}`,
      lessons,
    });

    return Response.json({ message: "دوره با موفقیت ایجاد شد", data: newCourse }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "خطا در ایجاد دوره", message: err.message }, { status: 500 });
  }
}


export async function GET() {
  const isAdmin = await authAdmin();

  if (!isAdmin) {
    redirect("/404")
  }
  const courses = await CourseModel.find({}, "-__v").populate("comments");
  return Response.json(courses);
}

