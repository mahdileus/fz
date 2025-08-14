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

function serializeDoc(doc) {
  return JSON.parse(JSON.stringify(doc));
}

const Course = async ({ params }) => {
  await connectToDB();

  const { id: CourseID } = await params; // ✅ حل مشکل await
  const user = await authUser();

  const [course, comments, userCourses] = await Promise.all([
    CourseModel.findOne({ _id: CourseID }).lean(),
    CommentModel.find({ CourseID })
      .populate("userID", "name email role phone")
      .lean(),
    user
      ? UserCourseModel.find({ user: user.id }).populate("course").lean()
      : Promise.resolve([]),
  ]);

  if (!course) return notFound();

  const registeredCourseIds = userCourses.map((item) =>
    item.course._id.toString()
  );
  const isRegistered = user
    ? registeredCourseIds.includes(CourseID)
    : false;

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
      <Comments CourseID={CourseID} comments={serializeDoc(comments)} />
      <Footer />
    </>
  );
};

export default Course;
