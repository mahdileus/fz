import { authUser } from "@/utils/auth-server";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import CourseModel from "@/models/Course";
import UserCourseModel from "@/models/UserCourse";
import connectToDB from "@/configs/db";
import { CiFileOn } from "react-icons/ci";
import Courses from "../components/template/courses/Courses";

const CoursesArchive = async () => {
  await connectToDB();
  const courses = await CourseModel.find({}).sort({ createdAt: -1 }).lean();
  const allTags = Array.from(new Set(courses.flatMap(p => p.tags || [])));
  const allCategories = Array.from(new Set(courses.map(p => p.category)));
  const user = await authUser();

  const userCourseRegs = await UserCourseModel.find({ user: user.id }).lean().populate('course');
  const registeredCourseIds = userCourseRegs.map(item => item.course._id.toString());

  return (
    <>
      <Navbar isLogin={!!user} />
      <div className="flex justify-center items-center gap-4 pt-20">
        <CiFileOn className="w-10 h-10 text-secondery" />
        <h1 className="text-center text-3xl text-primary font-bold font-kalameh ">دوره ها</h1>
      </div>

      <Courses
        courses={JSON.parse(JSON.stringify(courses))}
        tags={allTags}
        categories={allCategories}
        registeredCourseIds={JSON.parse(JSON.stringify(registeredCourseIds))}
      />
      <Footer />
    </>
  );
};

export default CoursesArchive;
