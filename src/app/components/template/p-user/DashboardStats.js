"use client";
import {
  CiBellOn,
  CiChat2,
  CiVideoOn,
  CiCircleQuestion,
} from "react-icons/ci";

const stats = [
  {
    icon: <CiVideoOn className="w-8 h-8 text-primary" />,
    label: "دوره",
    value: 8,
    title: "درحال یادگیری",
  },
  {
    icon: <CiChat2 className="w-8 h-8 text-primary" />,
    label: "نظر",
    value: 15,
    title: "نظرات من",
  },
  {
    icon: <CiCircleQuestion className="w-8 h-8 text-primary" />,
    label: "پرسش",
    value: 4,
    title: "پرسش‌های من",
  },
  {
    icon: <CiBellOn className="w-8 h-8 text-primary" />,
    label: "اعلان",
    value: 2,
    title: "اعلانات من",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-sm border border-primary/10"
        >
          {/* آیکون در سمت راست */}
          <div className="w-14 h-14 rounded-2xl bg-light-blue flex items-center justify-center">
            {stat.icon}
          </div>

          {/* محتوا در سمت چپ */}
          <div className="flex flex-col text-right flex-1">
            <h4 className="text-primary font-semibold text-xl">{stat.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-primary">{stat.value}</span>
              <span className="text-lg text-secondery">{stat.label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
