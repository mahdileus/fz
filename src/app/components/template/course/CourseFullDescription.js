"use client";

export default function CourseFullDescription({ longDescription, title }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DBE2EF]">
        <h2 className="text-2xl font-bold text-primary mb-4">معرفی کامل  {title}</h2>
        <div className="rich-text">
          <div dangerouslySetInnerHTML={{ __html: longDescription }} />
        </div>

      </div>
    </section>
  );
}
