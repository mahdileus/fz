"use client";

import LikeButton from "@/utils/Like";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function CourseCard({ course, isRegistered }) {
  const discount = course.discountPercent || 0; // درصد تخفیف یا صفر
  const price = course.price || 0;
  // محاسبه قیمت نهایی با تخفیف
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-full max-w-sm">
      {/* تصویر دوره + دکمه لایک */}
      <div className="relative w-full h-48">
        <Link href={`/course/${course._id}`}>
          <Image
            src={course.thumbnail}
            alt={course.title}
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
        <p className="text-sm text-gray-600 text-justify line-clamp-3">
          {course.shortDescription}
        </p>

        {/* خط جداکننده */}
        <hr className="border-t border-gray-200 my-2" />

        {/* قیمت یا دکمه */}
        <div className="flex justify-between items-center">
          {isRegistered ? (
            <Link
              href={`/course/${course._id}`} // یا هر لینک مناسب برای مشاهده دوره
              className="bg-primary hover:bg-primary/90 text-white cursor-pointer px-4 py-2 rounded-lg transition"
            >
              مشاهده دوره
            </Link>
          ) : (
            <div className="flex flex-col items-start gap-1 text-sm text-primary">
              {discount > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white bg-secondery px-2 py-0.5 rounded-full">
                      {discount}٪
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                      {price.toLocaleString()} تومان
                    </span>
                  </div>
                  <span className="text-base font-bold">
                    {discountedPrice.toLocaleString()} تومان
                  </span>
                </>
              ) : (
                <span className="text-base font-bold">
                  {price.toLocaleString()} تومان
                </span>
              )}
            </div>
          )}

          {/* امتیاز سمت راست */}
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <FaStar size={14} />
            <span className="text-[#3F72AF] font-medium">
              {course.score?.toFixed(1) || "۴.۷"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
