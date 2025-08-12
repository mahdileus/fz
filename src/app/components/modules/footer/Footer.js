
"use client";

import { PiTelegramLogo, PiInstagramLogo, PiYoutubeLogo, PiClock, PiPhone } from "react-icons/pi"
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-25 pt-20 pb-10 overflow-hidden">

      {/* شکل گرد پس‌زمینه پایین چپ */}
      <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-t from-secondery to-white rounded-full -z-10"></div>

      <div className=" container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[#112D4E]">

        {/* ستون اول - آکادمی */}
        <div className="space-y-4 text-center md:text-right">
          <h4 className="font-bold text-xl font-kalameh">آکادمی فیروزه جواهران</h4>
          <p className="text-md leading-relaxed text-center text-gray-700 md:text-right">
            چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.
          </p>
        </div>

        {/* ستون دوم - دوره ها */}
        <div className="space-y-2 text-center md:text-right lg:pr-20">
          <h4 className="font-bold text-xl font-kalameh">دوره ها</h4>
          <ul className="space-y-3 text-md text-center md:text-right">
            <li>آموزش موفقیت</li>
            <li>آموزش فن‌بیان</li>
            <li>آموزش ذهنیت برتر</li>
            <li>موفقیت چیست</li>
          </ul>
        </div>

        {/* ستون سوم - دسترسی سریع */}
        <div className="space-y-2 text-center md:text-right">
          <h4 className="font-bold text-xl font-kalameh">دسترسی سریع</h4>
          <ul className="space-y-2 text-md text-center md:text-right flex flex-col">
            <Link href={"/"} className="inline-block">صفحه نخست</Link>
            <Link href={"/courses"} className="inline-block">دوره‌ها</Link>
            <Link href={"/posts"} className="inline-block">مقالات</Link>
            <Link href={"/about-us"} className="inline-block">درباره ما</Link>
          </ul>
        </div>

        {/* ستون چهارم - ارتباط و شبکه‌ها */}
        <div className="space-y-4 text-center md:text-right">
          <h4 className="font-bold text-xl text-center md:text-right font-kalameh">تماس باما</h4>
          <div className="text-sm space-y-4">
            <Link href="tel:09925349731">
              <p className="text-base cursor-pointer hover:text-[#3F72AF]">
                <PiPhone className="inline ml-2 text-xl" /> 09925349731
              </p>
            </Link>

            <p className="text-base"><PiClock className="inline ml-2 text-xl mt-4" /> ساعت کاری از ساعت 8 صبح تا 10 شب </p>
          </div>
          <div className="flex gap-4 mt-5 text-xl justify-center md:justify-start text-[#112D4E]">
            <Link href="https://instagram.com/firouzeh.javaherian" target="_blank">
              <PiInstagramLogo className="hover:text-[#3F72AF] cursor-pointer" />
            </Link>

            <Link href="https://t.me/Poshtibani_javaherian" target="_blank">
              <PiTelegramLogo className="hover:text-[#3F72AF] cursor-pointer" />
            </Link>

            <Link href="https://www.youtube.com/@FirouzehJavaherian-gn3" target="_blank">
              <PiYoutubeLogo className="hover:text-[#3F72AF] cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* نوار اشتراک */}
      <div className="max-w-2xl mx-auto text-center mt-14">
        <p className="text-sm text-[#112D4E]">از <span className="text-[#3F72AF] font-semibold">تخفیف‌ها و جدیدترین‌ها</span> باخبر شوید</p>
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          <input
            type="email"
            placeholder="ایمیل شما"
            className="px-6 py-2 rounded-2xl border text-sm"
          />
          <button className="bg-[#112D4E] text-white px-6 py-2 hover:bg-[#3F72AF] text-sm rounded-2xl">
            مشترک شوید
          </button>
        </div>
      </div>

      {/* لوگوها */}
      <div className="mt-10 flex justify-center gap-6 flex-wrap">
        <img src="/image/certificate/sabt.webp" alt="لوگو 1" className="h-16" />
        <img src="/image/certificate/certificate.webp" alt="لوگو 2" className="h-16" />
        <img src="/image/certificate/certificate2.webp" alt="لوگو 3" className="h-16" />
        <img src="/image/certificate/e-namad.png" alt="لوگو 4" className="h-16" />
      </div>

      {/* دکمه اسکرول به بالا */}
      <div className="flex justify-center mt-8">
        <button className="p-2 bg-[#112D4E] text-white rounded-full hover:bg-[#3F72AF]">
          <IoIosArrowUp size={20} />
        </button>
      </div>

      {/* متن کپی‌رایت */}
      <p className="text-center text-xs text-[#112D4E] mt-6">
        کلیه حقوق این سایت متعلق به آکادمی فیروزه جواهران می‌باشد.
      </p>
    </footer>
  );
}

