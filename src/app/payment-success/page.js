"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const goToPanel = () => {
    router.push("/p-user/courses"); // مسیر پنل دوره‌ها (باید طبق پروژه‌ات تنظیم کنی)
  };

  const goToCourse = () => {
    if (courseId) {
      router.push(`/course/${courseId}`);
    } else {
      router.push("/p-user/courses");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50">
      <h1 className="text-4xl font-bold mb-4 text-green-700">خرید شما با موفقیت انجام شد!</h1>
      <p className="mb-6 text-lg text-green-900">از اعتماد شما سپاسگزاریم.</p>
      <div className="flex gap-4">
        <button
          onClick={goToPanel}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          رفتن به پنل دوره‌ها
        </button>
        {courseId && (
          <button
            onClick={goToCourse}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            رفتن به دوره خریداری شده
          </button>
        )}
      </div>
    </div>
  );
}
