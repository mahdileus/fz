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
        slug:"",
        category: "",
        duration: "",
        tags: "",
        longDescription:"",
        podcast: null,
        img: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setForm((prev) => ({ ...prev, img: e.target.files[0] }));
    };
        const handlePodcastChange = (e) => {
        setForm((prev) => ({ ...prev, podcast: e.target.files[0] }));
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
                    slug:"",
                    category: "",
                    duration: "",
                    tags: "",
                    longDescription:"",
                    podcast: null,
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
        <section className="container px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6 text-right"
            >
                <h2 className="text-2xl font-bold text-primary">افزودن پادکست جدید</h2>

                <input
                    name="title"
                    className="input min-h-[56px] w-full"
                    placeholder="عنوان"
                    value={form.title}
                    onChange={handleChange}
                />
                <input
                    name="slug"
                    className="input min-h-[56px] w-full"
                    placeholder="نامک"
                    value={form.slug}
                    onChange={handleChange}
                />
                <input
                    name="category"
                    className="input min-h-[56px] w-full"
                    placeholder="دسته‌بندی"
                    value={form.category}
                    onChange={handleChange}
                />
                <input
                    name="duration"
                    type="number"
                    className="input min-h-[56px] w-full"
                    placeholder="مدت زمان پادکست (دقیقه)"
                    value={form.duration}
                    onChange={handleChange}
                />
                <input
                    name="tags"
                    className="input min-h-[56px] w-full"
                    placeholder="تگ‌ها با , جدا شده"
                    value={form.tags}
                    onChange={handleChange}
                />

                <label className="font-medium text-primary">محتوای پادکست</label>
                <CKEditorComponent
                    value={form.longDescription}
                    onChange={(data) => setForm((prev) => ({ ...prev, longDescription: data }))}
                />

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
