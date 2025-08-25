"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });


export default function EditCourseForm({ course, courseId }) {
  const router = useRouter();

const [courseInfo, setCourseInfo] = useState({
  title: course.title || "",
  slug: course.slug || "",
  price: course.price || "",
  category: course.category || "",
  duration: course.duration || "",
  shortDescription: course.shortDescription || "",
  longDescription: course.longDescription || "",
  tags: course.tags?.join(",") || "",
  score: course.score || 5,
  discountPercent: course.discountPercent || "",
  thumbnail: course.thumbnail || null,
  introVideo: course.introVideo || null,
});

const [lessons, setLessons] = useState(
  Array.isArray(course.lessons)
    ? course.lessons.map((l) => ({
        title: l.title,
        video: null,
        thumbnail: null,
      }))
    : [{ title: "", video: null, thumbnail: null, audio:null }]
);


  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: "", video: null, thumbnail: null, audio:null }]);
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
      formData.append(`lessonVideo-${i}`, lesson.video);
      formData.append(`lessonThumbnail-${i}`, lesson.thumbnail);
      formData.append(`lessonAudio-${i}`, lesson.audio);
    });

    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      Swal({
        title: "دوره با موفقیت ویرایش شد",
        icon: "success",
        buttons: "باشه",
      }).then(() => {
        router.replace("/p-admin/courses");
      });
    } else {
      Swal({
        title: "خطا در ویرایش دوره",
        icon: "error",
        buttons: "فهمیدم",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">ویرایش دوره</h2>

      {/* اطلاعات پایه دوره */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="text" placeholder="عنوان دوره" value={courseInfo.title} onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })} />
        <input className="input" type="text" placeholder="نامک دوره" value={courseInfo.slug} onChange={(e) => setCourseInfo({ ...courseInfo, slug: e.target.value })} />
        <input className="input" type="number" placeholder="قیمت" value={courseInfo.price} onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })} />
        <input className="input" type="number" placeholder="درصد تخفیف" value={courseInfo.discountPercent} onChange={(e) => setCourseInfo({ ...courseInfo, discountPercent: e.target.value })} />
        <input className="input" type="text" placeholder="دسته‌بندی" value={courseInfo.category} onChange={(e) => setCourseInfo({ ...courseInfo, category: e.target.value })} />
        <input className="input" type="number" placeholder="مدت زمان (ساعت)" value={courseInfo.duration} onChange={(e) => setCourseInfo({ ...courseInfo, duration: e.target.value })} />
      </div>

      <input className="input" type="text" placeholder="توضیح کوتاه" value={courseInfo.shortDescription} onChange={(e) => setCourseInfo({ ...courseInfo, shortDescription: e.target.value })} />

      <label className="font-medium text-primary">محتوای دوره</label>
      <div className="overflow-x-auto">
        <CKEditorComponent
          value={courseInfo.longDescription}
          onChange={(data) => setCourseInfo((prev) => ({ ...prev, longDescription: data }))}
        />
      </div>

      <input className="input" type="text" placeholder="تگ‌ها (با , جدا کنید)" value={courseInfo.tags} onChange={(e) => setCourseInfo({ ...courseInfo, tags: e.target.value })} />

      {/* آپلود فایل‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">تصویر جدید (اختیاری):</label>
          <input type="file" accept="image/*" onChange={(e) => setCourseInfo({ ...courseInfo, thumbnail: e.target.files[0] })} className="input" />
        </div>
        <div>
          <label className="block text-sm mb-1">ویدیوی معرفی جدید (اختیاری):</label>
          <input type="file" accept="video/*" onChange={(e) => setCourseInfo({ ...courseInfo, introVideo: e.target.files[0] })} className="input" />
        </div>
      </div>

      {/* جلسات */}
      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold text-secondary">جلسات دوره</h3>

        {lessons.map((lesson, index) => (
          <div key={index} className="border border-gray-200 bg-gray-50 p-4 rounded-xl space-y-3">
            <input className="input" type="text" placeholder={`عنوان جلسه ${index + 1}`} value={lesson.title} onChange={(e) => handleLessonChange(index, "title", e.target.value)} />
            <label className="block text-sm mb-1">ویدیو جدید (در صورت تغییر):</label>
            <input className="input" type="file" accept="video/*" onChange={(e) => handleLessonChange(index, "video", e.target.files[0])} />
            <label className="block text-sm mb-1">تصویر جدید (در صورت تغییر):</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => handleLessonChange(index, "thumbnail", e.target.files[0])} />
            <label className="block text-sm mb-1">وویس جدید (در صورت تغییر):</label>
            <input className="input" type="file" accept="audio/*" onChange={(e) => handleLessonChange(index, "audio", e.target.files[0])} />
          </div>
        ))}

        <button type="button" onClick={addLesson} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">افزودن جلسه جدید +</button>
      </div>

      <div className="pt-6">
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow">ذخیره تغییرات</button>
      </div>
    </form>
  );
}
