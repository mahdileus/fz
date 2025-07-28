"use client";

import { FaStar } from "react-icons/fa";
import { CiWifiOn } from "react-icons/ci";
import { GiBrain } from "react-icons/gi";
import { PiInfinityThin } from "react-icons/pi";



export default function CourseInfoBoxes({category}) {
  const infoBoxes = [
    {
      icon: <FaStar className="text-yellow-400 text-3xl" />,
      label: "امتیاز دوره",
      value: "۴.۹ از ۵",
    },
    {
      icon: <CiWifiOn className="text-secondery text-4xl" />,
      label: "نوع مشاهده",
      value: "آنلاین",
    },
    {
      icon: <GiBrain className="text-secondery text-4xl" />,
      label: "دسته بندی دوره",
      value: category,
    },
    {
      icon: <PiInfinityThin className="text-secondery text-4xl" />,
      label: "دسترسی",
      value: "دائم + آپدیت رایگان",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {infoBoxes.map((box, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center border border-[#DBE2EF]"
        >
          {box.icon}
          <p className="text-sm text-gray-600 mt-2">{box.label}</p>
          <p className="text-base font-bold text-[#112D4E]">{box.value}</p>
        </div>
      ))}
    </section>
  );
}
