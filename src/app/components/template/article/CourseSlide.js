"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";  // برای اسلاید خودکار و نقطه‌ها
import CourseCard from "../../modules/courses/CourseCard";

export default function LatestCourses({ courses = [] }) {  // default [] اضافه کن تا خالی باشه
  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-500">دوره‌ای موجود نیست!</p>;  // empty state برای UX بهتر
  }

  return (
        <div className="">
      <h3 className="text-base font-bold text-primary mt-14">آخرین دوره ها </h3>
    <Swiper
      spaceBetween={20}  // فاصله بین اسلایدها
      slidesPerView={1}  // ۱ اسلاید در موبایل
      breakpoints={{
        640: { slidesPerView: 1 },  // ۲ در sm
        1024: { slidesPerView: 1 },  // ۳ در lg
      }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}  // اسلاید خودکار هر ۳ ثانیه
      modules={[Pagination, Autoplay]}  // modules اضافه
      className="mySwiper"  // کلاس برای استایل
    >
      {courses?.map((course) => (  // ?.map اضافه کن تا اگر undefined بود, ارور نده
        <SwiperSlide key={course._id}>
          <CourseCard
            course={course} 
          />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}