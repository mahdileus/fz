"use client";
import Link from "next/link";
import React from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { CiVideoOn, CiMicrophoneOn } from "react-icons/ci";
import { PiStudentLight } from "react-icons/pi";




const AboutUs = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });


    return (
        <section className=" mx-auto py-30 bg-gradient-to-b from-blue-50 to-white">
            <div className="container grid md:grid-cols-2 gap-10 items-center">
                {/* متن */}
                <div className="order-2 md:order-1 text-right space-y-6">
                    <h2 className="text-3xl font-kalameh font-bold text-primary">
                        درباره ما
                    </h2>
                    <p className="text-gray-800 text-justify">
                        آکادمی فیروزه جواهریان جایی‌ست برای کسانی که نمی‌خواهند زندگی را به حالت پیش‌فرض ادامه دهند. ما به دنبال رشد سطحی نیستیم؛ هدف ما بیدارسازی توانایی‌های پنهان ذهنی و شخصیتی شماست. با تکیه بر علوم کوچینگ، فروش آگاهانه، هیپنوتیزم ذهنی و روانشناسی موفقیت، شما را در مسیری گام‌به‌گام همراهی می‌کنیم تا نسخه‌ی نهایی و بیدار‌شده‌ی خودتان را کشف کنید — نسخه‌ای که ترس را مدیریت می‌کند، تصمیم‌های قاطع می‌گیرد و با اعتماد‌به‌نفس در مسیر «ابرانسان شدن» حرکت می‌کند.
                        این آکادمی صرفاً یک مجموعه آموزشی نیست؛ حرکتی‌ست برای ساخت انسان‌هایی آگاه‌تر، شجاع‌تر و اثرگذارتر.
                    </p>
                    <div ref={ref} className="flex flex-col sm:flex-row gap-6 sm:justify-center pt-4">
                        {/* کارت ۱ */}
                        <div className="flex flex-col items-center justify-center text-primary">
                            <PiStudentLight className="text-secondery w-10 h-10 mb-2" />
                            <span className="text-lg font-semibold">
                                {inView && <CountUp end={1000} duration={2} />}+ دانشجو
                            </span>
                        </div>

                        {/* کارت ۲ */}
                        <div className="flex flex-col items-center justify-center text-primary">
                            <CiVideoOn className="text-secondery w-10 h-10 mb-2" />
                            <span className="text-lg font-semibold">
                                {inView && <CountUp end={10} duration={2} />}+ دوره
                            </span>
                        </div>

                        {/* کارت ۳ */}
                        <div className="flex flex-col items-center justify-center text-primary">
                            <CiMicrophoneOn className="text-secondery w-10 h-10 mb-2" />
                            <span className="text-lg font-semibold">
                                {inView && <CountUp end={100} duration={2} />}+ پادکست
                            </span>
                        </div>
                    </div>

                    <div className="text-center sm:text-right">
                        <Link
                            href="/about-us"
                            className="inline-block bg-[#3F72AF] text-white px-6 py-2 rounded-xl text-sm hover:bg-[#2c5e95] transition"
                        >
                            بیشتر بدانید
                        </Link>
                    </div>

                </div>
                {/* ویدیو */}
                <div className="flex justify-center items-center order-1 md:order-2">

                    <video
                        controls
                        className="w-[320px] sm:w-[300px] h-[480px] sm:h-[530px] rounded-2xl shadow-lg "
                        src="/video/meeting-2.mov"
                        title="درباره ما"
                        poster="/image/about-us-thumbnail.jpg"
                    />

                </div>
            </div>
        </section>
    );
};

export default AboutUs;
