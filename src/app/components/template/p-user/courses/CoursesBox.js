"use client";

import LikeButton from "@/utils/Like";
import Image from "next/image";
import Link from "next/link";


export default function CourseCard({ usercourse }) {

    


  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full max-w-sm">
      {/* تصویر دوره + دکمه لایک */}
      <div className="relative w-full h-48">
        <Link href={`/course/${usercourse.course._id}`}>
          <Image
            src={usercourse.course.thumbnail}
            alt={usercourse.course.title}
            fill
            className="object-cover rounded-t-2xl"
          />
        </Link>
        <div className="absolute top-2 left-2 z-10">
          <LikeButton itemID={usercourse.course._id} itemType="course" />
        </div>
      </div>

      {/* محتوا */}
      <div className="p-4 flex flex-col gap-3 text-right">
        {/* عنوان لینک‌دار */}
        <Link href={`/course/${usercourse.course._id}`}>
          <h3 className="text-primary text-lg font-bold hover:text-secondery transition">
            {usercourse.course.title}
          </h3>
        </Link>

        {/* توضیح کوتاه */}
        <p className="text-sm text-gray-600 text-justify line-clamp-3">
          {usercourse.course.shortDescription}
        </p>

        {/* خط جداکننده */}
        <hr className="border-t border-gray-200 my-2" />

        {/* قیمت + امتیاز */}
        <div className="flex justify-between items-end">
            <Link href={`/course/${usercourse.course._id}`}>مشاهده دوره</Link>


        </div>
      </div>
    </div>
  );
}
