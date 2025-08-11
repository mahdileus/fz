import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import CourseFullDescription from "../../components/template/course/CourseFullDescription";
import CourseHeader from "../../components/template/course/CourseHeader";
import CourseInfoBoxes from "../../components/template/course/CourseInfoBoxes";
import CourseChapters from "@/app/components/template/course/CourseChapters";
import CourseModel from "@/models/Course";
import UserCourseModel from "@/models/UserCourse";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import Comments from "@/app/components/modules/comments/Comments";

import CommentModel from "@/models/Comment";

const Course = async ({ params }) => {
  await connectToDB();
  const { id: CourseID } = await params;
  const user = await authUser();

  const comments = await CommentModel.find({ CourseID })
    .populate("userID", "name email role phone")
    .lean();

  let registeredCourseIds = [];
  if (user && user.id) {
    const userCourseRegs = await UserCourseModel.find({ user: user.id })
      .lean()
      .populate("course");
    registeredCourseIds = userCourseRegs.map((item) =>
      item.course._id.toString()
    );
  }

  const course = await CourseModel.findOne({ _id: CourseID }).lean();

  const isRegistered = user && user.id ? registeredCourseIds.includes(CourseID) : false;

  return (
    <>
      <Navbar isLogin={!!user} />
      <CourseHeader
        course={JSON.parse(JSON.stringify(course))}
        isRegistered={isRegistered}
      />
      <CourseInfoBoxes category={course.category} />
      <CourseFullDescription
        longDescription={course.longDescription}
        title={course.title}
      />
      <CourseChapters
        course={JSON.parse(JSON.stringify(course))}
        isRegistered={isRegistered}
      />
      <Comments CourseID={CourseID} comments={JSON.parse(JSON.stringify(comments))} />
      <Footer />
    </>
  );
};

export default Course;
