"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="container min-h-screen flex flex-col items-center justify-center text-center py-20">
      <div className="relative w-84 h-84 mb-8">
        <Image
          src="/image/404.png" // فایل PNG یا SVG مناسب رو توی public/image بذار
          alt="404 Not Found"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold font-kalameh text-primary mb-4 ">صفحه مورد نظر پیدا نشد!</h1>
      <p className="text-gray-600 max-w-md mb-6 font-dana">
        متأسفیم، صفحه‌ای که دنبال آن بودید وجود ندارد یا ممکن است حذف شده باشد.
      </p>
      <Link
        href="/"
        className="inline-block bg-secondery text-white px-6 py-2 rounded-xl text-sm hover:bg-primary transition font-dana"
      >
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}
