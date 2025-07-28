"use client";
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { showSwal } from "@/utils/helpers";

export default function DataTable({ comments, title }) {
  console.log("comments",comments);
  
    
  const showCommentBody = (commentBody) => {
    showSwal(commentBody, undefined, "اوکی");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold border-b pb-2">{title}</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">شناسه</th>
              <th className="py-3 px-4 border-b">تاریخ</th>
              <th className="py-3 px-4 border-b">محصول</th>
              <th className="py-3 px-4 border-b">امتیاز</th>
              <th className="py-3 px-4 border-b">وضعیت</th>
              <th className="py-3 px-4 border-b">مشاهده</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(comment.date).toLocaleDateString("fa-IR")}
                </td>
                <td className="py-2 px-4 border-b">
                  {comment.CourseID?.title || "—"}
                </td>
                <td className="py-2 px-4 border-b flex items-center gap-1">
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
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      comment.isAccept
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {comment.isAccept ? "تایید شده" : "در انتظار تایید"}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => showCommentBody(comment.body)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
