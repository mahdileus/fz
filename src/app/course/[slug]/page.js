import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import CourseFullDescription from "../../components/template/course/CourseFullDescription";
import CourseHeader from "../../components/template/course/CourseHeader";
import CourseInfoBoxes from "../../components/template/course/CourseInfoBoxes";
import CourseChapters from "@/app/components/template/course/CourseChapters";
import CourseModel from "@/models/Course";
import UserCourseModel from "@/models/UserCourse";
import CommentModel from "@/models/Comment";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import { notFound } from "next/navigation";
import Comments from "@/app/components/modules/comments/Comments";


export async function generateMetadata({ params }) {
  const { slug } = params;
  await connectToDB();

  const course = await CourseModel.findOne({ slug }).lean();

  if (!course) {
    return {
      title: "دوره یافت نشد",
      description: "این دوره وجود ندارد",
    };
  }

  const title = `${course.title} – فیروزه جواهریان`;
  const description = course.shortDescription || "دوره آموزشی توسعه فردی و جذب ثروت";

  return {
    title,
    description,
    alternates: { canonical: `https://firouzehjavaherian.com/courses/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://firouzehjavaherian.com/courses/${slug}`,
      type: "article",
      images: [
        {
          url: course.thumbnail || "/logo/fj-logo.png",
          width: 1200,
          height: 630,
        },
      ],
      article: {
        publishedTime: course.createdAt?.toISOString() || undefined,
        authors: ["فیروزه جواهریان"],
        tags: course.tags || [],
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [course.thumbnail || "/logo/fj-logo.png"],
    },
  };
}


function serializeDoc(doc) {
  return JSON.parse(JSON.stringify(doc));
}

const Course = async ({ params }) => {
  await connectToDB();

  const { slug } = await params;
  const user = await authUser();

  const course = await CourseModel.findOne({ slug }).lean();
  if (!course) return notFound();

  const [comments, userCourses] = await Promise.all([
    CommentModel.find({ CourseID: course._id })
      .populate("userID", "name email role phone")
      .lean(),
    user
      ? UserCourseModel.find({ user: user.id }).populate("course").lean()
      : Promise.resolve([]),
  ]);
  if (!course) return notFound();

const registeredCourseIds = userCourses
  .filter(item => item.course || item.course?.isFree)
  .map(item => item.course._id.toString());


const isRegistered = user
  ? user.role === "ADMIN" || registeredCourseIds.includes(course._id.toString())
  : course.isFree; // ← اگر دوره رایگان است، حتی بدون کاربر ثبت‌شده اجازه بده



  return (
    <>
      <Navbar isLogin={!!user} />
      <CourseHeader course={serializeDoc(course)} isRegistered={isRegistered} />
      <CourseInfoBoxes category={course.category} />
      <CourseFullDescription
        longDescription={course.longDescription}
        title={course.title}
      />
      <CourseChapters course={serializeDoc(course)} isRegistered={isRegistered} />
      <Comments CourseID={course._id.toString()} comments={serializeDoc(comments)} />

      <Footer />
    </>
  );
};

export default Course;
