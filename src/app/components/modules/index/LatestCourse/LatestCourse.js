"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay"
import { Autoplay } from "swiper/modules";
import CourseCard from "../../courses/CourseCard";

export default function LatestCourse({ courses, userCourseRegs }) {
  // ساخت آرایه از آیدی دوره‌هایی که کاربر ثبت نام کرده
  const registeredCourseIds = userCourseRegs.map(item => item.course._id);

  return (
    <div className="relative container">
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3.5 },
        }}
      >
        {courses.map((course) => (
          <SwiperSlide key={course._id}>
            <CourseCard 
              course={course} 
              isRegistered={registeredCourseIds.includes(course._id)} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

