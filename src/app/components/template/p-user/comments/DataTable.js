"use client";
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { showSwal } from "@/utils/helpers";

export default function DataTable({ comments, title }) {
  const showCommentBody = (commentBody) => {
    showSwal(commentBody, undefined, "اوکی");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold border-b-2 border-gray-200 pb-3 text-gray-800">
          {title}
        </h1>
      </div>

      {/* دسکتاپ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-base text-right rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th className="py-4 px-5 border-b">#</th>
              <th className="py-4 px-5 border-b">تاریخ</th>
              <th className="py-4 px-5 border-b">عنوان دوره</th>
              <th className="py-4 px-5 border-b">امتیاز</th>
              <th className="py-4 px-5 border-b">وضعیت</th>
              <th className="py-4 px-5 border-b">مشاهده</th>
            </tr>
          </thead>
          <tbody className="border-b">
            {comments.map((comment, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="py-3 px-5 ">{index + 1}</td>
                <td className="py-3 px-5 text-primary ">
                  {new Date(comment.date).toLocaleDateString("fa-IR")}
                </td>
                <td className="py-3 px-5 text-primary">
                  {comment.CourseID?.title || "—"}
                </td>
                <td className="py-3 px-5 flex items-center gap-1">
                  {Array(comment.score)
                    .fill(0)
                    .map((_, idx) => (
                      <FaStar key={idx} className="text-yellow-400" />
                    ))}
                  {Array(5 - comment.score)
                    .fill(0)
                    .map((_, idx) => (
                      <FaRegStar key={idx} className="text-gray-300" />
                    ))}
                </td>
                <td className="py-3 px-5">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-bold ${
                      comment.isAccept
                        ? "bg-primary text-cream"
                        : "bg-light-blue text-primary"
                    }`}
                  >
                    {comment.isAccept ? "تایید شده" : "در انتظار تأیید"}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <button
                    onClick={() => showCommentBody(comment.body)}
                    className="text-secondery hover:underline font-medium"
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* موبایل */}
      <div className="block md:hidden space-y-5">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 shadow-md bg-gray-50"
          >
            <div className="text-base font-semibold text-gray-700 mb-2">
              شناسه: <span className="font-normal">{index + 1}</span>
            </div>
            <div className="text-base text-gray-700 mb-2">
              تاریخ:{" "}
              <span className="font-medium">
                {new Date(comment.date).toLocaleDateString("fa-IR")}
              </span>
            </div>
            <div className="text-base text-gray-700 mb-2">
              دوره:{" "}
              <span className="font-medium">
                {comment.CourseID?.title || "—"}
              </span>
            </div>
            <div className="text-base text-gray-700 mb-2 flex items-center gap-1">
              امتیاز:
              {Array(comment.score)
                .fill(0)
                .map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400" />
                ))}
              {Array(5 - comment.score)
                .fill(0)
                .map((_, idx) => (
                  <FaRegStar key={idx} className="text-gray-300" />
                ))}
            </div>
            <div className="text-base text-gray-700 mb-3">
              وضعیت:{" "}
              <span
                className={`px-2 py-1 text-sm rounded-full font-bold ${
                  comment.isAccept
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {comment.isAccept ? "تایید شده" : "در انتظار تأیید"}
              </span>
            </div>
            <div>
              <button
                onClick={() => showCommentBody(comment.body)}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                مشاهده کامنت
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
