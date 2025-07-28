"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";

const testimonials = [
  {
    name: "سارا محمدی",
    text: "دوره‌ها واقعاً دید منو نسبت به رشد فردی عوض کردن، خیلی ممنون از آکادمی جواهریان!",
  },
  {
    name: "مهدی فراهانی",
    text: "محتوا خیلی کامل و عمیقه، پادکست‌ها هم فوق‌العاده‌ن. مخصوصاً توضیحات دقیق خانم جواهریان واقعاً تاثیرگذاره.",
  },
  {
    name: "الهام رضایی",
    text: "از وقتی با آکادمی جواهریان آشنا شدم، روزانه دارم رشد می‌کنم. مسیری که برام باز شد بی‌نظیر بود.",
  },
  {
    name: "آرمان کریمی",
    text: "کوچینگ‌ها باعث شدن مسیرم رو واضح‌تر ببینم. خانم جواهریان با صبوری و اخلاق عالی، بهترین راهنما بودن.",
  },
  {
    name: "زهرا رضوانی",
    text: "تدریس‌های خانم جواهریان فوق‌العاده حرفه‌ای و دلنشینه. صدای آرامش‌بخش و روش توضیحشون خیلی تاثیرگذاره.",
  },
  {
    name: "حمید نظری",
    text: "با تیم آکادمی جواهریان تونستم تمرکز بیشتری پیدا کنم و مسیر یادگیریم رو هدفمندتر کنم.",
  },
  {
    name: "پریسا احمدی",
    text: "اخلاق حرفه‌ای، برخورد مهربان و حوصله زیاد خانم جواهریان باعث شد با انگیزه تمام دوره‌ها رو دنبال کنم.",
  },
  {
    name: "کامران موسوی",
    text: "همه چیز دقیق و با برنامه‌ست. خانم جواهریان یکی از خوش‌اخلاق‌ترین اساتیدی هستن که تا حالا دیدم.",
  },
  {
    name: "فرزانه کرمی",
    text: "با راهنمایی‌های خانم جواهریان تونستم اعتماد به نفسم رو بازیابی کنم. حس انسان بودنم برگشت...",
  },
  {
    name: "رضا توکلی",
    text: "آکادمی جواهریان جاییه که حس می‌کنی یکی واقعاً به رشد تو اهمیت می‌ده. ممنون از شما استاد عزیز.",
  }
];


export default function CommentBox() {
  return (
    <section className="w-full py-5 bg-white overflow-hidden">

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1.2}
        spaceBetween={24}
        loop={true}
        speed={2500}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5.2 },
        }}
        className="!overflow-visible px-4"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="flex h-full">
            <div className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between w-full min-h-[200px] max-h-[200px] h-full">
              <FaQuoteRight className="text-secondery text-lg mb-2" />
              <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                {item.text}
              </p>
              <span className="text-xs font-bold text-primary mt-4">
                {item.name}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
