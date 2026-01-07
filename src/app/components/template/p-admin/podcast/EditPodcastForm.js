"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });

export default function EditPodcastForm({ podcast, podcastId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);  // برای disable دکمه هنگام submit
  const [podcastInfo, setpodcastInfo] = useState({
    title: podcast.title || "",
    slug: podcast.slug || "",
    category: podcast.category || "",
    duration: podcast.duration || "",
    longDescription: podcast.longDescription || "",
    thumbnail: podcast.thumbnail || null,
    podcast: podcast.thumbnail || null,
    // فیلدهای سئو جدید اضافه شد و از podcast لود می‌شن
    metaTitle: podcast.metaTitle || "",
    metaDescription: podcast.metaDescription || "",
    metaKeywords: podcast.metaKeywords?.join(",") || "",
    canonicalUrl: podcast.canonicalUrl || "",
    seoSchema: JSON.stringify(podcast.seoSchema || {}, null, 2),  // به string تبدیل برای textarea
    viewCount: podcast.viewCount || "0",
    isPublished: podcast.isPublished || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setpodcastInfo((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    setpodcastInfo((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
  };
  const handlePodcastChange = (e) => {
    setpodcastInfo((prev) => ({ ...prev, podcast: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation ساده برای فیلدهای الزامی
    if (!podcastInfo.title || !podcastInfo.slug || !podcastInfo.longDescription) {
      return Swal({
        title: "خطا",
        text: "فیلدهای عنوان, نامک و محتوای پادکست الزامی است!",
        icon: "error",
        buttons: "فهمیدم",
      });
    }

    setIsLoading(true);
    const formData = new FormData();

    Object.entries(podcastInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "metaKeywords") {
        const cleaned = value
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== "");
        formData.append(key, JSON.stringify(cleaned));
      } else if (key === "seoSchema") {
        formData.append(key, value ? value : JSON.stringify({}));  // اگر خالی بود, empty JSON
      } else if (key === "isPublished") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value);
      }
    });

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
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">ویرایش پادکست</h2>

      {/* اطلاعات پایه پادکست */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="text" placeholder="عنوان پادکست" name="title" value={podcastInfo.title} onChange={handleChange} />
        <input className="input" type="text" placeholder="نامک پادکست" name="slug" value={podcastInfo.slug} onChange={handleChange} />
        <input className="input" type="text" placeholder="دسته‌بندی" name="category" value={podcastInfo.category} onChange={handleChange} />
        <input className="input" type="number" placeholder="مدت زمان  (دقیقه)" name="duration" value={podcastInfo.duration} onChange={handleChange} />
      </div>

      <label className="block text-sm mb-1">محتوای پادکست</label>
      <div className="overflow-x-auto">
        <CKEditorComponent
          value={podcastInfo.longDescription}
          onChange={(data) => setpodcastInfo((prev) => ({ ...prev, longDescription: data }))}
        />
      </div>
      {/* فیلدهای سئو جدید اضافه شد و از پادکست لود می‌شه */}
      <input className="input" type="text" placeholder="عنوان متا (برای سئو - اختیاری)" name="metaTitle" value={podcastInfo.metaTitle} onChange={handleChange} />
      <textarea className="input min-h-25" placeholder="توضیح متا (۱۵۰ کاراکتر برای سئو - اختیاری)" name="metaDescription" value={podcastInfo.metaDescription} onChange={handleChange} />
      <input className="input" type="text" placeholder="کلمات کلیدی متا با , جدا شده (برای سئو - اختیاری)" name="metaKeywords" value={podcastInfo.metaKeywords} onChange={handleChange} />
      <input className="input" type="text" placeholder="URL کانونی (برای جلوگیری از duplicate - اختیاری)" name="canonicalUrl" value={podcastInfo.canonicalUrl} onChange={handleChange} />
      <textarea className="input min-h-25" placeholder="JSON-LD schema برای سئو (اختیاری)" name="seoSchema" value={podcastInfo.seoSchema} onChange={handleChange} />
      <input className="input" type="number" placeholder="تعداد بازدید (اختیاری, default 0)" name="viewCount" value={podcastInfo.viewCount} onChange={handleChange} />
      <label className="flex items-center gap-2">
        <input
          name="isPublished"
          type="checkbox"
          checked={podcastInfo.isPublished}
          onChange={handleChange}
        />
        <span className="font-medium text-primary">انتشار پادکست (اگر تیک بزنی, منتشر می‌شه)</span>
      </label>
      <div>
        <div >
          <label className="block text-sm mb-1 ">تصویر جدید (اختیاری):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
          <label className="block text-sm mb-1 mt-4">پادکست جدید (اختیاری):</label>
          <input type="file" accept="audio/*" onChange={handlePodcastChange} className="input" />
        </div>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow disabled:opacity-50">
          {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}