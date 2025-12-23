"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert";
import dynamic from "next/dynamic";

// CKEditor را یکجا و بدون SSR لود کن
const CKEditorComponent = dynamic(() => import("../../modules/ckeditor/CKEditorWrapper"), { ssr: false });

export default function DashboardPodcast() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        slug: "",
        category: "",
        duration: "",
        tags: "",
        longDescription: "",
        podcast: null,
        thumbnail: null,
        // فیلدهای سئو جدید اضافه شد
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        canonicalUrl: "",
        seoSchema: "",
        viewCount: "0",
        isPublished: false,  // boolean برای checkbox
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

    };

    const handleImageChange = (e) => {
        setForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    };
    const handlePodcastChange = (e) => {
        setForm((prev) => ({ ...prev, podcast: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();

        for (const key in form) {
            if (key === "tags" || key === "metaKeywords") {
                const cleaned = form[key]
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item !== "");
                fd.append(key, JSON.stringify(cleaned));
            } else if (key === "seoSchema") {
                try {
                    const parsed =
                        typeof form[key] === "string" && form[key].trim() !== ""
                            ? JSON.parse(form[key])
                            : {};
                    fd.append(key, JSON.stringify(parsed));
                } catch (err) {
                    console.error("Invalid JSON in seoSchema:", err);
                    fd.append(key, JSON.stringify({}));
                }


            } else if (key === "isPublished") {
                fd.append(key, form[key] ? "true" : "false");  // boolean to string for formData
            } else {
                fd.append(key, form[key]);
            }
        }

        const res = await fetch("/api/podcast", {
            method: "POST",
            body: fd,
        });

        if (res.status === 201) {
            Swal({
                title: "پادکست با موفقیت ایجاد شد",
                icon: "success",
                buttons: "فهمیدم",
            }).then(() => {
                setForm({
                    title: "",
                    slug: "",
                    category: "",
                    duration: "",
                    tags: "",
                    longDescription: "",
                    podcast: null,
                    thumbnail: null,
                    metaTitle: "",
                    metaDescription: "",
                    metaKeywords: "",
                    canonicalUrl: "",
                    seoSchema: "",
                    viewCount: "0",
                    isPublished: false,
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
        <section className="container px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6 text-right"
            >
                <h2 className="text-2xl font-bold text-primary">افزودن پادکست جدید</h2>

                <input
                    name="title"
                    className="input min-h-14 w-full"
                    placeholder="عنوان"
                    value={form.title}
                    onChange={handleChange}
                />
                <input
                    name="slug"
                    className="input min-h-14 w-full"
                    placeholder="نامک"
                    value={form.slug}
                    onChange={handleChange}
                />
                <input
                    name="category"
                    className="input min-h-14 w-full"
                    placeholder="دسته‌بندی"
                    value={form.category}
                    onChange={handleChange}
                />
                <input
                    name="duration"
                    type="number"
                    className="input min-h-14 w-full"
                    placeholder="مدت زمان پادکست (دقیقه)"
                    value={form.duration}
                    onChange={handleChange}
                />
                <input
                    name="tags"
                    className="input min-h-14 w-full"
                    placeholder="تگ‌ها با , جدا شده"
                    value={form.tags}
                    onChange={handleChange}
                />

                <label className="font-medium text-primary">محتوای پادکست</label>
                <CKEditorComponent
                    value={form.longDescription}
                    onChange={(data) => setForm((prev) => ({ ...prev, longDescription: data }))}
                />
                {/* فیلدهای سئو جدید اضافه شد */}
                <input
                    name="metaTitle"
                    className="input w-full min-h-14"
                    placeholder="عنوان متا (برای سئو - اختیاری)"
                    value={form.metaTitle}
                    onChange={handleChange}
                />
                <textarea
                    name="metaDescription"
                    className="input w-full min-h-14"
                    placeholder="توضیح متا (۱۵۰ کاراکتر برای سئو - اختیاری)"
                    value={form.metaDescription}
                    onChange={handleChange}
                />
                <input
                    name="metaKeywords"
                    className="input w-full min-h-14"
                    placeholder="کلمات کلیدی متا با , جدا شده (برای سئو - اختیاری)"
                    value={form.metaKeywords}
                    onChange={handleChange}
                />
                <input
                    name="canonicalUrl"
                    className="input w-full min-h-14"
                    placeholder="URL کانونی (برای جلوگیری از duplicate - اختیاری)"
                    value={form.canonicalUrl}
                    onChange={handleChange}
                />
                <textarea
                    name="seoSchema"
                    className="input w-full min-h-25"
                    placeholder="JSON-LD schema برای سئو (اختیاری)"
                    value={form.seoSchema}
                    onChange={handleChange}
                />
                <input
                    name="viewCount"
                    type="number"
                    className="input w-full min-h-14"
                    placeholder="تعداد بازدید (اختیاری، default 0)"
                    value={form.viewCount}
                    onChange={handleChange}
                />
                <label className="flex items-center gap-2">
                    <input
                        name="isPublished"
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={handleChange}
                    />
                    <span className="font-medium text-primary">انتشار مقاله (اگر تیک بزنی، منتشر می‌شه)</span>
                </label>

                <label className="font-medium text-primary">تصویر پادکست</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                />
                <label className="font-medium text-primary"> پادکست</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handlePodcastChange}
                    className="w-full"
                />

                <button className="bg-primary text-white py-3 rounded-xl hover:bg-secondery transition text-base sm:text-lg">
                    ارسال پادکست
                </button>
            </form>
        </section>

    );
}
