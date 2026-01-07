import { CiTimer } from "react-icons/ci";
import { IoIosArrowRoundBack } from "react-icons/io";
import LikeButton from "@/utils/Like";
import Link from "next/link";
import Image from "next/image";

export default function PodcastBox({ podcast }) {

  if (!podcast) return null; // جلو کرش

  const { _id, slug, title, duration, tags, thumbnail } = podcast;

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 max-w-md">

      {/* بالا → تگ‌ها + تایم + لایک */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-light-blue text-primary px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <CiTimer className="w-5 h-5 text-secondery" />
            <span className="text-primary text-sm">{duration ?? 0} دقیقه</span>
          </div>

          <LikeButton itemID={_id} itemType="podcast" />
        </div>
      </div>

      {/* عنوان */}
      <Link href={`/podcast/${slug}`}>
        <h3 className="text-primary text-lg font-bold hover:text-secondery transition line-clamp-1">
          {title}
        </h3>
      </Link>

      <hr className="border-t border-light-blue" />

      {/* دکمه مشاهده */}
      <Link
        href={`/podcast/${slug}`}
        className="flex items-center gap-1 text-sm text-primary transition mt-2"
      >
        مشاهده پادکست
        <IoIosArrowRoundBack className="text-secondery w-7 h-7" />
      </Link>

      {/* تامنیل */}
      {thumbnail && (
        <div className="absolute -bottom-6 -left-6 z-10 w-27 h-27 rounded-xl overflow-hidden">
          <Image
            src={
              thumbnail?.startsWith("http")
                ? thumbnail
                : `https://firouzehjavaherian.com${thumbnail}`
              }
            alt={title || "thumbnail"}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
