"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 min-h-[600px]">
        {/* بخش متن */}
        <div className="md:text-right text-center md:w-1/2 w-full max-w-xl md:pt-40 pt-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#112D4E] mb-4 font-kalameh">
            ذهن خود را به سطح بالاتری ببرید
          </h1>
          <p className="text-base md:text-base text-gray-800 mb-6 text-justify">
            ما انسان‌ها با مغزی متولد می‌شیم که قدرتی فراتر از تصوره، اما بیشترمون فقط سطحی‌ترین بخش اون رو به کار می‌گیریم.
            اون ۹۵٪ پنهان چی می‌شه؟ همون بخش عمیق و ناپیدا که توانایی خلق، تصمیم‌گیری قاطع، آرامش درونی و جسارت برای ساختن آینده‌ای متفاوت رو داره.
            حاضری بهش دست پیدا کنی؟
            قدم اول رو بردار، چون سفر تو به سمت بیداری ذهنی دقیقاً از اینجا شروع می‌شه.

            در طول زندگی‌م، هیچ واژه‌ای مثل «ابرانسان» ذهنم رو درگیر نکرد.
            نه به‌عنوان یک قهرمان خیالی، بلکه به‌عنوان انسانی که خودش رو به حقیقت درونی‌ش متصل کرده؛
            کسی که از درون می‌دونه کیه، چی می‌خواد، و چرا اینجاست.

            وقتی به نیروی درونم متصل شدم، تصمیم‌هام واضح‌تر شدن، صدام محکم‌تر شد،
            و ترس‌هام؟
            اون‌ها بودن که از من ترسیدن.

            ابرانسان درونت هنوز خاموشه، ولی منتظر بیدار شدنه.
            اگه صدای دعوتش رو می‌شنوی، پس وقتشه...
            با ما همراه شو، مسیر تازه‌ای در راهه.        </p>
          <Link
            href="/courses"
            className="inline-block bg-[#3F72AF] text-white px-6 py-2 rounded-xl text-sm hover:bg-[#2c5e95] transition"
          >
            شروع یادگیری
          </Link>
        </div>

        {/* تصویر */}
        <div className="relative md:w-1/2 w-full h-110 md:h-[600px]">
          <Image
            src="/image/herosection.png"
            alt="hero"
            fill
            className="object-contain"
            priority
          />
          {/* کادر تگ‌ها */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white/50 rounded-xl px-4 py-5 shadow-md flex flex-wrap justify-center gap-2 max-w-xs w-full">
            <span className="text-xs bg-primary text-cream  px-3 py-1 rounded-full shadow-sm">
              #ذهن
            </span>
            <span className="text-xs bg-primary text-cream px-3 py-1 rounded-full shadow-sm">
              #من_می‌توانم
            </span>
            <span className="text-xs bg-primary text-cream px-3 py-1 rounded-full shadow-sm">
              #ذهن_هوشیار
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
