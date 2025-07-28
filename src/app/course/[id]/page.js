import Footer from "../../components/modules/footer/Footer";
import Navbar from "../../components/modules/navbar/Navbar";
import CourseFullDescription from "../../components/template/course/CourseFullDescription";
import CourseHeader from "../../components/template/course/CourseHeader";
import CourseInfoBoxes from "../../components/template/course/CourseInfoBoxes";
import CourseChapters from "@/app/components/template/course/CourseChapters";
import CourseModel from "@/models/Course";
import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import Comments from "@/app/components/modules/comments/Comments";


const Course = async ({ params }) => {
  await connectToDB();
  const { id: CourseID } = await params; // Await params and destructure id
  const course = await CourseModel.findOne({ _id: CourseID }).populate("comments");
  const user = await authUser();


  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <CourseHeader course={JSON.parse(JSON.stringify(course))} />
      <CourseInfoBoxes category={course.category} />
      <CourseFullDescription longDescription={course.longDescription}
        title={course.title} // Pass title as a prop
      />
      <CourseChapters course={JSON.parse(JSON.stringify(course))} />
      <Comments
        CourseID={CourseID}
        comments={JSON.parse(JSON.stringify(course.comments))}
      />
      <Footer />
    </>
  );
};

export default Course;