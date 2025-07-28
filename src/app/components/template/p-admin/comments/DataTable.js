"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal } from "@/utils/helpers";
import swal from "sweetalert";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DataTable({ comments, title }) {


  

  
  const router = useRouter();

  const showCommentBody = (body) => {
    showSwal(body, undefined, "خوندم");
  };
  const acceptComment = async (commentID) => {
    const res = await fetch("/api/comments/accept", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentID }),
    });

    if (res.status === 200) {
      swal("تایید شد", "کامنت با موفقیت تایید شد", "success").then(() =>
        router.refresh()
      );
    }
  };
  const deleteComment = async (commentID) => {
    const confirm = await swal({
      title: "آیا از حذف مطمئنی؟",
      icon: "warning",
      buttons: ["لغو", "حذف"],
      dangerMode: true,
    });

    if (confirm) {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentID }),
      });

      if (res.ok) {
        swal("حذف شد", "کامنت با موفقیت حذف شد", "success").then(() =>
          router.refresh()
        );
      }
    }
  };


  const rejectComment = async (commentID) => {
    const res = await fetch("/api/comments/reject", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentID }),
    });

    if (res.status === 200) {
      swal("رد شد", "کامنت با موفقیت رد شد", "success").then(() =>
        router.refresh()
      );
    }
  };

  return (
    <div className="p-6 bg-white backdrop-blur-md border border-white/40 rounded-xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 text-center">{title}</h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-[900px] w-full text-center border-collapse">
          <thead className="bg-primary text-white text-sm md:text-base">
            <tr>
              <th className="px-3 py-2">شناسه</th>
              <th className="px-3 py-2">کاربر</th>
              <th className="px-3 py-2">ایمیل</th>
              <th className="px-3 py-2">امتیاز</th>
              <th className="px-3 py-2">دوره</th>
              <th className="px-3 py-2">تاریخ</th>
              <th className="px-3 py-2">مشاهده</th>
              <th className="px-3 py-2">ویرایش</th>
              <th className="px-3 py-2">حذف</th>
              <th className="px-3 py-2">تایید / رد</th>
              <th className="px-3 py-2">پاسخ</th>
              <th className="px-3 py-2">بن</th>
            </tr>
          </thead>
          <tbody className="bg-white text-primary text-sm md:text-base">
            {comments.map((comment, index) => (
              <tr key={comment._id} className="border-b hover:bg-cream transition">
                <td className="px-3 py-2">
                  {comment.isAccept ? (
                    <FaCheck className="text-green-500 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-3 py-2">{comment.username}</td>
                <td className="px-3 py-2">{comment.email}</td>
                <td className="px-3 py-2">{comment.score}</td>
                <td className="px-3 py-2">{comment.CourseID?.title || "_"}</td>
                <td className="px-3 py-2">{new Date(comment.date).toLocaleDateString("fa-IR")}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => showCommentBody(comment.body)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                  >
                    مشاهده
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg">
                    ویرایش
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    حذف
                  </button>

                </td>
                <td className="px-3 py-2">
                  {comment.isAccept ? (
                    <button
                      onClick={() => rejectComment(comment._id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
                    >
                      رد
                    </button>
                  ) : (
                    <button
                      onClick={() => acceptComment(comment._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      تایید
                    </button>
                  )}
                </td>
                <td className="px-3 py-2">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg">
                    پاسخ
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-lg">
                    بن
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
