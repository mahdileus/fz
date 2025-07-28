"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });


export default function EditPodcastForm({ podcast, podcastId }) {
  const router = useRouter();

const [podcastInfo, setPodcastInfo] = useState({
  title: podcast.title || "",
  category: podcast.category || "",
  duration: podcast.duration || "",
  longDescription: podcast.longDescription || "",
  tags: podcast.tags?.join(",") || "",
  thumbnail: podcast.thumbnail || null,
  introVideo: podcast.podcast || null,
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(podcastInfo).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.set("tags", JSON.stringify(podcastInfo.tags.split(",")));

    const res = await fetch(`/api/podcast/${podcastId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      Swal({
        title: "پادکست با موفقیت ویرایش شد",
        icon: "success",
        buttons: "باشه",
      }).then(() => {
        router.replace("/p-admin/podcasts");
      });
    } else {
      Swal({
        title: "خطا در ویرایش پادکست",
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
      <h2 className="text-2xl font-bold text-primary mb-4">ویرایش پادکست</h2>

      {/* اطلاعات پایه دوره */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="text" placeholder="عنوان پادکست" value={podcastInfo.title} onChange={(e) => setPodcastInfo({ ...podcastInfo, title: e.target.value })} />
        <input className="input" type="text" placeholder="دسته‌بندی" value={podcastInfo.category} onChange={(e) => setPodcastInfo({ ...podcastInfo, category: e.target.value })} />
        <input className="input" type="number" placeholder="مدت زمان (دقیقه)" value={podcastInfo.duration} onChange={(e) => setPodcastInfo({ ...podcastInfo, duration: e.target.value })} />
      </div>
      <label className="font-medium text-primary">محتوای دوره</label>
      <div className="overflow-x-auto">
        <CKEditorComponent
          value={podcastInfo.longDescription}
          onChange={(data) => setPodcastInfo((prev) => ({ ...prev, longDescription: data }))}
        />
      </div>

      <input className="input" type="text" placeholder="تگ‌ها (با , جدا کنید)" value={podcastInfo.tags} onChange={(e) => setPodcastInfo({ ...podcastInfo, tags: e.target.value })} />

      {/* آپلود فایل‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">تصویر جدید (اختیاری):</label>
          <input type="file" accept="image/*" onChange={(e) => setPodcastInfo({ ...podcastInfo, thumbnail: e.target.files[0] })} className="input" />
        </div>
        <div>
          <label className="block text-sm mb-1">پادکست جدید (اختیاری):</label>
          <input type="file" accept="audio/*" onChange={(e) => setPodcastInfo({ ...podcastInfo, podcast: e.target.files[0] })} className="input" />
        </div>
      </div>

      {/* جلسات */}

      <div className="pt-6">
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow">ذخیره تغییرات</button>
      </div>
    </form>
  );
}
