// SingleArticlePage.js
"use client";

import LikeIcon from "@/utils/Like";
import Image from "next/image";
import { FaTags } from "react-icons/fa";
import { CiCalendar, CiUser, CiFolderOn, } from "react-icons/ci";


export default function ArticleHeader({ article }) {
  console.log("article", article);




  return (
    <div className="container grid grid-cols-1 lg:grid-cols-4 gap-8 my-10">
      {/* Content Right Side */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow">
        {/* Title */}
        <h1 className="text-3xl font-bold text-primary py-6">{article.title}</h1>
        <hr className="text-light-blue pb-4" />

        {/* Meta info */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <CiUser className="text-secondery w-5 h-5" />
            <span className="text-primary "> نویسنده : {article.author}</span>
            <CiCalendar className="text-secondery w-5 h-5" />
            <span className="text-primary">{new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CiFolderOn className="text-secondery w-5 h-5" />
            <span className="text-primary">{article.category}</span>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto">
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={1200}
            height={450}
            className="rounded-xl mb-6 w-full object-cover"
          />
        </div>


        {/* Content */}
        <div className="rich-text">
          <div dangerouslySetInnerHTML={{ __html: article.longDescription }} />
        </div>
        <hr className="text-light-blue mt-6" />

        {/* Footer */}
        <div className=" flex flex-wrap justify-between items-center py-4 gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <FaTags className="text-primary" />
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-light-blue text-primary px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xl text-primary">
            <LikeIcon />
          </div>
        </div>
      </div>

      {/* Sidebar Left */}
      <div className="lg:col-span-1">
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          {/* اطلاعات مقاله مرتبط */}
          <div className="flex items-start gap-3">
            <img
              src="/path/to/article-thumbnail.jpg"
              alt="article"
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex flex-col justify-start text-right">
              <h4 className="font-semibold text-sm text-primary">عنوان مقاله</h4>
              <p className="text-xs text-gray-500 mt-1">
                این یک توضیح کوتاه درباره مقاله است که حداکثر در دو خط نمایش داده می‌شود.
              </p>
            </div>
          </div>
          {/* دسته‌بندی و تاریخ */}
          <div className="flex justify-between text-xs text-gray-600">
            <span className="bg-light-blue text-primary px-2 py-0.5 rounded-full">
              دسته‌بندی: توسعه فردی
            </span>
            <span>1403/04/20</span>
          </div>
          <hr className="text-light-blue" />

        </div>
      </div>

    </div>
  );
}
