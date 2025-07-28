// components/template/p-admin/course/CourseBox.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { MdDelete } from 'react-icons/md';
import { MdModeEdit } from 'react-icons/md'; 

export default function ArticleBox({ article }) {
  const router = useRouter()

  const removeArticle = async () => {
    const confirm = await swal({
      title: "آیا از حذف مطمئنی؟",
      icon: "warning",
      buttons: ["لغو", "حذف"],
      dangerMode: true,
    });
    if (confirm) {
      const res = await fetch(`/api/article/${article._id}`, {
        method: "DELETE",
      });
      

      if (res.ok) {
        swal({
          title:"مقاله با موفقیت حذف شد",
          icon:"success",
          buttons:"فهمیدم"
          
        }).then(() =>
          router.refresh()
        );
      }
    }
  };
    const handleEditClick = () => {
    router.push(`/p-admin/posts/edit-post/${article._id}`);
  };


  return (
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-4 mb-4">
      {/* تصویر دوره */}
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* اطلاعات دوره */}
      <div className="flex flex-col justify-between pr-4 w-full">
        <div className="flex justify-between ">
          <div>
            <Link
              href={`/articles/${article._id}`}
              className="text-lg font-semibold text-primary hover:underline text-right"
            >
              {article.title}
            </Link>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-400 hover:text-red-500 text-2xl cursor-pointer" onClick={removeArticle} >
            <MdDelete/>
          </span>
          <span className="text-secondery hover:text-secondery/90 text-2xl cursor-pointer" onClick={handleEditClick}>

            <MdModeEdit />
          </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-right line-clamp-2">
          {article.longDescription}
        </p>

        <div className="text-left text-secondery font-bold mt-2">
          {article.category}
        </div>
      </div>
    </div>
  );
}
