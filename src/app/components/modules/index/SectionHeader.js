"use  client"

import {
  CiVideoOn,
  CiMicrophoneOn,
  CiFileOn,
  CiChat2,
  CiCircleChevLeft,
} from "react-icons/ci";
import Link from "next/link";

const iconMap = {
  course: <CiVideoOn size={30} />,
  podcast: <CiMicrophoneOn size={30} />,
  article: <CiFileOn size={30} />,
  comment: <CiChat2 size={30} />,
};

export default function SectionHeader({ title, href, type = "course" }) {
  return (
    <div className="container flex items-center justify-between mb-6 mt-12 px-2 md:px-0">
      {/* سمت راست: آیکون با بک گرد و عنوان */}
      <div className="flex items-center gap-2 text-primary">
        <div className="bg-[#DBE2EF] text-primary p-2.5 rounded-xl shadow-xl">
          {iconMap[type]}
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-kalameh">{title}</h2>
      </div>

      {/* سمت چپ: دکمه مشاهده همه - فقط اگر href داده شده باشه */}
      {href && href !== "#" && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-secondery border border-secondery px-3 py-1.5 rounded-full hover:bg-secondery hover:text-white transition"
        >
          مشاهده همه
          <CiCircleChevLeft size={25} />
        </Link>
      )}
    </div>
  );
}
