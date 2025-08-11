"use client";
import {
  CiBellOn,
  CiChat2,
  CiVideoOn,
  CiCircleQuestion,
  CiChat1,
} from "react-icons/ci";

export default function DashboardStats({
  userCommentsCount,
  userCoursesCount,
  userWishlistCount,
  userTicketsCount,
}) {
  const stats = [
    {
      icon: <CiVideoOn className="w-8 h-8 text-primary" />,
      label: "دوره",
      value: userCoursesCount ?? 0,
      title: "درحال یادگیری",
    },
    {
      icon: <CiChat2 className="w-8 h-8 text-primary" />,
      label: "نظر",
      value: userCommentsCount ?? 0,
      title: "نظرات من",
    },
    {
      icon: <CiCircleQuestion className="w-8 h-8 text-primary" />,
      label: "پرسش",
      value: userTicketsCount ?? 0,
      title: "پرسش‌های من",
    },
    {
      icon: <CiChat1 className="w-8 h-8 text-primary" />,
      label: "علاقه مندی",
      value: userWishlistCount ?? 0,
      title: "علاقه مندی ها ",
    },
  ];

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
