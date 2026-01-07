"use client";

import Content from "../article/Content";

export default function CourseFullDescription({ longDescription, title }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-blue">
        <h2 className="text-2xl font-bold text-primary mb-4">معرفی کامل  {title}</h2>
        <Content html={longDescription} />
      </div>
    </section>
  );
}
