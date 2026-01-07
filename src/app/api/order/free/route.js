import { NextResponse } from "next/server";
import User from "@/models/User";
import Course from "@/models/Course";
import UserCourse from "@/models/UserCourse";
import connectToDB from "@/configs/db";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    console.log("FREE ORDER BODY:", body);

    const { userId, items } = body; // <--- اضافه شد

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    const courseIds = items.map(item => typeof item === "string" ? item : item._id);

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (!courses.length) return NextResponse.json({ message: "دوره‌ای یافت نشد" }, { status: 404 });

    for (const course of courses) {
      const exists = await UserCourse.findOne({ user: userId, course: course._id });
      if (!exists) {
        await UserCourse.create({ user: userId, course: course._id });
      }
    }

    return NextResponse.json({ success: true, message: "ثبت‌نام در دوره‌های رایگان با موفقیت انجام شد" });

  } catch (err) {
    console.error("FREE ORDER ERROR:", err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}

