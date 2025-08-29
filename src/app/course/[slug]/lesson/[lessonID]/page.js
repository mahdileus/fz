import CourseModel from "@/models/Course";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import SecurePlayer from "@/app/components/modules/courses/SecurePlayer";
import Link from "next/link";
import PodcastPlayer from "@/app/components/modules/podcast/PodcastPlayer/PodcastPlayer";
import Navbar from "@/app/components/modules/navbar/Navbar";
import Footer from "@/app/components/modules/footer/Footer";
import { notFound } from "next/navigation";
import DisableInspect from "@/utils/DisableInspect";

export default async function LessonPage({ params }) {
  await connectToDB();

  const { slug, lessonID } = await params;
  const user = await authUser();
  const watermark = user.phone

  const course = await CourseModel.findOne({ slug }).lean();
  if (!course) return notFound();

  const lesson = course.lessons.find(
    (lesson) => String(lesson._id) === String(lessonID)
  );


  if (!lesson) {
    return (
      <div className="p-6">
        <h2 className="text-red-500">جلسه‌ای با این شناسه پیدا نشد</h2>
      </div>
    );
  }

  return (
    <section>
      <Navbar isLogin={!!user} />
    <DisableInspect/>
      <div className="mt-24 min-h-screen px-6 md:px-28 pb-10">
        {/* عنوان جلسه */}
        <h1 className="text-lg font-bold mb-10 bg-white shadow-lg p-3 rounded-2xl text-primary">
          {lesson.title}
        </h1>

        {/* دو ستونه: پلیر بزرگ و لیست جلسات جمع و جور */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* پلیر با عرض بیشتر */}
          <div className="w-full md:w-[70%] flex items-start">
            <div className="mx-auto w-full max-w-full aspect-[16/9] bg-black rounded-xl shadow-xl overflow-hidden relative border border-primary">
              <SecurePlayer src={lesson.video} className="w-full h-full object-cover"
              watermark={watermark}
              />
            </div>
          </div>

          {/* لیست جلسات کوچیک‌تر */}
          <div className="w-full md:w-[30%] bg-white border border-gray-100 rounded-2xl shadow-md p-2 overflow-y-auto max-h-[500px]">
            <h2 className="text-md font-semibold mb-2 text-center">جلسات دوره</h2>
            <ul className="space-y-1">
              {course.lessons.map((lessonItem) => (
                <li
                  key={String(lessonItem._id)}
                  className={`p-2 rounded-md transition-all text-sm ${
                    String(lessonItem._id) === String(lessonID)
                      ? "bg-primary text-white"
                      : "hover:bg-light-blue"
                  }`}
                >
                  <Link
                    href={`/course/${slug}/lesson/${lessonItem._id}`}
                    className="block"
                  >
                    {lessonItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* توضیحات و فایل صوتی */}
        <div className="mt-12 bg-white border border-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 text-center text-primary">توضیحات جلسه</h2>
          <p className="text-gray-700 text-justify">
            {lesson.description || "توضیحاتی برای این جلسه ارائه نشده است."}
          </p>

          {lesson.audio && (
            <>
              <h2 className="text-lg font-bold mb-4 text-center mt-10 text-primary">فایل صوتی جلسه</h2>
              <PodcastPlayer src={lesson.audio} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </section>
  );
}
