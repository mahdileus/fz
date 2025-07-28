"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay"
import { Autoplay} from "swiper/modules";
import PodcastBox from "../../podcast/PodcastBox/PodcastBox";

export default function LatestPodcast({ podcasts }) {
;

  return (
    <div className="relative container">
      <Swiper
        autoplay={{
        delay: 3000, // هر 3 ثانیه یک اسلاید
        disableOnInteraction: true, // اگر کاربر اسلایدر رو لمس کرد، autoplay متوقف نشه
        }}
        modules={[Autoplay]}
        spaceBetween={40}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3.5 },
          
        }}
      >
        {podcasts.map((podcast) => (
          <SwiperSlide key={podcast._id}>
            <PodcastBox podcast={podcast} />
          </SwiperSlide>
        ))}
      </Swiper>
      

    </div>
  );
}
