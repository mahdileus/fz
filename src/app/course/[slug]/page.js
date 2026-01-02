import { notFound } from "next/navigation";

import CourseModel from "@/models/Course";
import UserCourseModel from "@/models/UserCourse";
import CommentModel from "@/models/Comment";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import Comments from "@/app/components/modules/comments/Comments";
import Script from "next/script";
import Navbar from "@/app/components/modules/navbar/Navbar";
import CourseHeader from "@/app/components/template/course/CourseHeader";
import CourseInfoBoxes from "@/app/components/template/course/CourseInfoBoxes";
import CourseFullDescription from "@/app/components/template/course/CourseFullDescription";
import CourseChapters from "@/app/components/template/course/CourseChapters";
import Footer from "@/app/components/modules/footer/Footer";

export const revalidate = 86400; // ISR روزی یک بار

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectToDB();

  const course = await CourseModel.findOne({ slug }).lean();
  if (!course) {
    return {
      title: "دوره یافت نشد",
      description: "این دوره وجود ندارد",
      robots: { index: false, follow: false },
    };
  }

  const title = `${course.title} | فیروزه جواهریان`;
  const description = course.shortDescription?.slice(0, 160) || "دوره آموزشی توسعه فردی و جذب ثروت";
  const url = `https://firouzehjavaherian.com/courses/${slug}`;
  const image = course.thumbnail?.startsWith("http") ? course.thumbnail : "https://firouzehjavaherian.com/logo/fj-logo.png";

  return {
    metadataBase: new URL("https://firouzehjavaherian.com"),
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Firouzeh Javaherian",
      images: [{ url: image, width: 1200, height: 630, alt: course.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function serializeDoc(doc) {
  return JSON.parse(JSON.stringify(doc));
}

const Course = async ({ params }) => {
  const { slug } = await params;
  await connectToDB();
  const user = await authUser();

  const course = await CourseModel.findOne({ slug }).lean();
  if (!course) notFound();

  const [comments, userCourses] = await Promise.all([
    CommentModel.find({ CourseID: course._id }).populate("userID", "name email role phone").lean(),
    user ? UserCourseModel.find({ user: user.id }).populate("course").lean() : Promise.resolve([]),
  ]);

  const registeredCourseIds = userCourses
    .filter(item => item.course || item.course?.isFree)
    .map(item => item.course._id.toString());

  const isRegistered = user
    ? user.role === "ADMIN" || registeredCourseIds.includes(course._id.toString())
    : course.isFree; // دوره رایگان بدون ثبت‌نام

  // Optional: JSON-LD Course schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.shortDescription,
    "url": `https://firouzehjavaherian.com/courses/${slug}`,
    "provider": {
      "@type": "Organization",
      "name": "فیروزه جواهریان",
      "logo": { "@type": "ImageObject", "url": "https://firouzehjavaherian.com/logo/fj-logo.png" }
    },
    "datePublished": course.createdAt?.toISOString(),
    "dateModified": course.updatedAt?.toISOString()
  };

  return (
    <>
      <Script id="course-schema" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>

      <Navbar isLogin={!!user} />
      <CourseHeader course={serializeDoc(course)} isRegistered={isRegistered} />
      <CourseInfoBoxes category={course.category} />
      <CourseFullDescription longDescription={course.longDescription} title={course.title} />
      <CourseChapters course={serializeDoc(course)} isRegistered={isRegistered} />
      <Comments CourseID={course._id.toString()} comments={serializeDoc(comments)} />
      <Footer />
    </>
  );
};

export default Course;
