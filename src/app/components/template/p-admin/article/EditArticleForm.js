"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(() => import("../../../modules/ckeditor/CKEditorWrapper"), { ssr: false });


export default function EditArticleForm({ article, articleId }) {
  const router = useRouter();

const [articleInfo, setArticleInfo] = useState({
  title: article.title || "",
  slug: article.slug || "",
  author: article.author || "",
  category: article.category || "",
  timeToRead: article.timeToRead || "",
  longDescription: article.longDescription || "",
  shortDescription: article.longDescription || "",
  tags: article.tags?.join(",") || "",
  thumbnail: article.thumbnail || null,
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(articleInfo).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.set("tags", JSON.stringify(articleInfo.tags.split(",")));

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
        title: "خطا در ویرایش مفاله",
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
      <h2 className="text-2xl font-bold text-primary mb-4">ویرایش مقاله</h2>

      {/* اطلاعات پایه دوره */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="text" placeholder="عنوان مقاله" value={articleInfo.title} onChange={(e) => setArticleInfo({ ...articleInfo, title: e.target.value })} />
        <input className="input" type="text" placeholder="نامک مقاله" value={articleInfo.slug} onChange={(e) => setArticleInfo({ ...articleInfo, slug: e.target.value })} />
        <input className="input" type="text" placeholder=" نویسنده" value={articleInfo.author} onChange={(e) => setArticleInfo({ ...articleInfo, author: e.target.value })} />
        <input className="input" type="text" placeholder="دسته‌بندی" value={articleInfo.category} onChange={(e) => setArticleInfo({ ...articleInfo, category: e.target.value })} />
        <input className="input" type="number" placeholder="مدت زمان مطالعه (دقیقه)" value={articleInfo.timeToRead} onChange={(e) => setArticleInfo({ ...articleInfo, timeToRead: e.target.value })} />
        <input className="input" type="number" placeholder=" توضیح کوتاه" value={articleInfo.shortDescription} onChange={(e) => setArticleInfo({ ...articleInfo, shortDescription: e.target.value })} />
      </div>
      <label className="font-medium text-primary">محتوای مقاله</label>
      <div className="overflow-x-auto">
        <CKEditorComponent
          value={articleInfo.longDescription}
          onChange={(data) => setArticleInfo((prev) => ({ ...prev, longDescription: data }))}
        />
      </div>

      <input className="input" type="text" placeholder="تگ‌ها (با , جدا کنید)" value={articleInfo.tags} onChange={(e) => setArticleInfo({ ...articleInfo, tags: e.target.value })} />

      {/* آپلود فایل‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">تصویر جدید (اختیاری):</label>
          <input type="file" accept="image/*" onChange={(e) => setArticleInfo({ ...articleInfo, thumbnail: e.target.files[0] })} className="input" />
        </div>
      </div>
      <div className="pt-6">
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl shadow">ذخیره تغییرات</button>
      </div>
    </form>
  );
}
