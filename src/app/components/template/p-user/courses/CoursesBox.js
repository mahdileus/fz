"use client";

import LikeButton from "@/utils/Like";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ usercourse }) {
  // اطمینان از وجود usercourse و course
  const course = usercourse?.course;
  if (!course?._id) {
    // اگر course خالی یا null باشه، چیزی رندر نشه
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full max-w-sm">
      {/* تصویر دوره + دکمه لایک */}
      <div className="relative w-full h-48">
        <Link href={`/course/${course._id}`}>
          <Image
            src={course.thumbnail || "/default-course.jpg"} // تصویر پیش‌فرض در صورت نبود thumbnail
            alt={course.title || "Course"}
            fill
            className="object-cover rounded-t-2xl"
          />
        </Link>
        <div className="absolute top-2 left-2 z-10">
          <LikeButton itemID={course._id} itemType="course" />
        </div>
      </div>

      {/* محتوا */}
      <div className="p-4 flex flex-col gap-3 text-right">
        {/* عنوان لینک‌دار */}
        <Link href={`/course/${course._id}`}>
          <h3 className="text-primary text-lg font-bold hover:text-secondery transition">
            {course.title}
          </h3>
        </Link>

        {/* توضیح کوتاه */}
        {course.shortDescription && (
          <p className="text-sm text-gray-600 text-justify line-clamp-3">
            {course.shortDescription}
          </p>
        )}

        <hr className="border-t border-gray-200 my-2" />

        {/* دکمه مشاهده */}
        <div className="flex justify-between items-end">
          <Link href={`/course/${course._id}`}>مشاهده دوره</Link>
        </div>
      </div>
    </div>
  );
}
