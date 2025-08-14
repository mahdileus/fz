"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import swal from "sweetalert";

export default function CourseChapters({ course = {}, isRegistered = false }) {
  const [open, setOpen] = useState(true);

  const toggleAccordion = () => {
    setOpen((prev) => !prev);
  };

  const handleLessonClick = (e) => {
    if (!isRegistered) {
      e.preventDefault();
      swal({
        title: "شما هنوز در این دوره ثبت‌نام نکرده‌اید!",
        text: "برای مشاهده جلسات ابتدا باید در دوره ثبت‌نام کنید.",
        icon: "warning",
        button: "باشه",
      });
    }
  };

  const lessons = course?.lessons || [];

  return (
    <section className="container">
      <div className="bg-white rounded-xl border border-gray-200 mt-10 shadow-sm">
        <h3 className="text-2xl font-bold text-primary px-6 pt-6">
          جلسات دوره {course?.title || ""}
        </h3>

        <div className="divide-y divide-gray-200">
          <div>
            <button
              onClick={toggleAccordion}
              className="w-full flex justify-between items-center px-6 py-4 text-right text-secondery font-semibold text-lg hover:bg-light-blue transition-all"
            >
              <span>مشاهده جلسات</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <ul className="bg-[#f5f7fa] px-8 py-4 space-y-3 text-sm text-gray-800">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <li key={lesson._id || lesson.title}>
                      <Link
                        href={`/course/${course?._id}/lesson/${lesson?._id}`}
                        className={`flex items-center gap-2 ${
                          isRegistered
                            ? "text-primary hover:underline cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleLessonClick}
                      >
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        <span>{lesson?.title || "بدون عنوان"}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">جلسه‌ای وجود ندارد</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
