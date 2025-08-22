import { CiTimer } from "react-icons/ci";
import { IoIosArrowRoundBack } from "react-icons/io";
import LikeButton from "@/utils/Like";
import Link from "next/link";
import Image from "next/image";

export default function PodcastBox({ podcast }) {
  const { title, tags, duration, thumbnail, _id, slug } = podcast
  return (
    <>
      {/* باکس اصلی */}
      <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 max-w-md">

        {/* محتوای داخل باکس */}
        <div className="flex justify-between items-center">
          {/* تگ‌ها */}
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

          {/* زمان و لایک */}
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <CiTimer className="w-5 h-5 text-secondery" />
              <span className="text-primary text-sm">{duration} دقیقه</span>
            </div>
            <div className="flex items-center gap-1 ">
              <LikeButton itemID={_id} itemType="podcast" />
            </div>
          </div>
        </div>

        {/* عنوان */}
        <Link href={`/podcast/${slug}`}>
          <h3 className="text-primary text-lg font-bold hover:text-secondery transition">
            {title}
          </h3>
        </Link>

        {/* خط جداکننده */}
        <hr className="border-t border-light-blue" />
        {/* دکمه مشاهده */}
        <Link href={`/podcast/${slug}`} className="flex items-center gap-1 text-sm text-primary transition mt-2">
          مشاهده پادکست
          <IoIosArrowRoundBack className="text-secondery w-7 h-7" />
        </Link>

        {/* عکس تامنیل - گوشه پایین چپ با بیرون‌زدگی از باکس */}
        <div className="absolute -bottom-6 -left-6 z-10 w-[108px] h-[108px] rounded-xl overflow-hidden">
          <Image
            src={thumbnail}
            alt="Podcast"
            fill
            style={{ objectFit: "cover" }}
          />

        </div>
      </div>
    </>
  );
}