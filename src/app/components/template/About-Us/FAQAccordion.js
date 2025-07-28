"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";

const faqs = [
    {
        question: "آیا برای شرکت در دوره‌ها پیش‌نیاز خاصی نیاز هست؟",
        answer: "خیر، تمامی دوره‌ها از سطح پایه طراحی شده‌اند و نیاز به تجربه قبلی نیست.",
    },
    {
        question: "چطور به محتوای دوره‌ها دسترسی پیدا کنم؟",
        answer: "بعد از ثبت‌نام، محتوای دوره در پنل کاربری شما در دسترس خواهد بود.",
    },
    {
        question: "چطور می‌تونم در دوره‌ها ثبت‌نام کنم؟",
        answer: "کافی است وارد صفحه دوره مورد نظر شده و از طریق دکمه ثبت‌نام، فرآیند پرداخت را انجام دهید.",
    },
    {
        question: "آیا دوره‌ها پشتیبانی دارند؟",
        answer: "بله، پس از ثبت‌نام در دوره‌ها، می‌توانید از طریق پنل کاربری یا گروه‌های پشتیبانی با مدرس در ارتباط باشید.",
    },
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(index === openIndex ? null : index);
    };

    return (
        <section className="w-full py-20">
            <div className=" max-w-6xl mx-auto px-4 md:px-8 space-y-10">
                <h2 className="text-3xl font-bold font-kalameh text-primary text-center">
                    سوالات متداول
                </h2>

                <div className="flex flex-col md:flex-row md:justify-between items-center gap-10">
                    {/* آکاردئون */}
                    {/* آکاردئون */}
                    <div className="w-full md:max-w-[48%] order-2 md:order-1 space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border rounded-xl overflow-hidden shadow transition-all"
                            >
                                <button
                                    onClick={() => toggle(index)}
                                    className="w-full px-4 py-3 flex justify-between items-center text-right text-primary text-base font-medium"
                                >
                                    {faq.question}
                                    {openIndex === index ? (
                                        <FaMinus className="text-secondery" />
                                    ) : (
                                        <FaPlus className="text-secondery" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-4 pb-4 text-sm text-gray-800 leading-loose">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* تصویر */}
                    <div className="relative w-full md:max-w-[48%] h-[400px] order-1 md:order-2 flex justify-center">

                        <Image
                            src="/image/Questions.png"
                            alt="سوالات متداول"
                            fill
                            className="object-contain rounded-3xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
