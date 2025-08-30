"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert";
import dynamic from "next/dynamic";
import axios from "axios";


// CKEditor را یکجا و بدون SSR لود کن
const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });
export default function CourseForm() {
  const router = useRouter();
   const [uploadProgress, setUploadProgress] = useState(0); // ✅ درصد آپلود

  const [lessons, setLessons] = useState([
    { title: "", video: null, audio: null, thumbnail: null },
  ]);

  const [courseInfo, setCourseInfo] = useState({
    title: "",
    slug: "",
    price: "",
    category: "",
    duration: "",
    shortDescription: "",
    longDescription: "",
    tags: "",
    score: 5,
    discountPercent: "",
    thumbnail: null,
    introVideo: null,
  });

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      { title: "", description: "", video: null, thumbnail: null, audio: null },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(courseInfo).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.set("tags", JSON.stringify(courseInfo.tags.split(",")));
    formData.append("lessonCount", lessons.length);

    lessons.forEach((lesson, i) => {
      formData.append(`lessonTitle-${i}`, lesson.title);
      formData.append(`lessonDescription-${i}`, lesson.description);
      formData.append(`lessonVideo-${i}`, lesson.video);
      formData.append(`lessonThumbnail-${i}`, lesson.thumbnail);
      formData.append(`lessonAudio-${i}`, lesson.audio);
    });

    try {
      const res = await axios.post("/api/courses", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent); // ✅ درصد آپلود
        },
      });

      if (res.status === 201) {
        Swal({
          title: "دوره با موفقیت ایجاد شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          router.replace("/p-admin/courses");
        });
      }
    } catch (error) {
      Swal({
        title: "خطا سمت سرور",
        icon: "error",
        buttons: "فهمیدم",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">افزودن دوره جدید</h2>
            {/* ✅ Progress Bar */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            {uploadProgress}%
          </p>
        </div>
      )}

      {/* اطلاعات دوره */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="عنوان دوره"
          value={courseInfo.title}

          onChange={(e) =>
            setCourseInfo({ ...courseInfo, title: e.target.value })
          }
          className="input"
        />
        <input
          type="text"
          placeholder="نامک دوره"
          value={courseInfo.slug}

          onChange={(e) =>
            setCourseInfo({ ...courseInfo, slug: e.target.value })
          }
          className="input"
        />
        <input
          type="number"
          value={courseInfo.price}

          placeholder="قیمت"
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, price: e.target.value })
          }
          className="input"
        />
        <input
          type="number"
          value={courseInfo.discountPercent}

          placeholder="درصد تخفیف"
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, discountPercent: e.target.value })
          }
          className="input"
        />
        <input
          type="text"
          value={courseInfo.category}

          placeholder="دسته‌بندی"
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, category: e.target.value })
          }
          className="input"
        />
        <input
          type="number"
                  value={courseInfo.duration}

          placeholder="مدت زمان (ساعت)"
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, duration: e.target.value })
          }
          className="input"
        />
      </div>

      <input
        type="text"
        placeholder="توضیح کوتاه"
        value={courseInfo.shortDescription}
        onChange={(e) =>
          setCourseInfo({ ...courseInfo, shortDescription: e.target.value })
        }
        className="input"
      />

      <label className="font-medium text-primary">محتوای دوره</label>
  <div className="overflow-x-auto">
      <CKEditorComponent
        value={courseInfo.longDescription}
        onChange={(data) => setCourseInfo((prev) => ({ ...prev, longDescription: data }))}
      />

      </div>

      <input
        type="text"
        value={courseInfo.tags}

        placeholder="تگ‌ها (با , جدا کنید)"
        onChange={(e) =>
          setCourseInfo({ ...courseInfo, tags: e.target.value })
        }
        className="input"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">تصویر دوره:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, thumbnail: e.target.files[0] })
            }
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">ویدیو معرفی دوره:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, introVideo: e.target.files[0] })
            }
            className="input"
          />
        </div>
      </div>

      {/* جلسات دوره */}
      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold text-secondary">
          جلسات دوره
        </h3>

        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-gray-50 p-4 rounded-xl space-y-3"
          >
            <input
              type="text"
              placeholder={`عنوان جلسه ${index + 1}`}
              onChange={(e) =>
                handleLessonChange(index, "title", e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder={`توضیحات جلسه`}
              onChange={(e) =>
                handleLessonChange(index, "description", e.target.value)
              }
              className="input"
            />
            <label className="block text-sm mb-1">ویدیو جلسه:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleLessonChange(index, "video", e.target.files[0])
              }
              className="input"
            />
            <label className="block text-sm mb-1">صدا(وویس) جلسه:</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                handleLessonChange(index, "audio", e.target.files[0])
              }
              className="input"
            />
            <label className="block text-sm mb-1">  عکس جلسه:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleLessonChange(index, "thumbnail", e.target.files[0])
              }
              className="input"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addLesson}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          افزودن جلسه جدید +
        </button>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow"
        >
          ارسال دوره
        </button>
      </div>
    </form>
  );
}
