"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

// CKEditor را یکجا و بدون SSR لود کن
const CKEditorComponent = dynamic(() => import("../../modules/ckeditor/CKEditorWrapper"), { ssr: false });

export default function ArticleForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    author: "",
    shortDescription: "",
    timeToRead: "",
    tags: "",
    longDescription: "",
    img: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, img: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    for (const key in form) {
      if (key === "tags") {
        const cleanedTags = form.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag !== "");
        fd.append("tags", JSON.stringify(cleanedTags));
      } else {
        fd.append(key, form[key]);
      }
    }

    const res = await fetch("/api/article", {
      method: "POST",
      body: fd,
    });

    if (res.status === 201) {
      Swal({
        title: "مقاله با موفقیت ایجاد شد",
        icon: "success",
        buttons: "فهمیدم",
      }).then(() => {
        setForm({
          title: "",
          slug: "",
          category: "",
          author: "",
          shortDescription: "",
          timeToRead: "",
          tags: "",
          longDescription: "",
          img: null,
        });
        router.refresh();
      });
    } else {
      Swal({
        title: "خطا سمت سرور",
        icon: "error",
        buttons: "فهمیدم",
      });
    }
  };

  return (
<section className="w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6 text-right"
  >
    <h2 className="text-2xl font-bold text-primary">افزودن مقاله جدید</h2>

    <input
      name="title"
      className="input w-full min-h-[56px]"
      placeholder="عنوان"
      value={form.title}
      onChange={handleChange}
    />
    <input
      name="slug"
      className="input w-full min-h-[56px]"
      placeholder="نامک"
      value={form.slug}
      onChange={handleChange}
    />
    <input
      name="author"
      className="input w-full min-h-[56px]"
      placeholder="نویسنده"
      value={form.author}
      onChange={handleChange}
    />
    <input
      name="category"
      className="input w-full min-h-[56px]"
      placeholder="دسته‌بندی"
      value={form.category}
      onChange={handleChange}
    />
    <input
      name="shortDescription"
      className="input w-full min-h-[56px]"
      placeholder="توضیح کوتاه"
      value={form.shortDescription}
      onChange={handleChange}
    />
    <input
      name="timeToRead"
      type="number"
      className="input w-full min-h-[56px]"
      placeholder="مدت زمان مطالعه (دقیقه)"
      value={form.timeToRead}
      onChange={handleChange}
    />
    <input
      name="tags"
      className="input w-full min-h-[56px]"
      placeholder="تگ‌ها با , جدا شده"
      value={form.tags}
      onChange={handleChange}
    />

    <label className="font-medium text-primary">محتوای مقاله</label>
    <div className="overflow-x-auto">
      <CKEditorComponent
        value={form.longDescription}
        onChange={(data) => setForm((prev) => ({ ...prev, longDescription: data }))}
      />
    </div>

    <label className="font-medium text-primary">تصویر مقاله</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="w-full"
    />

    <button className="bg-primary text-white py-3 rounded-xl hover:bg-secondery transition text-base sm:text-lg">
      ارسال مقاله
    </button>
  </form>
</section>


  );
}
