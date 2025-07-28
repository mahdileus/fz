import CourseBox from "@/app/components/template/p-admin/course/CourseBox";
import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";
import Link from "next/link";
export default async function page() {
  await connectToDB();
  const courses = await CourseModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className=" mt-14 container">
      <div className=" px-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-6">تمام دوره‌ها</h1>
        </div>
        <div>
          <Link href={"/p-admin/courses/add-course"} className="text-cream bg-primary p-3 rounded-2xl">افزودن دوره جدید</Link>

        </div>
        
      </div>
              {courses.map((course) => (
            <CourseBox key={course._id} course={JSON.parse(JSON.stringify(course))} />
          ))}
    </section>
  );
}
