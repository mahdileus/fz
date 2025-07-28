
import EditCourseForm from "@/app/components/template/p-admin/course/EditCourseForm";
import connectToDB from "@/configs/db";
import CourseModel from "@/models/Course";

export default async function EditCoursePage({ params }) {
  // await کردن params برای دسترسی به id
  const { id } = await params;

  // اتصال به دیتابیس و دریافت داده
  await connectToDB();
  const course = await CourseModel.findById(id).lean();

  return (
    <div className="mt-10">
      <EditCourseForm
        course={JSON.parse(JSON.stringify(course))}
        courseId={id}
      />
    </div>
  );
}