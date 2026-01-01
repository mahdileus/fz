"use client";
import Image from "next/image";
import Link from "next/link";
import { CiCalendar } from "react-icons/ci";
import LikeButton from "@/utils/Like";

export default function ArticleCard({ post }) {
  if (!post) return null;

  const {
    _id,
    slug,
    title,
    thumbnail = "/images/default-thumbnail.jpg",
    shortDescription = "",
    author = "نامشخص",
    createdAt
  } = post;

  const date = createdAt ? new Date(createdAt) : new Date();
  const shamsiDate = date.toLocaleDateString("fa-IR");

  return (
<div className="bg-white rounded-2xl overflow-hidden shadow-md w-full max-w-sm h-105 flex flex-col">
  <div className="relative w-full h-48">
    <Link href={`/post/${slug}`}>
      <Image
        src={thumbnail}
        alt={title || "thumbnail"}
        fill
        className="object-cover rounded-t-2xl"
      />
    </Link>
    <div className="absolute top-2 left-2 z-10">
      <LikeButton itemID={_id} itemType="article" />
    </div>
  </div>

  <div className="p-4 flex flex-col justify-between flex-1 text-right">
    <div>
      <Link href={`/post/${slug}`}>
        <h3 className="text-primary text-lg font-bold leading-snug hover:text-secondery transition line-clamp-2">
          {title}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 leading-relaxed text-justify line-clamp-3 mt-2" dangerouslySetInnerHTML={{ __html: shortDescription }} />
    </div>

    <div>
      <div className="flex items-center justify-between text-secondery text-sm mt-3">
        <div className="flex items-center gap-1">
          <CiCalendar size={16} />
          <span>{shamsiDate}</span>
        </div>
        <span className="text-xs text-primary font-medium">
          نویسنده: {author}
        </span>
      </div>

      <hr className="border-t border-gray-200 my-3" />

      <div className="flex justify-center">
        <Link href={`/post/${slug}`} className="text-sm text-secondery hover:text-[#2c5e95] transition">
          مطالعه مقاله
        </Link>
      </div>
    </div>
  </div>
</div>

  );
}
