import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import CourseModel from "@/models/Course";
import UserCourseModel from "@/models/UserCourse";
import connectToDB from "@/configs/db";
import { CiFileOn } from "react-icons/ci";
import Courses from "../components/template/courses/Courses";

export const metadata = {
  title: "دوره‌ها",
  description: "دوره‌های آموزشی و کوچینگ برای رشد فردی و جذب ثروت",
  alternates: {
    canonical: "https://firouzehjavaherian.com/courses",
  },
  openGraph: {
    title: "دوره‌ها",
    description: "دوره‌های آموزشی و کوچینگ برای رشد فردی و جذب ثروت",
    url: "https://firouzehjavaherian.com/courses",
    images: [{ url: "/logo/fj-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دوره‌ها",
    description: "دوره‌های آموزشی و کوچینگ برای رشد فردی و جذب ثروت",
    images: ["/logo/fj-logo.png"],
  },
};



const CoursesArchive = async () => {
  await connectToDB();
  const courses = await CourseModel.find({}).sort({ createdAt: -1 }).lean();
  const allTags = Array.from(new Set(courses.flatMap(p => p.tags || [])));
  const allCategories = Array.from(new Set(courses.map(p => p.category)));

  const user = await authUser();

  let registeredCourseIds = [];
  if (user && user.id) {
    const userCourseRegs = await UserCourseModel.find({ user: user.id })
      .lean()
      .populate('course');

    // فقط دوره‌هایی که موجود هستند
    registeredCourseIds = userCourseRegs
      .filter(item => item.course && item.course._id)
      .map(item => item.course._id.toString());
  }

  // برای ارسال به کامپوننت‌ها هم امن کن
  const safeCourses = (courses || []).filter(course => course && course._id);


  return (
    <>
      <Navbar isLogin={!!user} />
      <div className="flex justify-center items-center gap-4 pt-20">
        <CiFileOn className="w-10 h-10 text-secondery" />
        <h1 className="text-center text-3xl text-primary font-bold font-kalameh ">دوره ها</h1>
      </div>

      <Courses
        courses={JSON.parse(JSON.stringify(safeCourses))}
        tags={allTags}
        categories={allCategories}
        registeredCourseIds={JSON.parse(JSON.stringify(registeredCourseIds))}
      />

      <Footer />
    </>
  );
};

export default CoursesArchive;
