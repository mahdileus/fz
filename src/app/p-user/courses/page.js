import SectionHeader from "@/app/components/modules/index/SectionHeader";
import CourseCard from "@/app/components/template/p-user/courses/CoursesBox";
import connectToDB from "@/configs/db";
import UserCourseModel from "@/models/UserCourse";
import { authUser } from "@/utils/auth-server";

export default async function Page() {
  await connectToDB();
  const user = await authUser();

  // اگر کاربر لاگین نیست، آرایه خالی برگردون
  if (!user) {
    return (
      <section className="mt-14 container">
        <SectionHeader title="دوره های خریداری شده" type="course" />
        <p>برای مشاهده دوره‌ها ابتدا وارد حساب کاربری شوید.</p>
      </section>
    );
  }

  // گرفتن لیست دوره‌ها
  const usercourses = await UserCourseModel.find({ user: user.id })
    .sort({ purchasedAt: -1 })
    .populate("course")
    .lean();

  // فیلتر کردن رکوردهایی که course مقدار null دارند
  const filteredCourses = usercourses.filter(
    (uc) => uc.course !== null && uc.course !== undefined
  );

  return (
    <section className="mt-14 container">
      <SectionHeader title="دوره های خریداری شده" type="course" />

      {filteredCourses.length === 0 ? (
        <p>هیچ دوره‌ای خریداری نشده است.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((usercourse) => (
            <CourseCard
              key={usercourse._id}
              usercourse={JSON.parse(JSON.stringify(usercourse))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
