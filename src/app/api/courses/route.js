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
    const isFree = formData.get("isFree") === "true";
    const tags = JSON.parse(formData.get("tags") || "[]");

    const uploadDir = "/var/www/uploads";

    // ذخیره تامنیل دوره
    const thumbnail = formData.get("thumbnail");
    if (!thumbnail || typeof thumbnail.arrayBuffer !== "function") {
      throw new Error("Thumbnail نامعتبر است یا ارسال نشده");
    }
    const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const thumbnailName = `${Date.now()}-${thumbnail.name}`;
    const thumbnailPath = path.join(uploadDir, thumbnailName);
    await writeFile(thumbnailPath, thumbnailBuffer);

    // ذخیره ویدیوی معرفی
    const introVideo = formData.get("introVideo");
    if (!introVideo || typeof introVideo.arrayBuffer !== "function") {
      throw new Error("Intro video نامعتبر است یا ارسال نشده");
    }
    const introBuffer = Buffer.from(await introVideo.arrayBuffer());
    const introName = `${Date.now()}-${introVideo.name}`;
    const introPath = path.join(uploadDir, introName);
    await writeFile(introPath, introBuffer);

    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

    // تعداد جلسات
    let lessonCount = 0;
    try {
      lessonCount = parseInt(formData.get("lessonCount") || "0", 10);
    } catch (e) {
      lessonCount = 0;
    }

    const lessons = [];

    // اگر تعداد > 0 بود برو سراغ حلقه
    if (lessonCount > 0) {
      for (let i = 0; i < lessonCount; i++) {
        const lessonVideo = formData.get(`lessonVideo-${i}`);
        const lessonThumbnail = formData.get(`lessonThumbnail-${i}`);
        const lessonAudio = formData.get(`lessonAudio-${i}`);
        const practiceAudio = formData.get(`practiceAudio-${i}`);
        const practice = formData.get(`practice-${i}`);


        if (!lessonVideo || typeof lessonVideo.arrayBuffer !== "function") {
          throw new Error(`Lesson video ${i} نامعتبر است یا ارسال نشده`);
        }
        const lessonVideoBuffer = Buffer.from(await lessonVideo.arrayBuffer());
        const lessonVideoName = `${Date.now()}-${lessonVideo.name}`;
        const lessonVideoPath = path.join("/var/www/uploads", lessonVideoName);
        await writeFile(lessonVideoPath, lessonVideoBuffer);

        if (!lessonThumbnail || typeof lessonThumbnail.arrayBuffer !== "function") {
          throw new Error(`Lesson thumbnail ${i} نامعتبر است یا ارسال نشده`);
        }
        const lessonThumbBuffer = Buffer.from(await lessonThumbnail.arrayBuffer());
        const lessonThumbName = `${Date.now()}-${lessonThumbnail.name}`;
        const lessonThumbPath = path.join("/var/www/uploads", lessonThumbName);
        await writeFile(lessonThumbPath, lessonThumbBuffer);

        let lessonAudioName = null;
        if (lessonAudio && typeof lessonAudio.arrayBuffer === "function") {
          const lessonAudioBuffer = Buffer.from(await lessonAudio.arrayBuffer());
          lessonAudioName = `${Date.now()}-${lessonAudio.name}`;
          const lessonAudioPath = path.join("/var/www/uploads", lessonAudioName);
          await writeFile(lessonAudioPath, lessonAudioBuffer);
        }
        let lessonPracticeAudioName = null;
        if (practiceAudio && typeof practiceAudio.arrayBuffer === "function") {
          const practiceAudioBuffer = Buffer.from(await practiceAudio.arrayBuffer());
          lessonPracticeAudioName = `${Date.now()}-${practiceAudio.name}`;
          const lessonPracticePath = path.join("/var/www/uploads", lessonPracticeAudioName);
          await writeFile(lessonPracticePath, practiceAudioBuffer);
        }
        let lessonPracticeName = null;
        if (practice && typeof practice.arrayBuffer === "function") {
          const lessonPracticeBuffer = Buffer.from(await practice.arrayBuffer());
          lessonPracticeName = `${Date.now()}-${practice.name}`;
          const lessonPracticePath = path.join("/var/www/uploads", lessonPracticeName);
          await writeFile(lessonPracticePath, lessonPracticeBuffer);
        }

        lessons.push({
          title: formData.get(`lessonTitle-${i}`),
          description: formData.get(`lessonDescription-${i}`),
          video: `${DOMAIN}/uploads/${lessonVideoName}`,
          thumbnail: `${DOMAIN}/uploads/${lessonThumbName}`,
          audio: lessonAudioName ? `${DOMAIN}/uploads/${lessonAudioName}` : null,
          practiceAudios: lessonPracticeAudioName ? `${DOMAIN}/uploads/${lessonPracticeAudioName}` : null,
          practices: lessonPracticeName ? `${DOMAIN}/uploads/${lessonPracticeName}` : null,

        });
      }
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
      isFree,
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

