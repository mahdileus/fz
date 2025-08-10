"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-red-50">
      <h1 className="text-4xl font-bold mb-4 text-red-700">پرداخت انجام نشد!</h1>
      <p className="mb-6 text-lg text-red-900">
        متأسفانه مشکلی در پرداخت شما رخ داد. لطفاً مجدداً تلاش کنید.
      </p>
      <button
        onClick={() => router.push("/cart")}
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
      >
        بازگشت به سبد خرید
      </button>
    </div>
  );
}
