"use client";

export default function Content({ html }) {
  return (
    <div className="overflow-x-auto">
      <div
        className="rich-text" // حداقل عرض جدول‌ها
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
