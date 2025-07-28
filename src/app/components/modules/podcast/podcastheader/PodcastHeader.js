"use client";

import { CiTimer } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";
import PodcastPlayer from "../PodcastPlayer/PodcastPlayer";
import Image from "next/image";
import LikeButton from "@/utils/Like";

export default function PodcastSingle({ podcast }) {
  return (
    <section className="container py-10 flex flex-col gap-8">

      {/* باکس اصلی سفید شامل اطلاعات اولیه */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 w-full relative aspect-[16/9]">
          <Image
            src={podcast.thumbnail}
            alt={podcast.title}
            fill
            className="rounded-2xl object-cover shadow"
          />
        </div>


        {/* محتوا */}
        <div className="md:w-1/2 w-full flex flex-col justify-between gap-6">
          {/* تگ‌ها */}
          <div className="flex flex-wrap gap-2">
            {podcast.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-light-blue text-primary px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* عنوان و دکمه‌ها */}
          <div className="flex justify-between items-start flex-wrap gap-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-snug">
              {podcast.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-secondery">
                <CiTimer className="w-5 h-5" />
                <span>{podcast.duration}دقیقه </span>
              </div>

              <LikeButton itemID={podcast._id} itemType="podcast" />

              <button className="text-primary text-sm bg-light-blue px-3 py-1.5 rounded-xl hover:bg-secondery hover:text-white transition flex items-center gap-1">
                <IoIosShareAlt className="text-lg" />
                اشتراک‌گذاری
              </button>
            </div>
          </div>

          {/* پلیر وسط */}
          <div className="w-full mt-6 flex justify-center">
            <div className="w-full md:w-4/5">
              <PodcastPlayer src={podcast.podcast} />
            </div>
          </div>
        </div>
      </div>
      {/* لایه بیرونی آبی لایت */}
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        {/* باکس توضیحات سفید داخلش */}
        <div className="bg-light-blue text-primary p-6 md:p-8 rounded-2xl shadow-md leading-relaxed text-sm md:text-base">
          <h1 className="text-2xl py-4 md:text-3xl font-bold text-primary ">
            {podcast.title}
          </h1>
        <div className="rich-text">
          <div dangerouslySetInnerHTML={{ __html: podcast.longDescription }} />
        </div>
        </div>
      </div>
    </section>
  );
}
