
import SectionHeader from "@/app/components/modules/index/SectionHeader";
import CourseCard from "@/app/components/template/p-user/courses/CoursesBox";
import connectToDB from "@/configs/db";
import UserCourseModel from "@/models/UserCourse";
import { authUser } from "@/utils/auth-server";

export default async function page() {
    await connectToDB();
    const user = await authUser();
    const usercourses = await UserCourseModel.find({ user: user.id })
        .sort({ purchasedAt: -1 }) // مرتب‌سازی بر اساس زمان خرید
        .lean()
        .populate('course');

          let userCourseRegs = [];
          if (user) {
            userCourseRegs = await UserCourseModel.find({ user: user.id })
              .lean()
              .populate('course');
          }

    return (
        <section className="mt-14 container">
            <SectionHeader title="دوره های خریداری شده" type="course" />
            {usercourses.length === 0 ? (
                <p>هیچ دوره‌ای خریداری نشده است.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usercourses.map(usercourse => (

                        <CourseCard key={usercourse._id} usercourse={JSON.parse(JSON.stringify(usercourse))} />
                    ))}
                </div>

            )}

        </section>
    );
}


