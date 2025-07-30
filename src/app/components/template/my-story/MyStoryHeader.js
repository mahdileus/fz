"use client";
import React from "react";



const MyStoryHeader = () => {


    return (
        <section className=" mx-auto py-30">
            <div className="container grid md:grid-cols-2 gap-10 items-center">
                {/* متن */}
                <div className="order-2 md:order-1 text-right space-y-6">
                    <h2 className="text-3xl font-kalameh font-bold text-primary">
                        داستان من
                    </h2>
                    <p className="text-gray-800 font-dana font-medium text-justify">
                        مسیر من ترکیبی از یادگیری، تجربه و آموزش است.
                        با داشتن مدارک معتبر در کوچینگ و مدرس‌پروری، فروش و بازاریابی، و هیپنوتیزم ذهنی، توانایی همراهی شما در کشف و فعال‌سازی توانایی‌های درونیتان را دارم.
                        ابزارهای من، کمک به رشد ذهنی، مدیریت ترس‌ها و افزایش اعتماد به نفس شماست تا نسخه‌ی قدرتمندتری از خودتان بسازید و تبدیل به یک ابرانسان واقعی شوید
                    </p>
                </div>
                {/* ویدیو */}
                <div className="flex justify-center items-center order-1 md:order-2">

                    <video
                        controls
                        className="w-[320px] sm:w-[300px] h-[480px] sm:h-[530px] rounded-2xl shadow-lg "
                        src="/video/my-story.MP4"
                        title="درباره ما"
                    />

                </div>
            </div>
        </section>
    );
};

export default MyStoryHeader;