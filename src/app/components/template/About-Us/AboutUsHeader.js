"use client";
import React from "react";


const AboutUsHeader = () => {
    return (
        <section className=" mx-auto py-30">
            <div className="container grid md:grid-cols-2 gap-10 items-center">
                {/* متن */}
                <div className="order-2 md:order-1 text-center md:text-right space-y-6">
                    <h2 className="text-3xl font-kalameh font-bold text-primary">
                        درباره ما
                    </h2>
                    <p className="text-gray-800 text-justify">
                        آکادمی فیروزه جواهریان جایی‌ست برای کسانی که نمی‌خواهند زندگی را به حالت پیش‌فرض ادامه دهند. ما به دنبال رشد سطحی نیستیم؛ هدف ما بیدارسازی توانایی‌های پنهان ذهنی و شخصیتی شماست. با تکیه بر علوم کوچینگ، فروش آگاهانه، هیپنوتیزم ذهنی و روانشناسی موفقیت، شما را در مسیری گام‌به‌گام همراهی می‌کنیم تا نسخه‌ی نهایی و بیدار‌شده‌ی خودتان را کشف کنید — نسخه‌ای که ترس را مدیریت می‌کند، تصمیم‌های قاطع می‌گیرد و با اعتماد‌به‌نفس در مسیر «ابرانسان شدن» حرکت می‌کند.
                        این آکادمی صرفاً یک مجموعه آموزشی نیست؛ حرکتی‌ست برای ساخت انسان‌هایی آگاه‌تر، شجاع‌تر و اثرگذارتر.
                    </p>
                </div>
                {/* ویدیو */}
                <div className="flex justify-center items-center order-1 md:order-2">

                    <video
                        controls
                        className="w-[320px] sm:w-[300px] h-[480px] sm:h-[530px] rounded-2xl shadow-lg "
                        src="/video/meeting-1.MOV"
                        title="درباره ما"
                        poster="/image/about-us-poster.jpg"
                    />

                </div>
            </div>
        </section>
    );
};

export default AboutUsHeader;
