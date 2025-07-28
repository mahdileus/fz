// components/template/p-admin/course/CourseBox.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { MdDelete } from 'react-icons/md';
import { MdModeEdit } from 'react-icons/md'; 

export default function PodcastBox({ podcast }) {
  const router = useRouter()

  const removePodcast = async () => {
    const confirm = await swal({
      title: "آیا از حذف مطمئنی؟",
      icon: "warning",
      buttons: ["لغو", "حذف"],
      dangerMode: true,
    });
    if (confirm) {
      const res = await fetch(`/api/podcast/${podcast._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        swal({
          title:"پادکست با موفقیت حذف شد",
          icon:"success",
          buttons:"فهمیدم"
          
        }).then(() =>
          router.refresh()
        );
      }
    }
  };
    const handleEditClick = () => {
    router.push(`/p-admin/podcasts/edit-podcast/${podcast._id}`);
  };



  return (
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-4 mb-4">
      {/* تصویر دوره */}
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={podcast.thumbnail}
          alt={podcast.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* اطلاعات دوره */}
      <div className="flex flex-col justify-between pr-4 w-full">
        <div className="flex justify-between ">
          <div>
            <Link
              href={`/podcast/${podcast._id}`}
              className="text-lg font-semibold text-primary hover:underline text-right"
            >
              {podcast.title}
            </Link>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-400 hover:text-red-500 text-2xl cursor-pointer" onClick={removePodcast} >
            <MdDelete/>
          </span>
          <span className="text-secondery hover:text-secondery/90 text-2xl cursor-pointer" onClick={handleEditClick}>

            <MdModeEdit />
          </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-right line-clamp-2">
          {podcast.longDescription}
        </p>

        <div className="text-left text-secondery font-bold mt-2">
          {podcast.category}
        </div>
      </div>
    </div>
  );
}
