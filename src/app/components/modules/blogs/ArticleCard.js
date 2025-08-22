"use client"
import Image from "next/image";
import Link from "next/link";
import { CiCalendar } from "react-icons/ci";
import LikeButton from "@/utils/Like";


export default function ArticleCard({ post }) {
  const { title, createdAt, thumbnail, _id, shortDescription, author, category, slug } = post

  const createdAts = new Date(createdAt); // یا هر مسیری که props داره
  const shamsiDate = createdAts.toLocaleDateString("fa-IR");
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md w-full max-w-sm">
      {/* تصویر مقاله + دکمه لایک */}
      <div className="relative w-full h-48">
        <Link href={`/articles/${slug}`}>
          <Image
            src={thumbnail}
            alt="Article Thumbnail"
            fill
            className="object-cover rounded-t-2xl"
          />
        </Link>
        <div className="absolute top-2 left-2 z-10">
          <LikeButton itemID={_id} itemType="article" />
            </div>
      </div>

      {/* محتوا */}
      <div className="p-4 flex flex-col gap-3 text-right">
        {/* عنوان لینک‌دار */}
        <Link href={`/articles/${slug}`}>
          <h3 className="text-[#112D4E] text-lg font-bold leading-snug hover:text-[#3F72AF] transition">
            {title}
          </h3>
        </Link>

        {/* توضیح بلند */}
        <p className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-3">
          {
            shortDescription
          }
        </p>

        {/* تاریخ + نویسنده */}
        <div className="flex items-center justify-between text-[#3F72AF] text-sm mt-1">
          <div className="flex items-center gap-1">
            <CiCalendar size={16} />
            <span>{shamsiDate}</span>
          </div>
          <span className="text-xs text-[#112D4E] font-medium">نویسنده: {author}</span>
        </div>

        {/* خط جداکننده */}
        <hr className="border-t border-gray-200 my-3" />

        {/* دکمه مطالعه - پایین و وسط */}
        <div className="flex justify-center">
          <Link
            href={`/articles/${slug}`}
            className="text-sm text-[#3F72AF] hover:text-[#2c5e95] transition"
          >
            مطالعه مقاله
          </Link>
        </div>
      </div>
    </div>
  );
}