"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });

export default function EditArticleForm({ article, articleId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);  // برای disable دکمه هنگام submit
  const [articleInfo, setArticleInfo] = useState({
    title: article.title || "",
    slug: article.slug || "",
    author: article.author || "",
    category: article.category || "",
    timeToRead: article.timeToRead || "",
    longDescription: article.longDescription || "",
    shortDescription: article.shortDescription || "",
    tags: article.tags?.join(",") || "",
    thumbnail: article.thumbnail || null,
    // فیلدهای سئو جدید اضافه شد و از article لود می‌شن
    metaTitle: article.metaTitle || "",
    metaDescription: article.metaDescription || "",
    metaKeywords: article.metaKeywords?.join(",") || "",
    canonicalUrl: article.canonicalUrl || "",
    seoSchema: JSON.stringify(article.seoSchema || {}, null, 2),  // به string تبدیل برای textarea
    viewCount: article.viewCount || "0",
    isPublished: article.isPublished || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleInfo((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    setArticleInfo((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation ساده برای فیلدهای الزامی
    if (!articleInfo.title || !articleInfo.slug || !articleInfo.longDescription) {
      return Swal({
        title: "خطا",
        text: "فیلدهای عنوان, نامک و محتوای مقاله الزامی است!",
        icon: "error",
        buttons: "فهمیدم",
      });
    }

    setIsLoading(true);
    const formData = new FormData();

    Object.entries(articleInfo).forEach(([key, value]) => {
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

    const res = await fetch(`/api/article/${articleId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      Swal({
        title: "مقاله با موفقیت ویرایش شد",
        icon: "success",
        buttons: "باشه",
      }).then(() => {
        router.replace("/p-admin/posts");
      });
    } else {
      Swal({
        title: "خطا در ویرایش مقاله",
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
      <h2 className="text-2xl font-bold text-primary mb-4">ویرایش مقاله</h2>

      {/* اطلاعات پایه مقاله */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="text" placeholder="عنوان مقاله" name="title" value={articleInfo.title} onChange={handleChange} />
        <input className="input" type="text" placeholder="نامک مقاله" name="slug" value={articleInfo.slug} onChange={handleChange} />
        <input className="input" type="text" placeholder="نویسنده" name="author" value={articleInfo.author} onChange={handleChange} />
        <input className="input" type="text" placeholder="دسته‌بندی" name="category" value={articleInfo.category} onChange={handleChange} />
        <input className="input" type="number" placeholder="مدت زمان مطالعه (دقیقه)" name="timeToRead" value={articleInfo.timeToRead} onChange={handleChange} />
        <input className="input" type="text" placeholder="توضیح کوتاه" name="shortDescription" value={articleInfo.shortDescription} onChange={handleChange} />
      </div>

      <label className="block text-sm mb-1">محتوای مقاله</label>
      <div className="overflow-x-auto">
        <CKEditorComponent
          value={articleInfo.longDescription}
          onChange={(data) => setArticleInfo((prev) => ({ ...prev, longDescription: data }))}
        />
      </div>

      <input className="input" type="text" placeholder="تگ‌ها (با , جدا کنید)" name="tags" value={articleInfo.tags} onChange={handleChange} />

      {/* آپلود فایل‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">تصویر جدید (اختیاری):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
        </div>
      </div>

      {/* فیلدهای سئو جدید اضافه شد و از article لود می‌شه */}
      <input className="input" type="text" placeholder="عنوان متا (برای سئو - اختیاری)" name="metaTitle" value={articleInfo.metaTitle} onChange={handleChange} />
      <textarea className="input min-h-25" placeholder="توضیح متا (۱۵۰ کاراکتر برای سئو - اختیاری)" name="metaDescription" value={articleInfo.metaDescription} onChange={handleChange} />
      <input className="input" type="text" placeholder="کلمات کلیدی متا با , جدا شده (برای سئو - اختیاری)" name="metaKeywords" value={articleInfo.metaKeywords} onChange={handleChange} />
      <input className="input" type="text" placeholder="URL کانونی (برای جلوگیری از duplicate - اختیاری)" name="canonicalUrl" value={articleInfo.canonicalUrl} onChange={handleChange} />
      <textarea className="input min-h-25" placeholder="JSON-LD schema برای سئو (اختیاری)" name="seoSchema" value={articleInfo.seoSchema} onChange={handleChange} />
      <input className="input" type="number" placeholder="تعداد بازدید (اختیاری, default 0)" name="viewCount" value={articleInfo.viewCount} onChange={handleChange} />
      <label className="flex items-center gap-2">
        <input
          name="isPublished"
          type="checkbox"
          checked={articleInfo.isPublished}
          onChange={handleChange}
        />
        <span className="font-medium text-primary">انتشار مقاله (اگر تیک بزنی, منتشر می‌شه)</span>
      </label>

      <div className="pt-6">
        <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow disabled:opacity-50">
          {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}